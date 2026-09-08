import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

interface CourseDisplayItem {
  id: string | number;
  title: string;
  description?: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  category: 'Technology' | 'Leadership' | 'Management' | 'Data Science' | 'Cybersecurity';
  img: string;
  targetCompetencies: string[];
}

const BASE_COURSES: CourseDisplayItem[] = [
  // Technology
  {
    id: 'base-1',
    title: 'Advanced React & Architecture Patterns',
    description: 'Master server components, state management architectures, custom hooks, and high-performance rendering.',
    instructor: 'Sarah Drasner',
    duration: '18h',
    difficulty: 'Advanced',
    rating: 4.9,
    category: 'Technology',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['React.js', 'Frontend Architecture', 'State Management']
  },
  {
    id: 'base-2',
    title: 'Node.js Microservices & Distributed Systems',
    description: 'Build resilient event-driven microservices with Node.js, Express, Kafka, and PostgreSQL clustering.',
    instructor: 'Stephen Grider',
    duration: '24h',
    difficulty: 'Intermediate',
    rating: 4.9,
    category: 'Technology',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Node.js & Express', 'Microservices', 'API Design']
  },
  {
    id: 'base-3',
    title: 'Cloud Infrastructure with AWS & Terraform',
    description: 'Design and automate scalable cloud infrastructure, IAM policies, VPCs, and serverless compute.',
    instructor: 'Neal Davis',
    duration: '32h',
    difficulty: 'Advanced',
    rating: 4.8,
    category: 'Technology',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Cloud Infrastructure (AWS/GCP)', 'DevOps', 'Terraform']
  },

  // Leadership
  {
    id: 'base-4',
    title: 'Engineering Leadership & Technical Mentorship',
    description: 'Develop executive communication, mentor high-output engineers, and cultivate psychological safety.',
    instructor: 'Camille Fournier',
    duration: '14h',
    difficulty: 'Intermediate',
    rating: 4.9,
    category: 'Leadership',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Technical Mentorship', 'Cross-functional Communication', 'Leadership']
  },
  {
    id: 'base-5',
    title: 'Strategic Decision Making for Tech Leads',
    description: 'Frameworks for architectural trade-offs, technical debt management, and executive alignment.',
    instructor: 'Will Larson',
    duration: '12h',
    difficulty: 'Advanced',
    rating: 4.8,
    category: 'Leadership',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Strategic Decision Making', 'Systems Thinking', 'Leadership']
  },

  // Management
  {
    id: 'base-6',
    title: 'Agile Delivery & Product Roadmapping',
    description: 'Lead high-velocity cross-functional sprints, balance technical debt vs roadmap features, and deliver on time.',
    instructor: 'Marty Cagan',
    duration: '16h',
    difficulty: 'Intermediate',
    rating: 4.7,
    category: 'Management',
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Agile Delivery & Roadmapping', 'Resource Allocation', 'Project Management']
  },
  {
    id: 'base-7',
    title: 'Engineering Resource & Talent Planning',
    description: 'Analyze competency matrix gaps, plan hiring pipelines, and optimize engineering bandwidth allocation.',
    instructor: 'Claire Hughes Johnson',
    duration: '10h',
    difficulty: 'Advanced',
    rating: 4.8,
    category: 'Management',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Workforce Planning', 'Capability Analysis', 'Talent Allocation']
  },

  // Data Science
  {
    id: 'base-8',
    title: 'Applied Machine Learning & LLM Orchestration',
    description: 'Deploy production RAG pipelines, fine-tune open weights models, and integrate agentic LLM workflows.',
    instructor: 'Andrew Ng',
    duration: '28h',
    difficulty: 'Advanced',
    rating: 5.0,
    category: 'Data Science',
    img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Python & ML Frameworks', 'LLM Orchestration & Prompting', 'Data Engineering']
  },
  {
    id: 'base-9',
    title: 'Statistical Data Analysis & Feature Engineering',
    description: 'Master data exploration, hypothesis testing, anomaly detection, and predictive modeling in Python.',
    instructor: 'Cassie Kozyrkov',
    duration: '20h',
    difficulty: 'Beginner',
    rating: 4.8,
    category: 'Data Science',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Statistical & Algorithmic Analysis', 'Python', 'Feature Engineering']
  },

  // Cybersecurity
  {
    id: 'base-10',
    title: 'DevSecOps & Secure Cloud Architecture',
    description: 'Implement automated vulnerability scanners in CI/CD, Zero Trust network architectures, and threat modeling.',
    instructor: 'Tanya Janca',
    duration: '22h',
    difficulty: 'Advanced',
    rating: 4.9,
    category: 'Cybersecurity',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['System Security & Compliance', 'DevSecOps', 'Cloud Security']
  },
  {
    id: 'base-11',
    title: 'Web Application Penetration Testing & OWASP',
    description: 'Identify and remediate SQL injection, XSS, CSRF, and authorization flaws across modern web stacks.',
    instructor: 'Georgia Weidman',
    duration: '18h',
    difficulty: 'Intermediate',
    rating: 4.8,
    category: 'Cybersecurity',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: ['Application Security', 'Threat Modeling', 'Code Review']
  }
];

const CATEGORIES = [
  'All Categories',
  'Technology',
  'Leadership',
  'Management',
  'Data Science',
  'Cybersecurity'
] as const;

export const LearningHub = () => {
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/courses')
      .then(res => {
        setDbCourses(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper to infer category for DB created courses
  const inferCategory = (course: any): 'Technology' | 'Leadership' | 'Management' | 'Data Science' | 'Cybersecurity' => {
    const text = `${course.title} ${course.description} ${(course.targetCompetencies || []).join(' ')}`.toLowerCase();
    if (text.includes('security') || text.includes('cyber') || text.includes('owasp') || text.includes('auth')) return 'Cybersecurity';
    if (text.includes('data') || text.includes('machine learning') || text.includes('ai') || text.includes('python')) return 'Data Science';
    if (text.includes('leadership') || text.includes('mentor') || text.includes('coach')) return 'Leadership';
    if (text.includes('manage') || text.includes('agile') || text.includes('scrum') || text.includes('product')) return 'Management';
    return 'Technology';
  };

  // Merge DB courses with base courses
  const formattedDbCourses: CourseDisplayItem[] = dbCourses.map(c => ({
    id: c._id || c.id,
    title: c.title,
    description: c.description || 'Comprehensive competency-building module designed by industry trainers.',
    instructor: c.trainer?.name || 'Verified Trainer',
    duration: '8h',
    difficulty: 'Intermediate',
    rating: 4.9,
    category: inferCategory(c),
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    targetCompetencies: c.targetCompetencies || ['Full-Stack Development']
  }));

  const allCourses: CourseDisplayItem[] = [...formattedDbCourses, ...BASE_COURSES];

  // Filtering
  const filteredCourses = allCourses.filter(course => {
    // 1. Category Filter
    const matchesCategory =
      selectedCategory === 'All Categories' || course.category === selectedCategory;

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      course.title.toLowerCase().includes(query) ||
      (course.description && course.description.toLowerCase().includes(query)) ||
      course.instructor.toLowerCase().includes(query) ||
      course.targetCompetencies.some(comp => comp.toLowerCase().includes(query));

    // 3. Difficulty Filter
    const matchesDifficulty =
      selectedDifficulty === 'ALL' || course.difficulty === selectedDifficulty;

    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  // Calculate counts per category
  const getCategoryCount = (cat: string) => {
    if (cat === 'All Categories') return allCourses.length;
    return allCourses.filter(c => c.category === cat).length;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 text-slate-900 max-w-7xl mx-auto pb-32">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Capacity Learning Academy
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Learning Hub</h1>
          <p className="text-slate-500 text-sm mt-1">
            Explore verified courses to close skill gaps and advance your Competency DNA.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search courses, instructors, skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all shadow-xs"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 shadow-xs cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Interactive Category Tabs with Live Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = getCategoryCount(cat);

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 scale-102'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Course Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} in <strong className="text-slate-800">{selectedCategory}</strong></span>
          {(selectedCategory !== 'All Categories' || searchQuery || selectedDifficulty !== 'ALL') && (
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setSearchQuery('');
                setSelectedDifficulty('ALL');
              }}
              className="text-purple-600 hover:text-purple-700 font-bold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">Loading learning academy catalog...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 space-y-4 shadow-sm">
            <div className="w-14 h-14 mx-auto bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No courses match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your category, difficulty level, or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setSearchQuery('');
                setSelectedDifficulty('ALL');
              }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden group cursor-pointer hover:border-purple-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image with badges overlay */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <div
                      className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${course.img})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Category pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
                        {course.category}
                      </span>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/90 backdrop-blur-md text-slate-900 flex items-center gap-1 shadow-xs">
                        <Star className="text-amber-500 w-3.5 h-3.5 fill-amber-500" /> {course.rating}
                      </span>
                    </div>

                    {/* Target Competencies at bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {course.targetCompetencies.slice(0, 2).map((comp) => (
                        <span key={comp} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-950/80 text-purple-200 backdrop-blur-xs border border-purple-500/20">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            course.difficulty === 'Advanced'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                              : course.difficulty === 'Intermediate'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}
                        >
                          {course.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock size={13} className="text-slate-400" /> {course.duration}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>

                      {course.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                          {course.instructor.charAt(0)}
                        </div>
                        <span className="truncate max-w-[130px]">{course.instructor}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                        Explore <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
