export type GradeNumber = 1 | 2 | 3 | 4 | 5;

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type QuestionType =
  | 'multiple_choice'
  | 'visual_fraction'
  | 'analog_clock'
  | 'money_calc'
  | 'shape_detect'
  | 'pattern_puzzle'
  | 'drag_order'
  | 'true_false'
  | 'word_problem';

export interface Question {
  id: string;
  grade: GradeNumber;
  topicId: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  prompt: string;
  question?: string; // alias for prompt
  subPrompt?: string;
  context?: string; // alias for subPrompt
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  visualData?: {
    type?: string;
    shape?: 'circle' | 'square' | 'rectangle' | 'triangle' | 'pentagon' | 'hexagon' | 'octagon' | 'cylinder' | 'cube';
    fractionTotal?: number;
    fractionShaded?: number;
    total?: number;
    shaded?: number;
    clockHours?: number;
    clockMinutes?: number;
    hours?: number;
    minutes?: number;
    rupeeNotes?: number[];
    itemPrice?: number;
    paidAmount?: number;
    numbersList?: number[];
    unit?: string;
  };
}

export type MathQuestion = Question;

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
}

export interface Student {
  id: string;
  name: string;
  grade: GradeNumber;
  avatarId: string;
  xp: number;
  level: number;
  stars: number;
  streak: number;
  bestStreak: number;
  questionsSolved: number;
  correctAnswers: number;
  accuracy: number;
  gamesPlayed: number;
  unlockedBadges: string[];
  badges?: string[];
  lastActive: string;
  classId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  gradesTaught: GradeNumber[];
  schoolName: string;
  avatarId: string;
}

export interface Classroom {
  id: string;
  name: string;
  grade: GradeNumber;
  teacherId: string;
  studentIds: string[];
  academicYear: string;
}

export interface Assignment {
  id: string;
  title: string;
  classId?: string;
  classroomId?: string;
  grade: GradeNumber;
  topicId: string;
  questionCount?: number;
  targetQuestions?: number;
  difficulty?: DifficultyLevel;
  targetAccuracy?: number;
  timeLimitMinutes?: number;
  dueDate: string;
  completedStudentIds: string[];
}

export interface GameResult {
  id: string;
  studentId: string;
  gameId: string;
  gameTitle: string;
  topicId: string;
  grade: GradeNumber;
  difficulty: DifficultyLevel;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  timeTakenSeconds: number;
  xpEarned: number;
  starsEarned: number;
  bestStreak: number;
  timestamp: string;
  mistakes?: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'subject' | 'special';
  requiredXp?: number;
  requiredStreak?: number;
  requiredQuestions?: number;
  requiredGameId?: string;
}

export interface TopicCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  grades: GradeNumber[];
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  language: 'en' | 'ur' | 'sd';
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard';
}

export interface DailyChallengeStatus {
  dateString?: string;
  date?: string;
  completed: boolean;
  score: number;
  total?: number;
  totalQuestions?: number;
  timeTakenSeconds?: number;
  stars?: number;
  starsEarned?: number;
}
