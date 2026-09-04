import React, { useState } from 'react';
import { Users, GraduationCap, TrendingUp, AlertCircle, CheckCircle2, Plus, Calendar, BookOpen, Award, BarChart3, Search } from 'lucide-react';
import { Assignment, Classroom, GradeNumber, Student, Teacher } from '../types';
import { AVATARS, TOPICS_DATA } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface TeacherDashboardProps {
  teacher: Teacher;
  classrooms: Classroom[];
  students: Student[];
  assignments: Assignment[];
  onCreateAssignment: (assignment: Assignment) => void;
  onOpenCertificate: (studentName: string, grade: GradeNumber) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  classrooms,
  students,
  assignments,
  onCreateAssignment,
  onOpenCertificate,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || 'c3');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Assignment Modal state
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('addition');
  const [newGrade, setNewGrade] = useState<GradeNumber>(3);
  const [newTargetQuestions, setNewTargetQuestions] = useState(15);
  const [newDueDate, setNewDueDate] = useState('2026-09-15');

  const currentClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0];
  const classStudents = students.filter(s => currentClass ? currentClass.studentIds.includes(s.id) : true);

  // Class analytics
  const totalStudents = classStudents.length;
  const avgAccuracy = Math.round(
    classStudents.reduce((acc, s) => acc + s.accuracy, 0) / Math.max(1, totalStudents)
  );
  const totalQuestions = classStudents.reduce((acc, s) => acc + s.questionsSolved, 0);

  const filteredStudents = classStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playAchievement();
    const asg: Assignment = {
      id: `asg_${Date.now()}`,
      title: newTitle,
      classroomId: selectedClassId,
      grade: newGrade,
      topicId: newTopic,
      targetQuestions: Number(newTargetQuestions),
      targetAccuracy: 80,
      dueDate: newDueDate,
      completedStudentIds: [],
    };

    onCreateAssignment(asg);
    setShowNewAssignmentModal(false);
    setNewTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Teacher Header Bar */}
      <div className="bg-white rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 border-b-8 border-blue-500 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-yellow-400 border-b-4 border-yellow-600 text-yellow-950 flex items-center justify-center text-3xl shadow-sm">
            👨‍🏫
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black">
              <GraduationCap className="w-3.5 h-3.5" />
              Educator Portal
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-800">
              Welcome, {teacher.name}
            </h1>
            <p className="text-xs text-slate-500 font-bold">{teacher.schoolName}</p>
          </div>
        </div>

        {/* Classroom selector buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {classrooms.map(c => (
            <button
              key={c.id}
              onClick={() => {
                soundManager.playPop();
                setSelectedClassId(c.id);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer active:translate-y-0.5 ${
                selectedClassId === c.id
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-950 border-b-4 border-yellow-600 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b-2 border-slate-200 pb-3 text-xs font-black text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-2xl transition-all cursor-pointer active:translate-y-0.5 ${
            activeTab === 'overview'
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800 shadow-sm'
              : 'bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          Classroom Analytics
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-5 py-2.5 rounded-2xl transition-all cursor-pointer active:translate-y-0.5 ${
            activeTab === 'students'
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800 shadow-sm'
              : 'bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          Individual Students ({totalStudents})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-5 py-2.5 rounded-2xl transition-all cursor-pointer active:translate-y-0.5 ${
            activeTab === 'assignments'
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800 shadow-sm'
              : 'bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          Math Homework & Tasks ({assignments.length})
        </button>
      </div>

      {/* TAB 1: Classroom Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Enrolled</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-heading font-black text-slate-800">{totalStudents}</span>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-black text-emerald-600">100% Active this week</span>
            </div>

            <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Average Accuracy</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-heading font-black text-emerald-600">{avgAccuracy}%</span>
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-slate-500">Benchmark: 75% target</span>
            </div>

            <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Questions Solved</span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-heading font-black text-blue-600">{totalQuestions}</span>
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-bold text-slate-500">Across all games</span>
            </div>

            <div className="bg-white p-5 rounded-[32px] border-b-6 border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Class Focus Topic</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-heading font-black text-yellow-800">Fractions & Time</span>
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-bold text-slate-500">Identified for drill</span>
            </div>
          </div>

          {/* Strong vs Weak Topics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-3">
              <h3 className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Class Strengths (High Fluency)
              </h3>
              <p className="text-xs font-bold text-slate-500">Topics where students maintain over 85% accuracy</p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-between text-xs font-black text-emerald-950">
                  <span>➕ Addition Attack & Number Sense</span>
                  <span className="text-emerald-700">92% Accuracy</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-between text-xs font-black text-emerald-950">
                  <span>💵 Money Master (Pakistani Currency Rs.)</span>
                  <span className="text-emerald-700">88% Accuracy</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-between text-xs font-black text-emerald-950">
                  <span>📐 2D Geometry & Shape Hunter</span>
                  <span className="text-emerald-700">86% Accuracy</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-3">
              <h3 className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Areas Needing Practice
              </h3>
              <p className="text-xs font-bold text-slate-500">Automated AI recommendation: assign 10-15 targeted questions</p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-yellow-50 border-2 border-yellow-100 flex items-center justify-between text-xs font-black text-yellow-950">
                  <span>🍕 Fraction Match (Shaded Parts)</span>
                  <span className="text-yellow-800">64% Accuracy • Recommended</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-yellow-50 border-2 border-yellow-100 flex items-center justify-between text-xs font-black text-yellow-950">
                  <span>⏰ Analog Clock Hands (Minutes)</span>
                  <span className="text-yellow-800">68% Accuracy • Recommended</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-yellow-50 border-2 border-yellow-100 flex items-center justify-between text-xs font-black text-yellow-950">
                  <span>➗ Division Master Facts</span>
                  <span className="text-yellow-800">71% Accuracy • Drill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Individual Student Performance */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-black text-slate-800">
              Student Diagnostic Reports
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search student by name..."
                className="pl-10 pr-4 py-2 rounded-2xl border-2 border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/50 text-slate-400 uppercase font-black text-[10px] border-b-2 border-blue-100">
                <tr>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Level / XP</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Solved</th>
                  <th className="py-3 px-3">Streak</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                {filteredStudents.map(s => {
                  const av = AVATARS.find(a => a.id === s.avatarId) || AVATARS[0];
                  return (
                    <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{av.emoji}</span>
                          <div>
                            <div className="font-black text-slate-800">{s.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold">Class {s.grade}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-black text-yellow-800">Lvl {s.level}</div>
                        <div className="text-[10px] text-slate-400">{s.xp} XP</div>
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-600">
                        {s.accuracy}%
                      </td>
                      <td className="py-3 px-3">{s.questionsSolved} questions</td>
                      <td className="py-3 px-3 text-orange-600 font-black">🔥 {s.streak}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          s.accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {s.accuracy >= 80 ? 'Excelling' : 'Needs Practice'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onOpenCertificate(s.name, s.grade)}
                          className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 border-b-2 border-yellow-600 text-yellow-950 font-black text-[11px] rounded-xl shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer active:translate-y-0.5"
                        >
                          <Award className="w-3 h-3" />
                          Issue Certificate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Assignments Manager */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-[36px] p-6 sm:p-7 border-b-6 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-black text-slate-800">
                Mathematics Homework & Assigned Practice
              </h2>
              <p className="text-xs font-bold text-slate-500">Track and assign structured practice tasks to students</p>
            </div>
            <button
              onClick={() => setShowNewAssignmentModal(true)}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 border-b-4 border-yellow-600 font-black text-xs rounded-2xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {assignments.map(asg => (
              <div key={asg.id} className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-base font-black text-slate-800">{asg.title}</h3>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Grade {asg.grade}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-bold">
                  Topic: <strong className="text-slate-700 capitalize">{asg.topicId.replace('_', ' ')}</strong> • Target: {asg.targetQuestions} questions
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: {asg.dueDate}
                  </span>
                  <span className="text-emerald-600 font-black">
                    Completed by {asg.completedStudentIds.length} students
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-7 border-b-8 border-yellow-500 shadow-2xl space-y-4">
            <h3 className="font-heading text-xl font-black text-slate-800">
              Assign Math Homework
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-black text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Weekly Fraction Drill"
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Grade</label>
                  <select
                    value={newGrade}
                    onChange={e => setNewGrade(Number(e.target.value) as GradeNumber)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Topic</label>
                  <select
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold"
                  >
                    {TOPICS_DATA.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-700 block mb-1">Questions Target</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={newTargetQuestions}
                    onChange={e => setNewTargetQuestions(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="px-5 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 font-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black shadow-sm cursor-pointer active:translate-y-0.5"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
