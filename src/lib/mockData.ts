// Mock data for MVP demonstration

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar?: string;
  grade?: string;
  subjects?: string[];
}

export interface MockClass {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  teacher: MockUser;
  students: MockUser[];
  duration: number; // in minutes
  modules: MockModule[];
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  schedule: string;
  maxStudents: number;
  currentStudents: number;
  tags: string[];
}

export interface MockModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'discussion';
  duration: number;
  content: string;
  resources: MockResource[];
  completed: boolean;
}

export interface MockResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  size?: string;
}

export interface MockQuiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  timeLimit: number; // in minutes
  passingScore: number;
  questions: MockQuestion[];
  attempts: number;
  bestScore: number;
}

export interface MockQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface MockProgress {
  userId: string;
  classId: string;
  completedModules: string[];
  quizScores: { quizId: string; score: number; attempts: number }[];
  timeSpent: number; // in minutes
  lastActivity: string;
  aiInsights: AIInsight[];
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'behavior' | 'learning_style' | 'engagement';
  title: string;
  description: string;
  confidence: number; // 0-100
  timestamp: string;
  actionable: boolean;
  actionItems: string[];
}

export interface MockClassSession {
  id: string;
  classId: string;
  title: string;
  type: 'online' | 'offline';
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  attendees: string[];
  resources: MockResource[];
  notes: string;
  recordingUrl?: string;
}

export interface MockParentCommunication {
  id: string;
  parentId: string;
  studentId: string;
  teacherId: string;
  type: 'progress_report' | 'behavior_alert' | 'achievement' | 'recommendation';
  title: string;
  message: string;
  performanceData?: {
    overallScore: number;
    subjectScores: { [subject: string]: number };
    attendance: number;
    participation: number;
  };
  recommendations: string[];
  timestamp: string;
  read: boolean;
  responded: boolean;
  response?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    email: 'john.doe@school.edu',
    name: 'John Doe',
    role: 'student',
    grade: '10th Grade',
    subjects: ['Mathematics', 'Physics', 'English']
  },
  {
    id: 'u2',
    email: 'sarah.smith@school.edu',
    name: 'Sarah Smith',
    role: 'teacher',
    subjects: ['Mathematics', 'Physics']
  },
  {
    id: 'u3',
    email: 'mike.johnson@school.edu',
    name: 'Mike Johnson',
    role: 'student',
    grade: '11th Grade',
    subjects: ['Chemistry', 'Biology', 'History']
  },
  {
    id: 'u4',
    email: 'emma.wilson@school.edu',
    name: 'Emma Wilson',
    role: 'teacher',
    subjects: ['English', 'Literature']
  },
  {
    id: 'u5',
    email: 'david.brown@school.edu',
    name: 'David Brown',
    role: 'parent'
  },
  {
    id: 'u6',
    email: 'admin@school.edu',
    name: 'System Administrator',
    role: 'admin'
  }
];

export const mockClasses: MockClass[] = [
  {
    id: 'c1',
    title: 'Advanced Mathematics',
    description: 'Comprehensive course covering calculus, linear algebra, and mathematical analysis.',
    subject: 'Mathematics',
    level: 'advanced',
    teacher: mockUsers[1],
    students: [mockUsers[0], mockUsers[2]],
    duration: 90,
    modules: [
      {
        id: 'm1',
        title: 'Calculus Fundamentals',
        description: 'Introduction to differential and integral calculus',
        type: 'video',
        duration: 45,
        content: 'This module covers the basics of calculus including limits, derivatives, and integrals.',
        resources: [
          { id: 'r1', title: 'Calculus Textbook Chapter 1', type: 'pdf', url: '#', size: '2.3MB' },
          { id: 'r2', title: 'Calculus Video Lecture', type: 'video', url: '#', size: '45:30' }
        ],
        completed: false
      },
      {
        id: 'm2',
        title: 'Linear Algebra Basics',
        description: 'Vectors, matrices, and linear transformations',
        type: 'reading',
        duration: 60,
        content: 'Explore the fundamental concepts of linear algebra through interactive examples.',
        resources: [
          { id: 'r3', title: 'Linear Algebra Notes', type: 'pdf', url: '#', size: '1.8MB' },
          { id: 'r4', title: 'Practice Problems', type: 'document', url: '#', size: '500KB' }
        ],
        completed: false
      }
    ],
    progress: 35,
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    schedule: 'Mon, Wed, Fri 9:00 AM',
    maxStudents: 25,
    currentStudents: 18,
    tags: ['STEM', 'Advanced', 'College Prep']
  },
  {
    id: 'c2',
    title: 'English Literature',
    description: 'Explore classic and contemporary literature through critical analysis and discussion.',
    subject: 'English',
    level: 'intermediate',
    teacher: mockUsers[3],
    students: [mockUsers[0]],
    duration: 60,
    modules: [
      {
        id: 'm3',
        title: 'Shakespeare\'s Works',
        description: 'Analysis of major plays and sonnets',
        type: 'reading',
        duration: 90,
        content: 'Dive into the world of Shakespeare with detailed analysis of his most famous works.',
        resources: [
          { id: 'r5', title: 'Shakespeare Collection', type: 'pdf', url: '#', size: '5.2MB' },
          { id: 'r6', title: 'Analysis Guide', type: 'document', url: '#', size: '800KB' }
        ],
        completed: true
      }
    ],
    progress: 75,
    startDate: '2024-01-10',
    endDate: '2024-05-20',
    schedule: 'Tue, Thu 10:30 AM',
    maxStudents: 20,
    currentStudents: 15,
    tags: ['Humanities', 'Literature', 'Classic']
  },
  {
    id: 'c3',
    title: 'Physics Lab',
    description: 'Hands-on experiments and demonstrations of fundamental physics principles.',
    subject: 'Physics',
    level: 'beginner',
    teacher: mockUsers[1],
    students: [mockUsers[2]],
    duration: 120,
    modules: [
      {
        id: 'm4',
        title: 'Mechanics Experiments',
        description: 'Basic mechanics and motion experiments',
        type: 'video',
        duration: 60,
        content: 'Learn about motion, forces, and energy through interactive lab experiments.',
        resources: [
          { id: 'r7', title: 'Lab Manual', type: 'pdf', url: '#', size: '1.5MB' },
          { id: 'r8', title: 'Safety Guidelines', type: 'document', url: '#', size: '300KB' }
        ],
        completed: false
      }
    ],
    progress: 20,
    startDate: '2024-02-01',
    endDate: '2024-07-01',
    schedule: 'Wed 2:00 PM',
    maxStudents: 15,
    currentStudents: 12,
    tags: ['STEM', 'Lab', 'Hands-on']
  }
];

export const mockQuizzes: MockQuiz[] = [
  {
    id: 'q1',
    title: 'Calculus Fundamentals Quiz',
    description: 'Test your understanding of basic calculus concepts',
    subject: 'Mathematics',
    timeLimit: 30,
    passingScore: 70,
    attempts: 2,
    bestScore: 85,
    questions: [
      {
        id: 'qu1',
        question: 'What is the derivative of x²?',
        type: 'multiple-choice',
        options: ['x', '2x', 'x²', '2x²'],
        correctAnswer: '2x',
        explanation: 'The derivative of x² is 2x using the power rule.',
        points: 10
      },
      {
        id: 'qu2',
        question: 'The integral of 2x is x² + C.',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'This is correct. The integral of 2x is x² + C, where C is the constant of integration.',
        points: 5
      },
      {
        id: 'qu3',
        question: 'Explain the concept of a limit in calculus.',
        type: 'short-answer',
        correctAnswer: 'A limit describes the value that a function approaches as the input approaches some value.',
        explanation: 'Limits are fundamental to calculus and describe the behavior of functions near specific points.',
        points: 15
      }
    ]
  },
  {
    id: 'q2',
    title: 'Shakespeare Literature Quiz',
    description: 'Test your knowledge of Shakespeare\'s works and themes',
    subject: 'English',
    timeLimit: 45,
    passingScore: 75,
    attempts: 1,
    bestScore: 90,
    questions: [
      {
        id: 'qu4',
        question: 'Which play contains the famous line "To be or not to be"?',
        type: 'multiple-choice',
        options: ['Macbeth', 'Hamlet', 'Romeo and Juliet', 'Othello'],
        correctAnswer: 'Hamlet',
        explanation: 'This famous soliloquy is from Hamlet, Act 3, Scene 1.',
        points: 10
      },
      {
        id: 'qu5',
        question: 'Shakespeare wrote both comedies and tragedies.',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'Shakespeare wrote in multiple genres including comedies, tragedies, and histories.',
        points: 5
      }
    ]
  }
];

export const mockProgress: MockProgress[] = [
  {
    userId: 'u1',
    classId: 'c1',
    completedModules: ['m1'],
    quizScores: [{ quizId: 'q1', score: 85, attempts: 2 }],
    timeSpent: 180,
    lastActivity: '2024-01-20T10:30:00Z',
    aiInsights: [
      {
        id: 'ai1',
        type: 'performance',
        title: 'Strong Mathematical Foundation',
        description: 'Student shows excellent understanding of calculus fundamentals with consistent high scores.',
        confidence: 92,
        timestamp: '2024-01-20T10:30:00Z',
        actionable: true,
        actionItems: ['Continue with advanced calculus topics', 'Focus on real-world applications']
      }
    ],
    recommendations: ['Continue with advanced calculus topics', 'Practice with real-world problems'],
    strengths: ['Mathematical reasoning', 'Problem-solving', 'Consistent performance'],
    areasForImprovement: ['Application to real-world scenarios', 'Time management in exams']
  },
  {
    userId: 'u1',
    classId: 'c2',
    completedModules: ['m3'],
    quizScores: [{ quizId: 'q2', score: 90, attempts: 1 }],
    timeSpent: 120,
    lastActivity: '2024-01-19T14:15:00Z',
    aiInsights: [
      {
        id: 'ai2',
        type: 'learning_style',
        title: 'Visual and Analytical Learner',
        description: 'Student excels when combining textual analysis with visual aids and discussions.',
        confidence: 88,
        timestamp: '2024-01-19T14:15:00Z',
        actionable: true,
        actionItems: ['Use more visual learning materials', 'Encourage group discussions']
      }
    ],
    recommendations: ['Use more visual learning materials', 'Participate in group discussions'],
    strengths: ['Critical analysis', 'Literary interpretation', 'Active participation'],
    areasForImprovement: ['Independent research', 'Creative writing skills']
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    type: 'assignment',
    title: 'New Assignment Posted',
    message: 'Calculus homework #3 has been posted. Due in 3 days.',
    timestamp: '2024-01-20T09:00:00Z',
    read: false
  },
  {
    id: 'n2',
    type: 'quiz',
    title: 'Quiz Results Available',
    message: 'Your Shakespeare quiz results are ready to view.',
    timestamp: '2024-01-19T16:30:00Z',
    read: true
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Class Reminder',
    message: 'Physics Lab starts in 30 minutes. Don\'t forget your lab notebook!',
    timestamp: '2024-01-20T13:30:00Z',
    read: false
  }
];

export const mockStudyGroups = [
  {
    id: 'sg1',
    name: 'Math Study Group',
    subject: 'Mathematics',
    members: [mockUsers[0], mockUsers[2]],
    maxMembers: 8,
    description: 'Weekly study sessions for advanced mathematics',
    meetingTime: 'Every Saturday 10:00 AM',
    createdBy: mockUsers[1]
  },
  {
    id: 'sg2',
    name: 'Literature Discussion',
    subject: 'English',
    members: [mockUsers[0]],
    maxMembers: 12,
    description: 'Deep dive into classic literature',
    meetingTime: 'Every Sunday 2:00 PM',
    createdBy: mockUsers[3]
  }
];

export const mockClassSessions: MockClassSession[] = [
  {
    id: 'cs1',
    classId: 'c1',
    title: 'Calculus Fundamentals Live Session',
    type: 'online',
    startTime: '2024-01-22T14:00:00Z',
    endTime: '2024-01-22T15:30:00Z',
    status: 'scheduled',
    attendees: ['u1', 'u2', 'u3'],
    resources: [
      { id: 'r9', title: 'Calculus Session Notes', type: 'document', url: '#', size: '1.2MB' },
      { id: 'r10', title: 'Practice Problems Set', type: 'pdf', url: '#', size: '800KB' }
    ],
    notes: 'Live interactive session covering derivatives and integrals with real-time problem solving.',
    recordingUrl: undefined
  },
  {
    id: 'cs2',
    classId: 'c2',
    title: 'Shakespeare Analysis Workshop',
    type: 'offline',
    startTime: '2024-01-23T10:00:00Z',
    endTime: '2024-01-23T11:30:00Z',
    status: 'scheduled',
    attendees: ['u1'],
    resources: [
      { id: 'r11', title: 'Workshop Materials', type: 'pdf', url: '#', size: '2.1MB' },
      { id: 'r12', title: 'Discussion Questions', type: 'document', url: '#', size: '300KB' }
    ],
    notes: 'In-person workshop focusing on character analysis and thematic elements in Hamlet.',
    recordingUrl: undefined
  }
];

export const mockParentCommunications: MockParentCommunication[] = [
  {
    id: 'pc1',
    parentId: 'u5',
    studentId: 'u1',
    teacherId: 'u2',
    type: 'progress_report',
    title: 'Monthly Progress Report - John Doe',
    message: 'John has shown excellent progress in Advanced Mathematics this month. He consistently scores above 85% and actively participates in class discussions.',
    performanceData: {
      overallScore: 87,
      subjectScores: { 'Mathematics': 87, 'Physics': 82, 'English': 90 },
      attendance: 95,
      participation: 88
    },
    recommendations: [
      'Continue encouraging independent problem-solving',
      'Consider advanced mathematics competitions',
      'Maintain current study routine'
    ],
    timestamp: '2024-01-20T16:00:00Z',
    read: false,
    responded: false
  },
  {
    id: 'pc2',
    parentId: 'u5',
    studentId: 'u1',
    teacherId: 'u3',
    type: 'achievement',
    title: 'Outstanding Performance in Literature',
    message: 'Congratulations! John has achieved the highest score in this month\'s Shakespeare analysis quiz.',
    recommendations: [
      'Encourage continued reading of classic literature',
      'Consider joining the school\'s book club',
      'Explore creative writing opportunities'
    ],
    timestamp: '2024-01-19T14:30:00Z',
    read: true,
    responded: true,
    response: 'Thank you for the update! We\'re very proud of John\'s progress and will continue to support his literary interests.'
  }
]; 