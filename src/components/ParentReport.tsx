import React from 'react';
import { GraduationCap, Heart, Award, CheckCircle, Clock, Star, Flame, Sparkles, BookOpen, Printer } from 'lucide-react';
import { GradeNumber, Student } from '../types';
import { AVATARS } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface ParentReportProps {
  student: Student;
  onOpenCertificate: (studentName: string, grade: GradeNumber) => void;
}

export const ParentReport: React.FC<ParentReportProps> = ({
  student,
  onOpenCertificate,
}) => {
  const avatar = AVATARS.find(a => a.id === student.avatarId) || AVATARS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Parent Header Card */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-xl border-b-8 border-teal-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-black text-white">
              <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
              Parent & Guardian Progress Digest
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight">
              {student.name}'s Math Journey
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm max-w-md font-bold leading-relaxed">
              Grade {student.grade} Primary School • Clear, positive insights into your child's mathematics learning and confidence.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-[28px] border-2 border-white/30 text-center shadow-sm">
            <span className="text-6xl">{avatar.emoji}</span>
            <span className="text-xs font-black mt-1 text-white">{student.name}</span>
            <span className="text-[10px] text-teal-100 font-black">Level {student.level}</span>
          </div>
        </div>
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Games Completed</span>
          <div className="text-3xl font-heading font-black text-slate-800">{student.gamesPlayed}</div>
          <span className="text-[11px] font-black text-emerald-600">Great consistency!</span>
        </div>

        <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Questions Solved</span>
          <div className="text-3xl font-heading font-black text-blue-600">{student.questionsSolved}</div>
          <span className="text-[11px] font-bold text-slate-500">{student.correctAnswers} Correct</span>
        </div>

        <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Overall Accuracy</span>
          <div className="text-3xl font-heading font-black text-emerald-600">{student.accuracy}%</div>
          <span className="text-[11px] font-black text-emerald-700">Above benchmark</span>
        </div>

        <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stars Earned</span>
          <div className="text-3xl font-heading font-black text-yellow-500 flex items-center justify-center gap-1">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span>{student.stars}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500">Reward points</span>
        </div>
      </div>

      {/* Strengths & Practice Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-3">
          <h3 className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Strong Areas
          </h3>
          <p className="text-xs font-bold text-slate-500">
            {student.name} shows high confidence and quick mental calculations here:
          </p>
          <ul className="space-y-2 pt-1 text-xs font-bold text-slate-700">
            <li className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-center gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Addition & Subtraction Fluency (90%+ accuracy)</span>
            </li>
            <li className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-center gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>Pakistani Currency (Rs.) money counting and real-life shopping</span>
            </li>
            <li className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-center gap-2">
              <span className="text-emerald-600 font-black">✓</span>
              <span>2D Shape identification (Triangles, Rectangles, Circles)</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-3">
          <h3 className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            Recommended Practice
          </h3>
          <p className="text-xs font-bold text-slate-500">
            Gentle exercises to build deeper conceptual understanding:
          </p>
          <ul className="space-y-2 pt-1 text-xs font-bold text-slate-700">
            <li className="p-3 bg-yellow-50 rounded-2xl border-2 border-yellow-100 flex items-center gap-2">
              <span className="text-yellow-600 font-black">→</span>
              <span>Fractions: Dividing real-life items (like pizza or rotis) into equal halves and quarters.</span>
            </li>
            <li className="p-3 bg-yellow-50 rounded-2xl border-2 border-yellow-100 flex items-center gap-2">
              <span className="text-yellow-600 font-black">→</span>
              <span>Analog Clocks: Practicing reading the hour and minute hand before bedtime.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Encouraging Home Tips for Parents */}
      <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-3">
        <h3 className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Tips for Supporting Your Child at Home
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-100 space-y-1">
            <span className="font-black text-slate-800 block">Praise the Effort</span>
            <p className="text-slate-600 font-bold leading-relaxed">
              Celebrate hard work and perseverance instead of just speed. Mistakes are stepping stones to deep understanding.
            </p>
          </div>
          <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-100 space-y-1">
            <span className="font-black text-slate-800 block">Everyday Shopping</span>
            <p className="text-slate-600 font-bold leading-relaxed">
              Ask {student.name} to count Rs. 50 or Rs. 100 notes when buying fruit or groceries together at the market.
            </p>
          </div>
          <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-100 space-y-1">
            <span className="font-black text-slate-800 block">10 Minutes Daily</span>
            <p className="text-slate-600 font-bold leading-relaxed">
              Short, daily playful sessions are far more effective than long drills. Keep it fun and enjoyable!
            </p>
          </div>
        </div>
      </div>

      {/* Printable Certificate CTA */}
      <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-[36px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border-b-8 border-yellow-600">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading text-xl sm:text-2xl font-black text-yellow-950">
            Official MathQuest Achievement Certificate
          </h3>
          <p className="text-xs sm:text-sm text-yellow-900 font-bold">
            Celebrate {student.name}'s mathematics dedication with a printable personalized certificate!
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            onOpenCertificate(student.name, student.grade);
          }}
          className="px-7 py-3 bg-white hover:bg-yellow-50 text-yellow-950 font-black text-xs rounded-2xl border-b-4 border-yellow-300 shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer active:translate-y-0.5"
        >
          <Award className="w-4 h-4 text-yellow-600" />
          <span>View & Print Certificate</span>
        </button>
      </div>
    </div>
  );
};
