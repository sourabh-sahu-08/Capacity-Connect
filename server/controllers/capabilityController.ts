import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCapabilityMatrix = async (req: Request, res: Response) => {
  try {
    const learners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      include: {
        competencyProfile: {
          include: {
            skills: { include: { skill: true } }
          }
        }
      }
    });

    const allSkills = await prisma.skill.findMany();
    
    const matrix = learners.map(l => {
      const skillsMap: Record<string, any> = {};
      
      if (l.competencyProfile && l.competencyProfile.skills) {
        l.competencyProfile.skills.forEach(ps => {
          skillsMap[ps.skillId] = {
            score: ps.score,
            confidence: ps.confidence,
            evidenceCount: ps.evidenceCount,
            lastUpdated: ps.lastUpdated
          };
        });
      }

      return {
        learner: {
          id: l.id,
          name: l.name,
          email: l.email,
          avatar: l.avatar,
          currentRole: l.currentRole || 'Unknown',
          targetRole: l.targetRole || 'Unknown',
          organization: l.organization || 'Global',
          experienceLevel: l.experienceLevel || 'Intermediate',
          overallScore: l.competencyProfile?.overallScore || 0,
          readinessScore: l.competencyProfile?.readinessScore || 0,
          dna: {
            technical: l.competencyProfile?.dnaTechnical || 0,
            analytical: l.competencyProfile?.dnaAnalytical || 0,
            communication: l.competencyProfile?.dnaCommunication || 0,
            leadership: l.competencyProfile?.dnaLeadership || 0,
            creativity: 0
          }
        },
        skills: skillsMap
      };
    });

    let teamAverageScore = 0;
    if (learners.length > 0) {
      teamAverageScore = learners.reduce((sum, l) => sum + (l.competencyProfile?.overallScore || 0), 0) / learners.length;
    }

    res.json({
      skills: allSkills.map(s => ({ id: s.id, name: s.name, slug: s.slug, category: s.category })),
      matrix,
      stats: {
        totalLearners: learners.length,
        totalSkills: allSkills.length,
        teamAverageScore,
        topStrengths: [],
        criticalGaps: []
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
