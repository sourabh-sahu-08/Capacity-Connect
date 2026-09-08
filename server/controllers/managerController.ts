import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getWorkforceOverview, getAttentionQueue } from '../services/managerIntelligenceService';
import { calculateRoleReadiness } from '../services/readinessEngine';

// Seed benchmark roles if empty
async function ensureDefaultRoles() {
  const count = await prisma.roleRequirement.count();
  if (count > 0) return;

  const defaultRoles = [
    {
      roleName: 'Full Stack Engineer',
      skills: [
        { name: 'React.js', category: 'technical', requiredLevel: 80, importance: 1.5, businessDemand: 90 },
        { name: 'Node.js & Express', category: 'technical', requiredLevel: 75, importance: 1.5, businessDemand: 85 },
        { name: 'PostgreSQL & Databases', category: 'technical', requiredLevel: 70, importance: 1.2, businessDemand: 80 },
        { name: 'REST & GraphQL APIs', category: 'technical', requiredLevel: 75, importance: 1.3, businessDemand: 85 },
        { name: 'Problem Solving', category: 'analytical', requiredLevel: 80, importance: 1.4, businessDemand: 90 },
        { name: 'Code Quality & Testing', category: 'technical', requiredLevel: 70, importance: 1.1, businessDemand: 75 },
      ]
    },
    {
      roleName: 'Cloud Architect & DevOps',
      skills: [
        { name: 'Cloud Infrastructure (AWS/GCP)', category: 'technical', requiredLevel: 85, importance: 1.8, businessDemand: 95 },
        { name: 'Docker & Kubernetes', category: 'technical', requiredLevel: 80, importance: 1.5, businessDemand: 90 },
        { name: 'CI/CD Automation', category: 'technical', requiredLevel: 75, importance: 1.3, businessDemand: 80 },
        { name: 'System Security & Compliance', category: 'technical', requiredLevel: 80, importance: 1.4, businessDemand: 85 },
        { name: 'Distributed Architecture', category: 'analytical', requiredLevel: 85, importance: 1.6, businessDemand: 90 },
      ]
    },
    {
      roleName: 'AI & Data Intelligence Engineer',
      skills: [
        { name: 'Python & ML Frameworks', category: 'technical', requiredLevel: 85, importance: 1.8, businessDemand: 95 },
        { name: 'Data Pipeline Engineering', category: 'technical', requiredLevel: 80, importance: 1.4, businessDemand: 85 },
        { name: 'Statistical & Algorithmic Analysis', category: 'analytical', requiredLevel: 85, importance: 1.6, businessDemand: 90 },
        { name: 'LLM Orchestration & Prompting', category: 'creativity', requiredLevel: 75, importance: 1.3, businessDemand: 90 },
      ]
    },
    {
      roleName: 'Engineering Team Lead',
      skills: [
        { name: 'Technical Mentorship', category: 'leadership', requiredLevel: 85, importance: 1.7, businessDemand: 90 },
        { name: 'Cross-functional Communication', category: 'communication', requiredLevel: 90, importance: 1.8, businessDemand: 95 },
        { name: 'System Architecture Design', category: 'technical', requiredLevel: 80, importance: 1.5, businessDemand: 85 },
        { name: 'Agile Delivery & Roadmapping', category: 'leadership', requiredLevel: 80, importance: 1.4, businessDemand: 85 },
      ]
    }
  ];

  for (const r of defaultRoles) {
    const createdRole = await prisma.roleRequirement.create({
      data: { roleName: r.roleName }
    });

    for (const s of r.skills) {
      const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let skill = await prisma.skill.findFirst({
        where: { OR: [{ slug }, { name: { equals: s.name, mode: 'insensitive' } }] }
      });

      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: s.name,
            slug,
            category: s.category,
            description: `${s.name} benchmark competency.`,
            difficultyLevel: 4
          }
        });
      }

      await prisma.roleSkill.create({
        data: {
          roleRequirementId: createdRole.id,
          skillId: skill.id,
          requiredLevel: s.requiredLevel,
          importance: s.importance,
          businessDemand: s.businessDemand
        }
      });
    }
  }
}

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const overview = await getWorkforceOverview();
    res.json(overview);
  } catch (error) {
    console.error('Manager Overview Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const queue = await getAttentionQueue();
    res.json(queue);
  } catch (error) {
    console.error('Manager Queue Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCapabilityMatrix = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultRoles();

    // 1. Fetch all learners
    const learners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currentRole: true,
        targetRole: true,
        organization: true,
        experienceLevel: true,
        competencyProfile: {
          include: {
            skills: {
              include: { skill: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // 2. Fetch all skills in the system
    const skills = await prisma.skill.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });

    // 3. Construct 2D Matrix
    const matrixRows = learners.map(learner => {
      const profile = learner.competencyProfile;
      const skillScoreMap: Record<string, { score: number; confidence: number; evidenceCount: number; lastUpdated: string | null }> = {};

      profile?.skills.forEach(ps => {
        skillScoreMap[ps.skillId] = {
          score: Math.round(ps.score),
          confidence: Math.round(ps.confidence * 100),
          evidenceCount: ps.evidenceCount,
          lastUpdated: ps.lastUpdated ? ps.lastUpdated.toISOString() : null
        };
      });

      return {
        learner: {
          id: learner.id,
          name: learner.name,
          email: learner.email,
          avatar: learner.avatar,
          currentRole: learner.currentRole || 'Learner',
          targetRole: learner.targetRole || 'Full Stack Engineer',
          organization: learner.organization || 'Engineering Org',
          experienceLevel: learner.experienceLevel || 'Intermediate',
          overallScore: Math.round(profile?.overallScore || 0),
          readinessScore: Math.round(profile?.readinessScore || 0),
          dna: {
            technical: Math.round(profile?.dnaTechnical || 0),
            analytical: Math.round(profile?.dnaAnalytical || 0),
            communication: Math.round(profile?.dnaCommunication || 0),
            leadership: Math.round(profile?.dnaLeadership || 0),
            creativity: Math.round(profile?.dnaCreativity || 0),
          }
        },
        skills: skillScoreMap
      };
    });

    // 4. Compute Skill Summary Averages & Vulnerabilities
    const skillStats = skills.map(skill => {
      let total = 0;
      let count = 0;
      let masteredCount = 0;

      matrixRows.forEach(row => {
        const item = row.skills[skill.id];
        if (item && item.score > 0) {
          total += item.score;
          count++;
          if (item.score >= 80) masteredCount++;
        }
      });

      const avgScore = count > 0 ? Math.round(total / count) : 0;
      return {
        skillId: skill.id,
        name: skill.name,
        category: skill.category,
        averageScore: avgScore,
        assessedCount: count,
        masteredCount,
        coveragePct: learners.length > 0 ? Math.round((count / learners.length) * 100) : 0
      };
    });

    const activeSkillsWithData = skillStats.filter(s => s.assessedCount > 0);
    const topStrengths = [...activeSkillsWithData].sort((a, b) => b.averageScore - a.averageScore).slice(0, 4);
    const criticalGaps = [...activeSkillsWithData].sort((a, b) => a.averageScore - b.averageScore).slice(0, 4);

    const totalOverall = learners.reduce((acc, l) => acc + (l.competencyProfile?.overallScore || 0), 0);
    const teamAverageScore = learners.length > 0 ? Math.round(totalOverall / learners.length) : 0;

    res.json({
      skills,
      matrix: matrixRows,
      stats: {
        totalLearners: learners.length,
        totalSkills: skills.length,
        teamAverageScore,
        topStrengths,
        criticalGaps
      }
    });
  } catch (error) {
    console.error('Capability Matrix Error:', error);
    res.status(500).json({ error: 'Failed to generate capability matrix' });
  }
};

export const getRoleRequirements = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultRoles();

    const roles = await prisma.roleRequirement.findMany({
      include: {
        skills: {
          include: { skill: true }
        }
      },
      orderBy: { roleName: 'asc' }
    });

    res.json(roles);
  } catch (error) {
    console.error('Get Role Requirements Error:', error);
    res.status(500).json({ error: 'Failed to retrieve role benchmarks' });
  }
};

export const simulateTalentMobility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetRoleId, minThreshold = 0 } = req.body;

    if (!targetRoleId) {
      res.status(400).json({ error: 'Target role ID is required' });
      return;
    }

    await ensureDefaultRoles();

    const role = await prisma.roleRequirement.findUnique({
      where: { id: targetRoleId },
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    if (!role) {
      res.status(404).json({ error: 'Role requirement not found' });
      return;
    }

    // Fetch all learners with skills
    const learners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      include: {
        competencyProfile: {
          include: {
            skills: {
              include: { skill: true }
            }
          }
        }
      }
    });

    // Fetch all courses for upskilling recommendation mapping
    const courses = await prisma.course.findMany({
      where: { status: 'Active' },
      select: { id: true, title: true, description: true, targetCompetencies: true }
    });

    const simulations = await Promise.all(
      learners.map(async learner => {
        const profileSkills = learner.competencyProfile?.skills || [];
        const formattedUserSkills = profileSkills.map(ps => ({
          skillId: ps.skillId,
          score: ps.score
        }));

        const readiness = await calculateRoleReadiness(targetRoleId, formattedUserSkills);
        const readinessScore = Math.round(readiness.readinessScore);

        // Map detailed gaps
        const skillGaps = role.skills.map(rs => {
          const userSkill = profileSkills.find(ps => ps.skillId === rs.skillId);
          const currentScore = Math.round(userSkill?.score || 0);
          const requiredLevel = rs.requiredLevel;
          const gap = Math.max(0, requiredLevel - currentScore);

          return {
            skillId: rs.skillId,
            skillName: rs.skill?.name || 'Unknown Skill',
            category: rs.skill?.category || 'technical',
            requiredLevel,
            currentScore,
            gap,
            importance: rs.importance,
            isMet: currentScore >= requiredLevel,
            priority: gap > 25 ? 'CRITICAL' : gap > 10 ? 'MODERATE' : 'LOW'
          };
        });

        // Generate tailored course recommendations to close identified gaps
        const missingSkillNames = skillGaps
          .filter(g => !g.isMet)
          .map(g => g.skillName.toLowerCase());

        const recommendedCourses = courses
          .filter(c =>
            c.targetCompetencies.some(comp =>
              missingSkillNames.some(ms => ms.includes(comp.toLowerCase()) || comp.toLowerCase().includes(ms))
            )
          )
          .slice(0, 3);

        let fitCategory: 'READY_NOW' | 'UPSKILLING_REQUIRED' | 'HIGH_GAP';
        if (readinessScore >= 80) {
          fitCategory = 'READY_NOW';
        } else if (readinessScore >= 60) {
          fitCategory = 'UPSKILLING_REQUIRED';
        } else {
          fitCategory = 'HIGH_GAP';
        }

        return {
          candidate: {
            id: learner.id,
            name: learner.name,
            email: learner.email,
            avatar: learner.avatar,
            currentRole: learner.currentRole || 'Learner',
            targetRole: learner.targetRole,
            overallScore: Math.round(learner.competencyProfile?.overallScore || 0)
          },
          readinessScore,
          fitCategory,
          skillGaps,
          criticalGapCount: skillGaps.filter(g => g.priority === 'CRITICAL').length,
          recommendedCourses,
          estimatedUpskillWeeks: Math.ceil(skillGaps.filter(g => !g.isMet).length * 1.5)
        };
      })
    );

    const filtered = simulations
      .filter(s => s.readinessScore >= minThreshold)
      .sort((a, b) => b.readinessScore - a.readinessScore);

    const benchSummary = {
      totalCandidates: simulations.length,
      readyNowCount: simulations.filter(s => s.fitCategory === 'READY_NOW').length,
      upskillingCount: simulations.filter(s => s.fitCategory === 'UPSKILLING_REQUIRED').length,
      highGapCount: simulations.filter(s => s.fitCategory === 'HIGH_GAP').length,
      averageReadiness: Math.round(
        simulations.reduce((acc, curr) => acc + curr.readinessScore, 0) / (simulations.length || 1)
      )
    };

    res.json({
      targetRole: {
        id: role.id,
        roleName: role.roleName,
        requiredSkillsCount: role.skills.length,
        requiredSkills: role.skills.map(s => ({
          skillId: s.skillId,
          name: s.skill.name,
          requiredLevel: s.requiredLevel,
          importance: s.importance
        }))
      },
      benchSummary,
      candidates: filtered
    });
  } catch (error) {
    console.error('Talent Mobility Simulation Error:', error);
    res.status(500).json({ error: 'Failed to execute talent mobility simulation' });
  }
};

export const getWorkforceReadiness = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultRoles();

    const roles = await prisma.roleRequirement.findMany({
      include: {
        skills: true
      }
    });

    const learners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      include: {
        competencyProfile: {
          include: { skills: true }
        }
      }
    });

    const roleReadinessDistribution = await Promise.all(
      roles.map(async role => {
        let readyCount = 0;
        let pipelineCount = 0;
        let totalScore = 0;

        for (const learner of learners) {
          const userSkills = (learner.competencyProfile?.skills || []).map(ps => ({
            skillId: ps.skillId,
            score: ps.score
          }));

          const res = await calculateRoleReadiness(role.id, userSkills);
          const score = Math.round(res.readinessScore);
          totalScore += score;

          if (score >= 80) readyCount++;
          else if (score >= 60) pipelineCount++;
        }

        const avgScore = learners.length > 0 ? Math.round(totalScore / learners.length) : 0;
        const targetHeadcount = 5; // Org benchmark target

        return {
          roleId: role.id,
          roleName: role.roleName,
          targetHeadcount,
          readyHeadcount: readyCount,
          pipelineHeadcount: pipelineCount,
          averageReadiness: avgScore,
          benchDeficit: Math.max(0, targetHeadcount - readyCount),
          healthStatus: readyCount >= targetHeadcount ? 'HEALTHY' : readyCount >= 2 ? 'WATCH' : 'CRITICAL'
        };
      })
    );

    res.json(roleReadinessDistribution);
  } catch (error) {
    console.error('Workforce Readiness Error:', error);
    res.status(500).json({ error: 'Failed to calculate workforce readiness' });
  }
};
