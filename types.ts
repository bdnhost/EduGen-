export interface RubricCriteria {
  title: string;
  description: string;
  max_points: number;
}

export interface LmsAssignment {
  title: string;
  description: string;
  type: 'assignment' | 'quiz' | 'project';
  weight: number;
  due_days_offset: number; // How many days after reading this guide is it due?
  rubric: RubricCriteria[];
}

// קטגוריות תואמות למערכת matireal
export type GuideCategory =
  | 'AI & Automation'
  | 'Career'
  | 'Creative Studio'
  | 'Data & Business'
  | 'Digital Basics'
  | 'Technology';

// טיזרים פדגוגיים מורחבים
export interface GuideTeasers {
  idea: string;      // 💡 חומר למחשבה
  warning: string;   // ⚠️ רגע, עצור!
  secret: string;    // 🤫 סוד קטן
  bonus: string;     // 😎 בונוס
  tip?: string;      // 💎 טיפ מקצועי
  challenge?: string; // 🎯 אתגר
}

// משימות מדורגות מפורטות
export interface GuideAssignments {
  basic: Array<{
    title: string;
    description: string;
    estimatedTime?: string;
    difficulty?: 'קל' | 'בינוני' | 'קשה';
  }>;
  advanced: Array<{
    title: string;
    description: string;
    estimatedTime?: string;
    difficulty?: 'קל' | 'בינוני' | 'קשה';
    prerequisites?: string[];
  }>;
}

// מטא-דאטה לזיהוי אוטומטי
export interface GuideMetadata {
  name: string;           // שם המדריך לקטלוג
  icon: string;           // emoji מייצג
  category: GuideCategory; // קטגוריה מתוך 6
  description: string;    // תיאור קצר עד 50 תווים
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
  category: GuideCategory;
  emoji: string;
  shortDescription: string; // Max 50 chars for the auto-detection block

  // מטא-דאטה לסיכרון עם matireal
  metadata: GuideMetadata;

  // Visuals
  headerImagePrompt: string; // English prompt for AI image generation
  diagramTheory: string; // Mermaid.js syntax for theory concept map
  diagramPractice: string; // Mermaid.js syntax for process flow

  introContent: string;
  part1Title: string;
  part1Content: string;
  codeExample: string;
  part2Title: string;
  part2Content: string;
  part2Steps: string[];
  advancedTitle: string;
  advancedPoint1Title: string;
  advancedPoint1List: string[];
  advancedPoint2Title: string;
  advancedPoint2List: string[];
  summaryPoints: string[];
  nextSteps: string[];
  commonMistakes: string[];

  // טיזרים פדגוגיים (חדש)
  teasers: GuideTeasers;

  // משימות מדורגות (חדש)
  assignments: GuideAssignments;

  // LMS Style Assignments
  lmsAssignments: LmsAssignment[];

  relatedGuides: { title: string; description: string; icon: string }[];
  faq: { question: string; answer: string }[];

  // Legacy fields (נשמרים לתאימות)
  teaserIdea: string;
  teaserWarning: string;
  teaserSecret: string;
  teaserBonus: string;
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
  metadata: {
    name: '',
    icon: '🎓',
    category: 'Technology',
    description: ''
  },
  headerImagePrompt: '',
  diagramTheory: '',
  diagramPractice: '',
  introContent: '',
  part1Title: '',
  part1Content: '',
  codeExample: '',
  part2Title: '',
  part2Content: '',
  part2Steps: [],
  advancedTitle: '',
  advancedPoint1Title: '',
  advancedPoint1List: [],
  advancedPoint2Title: '',
  advancedPoint2List: [],
  summaryPoints: [],
  nextSteps: [],
  commonMistakes: [],
  teasers: {
    idea: '',
    warning: '',
    secret: '',
    bonus: ''
  },
  assignments: {
    basic: [],
    advanced: []
  },
  lmsAssignments: [],
  relatedGuides: [],
  faq: [],
  // Legacy fields
  teaserIdea: '',
  teaserWarning: '',
  teaserSecret: '',
  teaserBonus: ''
};