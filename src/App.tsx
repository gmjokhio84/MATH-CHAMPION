/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { GameCenter, GAMES_LIST } from './components/GameCenter';
import { GradeTopicSelector } from './components/GradeTopicSelector';
import { StudentProfile } from './components/StudentProfile';
import { Leaderboard } from './components/Leaderboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentReport } from './components/ParentReport';
import { DailyChallenge } from './components/DailyChallenge';
import { UniversalGameEngine } from './components/games/UniversalGameEngine';
import { MathMemoryGame } from './components/games/MathMemoryGame';
import { GameResultModal } from './components/GameResultModal';
import { AiTutorModal } from './components/AiTutorModal';
import { CertificateModal } from './components/CertificateModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { OfflineIndicator } from './components/OfflineIndicator';

import { AppSettings, Assignment, Badge, DifficultyLevel, GameResult, GradeNumber, Student, Teacher } from './types';
import { INITIAL_STUDENTS } from './data/initialData';
import {
  getActiveRole,
  getActiveStudentId,
  getDailyChallengeStatus,
  getStoredAssignments,
  getStoredClassrooms,
  getStoredSettings,
  getStoredStudents,
  getStoredTeachers,
  recordGameResult,
  resetAllData,
  saveStoredAssignments,
  saveStoredSettings,
  saveStoredStudents,
  setActiveRole as persistActiveRole,
  setActiveStudentId as persistActiveStudentId,
} from './utils/storage';
import { soundManager } from './utils/audio';

export default function App() {
  // Persistence state
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);
  const [students, setStudents] = useState<Student[]>(getStoredStudents);
  const [activeStudentId, setActiveStudentIdState] = useState<string>(getActiveStudentId);
  const [activeRole, setActiveRoleState] = useState<'student' | 'teacher' | 'admin'>(getActiveRole);
  const [teachers] = useState<Teacher[]>(getStoredTeachers);
  const [classrooms] = useState(getStoredClassrooms);
  const [assignments, setAssignments] = useState<Assignment[]>(getStoredAssignments);

  // Active student object
  const activeStudent =
    (students && students.length > 0 ? (students.find(s => s.id === activeStudentId) || students[0]) : null) ||
    INITIAL_STUDENTS[0];

  // Navigation and active view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentGrade, setCurrentGrade] = useState<GradeNumber>(activeStudent ? activeStudent.grade : 3);

  // Game execution state
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeGameDifficulty, setActiveGameDifficulty] = useState<DifficultyLevel>('medium');
  const [activeGameTopic, setActiveGameTopic] = useState<string>('all');

  // Modals state
  const [lastGameResult, setLastGameResult] = useState<{
    result: GameResult;
    newBadges: Badge[];
    leveledUp: boolean;
  } | null>(null);

  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [aiTutorInitialPrompt, setAiTutorInitialPrompt] = useState<{ question: string; studentAnswer?: string }>({
    question: '',
  });

  const [certificateData, setCertificateData] = useState<{ studentName: string; grade: GradeNumber } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Sync sound settings with soundManager
  useEffect(() => {
    soundManager.setSoundEnabled(settings.soundEnabled);
    soundManager.setMusicEnabled(settings.musicEnabled);
  }, [settings]);

  // Keep student grade synced when active student changes
  const handleSelectActiveStudent = (id: string) => {
    setActiveStudentIdState(id);
    persistActiveStudentId(id);
    const selected = students.find(s => s.id === id);
    if (selected) {
      setCurrentGrade(selected.grade);
    }
  };

  const handleRegisterStudent = (newStudent: Student) => {
    const nextList = [newStudent, ...students];
    setStudents(nextList);
    saveStoredStudents(nextList);
    handleSelectActiveStudent(newStudent.id);
  };

  const handleUpdateStudent = (updated: Student) => {
    const nextList = students.map(s => (s.id === updated.id ? updated : s));
    setStudents(nextList);
    saveStoredStudents(nextList);
  };

  const handleChangeRole = (role: 'student' | 'teacher' | 'admin') => {
    setActiveRoleState(role);
    persistActiveRole(role);
    soundManager.playPop();
    if (role === 'teacher') {
      setCurrentView('teacher');
    } else if (role === 'student' && currentView === 'teacher') {
      setCurrentView('home');
    }
  };

  // Launch a game
  const handleStartGame = (gameId: string, diff: DifficultyLevel = 'medium', topicId: string = 'all') => {
    soundManager.playPop();
    setActiveGameId(gameId);
    setActiveGameDifficulty(diff);
    setActiveGameTopic(topicId);
    setCurrentView('game_play');
  };

  // Finish a game & trigger reward record
  const handleFinishGame = (result: GameResult) => {
    const outcome = recordGameResult(result);
    // Update local state with modified student
    setStudents(getStoredStudents());
    setLastGameResult({
      result,
      newBadges: outcome.newBadges,
      leveledUp: outcome.leveledUp,
    });
  };

  const handleCreateAssignment = (asg: Assignment) => {
    const updated = [asg, ...assignments];
    setAssignments(updated);
    saveStoredAssignments(updated);
  };

  const handleResetAll = () => {
    resetAllData();
    setStudents(getStoredStudents());
    setActiveStudentIdState(getStoredStudents()[0].id);
    setSettings(getStoredSettings());
    setIsSettingsOpen(false);
    setCurrentView('home');
  };

  const openAiTutor = (question: string = '', studentAnswer?: string) => {
    soundManager.playPop();
    setAiTutorInitialPrompt({ question, studentAnswer });
    setIsAiTutorOpen(true);
  };

  // Check if daily challenge is completed
  const dailyStatus = getDailyChallengeStatus(activeStudent.id);
  const isDailyCompleted = dailyStatus?.completed || false;

  // Selected game metadata
  const selectedGameMeta = GAMES_LIST.find(g => g.id === activeGameId) || {
    id: activeGameId || 'math_game',
    title: activeGameId ? activeGameId.replace('_', ' ').toUpperCase() : 'Math Practice',
    category: 'Mathematics',
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F0F9FF] text-[#1E293B] ${settings.largeText ? 'text-lg' : ''} ${settings.highContrast ? 'contrast-125' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        currentGrade={currentGrade}
        onSelectGrade={setCurrentGrade}
        activeStudent={activeStudent}
        activeRole={activeRole}
        onChangeRole={handleChangeRole}
        currentView={currentView}
        onNavigate={setCurrentView}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          const nextSettings = { ...settings, soundEnabled: next };
          setSettings(nextSettings);
          saveStoredSettings(nextSettings);
        }}
        onOpenAiTutor={() => openAiTutor()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Workspace with Immersive Left Dock */}
      <div className="flex-1 flex overflow-x-hidden">
        {/* Immersive Left Tactile Dock (Desktop) */}
        <aside className="hidden lg:flex w-20 xl:w-24 bg-white border-r-4 border-blue-100 flex-col items-center py-6 gap-5 shrink-0 z-20 shadow-xs">
          <button
            onClick={() => { soundManager.playPop(); setCurrentView('home'); }}
            title="Home"
            className={`w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl transition-all cursor-pointer ${
              currentView === 'home'
                ? 'bg-blue-600 text-white shadow-md border-b-4 border-blue-800 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-2 border-slate-200'
            }`}
          >
            🏠
          </button>
          <button
            onClick={() => { soundManager.playPop(); setCurrentView('games'); }}
            title="Game Center"
            className={`w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl transition-all cursor-pointer ${
              currentView === 'games'
                ? 'bg-blue-600 text-white shadow-md border-b-4 border-blue-800 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-2 border-slate-200'
            }`}
          >
            🎮
          </button>
          <button
            onClick={() => { soundManager.playPop(); setCurrentView('daily'); }}
            title="Daily Challenge"
            className={`w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl transition-all cursor-pointer ${
              currentView === 'daily'
                ? 'bg-blue-600 text-white shadow-md border-b-4 border-blue-800 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-2 border-slate-200'
            }`}
          >
            ⚡
          </button>
          <button
            onClick={() => { soundManager.playPop(); setCurrentView('topics'); }}
            title="Syllabus Topics"
            className={`w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl transition-all cursor-pointer ${
              currentView === 'topics'
                ? 'bg-blue-600 text-white shadow-md border-b-4 border-blue-800 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-2 border-slate-200'
            }`}
          >
            📚
          </button>
          <button
            onClick={() => { soundManager.playPop(); setCurrentView('leaderboard'); }}
            title="Leaderboard"
            className={`w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl transition-all cursor-pointer ${
              currentView === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-md border-b-4 border-blue-800 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-2 border-slate-200'
            }`}
          >
            🏆
          </button>
          <button
            onClick={() => { soundManager.playPop(); setCurrentView('profile'); }}
            title="Badges & Profile"
            className={`w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl transition-all cursor-pointer ${
              currentView === 'profile'
                ? 'bg-blue-600 text-white shadow-md border-b-4 border-blue-800 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-500 border-2 border-slate-200'
            }`}
          >
            🎖️
          </button>

          <div className="mt-auto flex flex-col gap-4">
            <button
              onClick={() => { soundManager.playPop(); setIsApkModalOpen(true); }}
              title="Install Android App / .APK Package"
              className="w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl bg-emerald-600 text-white border-b-4 border-emerald-800 shadow-sm hover:bg-emerald-500 transition-all cursor-pointer active:translate-y-0.5"
            >
              📱
            </button>
            <button
              onClick={() => { soundManager.playPop(); openAiTutor(); }}
              title="Questie AI Tutor"
              className="w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl bg-violet-600 text-white border-b-4 border-violet-800 shadow-sm hover:bg-violet-500 transition-all cursor-pointer active:translate-y-0.5"
            >
              🤖
            </button>
            <button
              onClick={() => { soundManager.playPop(); setIsSettingsOpen(true); }}
              title="Settings"
              className="w-12 xl:w-14 h-12 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl bg-white hover:bg-slate-50 text-slate-400 border-2 border-slate-200 transition-colors cursor-pointer"
            >
              ⚙️
            </button>
          </div>
        </aside>

        {/* Main Screen Content */}
        <main className="flex-1 min-w-0 pb-12 overflow-y-auto">
        {currentView === 'home' && (
          <HomeScreen
            currentGrade={currentGrade}
            activeStudent={activeStudent}
            onNavigate={setCurrentView}
            onSelectGame={gameId => handleStartGame(gameId, 'medium')}
            onSelectTopic={topicId => handleStartGame(topicId, 'medium', topicId)}
            onStartDailyChallenge={() => setCurrentView('daily')}
            dailyCompleted={isDailyCompleted}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        )}

        {currentView === 'games' && (
          <GameCenter
            currentGrade={currentGrade}
            onSelectGame={(gameId, diff) => handleStartGame(gameId, diff || 'medium')}
          />
        )}

        {currentView === 'topics' && (
          <GradeTopicSelector
            currentGrade={currentGrade}
            onSelectGrade={setCurrentGrade}
            onSelectTopic={topicId => handleStartGame(topicId, 'medium', topicId)}
          />
        )}

        {currentView === 'daily' && (
          <DailyChallenge
            currentGrade={currentGrade}
            activeStudent={activeStudent}
            onFinishGame={handleFinishGame}
            onGoHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'profile' && (
          <StudentProfile
            student={activeStudent}
            allStudents={students}
            onSelectStudent={handleSelectActiveStudent}
            onUpdateStudent={handleUpdateStudent}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
          />
        )}

        {currentView === 'leaderboard' && (
          <Leaderboard
            students={students}
            activeStudentId={activeStudent.id}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            teacher={teachers[0]}
            classrooms={classrooms}
            students={students}
            assignments={assignments}
            onCreateAssignment={handleCreateAssignment}
            onOpenCertificate={(name, g) => setCertificateData({ studentName: name, grade: g })}
          />
        )}

        {currentView === 'parent' && (
          <ParentReport
            student={activeStudent}
            onOpenCertificate={(name, g) => setCertificateData({ studentName: name, grade: g })}
          />
        )}

        {/* ACTIVE GAME PLAY CONTAINER */}
        {currentView === 'game_play' && activeGameId && (
          <div>
            {activeGameId === 'math_memory' ? (
              <MathMemoryGame
                grade={currentGrade}
                difficulty={activeGameDifficulty}
                activeStudent={activeStudent}
                onFinishGame={handleFinishGame}
                onBack={() => setCurrentView('games')}
              />
            ) : (
              <UniversalGameEngine
                gameId={activeGameId}
                gameTitle={selectedGameMeta.title}
                topicId={activeGameTopic !== 'all' ? activeGameTopic : activeGameId}
                grade={currentGrade}
                difficulty={activeGameDifficulty}
                activeStudent={activeStudent}
                onFinishGame={handleFinishGame}
                onBack={() => setCurrentView('games')}
                onOpenAiTutor={openAiTutor}
              />
            )}
          </div>
        )}
      </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-blue-700">MATH CHAMPIONS</span>
          <span>•</span>
          <span>Primary School Mathematics (Grades 1–5)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="text-emerald-700 hover:text-emerald-900 font-black bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            title="Install Android App or Download .APK Package"
          >
            📱 Android APK / App
          </button>
          <span>•</span>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="text-amber-800 hover:text-amber-950 font-black bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl transition-colors cursor-pointer"
          >
            Developed by J.E.F.M.S TEAM
          </button>
          <span>•</span>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-slate-800 font-bold"
          >
            Settings
          </button>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {isStudentLoginOpen && (
        <StudentLoginModal
          students={students}
          activeStudentId={activeStudent.id}
          onSelectStudent={handleSelectActiveStudent}
          onRegisterStudent={handleRegisterStudent}
          onClose={() => setIsStudentLoginOpen(false)}
        />
      )}
      {lastGameResult && (
        <GameResultModal
          result={lastGameResult.result}
          newBadges={lastGameResult.newBadges}
          leveledUp={lastGameResult.leveledUp}
          newLevel={activeStudent.level}
          onPlayAgain={() => {
            setLastGameResult(null);
            if (activeGameId) {
              handleStartGame(activeGameId, activeGameDifficulty, activeGameTopic);
            }
          }}
          onGoHome={() => {
            setLastGameResult(null);
            setCurrentView('home');
          }}
          onNextGame={() => {
            setLastGameResult(null);
            setCurrentView('games');
          }}
          onViewProgress={() => {
            setLastGameResult(null);
            setCurrentView('profile');
          }}
        />
      )}

      {isAiTutorOpen && (
        <AiTutorModal
          currentGrade={currentGrade}
          initialQuestion={aiTutorInitialPrompt.question}
          studentAnswer={aiTutorInitialPrompt.studentAnswer}
          onClose={() => setIsAiTutorOpen(false)}
        />
      )}

      {certificateData && (
        <CertificateModal
          studentName={certificateData.studentName}
          grade={certificateData.grade}
          onClose={() => setCertificateData(null)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={s => {
            setSettings(s);
            saveStoredSettings(s);
          }}
          onResetAllData={handleResetAll}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isAboutOpen && (
        <AboutModal
          onClose={() => setIsAboutOpen(false)}
        />
      )}

      {/* Android APK & Mobile App Installation Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* PWA Offline Network Indicator */}
      <OfflineIndicator />
    </div>
  );
}
