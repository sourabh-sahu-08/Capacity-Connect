export enum Role {
  LEARNER = 'LEARNER',
  TRAINER = 'TRAINER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  organization?: string;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  currentRole?: string;
  targetRole?: string;
}

export interface Competency {
  _id: string;
  name: string;
  category: string;
  description?: string;
}

export interface UserCompetency {
  competencyId: string | Competency;
  level: number; // 0-100
  history: Array<{ date: string; score: number }>;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string | User;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  thumbnail?: string;
  skills: string[]; // Competency IDs or names
  modules: Module[];
  createdAt: string;
}

export interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  order: number;
  content: string;
  videoUrl?: string;
  resources: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'video';
}

export interface Assessment {
  _id: string;
  courseId?: string;
  title: string;
  questions: Question[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  passingScore: number;
  duration: number; // in minutes
  competencies: Array<{ competencyId: string; weight: number }>;
}

export interface Question {
  _id: string;
  text: string;
  type: 'MCQ' | 'Scenario' | 'ShortAnswer';
  options?: string[];
  correctAnswer: string;
}

export interface LearningProgress {
  _id: string;
  userId: string;
  courseId: string;
  completedLessons: string[]; // Lesson IDs
  progress: number; // 0-100
  status: 'NotStarted' | 'InProgress' | 'Completed';
  startedAt: string;
  completedAt?: string;
}

export interface LearningPath {
  _id: string;
  userId: string;
  targetRole: string;
  skillsGap: Array<{ skill: string; gap: number; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  courses: Array<{ courseId: string | Course; status: 'Locked' | 'InProgress' | 'Completed' }>;
  overallReadiness: number;
}

export interface CommunityPost {
  _id: string;
  author: string | User;
  content: string;
  tags: string[];
  upvotes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  author: string | User;
  content: string;
  createdAt: string;
}

export interface Certificate {
  _id: string;
  userId: string;
  courseId: string;
  certificateId: string;
  issuedDate: string;
  verificationUrl: string;
}

export interface Achievement {
  _id: string;
  userId: string;
  title: string;
  description: string;
  badgeUrl: string;
  unlockedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}
