import React, { useState } from 'react';
import { Trophy, Star, Flame, Zap, Award, CheckCircle, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { Badge, GameResult, Student } from '../types';
import { AVATARS, BADGES, LEVELS } from '../data/initialData';
import { getLevelInfo, getNextLevelInfo, getStoredGameResults, saveStoredStudents } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface StudentProfileProps {
  student: Student;
  allStudents: Student[];
  onSelectStudent: (id: string) => void;
  onUpdateStudent: (student: Student) => void;
  onOpenStudentLogin?: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  allStudents,
  onSelectStudent,
  onUpdateStudent,
  onOpenStudentLogin,
}) => {
  const [editingAvatar, setEditingAvatar] = useState(false);
  const avatar = AVATARS.find(a => a.id === student.avatarId) || AVATARS[0];
  const currentLevelInfo = getLevelInfo(student.level);
  const nextLevelInfo = getNextLevelInfo(student.level);

  const prevMin = currentLevelInfo.minXp;
  const nextMin = nextLevelInfo ? nextLevelInfo.minXp : prevMin + 1000;
  const xpInLevel = Math.max(0, student.xp - prevMin);
  const xpSpan = Math.max(1, nextMin - prevMin);
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpSpan) * 100));

  const allResults = getStoredGameResults().filter(r => r.studentId === student.id);

  const handlePickAvatar = (avatarId: string) => {
    soundManager.playPop();
    const updated = { ...student, avatarId };
    onUpdateStudent(updated);
    setEditingAvatar(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-6 border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={() => setEditingAvatar(e => !e)}>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-yellow-400 border-b-6 border-yellow-600 flex items-center justify-center text-6xl shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                {avatar.emoji}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-white shadow-xs">
                Change
              </span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 border border-yellow-200 px-3 py-0.5 rounded-full text-xs font-black">
                <span>Grade {student.grade}</span>
                <span>•</span>
                <span>{currentLevelInfo.title}</span>
              </div>
              <h1 className="font-heading text-3xl font-black text-slate-800">
                {student.name}
              </h1>
              <p className="text-xs text-slate-400 font-bold">
                Active student • MATH CHAMPIONS Learner
              </p>
            </div>
          </div>

          {/* Quick Switch Student Dropdown & Login Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="bg-blue-50/60 p-3 rounded-2xl border-2 border-blue-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-black text-blue-400 block">Switch Student:</span>
                <select
                  value={student.id}
                  onChange={e => onSelectStudent(e.target.value)}
                  className="text-xs font-black bg-transparent text-slate-800 cursor-pointer focus:outline-none"
                >
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Grade {s.grade})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {onOpenStudentLogin && (
              <button
                type="button"
                onClick={onOpenStudentLogin}
                className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl border-b-4 border-amber-600 text-xs font-black shadow-sm transition-all cursor-pointer active:translate-y-0.5 whitespace-nowrap flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Students Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Avatar Picker Drawer */}
        {editingAvatar && (
          <div className="mt-6 p-4 bg-yellow-50/70 border-2 border-yellow-200 rounded-[28px] animate-fadeIn">
            <span className="text-xs font-black text-yellow-950 block mb-3">
              Choose your favorite avatar:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {AVATARS.map(av => (
                <button
                  key={av.id}
                  onClick={() => handlePickAvatar(av.id)}
                  className={`p-3 rounded-2xl text-3xl transition-all cursor-pointer active:translate-y-0.5 flex flex-col items-center gap-1 ${
                    student.avatarId === av.id ? 'bg-yellow-400 border-b-4 border-yellow-600 shadow-sm' : 'bg-white hover:bg-yellow-100 border border-yellow-100'
                  }`}
                >
                  <span>{av.emoji}</span>
                  <span className="text-[10px] font-black text-slate-700">{av.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* XP Level Progress Bar */}
        <div className="mt-6 pt-6 border-t-2 border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-700">
              Level {student.level}: <strong className="text-blue-600">{currentLevelInfo.title}</strong>
            </span>
            <span className="text-slate-500 font-bold">
              {student.xp} XP {nextLevelInfo ? `(Next Level at ${nextLevelInfo.minXp} XP)` : '(Max Level Achieved!)'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border-2 border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-100 text-center">
            <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400 font-black uppercase">Total XP</div>
            <div className="text-lg font-black text-slate-800">{student.xp}</div>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-100 text-center">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400 font-black uppercase">Stars</div>
            <div className="text-lg font-black text-slate-800">{student.stars}</div>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-100 text-center">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400 font-black uppercase">Streak</div>
            <div className="text-lg font-black text-orange-600">{student.streak}</div>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-100 text-center">
            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400 font-black uppercase">Best Streak</div>
            <div className="text-lg font-black text-slate-800">{student.bestStreak}</div>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-100 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400 font-black uppercase">Accuracy</div>
            <div className="text-lg font-black text-emerald-600">{student.accuracy}%</div>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-100 text-center">
            <Award className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <div className="text-[10px] text-slate-400 font-black uppercase">Solved</div>
            <div className="text-lg font-black text-slate-800">{student.questionsSolved}</div>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-6 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-black text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements & Badges
            </h2>
            <p className="text-xs font-bold text-slate-400">
              Unlocked: {(student?.unlockedBadges || student?.badges || []).length} of {BADGES.length} Badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map(badge => {
            const isUnlocked = (student?.unlockedBadges || student?.badges || []).includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-yellow-50/60 border-b-4 border-yellow-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  isUnlocked ? 'bg-yellow-400 border-b-4 border-yellow-600 text-yellow-950 shadow-xs' : 'bg-slate-200 grayscale text-slate-400'
                }`}>
                  {isUnlocked ? badge.icon : '🔒'}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading text-sm font-black text-slate-800">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold leading-tight">
                    {badge.description}
                  </p>
                  <span className={`text-[10px] font-black block pt-1 uppercase tracking-wider ${isUnlocked ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isUnlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Game Results Table */}
      <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-6 border-slate-200 shadow-sm space-y-4">
        <h2 className="font-heading text-xl font-black text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" />
          Recent Game Activities
        </h2>

        {allResults.length === 0 ? (
          <p className="text-xs font-bold text-slate-400 py-4 text-center">No games played yet. Go to Game Center to start!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/60 text-blue-900 uppercase font-black text-[10px] border-b-2 border-blue-100">
                <tr>
                  <th className="py-3 px-3">Game Title</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Stars</th>
                  <th className="py-3 px-3">XP</th>
                  <th className="py-3 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                {allResults.slice(0, 8).map(res => (
                  <tr key={res.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-black text-slate-800">{res.gameTitle}</td>
                    <td className="py-3 px-3">{res.score} pts</td>
                    <td className="py-3 px-3 text-emerald-600 font-black">{res.accuracy}%</td>
                    <td className="py-3 px-3 text-yellow-500">{'⭐'.repeat(res.starsEarned)}</td>
                    <td className="py-3 px-3 text-blue-600 font-black">+{res.xpEarned}</td>
                    <td className="py-3 px-3 text-slate-400">{res.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
