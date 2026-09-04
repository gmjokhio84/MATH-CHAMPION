import React, { useState } from 'react';
import { X, UserCheck, PlusCircle, Sparkles, Trophy, Flame, GraduationCap, Check, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { GradeNumber, Student } from '../types';
import { AVATARS } from '../data/initialData';
import { soundManager } from '../utils/audio';
import { ASSETS_3D, DEVELOPER_INFO } from '../assets/images';

interface StudentLoginModalProps {
  students: Student[];
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onRegisterStudent: (newStudent: Student) => void;
  onClose: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onRegisterStudent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'new'>('select');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for creating a new student
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeNumber>(3);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(AVATARS[0].id);
  const [formError, setFormError] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `grade ${s.grade}`.includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id: string) => {
    soundManager.playCorrect();
    onSelectStudent(id);
    onClose();
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError('Please enter the student’s name.');
      return;
    }

    const newStudent: Student = {
      id: `student_${Date.now()}`,
      name: trimmed,
      grade,
      avatarId: selectedAvatarId,
      xp: 150,
      level: 1,
      stars: 5,
      streak: 1,
      bestStreak: 1,
      questionsSolved: 0,
      correctAnswers: 0,
      accuracy: 100,
      gamesPlayed: 0,
      unlockedBadges: ['first_game'],
      badges: ['first_game'],
      lastActive: new Date().toISOString(),
    };

    soundManager.playCorrect();
    onRegisterStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 border-b-8 border-blue-600 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
          title="Close Login Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Modal Header */}
        <div className="flex items-center gap-3.5 pb-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
            <img
              src={ASSETS_3D.mascot}
              alt="3D Math Champion"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                STUDENTS LOGIN
              </h2>
            </div>
            <p className="text-xs font-black text-blue-600 flex items-center gap-1.5">
              <span>MATH CHAMPIONS</span>
              <span>•</span>
              <span className="text-slate-400 font-bold">Choose your profile to track XP &amp; badges</span>
            </p>
          </div>
        </div>

        {/* Tab switcher: Choose existing vs Add New */}
        <div className="flex items-center gap-2 p-1.5 bg-blue-50/80 rounded-2xl border-2 border-blue-100 mt-4">
          <button
            type="button"
            onClick={() => { soundManager.playPop(); setActiveTab('select'); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'select'
                ? 'bg-blue-600 text-white shadow-sm border-b-3 border-blue-800'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Existing Champions ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { soundManager.playPop(); setActiveTab('new'); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white shadow-sm border-b-3 border-blue-800'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Student Login</span>
          </button>
        </div>

        {/* TAB 1: SELECT EXISTING STUDENT */}
        {activeTab === 'select' && (
          <div className="mt-5 space-y-4">
            {/* Search filter if more than 3 students */}
            {students.length > 3 && (
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search student by name or grade..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredStudents.map(student => {
                const isCurrent = student.id === activeStudentId;
                const avatar = AVATARS.find(a => a.id === student.avatarId) || AVATARS[0];
                return (
                  <div
                    key={student.id}
                    onClick={() => handleSelect(student.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left group ${
                      isCurrent
                        ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        {avatar.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-black text-slate-800 text-sm truncate flex items-center gap-1.5">
                          {student.name}
                          {isCurrent && (
                            <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-0.5">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-blue-700 font-extrabold">
                            Grade {student.grade}
                          </span>
                          <span className="flex items-center gap-0.5 text-orange-600 font-black">
                            <Flame className="w-3 h-3 fill-orange-500" />
                            {student.streak || 0}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-indigo-600 font-black">
                            {student.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500 text-white flex items-center gap-1'
                          : 'bg-blue-600 group-hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In</span>
                        </>
                      ) : (
                        <span>Log In</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-slate-400 font-bold text-xs">
                No students found matching "{searchQuery}". You can register a new student above!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTER NEW STUDENT */}
        {activeTab === 'new' && (
          <form onSubmit={handleCreateStudent} className="mt-5 space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Student Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setFormError(''); }}
                placeholder="e.g. Zainab Malik or Hamza"
                maxLength={30}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Select Grade */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Select Class / Grade
              </label>
              <div className="grid grid-cols-5 gap-2">
                {([1, 2, 3, 4, 5] as GradeNumber[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                      grade === g
                        ? 'bg-blue-600 text-white border-b-4 border-blue-800 shadow-sm scale-105'
                        : 'bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Choose Math Champion Avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATARS.map(avatar => {
                  const isSelected = avatar.id === selectedAvatarId;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(avatar.id)}
                      className={`p-2 rounded-2xl text-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-sm'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                      title={avatar.name}
                    >
                      <span>{avatar.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-yellow-900" />
                <span>Create Profile & Log In</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Credit & Developer Contact */}
        <div className="pt-5 mt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 font-black text-slate-700">
              <span className="text-blue-700">MATH CHAMPIONS</span>
              <span>•</span>
              <span>By {DEVELOPER_INFO.leadDeveloper} &amp; {DEVELOPER_INFO.team}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] font-bold text-slate-500">
              <span>CONTACT: <strong className="text-emerald-700">{DEVELOPER_INFO.contactNumber}</strong></span>
              <span>•</span>
              <a href={`tel:${DEVELOPER_INFO.contactNumber}`} className="text-emerald-600 hover:underline flex items-center gap-0.5">
                <Phone className="w-2.5 h-2.5" /> Call
              </a>
              <span>•</span>
              <a href={`https://wa.me/92${DEVELOPER_INFO.contactNumber.slice(1)}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline flex items-center gap-0.5">
                <MessageCircle className="w-2.5 h-2.5" /> WhatsApp
              </a>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Interactive Primary School Mathematics
          </span>
        </div>
      </div>
    </div>
  );
};
