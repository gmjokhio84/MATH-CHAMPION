import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Clock, Zap, RotateCcw, Home, Play, ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';
import { Badge, GameResult } from '../types';
import { soundManager } from '../utils/audio';

interface GameResultModalProps {
  result: GameResult;
  newBadges: Badge[];
  leveledUp: boolean;
  newLevel?: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onNextGame: () => void;
  onViewProgress: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  result,
  newBadges,
  leveledUp,
  newLevel,
  onPlayAgain,
  onGoHome,
  onNextGame,
  onViewProgress,
}) => {
  useEffect(() => {
    // Launch celebratory confetti if completed well
    if (result.accuracy >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6'],
        });
      } catch {}
    }
  }, [result.accuracy]);

  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;
  const timeFormatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-[36px] max-w-lg w-full p-6 sm:p-8 border-b-8 border-yellow-500 shadow-2xl relative my-8 text-center">
        {/* Header Icon & Title */}
        <div className="w-16 h-16 rounded-2xl bg-yellow-400 border-b-4 border-yellow-600 text-yellow-950 flex items-center justify-center text-3xl shadow-sm mx-auto mb-3">
          🎉
        </div>
        <h2 className="font-heading text-3xl font-black text-slate-800">
          GREAT JOB!
        </h2>
        <p className="text-xs font-black text-blue-600 mt-1 uppercase tracking-wider">
          {result.gameTitle} Completed
        </p>

        {/* Level Up Banner if applicable */}
        {leveledUp && (
          <div className="mt-3 p-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 border-b-4 border-purple-800 rounded-2xl text-white font-black text-sm shadow-md flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>LEVEL UP! You reached Level {newLevel}!</span>
          </div>
        )}

        {/* New Badges Banner */}
        {newBadges && newBadges.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-2xl space-y-1">
            <span className="text-xs font-black text-yellow-950 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-600" />
              New Badge Unlocked!
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {newBadges.map(b => (
                <span key={b.id} className="px-3 py-1 bg-white rounded-full border-2 border-yellow-300 text-xs font-black text-slate-800 shadow-xs flex items-center gap-1">
                  <span>{b.icon}</span>
                  <span>{b.title}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3, 4, 5].map(starIndex => (
            <Star
              key={starIndex}
              className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                starIndex <= result.starsEarned
                  ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-sm'
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-100 text-left my-4">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Score</span>
            <span className="text-base font-black text-slate-800">{result.score} / {result.maxScore}</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Accuracy</span>
            <span className="text-base font-black text-emerald-600">{result.accuracy}%</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Time</span>
            <span className="text-base font-black text-slate-800">{timeFormatted}</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">XP Earned</span>
            <span className="text-base font-black text-blue-600">+{result.xpEarned} XP</span>
          </div>
        </div>

        {/* Streak & Details */}
        <div className="flex items-center justify-between px-2 text-xs font-black text-slate-500 mb-4">
          <span>Correct Answers: <strong className="text-slate-800">{result.correctAnswers}/{result.totalQuestions}</strong></span>
          <span>Best Streak: <strong className="text-orange-600">🔥 {result.bestStreak}</strong></span>
        </div>

        {/* Mistakes Review / Step-by-Step Educational section */}
        {result.mistakes && result.mistakes.length > 0 && (
          <div className="mt-3 mb-5 text-left bg-blue-50/70 p-3.5 rounded-2xl border-2 border-blue-200 space-y-2 max-h-48 overflow-y-auto">
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-900">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Let's learn from these together:</span>
            </div>
            {result.mistakes.map((m, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-blue-100 text-xs space-y-1">
                <div className="font-black text-slate-800">{m.question}</div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="text-red-500 line-through">Your answer: {m.studentAnswer}</span>
                  <span className="text-emerald-600 font-black">Correct: {m.correctAnswer}</span>
                </div>
                <div className="text-slate-600 text-[11px] font-bold bg-slate-50 p-2 rounded-lg border border-slate-100">
                  💡 {m.explanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation / Action Buttons with tactile feel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <button
            id="result-play-again-btn"
            onClick={() => {
              soundManager.playPop();
              onPlayAgain();
            }}
            className="py-3 px-2 bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>

          <button
            id="result-home-btn"
            onClick={() => {
              soundManager.playPop();
              onGoHome();
            }}
            className="py-3 px-2 bg-white hover:bg-slate-50 border-2 border-b-4 border-slate-300 text-slate-700 font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            id="result-next-btn"
            onClick={() => {
              soundManager.playPop();
              onNextGame();
            }}
            className="py-3 px-2 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 text-white font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Next Game</span>
          </button>

          <button
            id="result-progress-btn"
            onClick={() => {
              soundManager.playPop();
              onViewProgress();
            }}
            className="py-3 px-2 bg-blue-600 hover:bg-blue-500 border-b-4 border-blue-800 text-white font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
