import React, { useState, useEffect } from 'react';
import { RotateCcw, ArrowLeft, Trophy, Sparkles, Clock, Flame, Star, Lightbulb } from 'lucide-react';
import { DifficultyLevel, GameResult, GradeNumber, Student } from '../../types';
import { soundManager } from '../../utils/audio';

interface MathMemoryGameProps {
  grade: GradeNumber;
  difficulty: DifficultyLevel;
  activeStudent: Student;
  onFinishGame: (result: GameResult) => void;
  onBack: () => void;
}

interface MemoryCard {
  id: string;
  pairId: number;
  text: string;
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

export const MathMemoryGame: React.FC<MathMemoryGameProps> = ({
  grade,
  difficulty,
  activeStudent,
  onFinishGame,
  onBack,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [turnsCount, setTurnsCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Generate 6 pairs (12 cards) based on Grade
  useEffect(() => {
    initCards();
  }, [grade, difficulty]);

  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, isCompleted]);

  const initCards = () => {
    const pairs: Array<{ question: string; answer: string }> = [];

    if (grade <= 2) {
      // Simple additions & subtractions
      const nums = [
        { question: '3 + 4', answer: '7' },
        { question: '5 + 5', answer: '10' },
        { question: '9 - 3', answer: '6' },
        { question: '8 + 4', answer: '12' },
        { question: '15 - 7', answer: '8' },
        { question: '10 + 9', answer: '19' },
      ];
      pairs.push(...nums);
    } else if (grade === 3) {
      const nums = [
        { question: '6 × 4', answer: '24' },
        { question: '7 × 3', answer: '21' },
        { question: '35 ÷ 5', answer: '7' },
        { question: '12 + 18', answer: '30' },
        { question: '50 - 15', answer: '35' },
        { question: '8 × 5', answer: '40' },
      ];
      pairs.push(...nums);
    } else {
      // Grade 4 & 5: operations, fractions, squares
      const nums = [
        { question: '9 × 8', answer: '72' },
        { question: '72 ÷ 8', answer: '9' },
        { question: '1/2 of 50', answer: '25' },
        { question: '15 × 4', answer: '60' },
        { question: '100 - 37', answer: '63' },
        { question: '1/4 of 100', answer: '25' },
      ];
      pairs.push(...nums);
    }

    const cardsList: MemoryCard[] = [];
    pairs.forEach((p, index) => {
      cardsList.push({
        id: `card_${index}_q`,
        pairId: index,
        text: p.question,
        type: 'question',
        isFlipped: false,
        isMatched: false,
      });
      cardsList.push({
        id: `card_${index}_a`,
        pairId: index,
        text: p.answer,
        type: 'answer',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    for (let i = cardsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsList[i], cardsList[j]] = [cardsList[j], cardsList[i]];
    }

    setCards(cardsList);
    setFlippedIndices([]);
    setMatchesCount(0);
    setTurnsCount(0);
    setStreak(0);
    setIsCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    soundManager.playPop();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setTurnsCount(prev => prev + 1);
      const card1 = newCards[newFlipped[0]];
      const card2 = newCards[newFlipped[1]];

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // MATCH!
        soundManager.playCorrect();
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > bestStreak) setBestStreak(nextStreak);
        soundManager.playStreak(nextStreak);

        setTimeout(() => {
          setCards(prev =>
            prev.map((c, idx) =>
              idx === newFlipped[0] || idx === newFlipped[1]
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedIndices([]);
          setMatchesCount(m => {
            const nextM = m + 1;
            if (nextM === 6) {
              handleGameFinished();
            }
            return nextM;
          });
        }, 500);
      } else {
        // NO MATCH
        soundManager.playWrong();
        setStreak(0);
        setTimeout(() => {
          setCards(prev =>
            prev.map((c, idx) =>
              idx === newFlipped[0] || idx === newFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  const handleGameFinished = () => {
    setIsCompleted(true);
    soundManager.playFanfare();

    const totalSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    // Score based on turns efficiency
    const accuracy = Math.min(100, Math.round((6 / Math.max(6, turnsCount + 1)) * 100));
    const score = Math.max(40, Math.min(100, 100 - (turnsCount - 6) * 5));
    const stars = accuracy >= 80 ? 5 : accuracy >= 60 ? 4 : 3;
    const xpEarned = 100 + bestStreak * 10;

    const result: GameResult = {
      id: `res_${Date.now()}`,
      studentId: activeStudent.id,
      gameId: 'math_memory',
      gameTitle: 'Math Memory Match',
      topicId: 'patterns',
      grade,
      difficulty,
      score,
      maxScore: 100,
      correctAnswers: 6,
      totalQuestions: 6,
      accuracy,
      timeTakenSeconds: totalSeconds,
      xpEarned,
      starsEarned: stars,
      bestStreak,
      timestamp: 'Just now',
    };

    onFinishGame(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>🃏</span> Math Memory Match
            </h1>
            <p className="text-xs text-slate-500">Flip cards to match equations with their correct answers!</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-extrabold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{elapsedSeconds}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-900 rounded-xl border border-orange-200">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>Streak: {streak}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Pairs: {matchesCount}/6</span>
          </div>
        </div>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto py-2">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`h-28 sm:h-32 rounded-3xl cursor-pointer select-none transition-all transform duration-300 flex items-center justify-center p-3 text-center ${
              card.isMatched
                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900 shadow-xs scale-95 opacity-85'
                : card.isFlipped
                ? 'bg-white border-2 border-amber-400 shadow-md scale-100 text-slate-800'
                : 'bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-amber-300 text-white shadow-sm hover:scale-105 hover:shadow-md'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className={`font-heading font-extrabold ${card.text.length > 5 ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}>
                {card.text}
              </span>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 opacity-90">
                <span className="text-3xl sm:text-4xl">❓</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950">Math</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span>Turns taken: {turnsCount} • Match equations like <strong>6 × 4</strong> with <strong>24</strong>!</span>
      </div>
    </div>
  );
};
