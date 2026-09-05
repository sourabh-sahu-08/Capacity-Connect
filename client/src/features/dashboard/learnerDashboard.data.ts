export type LearnerDashboardData = {
  courses: Array<{ id: string; title: string; trainer: string; category: string; level: string; progress: number; modules: string; lastAccessed: string; image: string }>;
  recommendations: Array<{ id: string; title: string; trainer: string; level: string; duration: string; rating: number; reason: string; image: string }>;
  assessments: Array<{ id: string; title: string; course: string; questions: number; duration: string; deadline: string; status: 'Due soon' | 'Upcoming' | 'Completed' }>;
  competencies: Array<{ name: string; score: number; level: string; target: number }>;
  skillGaps: Array<{ name: string; current: string; target: string; score: number; recommendation: string }>;
  learningPath: Array<{ title: string; state: 'complete' | 'current' | 'upcoming' }>;
  certificates: Array<{ title: string; course: string; date: string; id: string }>;
  activity: Array<{ text: string; time: string; type: 'course' | 'assessment' | 'certificate' | 'competency' }>;
  notifications: Array<{ text: string; time: string; unread: boolean }>;
};

export const learnerDashboardData: LearnerDashboardData = {
  courses: [
    { id: 'react-advanced', title: 'Advanced React Architecture', trainer: 'Sarah Drasner', category: 'Frontend engineering', level: 'Advanced', progress: 72, modules: '8 / 11 modules', lastAccessed: 'Last opened 2 hours ago', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6ee6?q=80&w=900&auto=format&fit=crop' },
    { id: 'node-backend', title: 'Node.js Backend Fundamentals', trainer: 'Rahul Sharma', category: 'Backend engineering', level: 'Intermediate', progress: 48, modules: '6 / 12 modules', lastAccessed: 'Last opened yesterday', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop' },
  ],
  recommendations: [
    { id: 'system-design', title: 'Practical System Design', trainer: 'Maya Patel', level: 'Advanced', duration: '12 hours', rating: 4.8, reason: 'Builds on your strong JavaScript competency', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop' },
    { id: 'mongodb-design', title: 'MongoDB & Data Modeling', trainer: 'Arjun Mehta', level: 'Intermediate', duration: '8 hours', rating: 4.7, reason: 'Targets your database competency gap', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop' },
    { id: 'tech-leadership', title: 'Technical Leadership Essentials', trainer: 'Nadia Williams', level: 'Intermediate', duration: '6 hours', rating: 4.9, reason: 'Recommended from your assessment momentum', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=900&auto=format&fit=crop' },
  ],
  assessments: [
    { id: 'javascript', title: 'JavaScript Fundamentals', course: 'Web Development pathway', questions: 20, duration: '20 min', deadline: '10 Sep 2026', status: 'Due soon' },
    { id: 'backend', title: 'Backend Architecture Checkpoint', course: 'Node.js Backend Fundamentals', questions: 15, duration: '25 min', deadline: '18 Sep 2026', status: 'Upcoming' },
    { id: 'react', title: 'React Patterns Review', course: 'Advanced React Architecture', questions: 18, duration: '20 min', deadline: 'Completed 02 Sep', status: 'Completed' },
  ],
  competencies: [
    { name: 'Frontend Development', score: 82, level: 'Advanced', target: 90 },
    { name: 'Backend Development', score: 68, level: 'Intermediate', target: 82 },
    { name: 'Database Management', score: 74, level: 'Intermediate', target: 80 },
    { name: 'Communication', score: 61, level: 'Intermediate', target: 75 },
    { name: 'Project Management', score: 55, level: 'Developing', target: 70 },
  ],
  skillGaps: [
    { name: 'Backend Architecture', current: 'Intermediate', target: 'Advanced', score: 48, recommendation: 'Advanced Backend Development' },
    { name: 'System Design', current: 'Developing', target: 'Proficient', score: 42, recommendation: 'Practical System Design' },
    { name: 'MongoDB', current: 'Developing', target: 'Intermediate', score: 52, recommendation: 'MongoDB & Data Modeling' },
  ],
  learningPath: [
    { title: 'JavaScript Fundamentals', state: 'complete' }, { title: 'React Basics', state: 'complete' }, { title: 'Advanced React', state: 'current' }, { title: 'Node.js Backend', state: 'upcoming' }, { title: 'System Design', state: 'upcoming' },
  ],
  certificates: [
    { title: 'React Fundamentals', course: 'Frontend Development pathway', date: '02 Sep 2026', id: 'CC-REACT-2026-00123' },
    { title: 'JavaScript Essentials', course: 'Web Development pathway', date: '14 Aug 2026', id: 'CC-JS-2026-00088' },
  ],
  activity: [
    { text: 'Completed React Module 5', time: '2 hours ago', type: 'course' }, { text: 'Scored 86% in JavaScript Quiz', time: 'Yesterday', type: 'assessment' }, { text: 'Earned React Fundamentals Certificate', time: '3 days ago', type: 'certificate' }, { text: 'Backend competency updated to 68%', time: '5 days ago', type: 'competency' },
  ],
  notifications: [
    { text: 'JavaScript assessment is due tomorrow', time: '1 hour ago', unread: true }, { text: 'Your React certificate is ready to view', time: 'Yesterday', unread: true }, { text: 'Trainer uploaded new backend material', time: '3 days ago', unread: false },
  ],
};