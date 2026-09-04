import React, { useState } from 'react';
import { Trophy, Medal, Star, Flame, Sparkles, Zap, Award } from 'lucide-react';
import { Student } from '../types';
import { AVATARS } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface LeaderboardProps {
  students: Student[];
  activeStudentId: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ students, activeStudentId }) => {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'daily'>('weekly');

  // Sort students by XP descending
  const sortedStudents = [...students].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-xl border-b-8 border-orange-600 text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl mx-auto shadow-sm border border-white/30">
          🏆
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight">
          Classroom Math Champions
        </h1>
        <p className="text-yellow-100 text-sm max-w-md mx-auto font-bold">
          Celebrating curiosity, effort, and mathematical problem-solving skills!
        </p>

        {/* Filter Pills */}
        <div className="inline-flex items-center gap-1.5 bg-black/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 pt-1 mt-2">
          {(['daily', 'weekly', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                soundManager.playPop();
                setFilter(f);
              }}
              className={`px-4 py-1.5 text-xs font-black rounded-xl capitalize transition-all cursor-pointer ${
                filter === f ? 'bg-yellow-400 text-yellow-950 border-b-4 border-yellow-600 shadow-sm scale-105' : 'text-white hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All-Time' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end pt-4 pb-2">
        {/* Rank 2 */}
        {sortedStudents[1] && (
          <div className="bg-white rounded-[32px] p-4 sm:p-5 border-b-6 border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2 h-56 justify-between">
            <div className="text-2xl">🥈</div>
            <span className="text-4xl sm:text-5xl">{AVATARS.find(a => a.id === sortedStudents[1].avatarId)?.emoji || '🦁'}</span>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-800 line-clamp-1">{sortedStudents[1].name}</h3>
              <p className="text-[10px] font-bold text-slate-400">Grade {sortedStudents[1].grade}</p>
            </div>
            <div className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {sortedStudents[1].xp} XP
            </div>
          </div>
        )}

        {/* Rank 1 - Champion */}
        {sortedStudents[0] && (
          <div className="bg-gradient-to-b from-yellow-50 to-white rounded-[36px] p-5 sm:p-6 border-2 border-b-8 border-yellow-500 shadow-lg flex flex-col items-center text-center space-y-2 h-64 justify-between relative transform -translate-y-2">
            <div className="text-3xl">👑 🥇</div>
            <span className="text-5xl sm:text-6xl">{AVATARS.find(a => a.id === sortedStudents[0].avatarId)?.emoji || '🦊'}</span>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-slate-800 line-clamp-1">{sortedStudents[0].name}</h3>
              <span className="text-[10px] font-black text-yellow-950 bg-yellow-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Grand Champion
              </span>
            </div>
            <div className="text-sm font-black text-yellow-950 bg-yellow-400 border-b-4 border-yellow-600 px-4 py-1.5 rounded-2xl shadow-sm">
              {sortedStudents[0].xp} XP
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {sortedStudents[2] && (
          <div className="bg-white rounded-[32px] p-4 sm:p-5 border-b-6 border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2 h-52 justify-between">
            <div className="text-2xl">🥉</div>
            <span className="text-4xl sm:text-5xl">{AVATARS.find(a => a.id === sortedStudents[2].avatarId)?.emoji || '🐼'}</span>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-800 line-clamp-1">{sortedStudents[2].name}</h3>
              <p className="text-[10px] font-bold text-slate-400">Grade {sortedStudents[2].grade}</p>
            </div>
            <div className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              {sortedStudents[2].xp} XP
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-[36px] p-5 sm:p-8 border-b-6 border-slate-200 shadow-sm space-y-4">
        <h2 className="font-heading text-xl font-black text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Full Class Rankings
        </h2>

        <div className="space-y-2">
          {sortedStudents.map((s, index) => {
            const isMe = s.id === activeStudentId;
            const av = AVATARS.find(a => a.id === s.avatarId) || AVATARS[0];

            return (
              <div
                key={s.id}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                  isMe ? 'bg-yellow-50/80 border-2 border-b-4 border-yellow-400' : 'bg-slate-50/60 hover:bg-blue-50/40 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center font-heading font-black text-sm text-slate-400">
                    #{index + 1}
                  </span>
                  <span className="text-3xl">{av.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm sm:text-base text-slate-800">
                        {s.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-black bg-yellow-300 text-yellow-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      Grade {s.grade} • Level {s.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-black">
                  <div className="hidden sm:flex items-center gap-1 text-slate-500">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{s.stars}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-orange-600">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span>{s.streak}</span>
                  </div>
                  <div className="text-blue-600 font-heading text-base sm:text-lg font-black">
                    {s.xp} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
