import React, { useState, useEffect } from 'react';
import { Flame, Clock, Trophy, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Star } from 'lucide-react';
import { DifficultyLevel, GameResult, GradeNumber, MathQuestion, Student } from '../types';
import { generateQuestionSet } from '../utils/questionGenerator';
import { soundManager } from '../utils/audio';
import { getDailyChallengeStatus, saveDailyChallengeStatus } from '../utils/storage';
import { AnalogClockVisual, FractionPieVisual, PakistaniCurrencyVisual, ShapeVisual } from './common/MathVisuals';

interface DailyChallengeProps {
  currentGrade: GradeNumber;
  activeStudent: Student;
  onFinishGame: (result: GameResult) => void;
  onGoHome: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  currentGrade,
  activeStudent,
  onFinishGame,
  onGoHome,
}) => {
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mistakes, setMistakes] = useState<Array<{ question: string; studentAnswer: string; correctAnswer: string; explanation: string }>>([]);

  const savedStatus = getDailyChallengeStatus(activeStudent.id);
  const alreadyCompleted = savedStatus?.completed || false;

  useEffect(() => {
    // Generate 10 mixed questions for the grade
    const qList = generateQuestionSet(currentGrade, 'all', 10, 'medium');
    setQuestions(qList);
  }, [currentGrade]);

  useEffect(() => {
    if (alreadyCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, alreadyCompleted]);

  const currentQ = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered || !currentQ) return;
    soundManager.playPop();

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.trim() === currentQ.correctAnswer.trim();

    if (isCorrect) {
      soundManager.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      soundManager.playStreak(nextStreak);
      setCorrectCount(c => c + 1);
      setScore(s => s + 10 + Math.min(10, nextStreak * 2));
    } else {
      soundManager.playWrong();
      setStreak(0);
      setMistakes(prev => [
        ...prev,
        {
          question: currentQ.question,
          studentAnswer: option,
          correctAnswer: currentQ.correctAnswer,
          explanation: currentQ.explanation,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Save Daily Challenge status
      const totalTime = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      const accuracy = Math.round((correctCount / questions.length) * 100);
      const bonusXp = 200; // Big bonus for completing daily challenge
      const earnedXp = Math.round((accuracy / 100) * bonusXp) + 50;
      const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 4 : 3;

      saveDailyChallengeStatus(activeStudent.id, {
        date: new Date().toISOString().split('T')[0],
        completed: true,
        score,
        totalQuestions: 10,
        starsEarned: stars,
      });

      const result: GameResult = {
        id: `daily_${Date.now()}`,
        studentId: activeStudent.id,
        gameId: 'daily_challenge',
        gameTitle: 'Daily Math Challenge',
        topicId: 'mixed',
        grade: currentGrade,
        difficulty: 'medium',
        score,
        maxScore: 100,
        correctAnswers: correctCount,
        totalQuestions: 10,
        accuracy,
        timeTakenSeconds: totalTime,
        xpEarned: earnedXp,
        starsEarned: stars,
        bestStreak,
        mistakes,
        timestamp: 'Just now',
      };

      onFinishGame(result);
    }
  };

  if (alreadyCompleted && savedStatus) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-24 h-24 bg-emerald-100 border-b-4 border-emerald-300 rounded-[32px] flex items-center justify-center text-5xl mx-auto shadow-sm">
          ✅
        </div>
        <h2 className="font-heading text-3xl font-black text-slate-800">
          Today's Challenge Completed!
        </h2>
        <p className="text-base font-bold text-slate-500 max-w-md mx-auto">
          Awesome work! You scored {savedStatus.score} points and earned {savedStatus.starsEarned} stars today.
        </p>
        <div className="pt-4">
          <button
            onClick={onGoHome}
            className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black text-sm rounded-2xl shadow-md cursor-pointer active:translate-y-0.5"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 rounded-[32px] sm:rounded-[36px] p-6 text-white shadow-xl border-b-8 border-orange-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-black mb-1 border border-white/20 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            Daily Math Quest
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black">Today's 10-Question Challenge</h1>
          <p className="text-xs sm:text-sm font-bold text-orange-100 mt-1">Grade {currentGrade} • Finish all 10 to keep your daily flame alive!</p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-black">
          <div className="bg-black/25 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 border border-white/10">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span>{elapsedSeconds}s</span>
          </div>
          <div className="bg-black/25 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 border border-white/10">
            <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span>Streak: {streak}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-white p-1 rounded-full border-2 border-slate-200 shadow-xs h-5">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[36px] p-6 sm:p-10 border-b-8 border-slate-200 shadow-md space-y-6">
        {currentQ.visualData && (
          <div className="flex justify-center p-4 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-200">
            {currentQ.visualData.type === 'clock' && (
              <AnalogClockVisual hours={currentQ.visualData.hours || 12} minutes={currentQ.visualData.minutes || 0} />
            )}
            {currentQ.visualData.type === 'fraction' && (
              <FractionPieVisual total={currentQ.visualData.total || 4} shaded={currentQ.visualData.shaded || 1} />
            )}
            {currentQ.visualData.type === 'shape' && (
              <ShapeVisual shape={currentQ.visualData.shape || 'circle'} />
            )}
            {currentQ.visualData.type === 'money' && (
              <PakistaniCurrencyVisual
                rupeeNotes={currentQ.visualData.rupeeNotes}
                itemPrice={currentQ.visualData.itemPrice}
                paidAmount={currentQ.visualData.paidAmount}
              />
            )}
          </div>
        )}

        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            {currentQ.question}
          </h2>
          {currentQ.context && (
            <p className="text-sm font-bold text-slate-500">{currentQ.context}</p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt.trim() === currentQ.correctAnswer.trim();

            let style = 'bg-white border-2 border-b-4 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-800 shadow-xs';
            if (isAnswered) {
              if (isCorrect) style = 'bg-emerald-50 border-2 border-b-4 border-emerald-500 text-emerald-900 font-black shadow-xs';
              else if (isSelected) style = 'bg-rose-50 border-2 border-b-4 border-rose-500 text-rose-900 shadow-xs';
              else style = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`p-5 rounded-[22px] font-heading text-xl font-black transition-all cursor-pointer active:translate-y-0.5 ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="text-center pt-4">
            <button
              onClick={handleNext}
              className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black text-base rounded-2xl shadow-md cursor-pointer active:translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>{currentIndex + 1 === questions.length ? 'Finish Challenge 🏆' : 'Next Question ➡️'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
