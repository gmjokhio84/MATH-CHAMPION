import React from 'react';
import { Sparkles, Trophy, Flame, Volume2, VolumeX, User, BookOpen, GraduationCap, Home, Award, Settings as SettingsIcon, Bot, Smartphone } from 'lucide-react';
import { GradeNumber, Student } from '../types';
import { AVATARS, LEVELS } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  activeStudent: Student;
  activeRole: 'student' | 'teacher' | 'admin';
  onChangeRole: (role: 'student' | 'teacher' | 'admin') => void;
  currentView: string;
  onNavigate: (view: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAiTutor: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenStudentLogin: () => void;
  onOpenApkModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentGrade,
  onSelectGrade,
  activeStudent,
  activeRole,
  onChangeRole,
  currentView,
  onNavigate,
  soundEnabled,
  onToggleSound,
  onOpenAiTutor,
  onOpenSettings,
  onOpenAbout,
  onOpenStudentLogin,
  onOpenApkModal,
}) => {
  const avatar = AVATARS.find(a => a.id === activeStudent.avatarId) || AVATARS[0];
  const currentLevelInfo = LEVELS.find(l => l.level === activeStudent.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === activeStudent.level + 1);

  const prevMin = currentLevelInfo.minXp;
  const nextMin = nextLevelInfo ? nextLevelInfo.minXp : prevMin + 1000;
  const xpInLevel = Math.max(0, activeStudent.xp - prevMin);
  const xpSpan = Math.max(1, nextMin - prevMin);
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpSpan) * 100));

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-blue-100 shadow-sm">
      {/* Top Banner / Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center border-b-4 border-yellow-600 shadow-sm text-2xl font-black text-yellow-950 transform hover:scale-105 active:translate-y-0.5 transition-all">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-blue-600">
                MATH <span className="text-amber-500">CHAMPIONS</span>
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              By G. MUSTAFA JOKHIO &amp; TEAM J.E.F.M.S UMERKOT
            </span>
          </div>
        </div>

        {/* Grade Selection Chips */}
        <div className="flex items-center gap-1.5 bg-blue-50/70 p-1.5 rounded-full border-2 border-blue-100">
          <span className="text-xs font-black text-blue-900 px-2.5 hidden md:inline-block">Class:</span>
          {([1, 2, 3, 4, 5] as GradeNumber[]).map(g => (
            <button
              key={g}
              id={`grade-tab-${g}`}
              onClick={() => {
                soundManager.playPop();
                onSelectGrade(g);
              }}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-black rounded-full transition-all cursor-pointer ${
                currentGrade === g
                  ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm scale-105'
                  : 'bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Grade {g}
            </button>
          ))}
        </div>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Students Login Button */}
          <button
            id="students-login-btn"
            onClick={onOpenStudentLogin}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl border-b-4 border-amber-600 text-xs font-black shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
            title="Open Students Login / Switch Champion Profile"
          >
            <User className="w-4 h-4 text-amber-900" />
            <span className="whitespace-nowrap">Students Login</span>
          </button>

          {/* Streak pill */}
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border-2 border-orange-200 shadow-xs">
            <span className="text-base">🔥</span>
            <span className="font-black text-orange-600 text-xs sm:text-sm">
              {activeStudent.streak}
            </span>
          </div>

          {/* XP pill */}
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border-2 border-blue-200 shadow-xs">
            <span className="text-base">💎</span>
            <span className="font-black text-blue-600 text-xs sm:text-sm">
              {activeStudent.xp.toLocaleString()} XP
            </span>
          </div>

          {/* AI Tutor Assistant Button */}
          <button
            id="ai-tutor-btn"
            onClick={onOpenAiTutor}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl border-b-4 border-violet-800 text-xs font-black shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
            title="Ask Questie AI Math Buddy"
          >
            <Bot className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="hidden lg:inline">AI Tutor</span>
          </button>

          {/* Android APK & Mobile App Button */}
          <button
            id="apk-download-nav-btn"
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl border-b-4 border-emerald-800 text-xs font-black shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
            title="Install Android App / Download .APK Package"
          >
            <Smartphone className="w-4 h-4 text-emerald-200" />
            <span className="whitespace-nowrap">APK / App</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className="p-2 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 text-slate-600 transition-all active:translate-y-0.5 cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Role Switcher */}
          <div className="relative hidden xl:block">
            <select
              value={activeRole}
              onChange={e => onChangeRole(e.target.value as any)}
              className="text-xs font-black py-1.5 px-3 bg-white border-2 border-slate-200 border-b-4 rounded-2xl text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="student">Student Mode</option>
              <option value="teacher">Teacher Dashboard</option>
              <option value="admin">Admin Panel</option>
            </select>
          </div>

          {/* Student Profile Pill with Click to Switch / Login */}
          <div
            onClick={onOpenStudentLogin}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l-2 border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to Switch Student or Login"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-black text-slate-800 truncate max-w-[90px]">{activeStudent.name}</div>
              <div className="text-[9px] font-black text-emerald-600 uppercase tracking-tight">Grade {activeStudent.grade}</div>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full border-2 border-purple-400 overflow-hidden flex items-center justify-center text-lg shadow-xs hover:scale-105 transition-transform">
              {avatar.emoji}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="border-t-2 border-blue-50 bg-white/90 px-4 sm:px-8 py-2 flex items-center justify-between overflow-x-auto text-xs font-black text-slate-600">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'home'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => onNavigate('games')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'games'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Game Center</span>
          </button>
          <button
            onClick={() => onNavigate('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'daily'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Daily Challenge</span>
          </button>
          <button
            onClick={() => onNavigate('topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'topics'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Syllabus Topics</span>
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'leaderboard'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'profile'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <Award className="w-4 h-4 text-purple-500" />
            <span>My Badges</span>
          </button>
          <button
            onClick={() => onNavigate('parent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all cursor-pointer ${
              currentView === 'parent'
                ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Parent & Teacher</span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-2 shrink-0">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-600 font-black transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={onOpenAbout}
            className="text-xs font-black text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            About
          </button>
        </div>
      </nav>
    </header>
  );

};
