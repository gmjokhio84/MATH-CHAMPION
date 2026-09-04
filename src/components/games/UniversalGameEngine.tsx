import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Flame, Sparkles, Trophy, Lightbulb, Bot, CheckCircle2, XCircle, Heart, ShieldAlert, Flag, HelpCircle } from 'lucide-react';
import { DifficultyLevel, GameResult, GradeNumber, MathQuestion, Student } from '../../types';
import { generateQuestionSet } from '../../utils/questionGenerator';
import { soundManager } from '../../utils/audio';
import { AnalogClockVisual, FractionPieVisual, PakistaniCurrencyVisual, ShapeVisual } from '../common/MathVisuals';

interface UniversalGameEngineProps {
  gameId: string;
  gameTitle: string;
  topicId: string;
  grade: GradeNumber;
  difficulty: DifficultyLevel;
  activeStudent: Student;
  onFinishGame: (result: GameResult) => void;
  onBack: () => void;
  onOpenAiTutor: (questionText: string, studentAnswer?: string) => void;
}

export const UniversalGameEngine: React.FC<UniversalGameEngineProps> = ({
  gameId,
  gameTitle,
  topicId,
  grade,
  difficulty,
  activeStudent,
  onFinishGame,
  onBack,
  onOpenAiTutor,
}) => {
  // Question Count: Championship = 25, Boss = 10, Standard = 10
  const totalQuestionCount = gameId === 'championship' ? 25 : 10;

  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mistakes, setMistakes] = useState<Array<{ question: string; studentAnswer: string; correctAnswer: string; explanation: string }>>([]);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Lifelines: 50/50 used in Quiz Show
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);

  // Boss Battle HP: Starts at 100, drops by 10 per correct answer
  const [bossHp, setBossHp] = useState(100);

  // Multiplication Race Car distance %
  const [raceProgress, setRaceProgress] = useState(5);

  // Initialize questions
  useEffect(() => {
    const qList = generateQuestionSet(grade, topicId, totalQuestionCount, difficulty);
    setQuestions(qList);
  }, [grade, topicId, totalQuestionCount, difficulty]);

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;

    soundManager.playPop();
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.trim() === currentQ.correctAnswer.trim();
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      soundManager.playStreak(nextStreak);

      // Points calculation
      const points = 10 + Math.min(10, nextStreak * 2);
      setScore(s => s + points);

      if (gameId === 'boss_battle') {
        setBossHp(hp => Math.max(0, hp - 10));
      }
      if (gameId === 'multiplication_race') {
        setRaceProgress(p => Math.min(100, p + 10));
      }
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

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setShowHint(false);
      setHiddenOptions([]);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    const totalTime = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    const correctCount = questions.length - mistakes.length;
    const accuracy = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const maxScore = questions.length * 10;
    const stars = accuracy >= 90 ? 5 : accuracy >= 75 ? 4 : accuracy >= 50 ? 3 : accuracy >= 30 ? 2 : 1;
    const xpBonus = gameId === 'boss_battle' ? 500 : gameId === 'championship' ? 400 : 100;
    const xpEarned = Math.round((accuracy / 100) * xpBonus) + bestStreak * 5;

    const result: GameResult = {
      id: `res_${Date.now()}`,
      studentId: activeStudent.id,
      gameId,
      gameTitle,
      topicId,
      grade,
      difficulty,
      score,
      maxScore,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      accuracy,
      timeTakenSeconds: totalTime,
      xpEarned,
      starsEarned: stars,
      bestStreak,
      mistakes,
      timestamp: 'Just now',
    };

    onFinishGame(result);
  };

  // 50/50 lifeline
  const handleUse5050 = () => {
    if (lifelineUsed || !currentQ || isAnswered) return;
    soundManager.playPop();
    const wrongOptions = currentQ.options.filter(opt => opt.trim() !== currentQ.correctAnswer.trim());
    const toHide = wrongOptions.slice(0, 2);
    setHiddenOptions(toHide);
    setLifelineUsed(true);
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-slate-500">Preparing questions for Grade {grade}...</p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Header Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-lg sm:text-xl font-extrabold text-slate-800">
              {gameTitle}
            </h1>
            <span className="text-xs font-bold text-amber-600">
              Question {currentIndex + 1} of {questions.length} • Grade {grade}
            </span>
          </div>
        </div>

        {/* Stats Pill Badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-extrabold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{elapsedSeconds}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-900 rounded-xl border border-orange-200">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{streak}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* SPECIAL THEME: Math Boss Battle HP Bar */}
      {gameId === 'boss_battle' && (
        <div className="bg-slate-900 rounded-2xl p-4 text-white border border-purple-800 shadow-md">
          <div className="flex items-center justify-between mb-2 text-xs font-extrabold">
            <div className="flex items-center gap-2 text-purple-300">
              <span className="text-2xl animate-bounce">👾</span>
              <span>MATH BOSS: PROFESSOR POLYGON</span>
            </div>
            <span className="text-rose-400 font-bold">{bossHp} / 100 HP</span>
          </div>
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-purple-700">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${bossHp}%` }}
            />
          </div>
        </div>
      )}

      {/* SPECIAL THEME: Multiplication Race Track */}
      {gameId === 'multiplication_race' && (
        <div className="bg-slate-800 rounded-2xl p-3 text-white border border-slate-700">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1 px-1">
            <span>START</span>
            <span>FINISH LINE 🏁</span>
          </div>
          <div className="relative h-10 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center px-2">
            <div
              className="absolute transition-all duration-500 text-2xl"
              style={{ left: `calc(${raceProgress}% - 20px)` }}
            >
              🏎️
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL THEME: Quiz Show 50/50 Lifeline */}
      {gameId === 'quiz_show' && (
        <div className="flex items-center justify-end">
          <button
            onClick={handleUse5050}
            disabled={lifelineUsed || isAnswered}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
              lifelineUsed
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-xs'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-yellow-300" />
            <span>50/50 Lifeline {lifelineUsed ? '(Used)' : ''}</span>
          </button>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Visual Renderers if question has visual data */}
        {currentQ.visualData && (
          <div className="flex justify-center">
            {currentQ.visualData.type === 'clock' && (
              <AnalogClockVisual
                hours={currentQ.visualData.hours || 12}
                minutes={currentQ.visualData.minutes || 0}
              />
            )}
            {currentQ.visualData.type === 'fraction' && (
              <FractionPieVisual
                total={currentQ.visualData.total || 4}
                shaded={currentQ.visualData.shaded || 1}
              />
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

        {/* Question Text */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 leading-snug">
            {currentQ.question}
          </h2>
          {currentQ.context && (
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {currentQ.context}
            </p>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
          {currentQ.options.map((option, idx) => {
            const isHidden = hiddenOptions.includes(option);
            if (isHidden) {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border-2 border-dashed border-slate-200 opacity-40 flex items-center justify-center text-xs font-bold text-slate-400"
                >
                  Eliminated
                </div>
              );
            }

            const isThisSelected = selectedOption === option;
            const isThisCorrect = option.trim() === currentQ.correctAnswer.trim();

            let optionStyle = 'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-800 hover:shadow-xs';

            if (isAnswered) {
              if (isThisCorrect) {
                optionStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-extrabold shadow-sm';
              } else if (isThisSelected && !isThisCorrect) {
                optionStyle = 'bg-rose-50 border-2 border-rose-500 text-rose-900 font-bold';
              } else {
                optionStyle = 'bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`game-option-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`p-4 sm:p-5 rounded-2xl font-heading text-lg sm:text-xl font-extrabold transition-all transform active:scale-95 flex items-center justify-between ${optionStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Educational Feedback Box when Answered */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-left space-y-2 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-extrabold text-base flex items-center gap-1.5">
                {isCorrect ? '🎉 Great Job! Spot on!' : '💡 Good try! Here is how to solve it:'}
              </span>
              <button
                onClick={() => onOpenAiTutor(currentQ.question, selectedOption || undefined)}
                className="text-xs font-bold px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
              >
                <Bot className="w-3.5 h-3.5 text-yellow-300" />
                <span>Ask Questie AI</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Hint Box if user pressed hint */}
        {showHint && !isAnswered && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-left space-y-1 text-xs sm:text-sm text-blue-900">
            <div className="font-extrabold flex items-center gap-1.5 text-blue-700">
              <Lightbulb className="w-4 h-4" />
              <span>Friendly Hint:</span>
            </div>
            <p className="font-medium">{currentQ.hint}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {!isAnswered ? (
            <button
              onClick={() => {
                soundManager.playPop();
                setShowHint(h => !h);
              }}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          ) : (
            <div className="text-xs font-bold text-slate-500">
              {currentIndex + 1 === questions.length ? 'Final Question Completed!' : 'Ready for the next one?'}
            </div>
          )}

          {isAnswered && (
            <button
              id="game-continue-btn"
              onClick={() => {
                soundManager.playPop();
                handleNextQuestion();
              }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {currentIndex + 1 === questions.length ? 'View Results 🏆' : 'Next Question ➡️'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
