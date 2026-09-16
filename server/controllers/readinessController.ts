import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.roleRequirement.findMany({
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const simulateMobility = async (req: Request, res: Response) => {
  try {
    const { targetRoleId, minThreshold = 0 } = req.body;
    
    const targetRole = await prisma.roleRequirement.findUnique({
      where: { id: targetRoleId },
      include: { skills: { include: { skill: true } } }
    });

    if (!targetRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const learners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      include: {
        competencyProfile: {
          include: { skills: true }
        }
      }
    });

    let readyNowCount = 0;
    let upskillingCount = 0;
    let highGapCount = 0;
    let totalReadiness = 0;

    const candidates = learners.map(learner => {
      const skillGaps = targetRole.skills.map(reqSkill => {
        const userSkill = learner.competencyProfile?.skills?.find(ps => ps.skillId === reqSkill.skillId);
        const currentScore = userSkill ? userSkill.score : 0;
        const gap = Math.max(0, reqSkill.requiredLevel - currentScore);
        
        return {
          skillId: reqSkill.skillId,
          skillName: reqSkill.skill.name,
          category: reqSkill.skill.category,
          requiredLevel: reqSkill.requiredLevel,
          currentScore,
          gap,
          importance: reqSkill.importance,
          isMet: gap === 0,
          priority: gap > 30 ? 'CRITICAL' : gap > 10 ? 'MODERATE' : 'LOW'
        };
      });

      const criticalGaps = skillGaps.filter(g => g.priority === 'CRITICAL');
      let readinessScore = learner.competencyProfile?.readinessScore || 0;
      
      // Simple fitness logic
      let fitCategory = 'HIGH_GAP';
      if (criticalGaps.length === 0 && readinessScore > 70) {
        fitCategory = 'READY_NOW';
        readyNowCount++;
      } else if (criticalGaps.length < 3) {
        fitCategory = 'UPSKILLING_REQUIRED';
        upskillingCount++;
      } else {
        highGapCount++;
      }

      totalReadiness += readinessScore;

      return {
        candidate: {
          id: learner.id,
          name: learner.name,
          email: learner.email,
          avatar: learner.avatar,
          currentRole: learner.currentRole || 'Unknown',
          targetRole: learner.targetRole,
          overallScore: learner.competencyProfile?.overallScore || 0
        },
        readinessScore,
        fitCategory,
        skillGaps,
        criticalGapCount: criticalGaps.length,
        recommendedCourses: [],
        estimatedUpskillWeeks: criticalGaps.length * 2
      };
    });

    const averageReadiness = learners.length > 0 ? (totalReadiness / learners.length) : 0;

    res.json({
      targetRole: {
        id: targetRole.id,
        roleName: targetRole.roleName,
        requiredSkillsCount: targetRole.skills.length,
        requiredSkills: targetRole.skills.map(s => ({
          skillId: s.skillId,
          name: s.skill.name,
          requiredLevel: s.requiredLevel,
          importance: s.importance
        }))
      },
      benchSummary: {
        totalCandidates: learners.length,
        readyNowCount,
        upskillingCount,
        highGapCount,
        averageReadiness
      },
      candidates
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReadiness = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.roleRequirement.findMany();
    
    // Very simplified mock calculation for overall readiness to satisfy the UI type
    const results = roles.map(r => ({
      roleId: r.id,
      roleName: r.roleName,
      targetHeadcount: 5,
      readyHeadcount: 2,
      pipelineHeadcount: 3,
      averageReadiness: 65,
      benchDeficit: 3,
      healthStatus: 'WATCH'
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
