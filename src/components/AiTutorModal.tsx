import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, Lightbulb, Heart, HelpCircle } from 'lucide-react';
import { GradeNumber } from '../types';
import { soundManager } from '../utils/audio';

interface AiTutorModalProps {
  currentGrade: GradeNumber;
  initialQuestion?: string;
  studentAnswer?: string;
  onClose: () => void;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  currentGrade,
  initialQuestion = '',
  studentAnswer = '',
  onClose,
}) => {
  const [inputQuestion, setInputQuestion] = useState(initialQuestion);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; encouragement?: string }>>([
    {
      role: 'assistant',
      text: `Hi there! I'm Questie 🦊, your friendly Math Buddy! Ask me any math question or doubt from Grade ${currentGrade}, and I'll give you step-by-step clues to help you solve it yourself!`,
      encouragement: `Remember: Mistakes help our brain grow! 🌟`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || isLoading) return;

    soundManager.playPop();
    const userQ = inputQuestion.trim();
    setInputQuestion('');

    setMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQ,
          studentAnswer: studentAnswer || '',
          grade: currentGrade,
          topic: 'Primary Mathematics',
        }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.hint || "Let's break this down into smaller numbers! What happens if you split it into tens and ones?",
          encouragement: data.encouragement || "You're on the right track! Keep exploring!",
        },
      ]);
      soundManager.playCorrect();
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "Try breaking the numbers into simpler parts (like tens and ones). Count up step-by-step!",
          encouragement: "Great thinking! You've got this! ⭐",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[36px] max-w-lg w-full p-6 sm:p-7 border-b-8 border-violet-700 shadow-2xl flex flex-col h-[550px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-sm">
              🦊
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-800 flex items-center gap-2">
                <span>Questie the Math Fox</span>
                <span className="text-[10px] font-black bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI Buddy
                </span>
              </h3>
              <p className="text-xs font-bold text-slate-400">Step-by-step guidance • Grade {currentGrade}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3.5 my-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm font-bold leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 text-slate-800 rounded-tl-xs border-2 border-slate-200/80 space-y-1.5'
                }`}
              >
                {m.encouragement && (
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-violet-700 pb-1 border-b border-violet-100">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    <span>{m.encouragement}</span>
                  </div>
                )}
                <div>{m.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-black text-violet-600 p-2">
              <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
              <span>Questie is thinking about helpful clues...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] font-black text-slate-500">
          <span className="shrink-0 text-slate-400 font-bold">Quick ideas:</span>
          <button
            onClick={() => setInputQuestion("How do I add two-digit numbers with carrying?")}
            className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-yellow-100 hover:text-yellow-900 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Carrying in addition?
          </button>
          <button
            onClick={() => setInputQuestion("What is an easy way to remember the 7 times table?")}
            className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-yellow-100 hover:text-yellow-900 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Times table trick?
          </button>
          <button
            onClick={() => setInputQuestion("How do I read minutes on a clock?")}
            className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-yellow-100 hover:text-yellow-900 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Clock minutes?
          </button>
        </div>

        {/* Input Bar with Tactile Button */}
        <form onSubmit={handleSend} className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            placeholder="Type your math question or problem..."
            className="flex-1 p-3 px-4 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="p-3 bg-violet-600 hover:bg-violet-500 border-b-4 border-violet-800 text-white rounded-2xl shadow-xs transition-all disabled:opacity-50 cursor-pointer active:translate-y-0.5 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
