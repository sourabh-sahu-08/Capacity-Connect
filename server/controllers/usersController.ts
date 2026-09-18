import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const discoverUsers = async (req: Request, res: Response) => {
  try {
    const { q = '', role = 'ALL' } = req.query;
    
    let whereClause: any = {};
    if (q) {
      whereClause.name = { contains: String(q), mode: 'insensitive' };
    }
    if (role !== 'ALL') {
      whereClause.role = String(role);
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        competencyProfile: true
      },
      take: 20
    });

    const mappedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      currentRole: user.currentRole,
      organization: user.organization,
      location: null,
      competencyScore: user.competencyProfile?.overallScore || 0,
      readinessScore: user.competencyProfile?.readinessScore || 0,
      skillsCount: 0,
      projectsCount: 0,
      followersCount: 0,
      isFollowing: false
    }));

    res.json({
      success: true,
      users: mappedUsers,
      totalCount: mappedUsers.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
