import React, { useState } from 'react';
import { Play, Sparkles, Trophy, Flame, ShieldAlert, Zap, Filter, Star } from 'lucide-react';
import { DifficultyLevel, GradeNumber } from '../types';
import { soundManager } from '../utils/audio';

interface GameCenterProps {
  currentGrade: GradeNumber;
  onSelectGame: (gameId: string, difficulty?: DifficultyLevel) => void;
}

export interface GameMetadata {
  id: string;
  title: string;
  category: string;
  icon: string;
  tagline: string;
  description: string;
  color: string;
  isSpecial?: boolean;
}

export const GAMES_LIST: GameMetadata[] = [
  {
    id: 'number_blast',
    title: 'Number Blast',
    category: 'Counting & Numbers',
    icon: '💥',
    tagline: 'Which number is greater or smaller?',
    description: 'Compare high and low numbers, blast bubbles, and sharpen number sense.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'addition_attack',
    title: 'Addition Attack',
    category: 'Arithmetic',
    icon: '➕',
    tagline: 'Beat the timer with lightning addition!',
    description: 'Fast mathematical sums. Quick answers earn extra bonus XP points.',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'subtraction_shooter',
    title: 'Subtraction Shooter',
    category: 'Arithmetic',
    icon: '🎯',
    tagline: 'Shoot the target with the correct difference!',
    description: 'Take away numbers in fun floating meteors and targets with sound effects.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'multiplication_race',
    title: 'Multiplication Race',
    category: 'Multiplication',
    icon: '🏎️',
    tagline: 'Race your sports car using times tables!',
    description: 'Each correct answer accelerates your racing car ahead to victory.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'division_master',
    title: 'Division Master',
    category: 'Division',
    icon: '➗',
    tagline: 'Share items equally and master division facts!',
    description: 'Solve age-appropriate division problems with visual groups representation.',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 'fraction_match',
    title: 'Fraction Match',
    category: 'Fractions',
    icon: '🍕',
    tagline: 'Interactive pizzas, pies, and bar fractions!',
    description: 'Count shaded slices and match delicious visual fractions accurately.',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'shape_hunter',
    title: 'Shape Hunter',
    category: 'Geometry',
    icon: '📐',
    tagline: 'Identify shapes, sides, angles, and area!',
    description: 'Spot 2D/3D shapes, calculate perimeters, and hunt geometric figures.',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'math_memory',
    title: 'Math Memory',
    category: 'Logic & Memory',
    icon: '🃏',
    tagline: 'Flip cards and match equations with answers!',
    description: 'Classic memory matching: pair questions like 12 + 8 with their answer 20.',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'number_puzzle',
    title: 'Number Puzzle',
    category: 'Patterns',
    icon: '🧩',
    tagline: 'Crack the sequence and logical patterns!',
    description: 'Identify step rules (2, 4, 6, 8, ?) and solve engaging number riddles.',
    color: 'from-fuchsia-400 to-pink-600',
  },
  {
    id: 'money_master',
    title: 'Money Master',
    category: 'Pakistani Currency',
    icon: '💵',
    tagline: 'Realistic Pakistani Rupees (Rs.) shopping!',
    description: 'Practice with Rs. 10, 20, 50, 100, 500 notes and solve store change problems.',
    color: 'from-emerald-500 to-green-700',
  },
  {
    id: 'time_challenge',
    title: 'Time Challenge',
    category: 'Clocks & Time',
    icon: '⏰',
    tagline: 'Read real moving analog clock hands!',
    description: 'Master hours, half-hours, quarter-hours, and minutes on an analog clock face.',
    color: 'from-sky-400 to-blue-600',
  },
  {
    id: 'quiz_show',
    title: 'Math Quiz Show',
    category: 'Game Show',
    icon: '📺',
    tagline: 'TV game show style with spotlights and bonus!',
    description: 'Answer 4-option questions under the studio lights with streaks and cheers.',
    color: 'from-amber-500 to-red-500',
  },
  {
    id: 'boss_battle',
    title: 'Math Boss Battle',
    category: 'Special Boss Mode',
    icon: '👾',
    tagline: '10 intense timed questions against the Boss!',
    description: 'Defeat the Math Boss to earn 500 XP, the Boss Trophy, and legendary status!',
    color: 'from-purple-600 to-indigo-900',
    isSpecial: true,
  },
  {
    id: 'championship',
    title: 'Math Championship',
    category: 'Grand Final',
    icon: '👑',
    tagline: '25 comprehensive questions for the Certificate!',
    description: 'Grand test covering all syllabus categories with printable achievement certificate.',
    color: 'from-amber-500 to-yellow-600',
    isSpecial: true,
  },
];

export const GameCenter: React.FC<GameCenterProps> = ({
  currentGrade,
  onSelectGame,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredGames = GAMES_LIST.filter(game => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'special') return game.isSpecial;
    if (filterCategory === 'arithmetic') return ['addition_attack', 'subtraction_shooter', 'multiplication_race', 'division_master'].includes(game.id);
    if (filterCategory === 'practical') return ['money_master', 'time_challenge', 'shape_hunter', 'fraction_match'].includes(game.id);
    if (filterCategory === 'puzzles') return ['number_blast', 'math_memory', 'number_puzzle', 'quiz_show'].includes(game.id);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Game Center Header Banner (Immersive UI Hero) */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-xl border-b-8 border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-black text-white border border-white/20 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              12 Exciting Math Games + 2 Boss Modes
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight">
              MathQuest Game Center
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base font-bold leading-relaxed">
              Curriculum-aligned interactive mathematical adventures designed to make arithmetic, shapes, fractions, and logic thrilling!
            </p>
          </div>

          {/* Difficulty Switcher */}
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-[24px] border-2 border-white/30 self-start md:self-auto shadow-sm">
            <span className="block text-[11px] font-black uppercase tracking-wider text-yellow-200 mb-2 px-1">
              Select Difficulty:
            </span>
            <div className="flex items-center gap-1.5">
              {(['easy', 'medium', 'hard', 'expert'] as DifficultyLevel[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedDifficulty(diff);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-black capitalize rounded-xl transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600 shadow-sm scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative math symbol watermark */}
        <div className="absolute -right-6 -bottom-6 text-white/10 text-[180px] font-black select-none pointer-events-none leading-none">
          🎮
        </div>
      </div>

      {/* Filter Tabs (Immersive UI rounded-full tactile pills) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 text-xs font-black">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer shrink-0 ${
            filterCategory === 'all'
              ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
              : 'bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          All Games ({GAMES_LIST.length})
        </button>
        <button
          onClick={() => setFilterCategory('arithmetic')}
          className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer shrink-0 ${
            filterCategory === 'arithmetic'
              ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
              : 'bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          ➕ Arithmetic Speed
        </button>
        <button
          onClick={() => setFilterCategory('practical')}
          className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer shrink-0 ${
            filterCategory === 'practical'
              ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
              : 'bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          💵 Money, Clocks & Shapes
        </button>
        <button
          onClick={() => setFilterCategory('puzzles')}
          className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer shrink-0 ${
            filterCategory === 'puzzles'
              ? 'bg-blue-600 border-b-4 border-blue-800 text-white shadow-sm'
              : 'bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          🧩 Puzzles & Memory
        </button>
        <button
          onClick={() => setFilterCategory('special')}
          className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer shrink-0 ${
            filterCategory === 'special'
              ? 'bg-purple-600 border-b-4 border-purple-800 text-white shadow-sm'
              : 'bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          👾 Boss & Championship
        </button>
      </div>

      {/* Games Cards Grid (Immersive UI rounded-[32px] tactile cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className={`bg-white rounded-[32px] p-6 border-b-4 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md ${
              game.isSpecial
                ? 'border-purple-300 ring-2 ring-purple-100 hover:border-purple-500'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {game.category}
                  </span>
                  <span className="text-[10px] font-black capitalize text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {selectedDifficulty}
                  </span>
                </div>
              </div>

              <h3 className="font-heading text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                {game.title}
              </h3>
              <p className="text-xs font-bold text-indigo-600 mt-1">
                {game.tagline}
              </p>
              <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black text-slate-400">
                Grade {currentGrade} Ready
              </span>
              <button
                id={`play-game-${game.id}`}
                onClick={() => {
                  soundManager.playPop();
                  onSelectGame(game.id, selectedDifficulty);
                }}
                className={`px-5 py-2.5 font-black text-xs rounded-2xl border-b-4 transition-all flex items-center gap-2 cursor-pointer active:translate-y-0.5 ${
                  game.isSpecial
                    ? 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white shadow-sm'
                    : 'bg-yellow-400 hover:bg-yellow-300 border-yellow-600 text-yellow-900 shadow-sm'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                PLAY GAME
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
