import { AppSettings, Assignment, Badge, Classroom, DailyChallengeStatus, GameResult, GradeNumber, Student, Teacher } from '../types';
import { BADGES, INITIAL_ASSIGNMENTS, INITIAL_CLASSROOMS, INITIAL_GAME_RESULTS, INITIAL_STUDENTS, INITIAL_TEACHERS, LEVELS } from '../data/initialData';
import { soundManager } from './audio';

const STORAGE_KEYS = {
  STUDENTS: 'mqk_students_v1',
  ACTIVE_STUDENT_ID: 'mqk_active_student_id_v1',
  TEACHERS: 'mqk_teachers_v1',
  ACTIVE_TEACHER_ID: 'mqk_active_teacher_id_v1',
  ACTIVE_ROLE: 'mqk_active_role_v1', // 'student' | 'teacher' | 'admin'
  CLASSROOMS: 'mqk_classrooms_v1',
  ASSIGNMENTS: 'mqk_assignments_v1',
  GAME_RESULTS: 'mqk_game_results_v1',
  SETTINGS: 'mqk_settings_v1',
  DAILY_CHALLENGE: 'mqk_daily_challenge_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  musicEnabled: false,
  language: 'en',
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  difficultyPreference: 'adaptive',
};

export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!item) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(item) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setMusicEnabled(settings.musicEnabled);
  } catch {}
}

export function getStoredStudents(): Student[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const parsed: Student[] = item ? JSON.parse(item) : INITIAL_STUDENTS;
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_STUDENTS;
    return parsed.map(s => ({
      ...s,
      unlockedBadges: Array.isArray(s.unlockedBadges)
        ? s.unlockedBadges
        : Array.isArray(s.badges)
        ? s.badges
        : ['first_game'],
      badges: Array.isArray(s.badges) ? s.badges : (Array.isArray(s.unlockedBadges) ? s.unlockedBadges : ['first_game']),
    }));
  } catch {
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch {}
}

export function getActiveStudentId(): string {
  if (typeof window === 'undefined') return INITIAL_STUDENTS[0].id;
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || INITIAL_STUDENTS[0].id;
  } catch {
    return INITIAL_STUDENTS[0].id;
  }
}

export function setActiveStudentId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
  } catch {}
}

export function getActiveRole(): 'student' | 'teacher' | 'admin' {
  if (typeof window === 'undefined') return 'student';
  try {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as any) || 'student';
  } catch {
    return 'student';
  }
}

export function setActiveRole(role: 'student' | 'teacher' | 'admin') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  } catch {}
}

export function getStoredTeachers(): Teacher[] {
  if (typeof window === 'undefined') return INITIAL_TEACHERS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return item ? JSON.parse(item) : INITIAL_TEACHERS;
  } catch {
    return INITIAL_TEACHERS;
  }
}

export function getStoredClassrooms(): Classroom[] {
  if (typeof window === 'undefined') return INITIAL_CLASSROOMS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
    return item ? JSON.parse(item) : INITIAL_CLASSROOMS;
  } catch {
    return INITIAL_CLASSROOMS;
  }
}

export function saveStoredClassrooms(classes: Classroom[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classes));
  } catch {}
}

export function getStoredAssignments(): Assignment[] {
  if (typeof window === 'undefined') return INITIAL_ASSIGNMENTS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return item ? JSON.parse(item) : INITIAL_ASSIGNMENTS;
  } catch {
    return INITIAL_ASSIGNMENTS;
  }
}

export function saveStoredAssignments(asg: Assignment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(asg));
  } catch {}
}

export function getStoredGameResults(): GameResult[] {
  if (typeof window === 'undefined') return INITIAL_GAME_RESULTS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
    return item ? JSON.parse(item) : INITIAL_GAME_RESULTS;
  } catch {
    return INITIAL_GAME_RESULTS;
  }
}

export function saveStoredGameResults(results: GameResult[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(results));
  } catch {}
}

export function calculateLevel(xp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

export function getLevelInfo(level: number) {
  return LEVELS.find(l => l.level === level) || LEVELS[0];
}

export function getNextLevelInfo(level: number) {
  const next = LEVELS.find(l => l.level === level + 1);
  return next || null;
}

// Record a game result and automatically update student XP, Level, Badges, Stars, Streak
export function recordGameResult(result: GameResult): {
  updatedStudent: Student;
  newBadges: Badge[];
  leveledUp: boolean;
} {
  const students = getStoredStudents();
  let studentIndex = students.findIndex(s => s.id === result.studentId);
  if (studentIndex === -1) {
    studentIndex = 0;
  }
  const student = { ...students[studentIndex] };

  const oldLevel = student.level;
  student.xp += result.xpEarned;
  student.level = calculateLevel(student.xp);
  student.stars += result.starsEarned;
  student.gamesPlayed += 1;
  student.questionsSolved += result.totalQuestions;
  student.correctAnswers += result.correctAnswers;
  student.accuracy = Math.round((student.correctAnswers / Math.max(1, student.questionsSolved)) * 100);
  student.lastActive = 'Just now';

  if (result.bestStreak > student.bestStreak) {
    student.bestStreak = result.bestStreak;
  }
  student.streak = result.bestStreak;

  // Check for newly unlocked badges
  const newBadges: Badge[] = [];
  BADGES.forEach(badge => {
    if (!student.unlockedBadges.includes(badge.id)) {
      let unlock = false;
      if (badge.id === 'first_game' && student.gamesPlayed >= 1) unlock = true;
      if (badge.id === 'ten_correct' && student.correctAnswers >= 10) unlock = true;
      if (badge.id === 'ten_streak' && student.bestStreak >= 10) unlock = true;
      if (badge.id === 'hundred_xp' && student.xp >= 100) unlock = true;
      if (badge.id === 'addition_master' && result.topicId === 'addition' && result.accuracy >= 85) unlock = true;
      if (badge.id === 'division_master' && result.topicId === 'division' && result.accuracy >= 85) unlock = true;
      if (badge.id === 'fraction_explorer' && result.topicId === 'fractions' && result.accuracy >= 80) unlock = true;
      if (badge.id === 'geometry_hero' && result.topicId === 'geometry' && result.accuracy >= 80) unlock = true;
      if (badge.id === 'speed_champion' && result.timeTakenSeconds < 45 && result.accuracy >= 80) unlock = true;
      if (badge.id === 'problem_solver' && (result.topicId === 'money' || result.topicId === 'word_problems') && result.accuracy >= 80) unlock = true;
      if (badge.id === 'boss_defeated' && result.gameId === 'boss_battle') unlock = true;
      if (badge.id === 'math_champion' && (student.level >= 10 || result.gameId === 'championship')) unlock = true;

      if (unlock) {
        student.unlockedBadges.push(badge.id);
        newBadges.push(badge);
      }
    }
  });

  students[studentIndex] = student;
  saveStoredStudents(students);

  // Save game result
  const allResults = getStoredGameResults();
  allResults.unshift(result);
  saveStoredGameResults(allResults);

  const leveledUp = student.level > oldLevel;
  if (leveledUp) {
    soundManager.playFanfare();
  } else if (newBadges.length > 0) {
    soundManager.playAchievement();
  }

  return { updatedStudent: student, newBadges, leveledUp };
}

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDailyChallengeStatus(studentId: string): DailyChallengeStatus | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${STORAGE_KEYS.DAILY_CHALLENGE}_${studentId}_${getTodayDateString()}`;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function saveDailyChallengeStatus(studentId: string, status: DailyChallengeStatus) {
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_KEYS.DAILY_CHALLENGE}_${studentId}_${getTodayDateString()}`;
    localStorage.setItem(key, JSON.stringify(status));
  } catch {}
}

export function resetAllData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
  localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
  localStorage.removeItem(STORAGE_KEYS.CLASSROOMS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
