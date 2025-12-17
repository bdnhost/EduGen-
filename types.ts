export interface RubricCriteria {
  title: string;
  description: string;
  max_points: number;
}

// Interactive Quiz Question - Multiple Choice with visual support
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation: string; // Explanation shown after answer
  imageUrl?: string; // Optional: URL for visual diagram/chart
  points: number; // Points for this question
}

// Project Milestone - for tracking project progress
export interface ProjectMilestone {
  title: string;
  description: string;
  dueOffset: number; // Days from project start
  deliverables: string[]; // What student must submit
  points: number;
}

export interface LmsAssignment {
  title: string;
  description: string;
  type: 'assignment' | 'quiz' | 'project';
  weight: number;
  due_days_offset: number; // How many days after reading this guide is it due?
  rubric: RubricCriteria[];

  // NEW: Interactive Quiz Support
  quizQuestions?: QuizQuestion[]; // For type='quiz' - interactive multiple choice
  passingScore?: number; // Minimum score to pass (percentage)

  // NEW: Project Milestones Support
  projectMilestones?: ProjectMilestone[]; // For type='project' - tracking progress
  finalDeliverable?: string; // What's the final project output
}

export interface GuideData {
  topic: string;
  filenameSlug: string;
  title: string;
  description: string;
  keywords: string;
  readingTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  
  // LMS Course Context
  courseName: string; // e.g., "מבוא לפייתון ודאטה אנליסיס"
  courseCode: string; // e.g., "PY-PRO-2024"
  institution: string; // e.g., "האקדמיה לקוד"
  sessionNumber: number; // e.g., 2
  
  // Master Template Metadata
  category: 'AI & Automation' | 'Career' | 'Creative Studio' | 'Data & Business' | 'Digital Basics' | 'Technology';
  emoji: string;
  shortDescription: string; // Max 50 chars for the auto-detection block

  // Visuals
  headerImagePrompt: string; // English prompt for AI image generation
  diagramTheory: string; // Mermaid.js syntax for theory concept map
  diagramPractice: string; // Mermaid.js syntax for process flow
  
  introContent: string;
  part1Title: string;
  part1Content: string;
  codeExample: string;
  teaserIdea: string;
  part2Title: string;
  part2Content: string;
  part2Steps: string[];
  teaserWarning: string;
  advancedTitle: string;
  advancedPoint1Title: string;
  advancedPoint1List: string[];
  advancedPoint2Title: string;
  advancedPoint2List: string[];
  teaserSecret: string;
  summaryPoints: string[];
  nextSteps: string[];
  commonMistakes: string[];
  
  // LMS Style Assignments
  lmsAssignments: LmsAssignment[];
  
  teaserBonus: string;
  relatedGuides: { title: string; description: string; icon: string }[];
  faq: { question: string; answer: string }[];
}

export const initialGuideData: GuideData = {
  topic: '',
  filenameSlug: '',
  title: '',
  description: '',
  keywords: '',
  readingTime: 5,
  difficulty: 'Beginner',
  courseName: '',
  courseCode: '',
  institution: '',
  sessionNumber: 1,
  category: 'Technology',
  emoji: '🎓',
  shortDescription: '',
  headerImagePrompt: '',
  diagramTheory: '',
  diagramPractice: '',
  introContent: '',
  part1Title: '',
  part1Content: '',
  codeExample: '',
  teaserIdea: '',
  part2Title: '',
  part2Content: '',
  part2Steps: [],
  teaserWarning: '',
  advancedTitle: '',
  advancedPoint1Title: '',
  advancedPoint1List: [],
  advancedPoint2Title: '',
  advancedPoint2List: [],
  teaserSecret: '',
  summaryPoints: [],
  nextSteps: [],
  commonMistakes: [],
  lmsAssignments: [],
  teaserBonus: '',
  relatedGuides: [],
  faq: [],
};