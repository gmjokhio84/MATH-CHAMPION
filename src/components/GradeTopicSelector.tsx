import React from 'react';
import { BookOpen, CheckCircle, Play, ArrowRight } from 'lucide-react';
import { GradeNumber } from '../types';
import { TOPICS_DATA } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface GradeTopicSelectorProps {
  currentGrade: GradeNumber;
  onSelectGrade: (grade: GradeNumber) => void;
  onSelectTopic: (topicId: string) => void;
}

export const GradeTopicSelector: React.FC<GradeTopicSelectorProps> = ({
  currentGrade,
  onSelectGrade,
  onSelectTopic,
}) => {
  const gradeTopics = TOPICS_DATA.filter(t => t.grades.includes(currentGrade));

  const GRADE_DESCRIPTIONS: Record<GradeNumber, string> = {
    1: 'Fundamentals: Numbers 1-100, basic addition & subtraction, 2D shapes, analog clocks, and coins.',
    2: 'Building blocks: Numbers up to 1000, carry/borrow arithmetic, times tables intro, and measurement.',
    3: 'Core fluency: 3-digit operations, multiplication & division facts, fractions intro, and Pakistani word problems.',
    4: 'Advanced operations: Large numbers, fractions, decimals, factors, perimeter & area of shapes.',
    5: 'Mastery: Percentages, volume, LCM/HCF, data handling, and multi-step logical reasoning.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Header & Grade Switcher (Immersive UI Hero Card) */}
      <div className="bg-white rounded-[36px] p-6 sm:p-8 border-b-6 border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-black uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Primary Mathematics Syllabus
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Choose Your Class & Topic
            </h1>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              {GRADE_DESCRIPTIONS[currentGrade]}
            </p>
          </div>

          {/* Large Tactile Grade Buttons */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {([1, 2, 3, 4, 5] as GradeNumber[]).map(g => (
              <button
                key={g}
                onClick={() => {
                  soundManager.playPop();
                  onSelectGrade(g);
                }}
                className={`px-4 py-3 rounded-2xl font-black text-sm transition-all flex flex-col items-center min-w-[76px] cursor-pointer active:translate-y-0.5 ${
                  currentGrade === g
                    ? 'bg-yellow-400 text-yellow-950 border-b-4 border-yellow-600 shadow-sm scale-105'
                    : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-[10px] uppercase font-black opacity-80">Class</span>
                <span className="text-xl leading-tight font-black">{g}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-heading text-2xl font-black text-slate-800">
            Class {currentGrade} Subject Categories ({gradeTopics.length} Topics)
          </h2>
          <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Tap any topic to practice</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeTopics.map(topic => (
            <div
              key={topic.id}
              onClick={() => {
                soundManager.playPop();
                onSelectTopic(topic.id);
              }}
              className="cursor-pointer bg-white rounded-[32px] p-6 border-b-4 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between active:translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${topic.color} text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                  {topic.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-heading text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-slate-100 flex items-center justify-between text-xs font-black text-blue-600">
                <span className="flex items-center gap-1.5 font-black">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Practice Topic
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
