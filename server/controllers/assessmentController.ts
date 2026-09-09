import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { runCapacityCycle } from '../services/capacityCycleService';

async function resolveSkill(skillName: string): Promise<string> {
  const cleanName = skillName.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `skill-${Date.now()}`;
  
  let skill = await prisma.skill.findFirst({
    where: {
      OR: [
        { slug },
        { name: { equals: cleanName, mode: 'insensitive' } }
      ]
    }
  });

  if (!skill) {
    skill = await prisma.skill.create({
      data: {
        name: cleanName,
        slug,
        category: 'technical',
        description: `${cleanName} competency assessed through coursework and evaluations.`,
        difficultyLevel: 3,
      }
    });
  }
  return skill.id;
}

export const createAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, courseId, passingScore, questions, skillMappings } = req.body;
    const trainerId = req.user?.id;
    
    if (req.user?.role !== 'TRAINER') {
      res.status(403).json({ message: 'Only trainers can create assessments' });
      return;
    }
    
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.trainerId !== trainerId) {
      res.status(403).json({ message: 'Unauthorized or course not found' });
      return;
    }
    
    const assessment = await prisma.assessment.create({
      data: {
        title,
        description,
        courseId,
        trainerId: trainerId as string,
        passingScore: passingScore || 70,
        questions: questions || [],
        skillMappings: skillMappings || []
      }
    });
    
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const submitAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: assessmentId } = req.params;
    const { answers } = req.body;
    const learnerId = req.user?.id;
    
    const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }
    
    const enrollment = await prisma.enrollment.findUnique({
      where: { learnerId_courseId: { learnerId: learnerId as string, courseId: assessment.courseId } }
    });
    
    if (!enrollment) {
      res.status(403).json({ message: 'Must be enrolled to submit' });
      return;
    }
    
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId,
        learnerId: learnerId as string,
        courseId: assessment.courseId,
        trainerId: assessment.trainerId,
        answers: answers || [],
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });
    
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const gradeAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const { score, feedback } = req.body;
    const trainerId = req.user?.id;
    
    const attempt = await prisma.assessmentAttempt.findUnique({ 
      where: { id: attemptId },
      include: { assessment: true }
    });
    
    if (!attempt || attempt.trainerId !== trainerId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    
    const graded = await prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'GRADED',
        score,
        feedback,
        gradedAt: new Date(),
        gradedBy: trainerId as string
      }
    });
    
    res.json(graded);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssessments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trainerId = req.user?.id;
    if (!trainerId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const assessments = await prisma.assessment.findMany({
      where: { trainerId },
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(assessments);
  } catch (error) {
    console.error('getAssessments error', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssessmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, description: true, targetCompetencies: true } },
        trainer: { select: { id: true, name: true, email: true, avatar: true } },
        _count: { select: { submissions: true } }
      }
    });

    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }

    const mySubmission = await prisma.assessmentSubmission.findFirst({
      where: { assessmentId: id, userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        gradedBy: { select: { id: true, name: true } }
      }
    });

    res.json({
      ...assessment,
      _id: assessment.id,
      courseId: assessment.course,
      submissionsCount: assessment._count.submissions,
      mySubmission
    });
  } catch (error) {
    console.error('Get Assessment By Id Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { githubUrl, demoUrl, notes } = req.body;

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { trainer: true }
    });

    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }

    const existingSubmission = await prisma.assessmentSubmission.findFirst({
      where: { assessmentId: id, userId: req.user.id }
    });

    let submission;
    if (existingSubmission) {
      submission = await prisma.assessmentSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          githubUrl: githubUrl || existingSubmission.githubUrl,
          demoUrl: demoUrl || existingSubmission.demoUrl,
          notes: notes || existingSubmission.notes,
          status: 'PENDING',
          updatedAt: new Date()
        }
      });
    } else {
      submission = await prisma.assessmentSubmission.create({
        data: {
          assessmentId: id,
          userId: req.user.id,
          githubUrl,
          demoUrl,
          notes,
          status: 'PENDING'
        }
      });
    }

    // Notify trainer
    if (assessment.trainerId && assessment.trainerId !== req.user.id) {
      await prisma.notification.create({
        data: {
          recipientId: assessment.trainerId,
          role: 'TRAINER',
          type: 'NEW_SUBMISSION',
          title: `New Project Submitted: ${assessment.title}`,
          message: `${req.user.name || 'A learner'} submitted work for "${assessment.title}". Ready for rubric grading.`,
          category: 'ASSESSMENT',
          priority: 'MEDIUM',
          relatedEntityType: 'ASSESSMENT',
          relatedEntityId: assessment.id,
          actionUrl: `/assessments/${assessment.id}`
        }
      });
    }

    res.status(200).json({
      message: 'Assessment submitted successfully for trainer review!',
      submission
    });
  } catch (error) {
    console.error('Submit Assessment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMySubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const submissions = await prisma.assessmentSubmission.findMany({
      where: { userId: req.user.id },
      include: {
        assessment: {
          include: {
            course: { select: { id: true, title: true } },
            trainer: { select: { id: true, name: true } }
          }
        },
        gradedBy: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get My Submissions Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssessmentSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id }
    });

    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }

    const isTrainer = assessment.trainerId === req.user.id || req.user.role === 'ADMIN';

    let submissions;
    if (isTrainer) {
      submissions = await prisma.assessmentSubmission.findMany({
        where: { assessmentId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              targetRole: true,
              currentRole: true,
              organization: true
            }
          },
          gradedBy: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      submissions = await prisma.assessmentSubmission.findMany({
        where: { assessmentId: id, userId: req.user.id },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          gradedBy: { select: { id: true, name: true } }
        }
      });
    }

    res.json(submissions);
  } catch (error) {
    console.error('Get Assessment Submissions Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, submissionId } = req.params;
    const { score, feedback, status } = req.body;

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!assessment) {
      res.status(404).json({ message: 'Assessment not found' });
      return;
    }

    // Verify trainer authorization
    if (assessment.trainerId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Unauthorized: Only the assigned trainer can grade this assessment' });
      return;
    }

    const submission = await prisma.assessmentSubmission.findUnique({
      where: { id: submissionId },
      include: { user: true }
    });

    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    const numericScore = Number(score);
    const submissionStatus = status || (numericScore >= (assessment.maxScore * 0.5) ? 'GRADED' : 'REJECTED');

    // Update submission record
    const updatedSubmission = await prisma.assessmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: numericScore,
        feedback: feedback || '',
        status: submissionStatus,
        gradedAt: new Date(),
        gradedById: req.user.id
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        gradedBy: { select: { id: true, name: true } }
      }
    });

    // If passed/graded, generate Competency Evidence & trigger Capacity Cycle
    if (submissionStatus === 'GRADED') {
      const targetCompetencies = assessment.course?.targetCompetencies || ['Full-Stack Development'];
      const normalizedScore = Math.min(100, Math.max(0, (numericScore / (assessment.maxScore || 100)) * 100));

      // 1. Ensure learner has a competency profile
      let profile = await prisma.competencyProfile.findUnique({
        where: { userId: submission.userId }
      });

      if (!profile) {
        profile = await prisma.competencyProfile.create({
          data: {
            userId: submission.userId,
            overallScore: 50,
            targetRole: submission.user.targetRole || 'Full Stack Engineer'
          }
        });
      }

      // 2. Generate evidence for each target competency
      for (const compName of targetCompetencies) {
        const skillId = await resolveSkill(compName);

        // Create evidence
        await prisma.competencyEvidence.create({
          data: {
            userId: submission.userId,
            skillId,
            source: 'COURSE_ASSESSMENT',
            score: normalizedScore,
            weight: 1.5,
            metadata: {
              assessmentId: assessment.id,
              assessmentTitle: assessment.title,
              rawScore: numericScore,
              maxScore: assessment.maxScore,
              feedback
            }
          }
        });

        // Ensure ProfileSkill connection exists
        const profileSkill = await prisma.profileSkill.findUnique({
          where: {
            competencyProfileId_skillId: {
              competencyProfileId: profile.id,
              skillId
            }
          }
        });

        if (!profileSkill) {
          await prisma.profileSkill.create({
            data: {
              competencyProfileId: profile.id,
              skillId,
              score: normalizedScore,
              confidence: 0.8,
              evidenceCount: 1
            }
          });
        }
      }

      // 3. Trigger automated capacity cycle recalculation
      try {
        const targetRoleReq = await prisma.roleRequirement.findFirst({
          where: {
            roleName: { equals: submission.user.targetRole || 'Full Stack Engineer', mode: 'insensitive' }
          }
        }) || await prisma.roleRequirement.findFirst();

        if (targetRoleReq) {
          await runCapacityCycle(submission.userId, targetRoleReq.id, 'ASSESSMENT_PASSED');
        }
      } catch (cycleErr) {
        console.warn('Capacity cycle background calculation notice:', cycleErr);
      }
    }

    // Send learner notification
    await prisma.notification.create({
      data: {
        recipientId: submission.userId,
        role: 'LEARNER',
        type: 'ASSESSMENT_GRADED',
        title: `Graded: ${assessment.title}`,
        message: `Your assessment "${assessment.title}" has been graded: ${numericScore}/${assessment.maxScore}. ${feedback ? `Feedback: "${feedback}"` : ''}`,
        category: 'ASSESSMENT',
        priority: 'HIGH',
        relatedEntityType: 'ASSESSMENT',
        relatedEntityId: assessment.id,
        actionUrl: `/assessments/${assessment.id}`
      }
    });

    res.json({
      message: 'Submission graded successfully and Competency DNA updated!',
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Grade Submission Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
