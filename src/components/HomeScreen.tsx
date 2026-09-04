import React, { useState } from 'react';
import { Sparkles, Flame, Play, Trophy, ArrowRight, BookOpen, Star, Target, Zap, ShieldAlert, Award, UserCheck, Crown, Box, Eye, Layers, Phone, MessageCircle, Smartphone, Download } from 'lucide-react';
import { GradeNumber, Student } from '../types';
import { AVATARS, BADGES, LEVELS, TOPICS_DATA } from '../data/initialData';
import { soundManager } from '../utils/audio';
import { ASSETS_3D, DEVELOPER_INFO } from '../assets/images';

interface HomeScreenProps {
  currentGrade: GradeNumber;
  activeStudent: Student;
  onNavigate: (view: string) => void;
  onSelectGame: (gameId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onStartDailyChallenge: () => void;
  dailyCompleted: boolean;
  onOpenStudentLogin?: () => void;
  onOpenApkModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentGrade,
  activeStudent,
  onNavigate,
  onSelectGame,
  onSelectTopic,
  onStartDailyChallenge,
  dailyCompleted,
  onOpenStudentLogin,
  onOpenApkModal,
}) => {
  const [selected3DEnv, setSelected3DEnv] = useState<'observatory' | 'academy' | 'trophy' | 'mascot'>('observatory');
  const [cameraAngle, setCameraAngle] = useState<'cinematic' | 'orbit' | 'isometric'>('cinematic');

  const avatar = AVATARS.find(a => a.id === activeStudent?.avatarId) || AVATARS[0];
  const currentLevelInfo = LEVELS.find(l => l.level === (activeStudent?.level || 1)) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === (activeStudent?.level || 1) + 1);

  // Daily target calculation (e.g. 500 XP daily goal)
  const dailyGoal = 500;
  const currentDailyXp = Math.min(dailyGoal, ((activeStudent?.xp || 0) % 500) + 150);
  const dailyPercent = Math.min(100, Math.round((currentDailyXp / dailyGoal) * 100));

  // Topics for current grade
  const gradeTopics = TOPICS_DATA.filter(t => t.grades.includes(currentGrade));

  // Quick games list
  const quickGames = [
    { id: 'number_blast', title: 'Number Blast', icon: '💥', desc: 'Find greater or smaller numbers', color: 'from-amber-400 to-orange-500' },
    { id: 'addition_attack', title: 'Addition Attack', icon: '⚡', desc: 'Fast timed sums with bonus XP', color: 'from-emerald-400 to-teal-600' },
    { id: 'multiplication_race', title: 'Multiplication Race', icon: '🏎️', desc: 'Speed through times tables', color: 'from-violet-500 to-indigo-600' },
    { id: 'fraction_match', title: 'Fraction Match', icon: '🍕', desc: 'Visual pizza & parts matching', color: 'from-pink-400 to-rose-600' },
  ];

  const envData = {
    observatory: {
      title: 'Cosmic Mathematics Observatory',
      desc: 'Realistic 3D environment with holographic celestial geometry, glass dome observatory, and floating formulas.',
      badge: 'Realistic 3D Environment',
      img: ASSETS_3D.realmEnv,
      gameId: 'geometry_dash',
    },
    academy: {
      title: 'Floating Sky Mathematics Academy',
      desc: 'Cinematic 3D render of a futuristic floating island kingdom with golden arches, ray-traced water reflections, and volumetric sunset light.',
      badge: 'Cinematic 3D Visual',
      img: ASSETS_3D.heroBg,
      gameId: 'addition_attack',
    },
    trophy: {
      title: 'Grand Champion 3D Trophy Sanctum',
      desc: 'Photorealistic 3D rendered golden master trophy with embedded gems, reflective obsidian pedestal, and studio caustics.',
      badge: 'High-Quality 3D Render',
      img: ASSETS_3D.trophy,
      gameId: 'championship',
    },
    mascot: {
      title: '3D Math Champion Mascot Hero',
      desc: 'High-fidelity 3D character explorer equipped with aviator goggles and glowing mathematical crystal.',
      badge: '3D Character Model',
      img: ASSETS_3D.mascot,
      gameId: 'boss_battle',
    },
  };

  const currentEnv = envData[selected3DEnv];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Welcome Hero & Today's Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Quest Card (Immersive 3D Photorealistic UI Hero) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 text-white shadow-2xl border-b-8 border-indigo-950 flex flex-col justify-between bg-slate-900 min-h-[320px]">
          {/* Photorealistic 3D Background Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src={ASSETS_3D.heroBg}
              alt="Cinematic 3D Mathematics Academy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition-transform duration-1000"
            />
            {/* Cinematic Gradient Vignette & Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-indigo-950/85 to-purple-950/75" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-yellow-400 text-yellow-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-yellow-950" />
                  MATH CHAMPIONS
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest border border-white/20 flex items-center gap-1">
                  <Box className="w-3 h-3 text-cyan-300" />
                  Photorealistic 3D
                </span>
                <span className="bg-yellow-400/20 text-yellow-200 text-xs font-black px-3 py-1 rounded-full border border-yellow-300/30">
                  Level {activeStudent.level}: {currentLevelInfo.title}
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                Hello, {activeStudent.name}! 👋
              </h1>

              <p className="text-indigo-100 text-sm sm:text-base font-bold leading-relaxed drop-shadow-xs">
                Welcome to <strong>MATH CHAMPIONS</strong>! Explore realistic 3D environments, solve challenges, earn stars, and master Grade {currentGrade} maths.
              </p>

              {/* Action Buttons with 3D tactile buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  id="home-quick-play-btn"
                  onClick={() => {
                    soundManager.playPop();
                    onSelectGame('addition_attack');
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black text-sm sm:text-base px-7 py-3 rounded-2xl border-b-4 border-yellow-600 transition-all shadow-md active:translate-y-1 active:border-b-2 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-yellow-950" />
                  PLAY QUICK MATHS
                </button>

                <button
                  id="home-daily-btn"
                  onClick={() => {
                    soundManager.playPop();
                    onStartDailyChallenge();
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-black text-sm sm:text-base px-6 py-3 rounded-2xl border-2 border-white/40 border-b-4 transition-all active:translate-y-1 flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  {dailyCompleted ? 'Daily Completed ✅' : 'Daily Challenge'}
                </button>

                {onOpenStudentLogin && (
                  <button
                    onClick={() => {
                      soundManager.playPop();
                      onOpenStudentLogin();
                    }}
                    className="bg-purple-600/90 hover:bg-purple-600 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-purple-300/50 border-b-4 transition-all active:translate-y-1 flex items-center gap-1.5 cursor-pointer shadow-md"
                    title="Switch Champion Account or Login"
                  >
                    <UserCheck className="w-4 h-4 text-yellow-300" />
                    <span>Switch Student</span>
                  </button>
                )}
              </div>
            </div>

            {/* Floating 3D Mascot Emblem on right side of Hero Card */}
            <div className="relative group hidden sm:flex flex-col items-center shrink-0">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-yellow-400/90 shadow-2xl bg-indigo-900/60 backdrop-blur-md transform group-hover:scale-105 transition-transform">
                <img
                  src={ASSETS_3D.mascot}
                  alt="3D Math Champion Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 inset-x-0 text-center text-[10px] font-black text-yellow-300 uppercase tracking-wider">
                  3D Champion
                </span>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs font-black text-yellow-300 drop-shadow-sm flex items-center gap-1 justify-center">
                  <Star className="w-3.5 h-3.5 fill-yellow-300" />
                  {activeStudent.stars} Stars Earned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Progress Column Card with 3D Trophy */}
        <div className="bg-white rounded-[32px] p-6 border-b-4 border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Level {activeStudent.level} Progress
              </span>
              <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {activeStudent.accuracy}% Accuracy
              </span>
            </div>

            {/* 3D Trophy Showcase Banner inside stats */}
            <div className="mt-3 p-2.5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs shrink-0">
                <img
                  src={ASSETS_3D.trophy}
                  alt="3D Gold Trophy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                  Championship Master
                </span>
                <span className="text-xs font-black text-slate-800 truncate block">
                  {currentLevelInfo.title}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-amber-600 block">Grade {currentGrade}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <h3 className="font-heading text-xl font-black text-slate-800">
                {activeStudent.xp} <span className="text-xs text-slate-400 font-bold">/ {nextLevelInfo ? nextLevelInfo.minXp : 10000} XP</span>
              </h3>
              <span className="text-xs font-black text-blue-600">{currentLevelInfo.title}</span>
            </div>

            {/* Immersive XP progress bar with yellow marker bead */}
            <div className="w-full h-7 bg-slate-100 rounded-2xl my-3 p-1 border border-slate-200 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl transition-all duration-500 relative"
                style={{ width: `${dailyPercent}%` }}
              >
                <div className="absolute -right-1 -top-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white shadow-xs" />
              </div>
            </div>

            {/* Daily Challenge tactile widget */}
            <div
              onClick={() => {
                soundManager.playPop();
                onStartDailyChallenge();
              }}
              className="flex items-center gap-3.5 bg-orange-50/70 hover:bg-orange-100/70 p-3.5 rounded-2xl border-2 border-orange-200 border-b-4 transition-all cursor-pointer mt-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-xs">
                🔥
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-slate-800">Daily Math Sprint</div>
                <div className="text-[11px] font-bold text-orange-600">
                  {dailyCompleted ? 'Completed for today!' : '5 Questions • +150 XP bonus'}
                </div>
              </div>
              <span className="text-sm font-black text-orange-600">
                {dailyCompleted ? '✅' : 'GO →'}
              </span>
            </div>

            {/* Stats Counter Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase">Solved</div>
                <div className="text-base font-black text-slate-800">{activeStudent?.questionsSolved || 0}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase">Streak</div>
                <div className="text-base font-black text-orange-600 flex items-center justify-center gap-0.5">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  {activeStudent?.streak || 0}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase">Badges</div>
                <div className="text-base font-black text-indigo-600">
                  {(activeStudent?.unlockedBadges || activeStudent?.badges || []).length}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-2xl text-slate-700 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Full Stats &amp; Badges</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NEW: Photorealistic 3D Graphics & Realistic 3D Environments Showcase */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-2xl font-black text-slate-800 flex items-center gap-2">
                <Box className="w-6 h-6 text-indigo-600" />
                Realistic 3D Environments &amp; Cinematic Visuals
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Photorealistic 3D
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold">
              Immerse in high-quality 3D rendered mathematics worlds, sky academies, and cosmic observatories
            </p>
          </div>

          {/* Camera Perspective Angle Toggles */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-black">
            <span className="text-[10px] text-slate-400 px-2 uppercase">Angle:</span>
            {(['cinematic', 'orbit', 'isometric'] as const).map(angle => (
              <button
                key={angle}
                onClick={() => {
                  soundManager.playPop();
                  setCameraAngle(angle);
                }}
                className={`px-3 py-1 rounded-xl capitalize transition-all cursor-pointer ${
                  cameraAngle === angle
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {angle}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Realistic Environment Showcase Stage */}
        <div className="relative overflow-hidden rounded-[36px] bg-slate-950 border-4 border-indigo-900 shadow-xl text-white">
          <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden">
            <img
              src={currentEnv.img}
              alt={currentEnv.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-700 ${
                cameraAngle === 'orbit' ? 'scale-110 rotate-1' : cameraAngle === 'isometric' ? 'scale-105 -rotate-1' : 'scale-100'
              }`}
            />
            {/* Cinematic 3D Lighting & Shading Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Overlay Badges */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-yellow-300 border border-yellow-400/40 text-xs font-black flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentEnv.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-400/40 text-xs font-black hidden sm:flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Ray Tracing &amp; Volumetric Lighting
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-400/40 text-xs font-black">
                8K Octane Quality
              </span>
            </div>

            {/* Bottom Content within Environment */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="max-w-xl space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400 block">
                  3D Virtual Math World
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                  {currentEnv.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-bold leading-relaxed max-w-lg drop-shadow-xs">
                  {currentEnv.desc}
                </p>
              </div>

              <button
                onClick={() => {
                  soundManager.playPop();
                  onSelectGame(currentEnv.gameId);
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-yellow-950 font-black text-sm rounded-2xl border-b-4 border-yellow-700 shadow-lg transition-all active:translate-y-1 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-4 h-4 fill-yellow-950" />
                <span>Enter 3D Maths Realm</span>
              </button>
            </div>
          </div>

          {/* Environment Selector Strip below stage */}
          <div className="bg-slate-900 p-4 border-t-2 border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'observatory', label: 'Cosmic Observatory', icon: '🌌', type: 'Realistic 3D Room' },
              { id: 'academy', label: 'Sky Academy', icon: '🏛️', type: 'Cinematic Landscape' },
              { id: 'trophy', label: '3D Gold Trophy', icon: '🏆', type: 'Photorealistic Model' },
              { id: 'mascot', label: 'Champion Mascot', icon: '🤖', type: '3D Character Model' },
            ].map(env => (
              <button
                key={env.id}
                onClick={() => {
                  soundManager.playPop();
                  setSelected3DEnv(env.id as any);
                }}
                className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  selected3DEnv === env.id
                    ? 'bg-indigo-950/80 border-yellow-400 shadow-md scale-102'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-2xl">{env.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-black truncate ${selected3DEnv === env.id ? 'text-yellow-300' : 'text-white'}`}>
                    {env.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold truncate">{env.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Android APK & Mobile App Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-5 sm:p-6 text-white shadow-xl border-4 border-blue-900/40 card-float-3d-2">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shrink-0 border-2 border-emerald-300">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Android APK Ready
                </span>
                <span className="text-yellow-400 text-xs font-bold">1-Click Install or Export Package</span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-black text-white mt-0.5">
                Install MATH CHAMPIONS App on Android
              </h3>
              <p className="text-xs text-blue-200 font-bold">
                Play offline with full-screen experience on phones and tablets. Export standalone .APK or install directly.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              if (onOpenApkModal) onOpenApkModal();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 active:scale-95 text-slate-950 text-xs font-black shadow-lg border-b-4 border-amber-600 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>GET ANDROID .APK / APP</span>
          </button>
        </div>
      </div>

      {/* Special Highlights: Boss Battle & Math Championship */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Boss Battle Card */}
        <div
          onClick={() => {
            soundManager.playPop();
            onSelectGame('boss_battle');
          }}
          className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 rounded-[32px] p-6 text-white shadow-xl border-b-6 border-indigo-950 transition-all dof-card-special card-float-3d-1"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/40 text-purple-200 rounded-full text-xs font-black backdrop-blur-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
                Special Mode • 3D Spatial
              </div>
              <h3 className="font-heading text-2xl font-black group-hover:text-yellow-300 transition-colors">
                Defeat the Math Boss 👾
              </h3>
              <p className="text-xs text-purple-200 font-bold">10 intense questions against the clock. Win 500 XP &amp; Boss Slayer badge!</p>
            </div>
            <span className="text-5xl group-hover:scale-110 transition-transform">⚔️</span>
          </div>
        </div>

        {/* Championship Card */}
        <div
          onClick={() => {
            soundManager.playPop();
            onSelectGame('championship');
          }}
          className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 rounded-[32px] p-6 text-white shadow-xl border-b-6 border-amber-800 transition-all dof-card-special card-float-3d-3"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/40 text-yellow-100 rounded-full text-xs font-black backdrop-blur-sm">
                <Trophy className="w-3.5 h-3.5 text-yellow-200" />
                Grade {currentGrade} Grand Finale
              </div>
              <h3 className="font-heading text-2xl font-black group-hover:text-yellow-200 transition-colors">
                Math Championship 👑
              </h3>
              <p className="text-xs text-yellow-100 font-bold">25 comprehensive syllabus questions. Earn your Official Master Certificate!</p>
            </div>
            <span className="text-5xl group-hover:scale-110 transition-transform">🏆</span>
          </div>
        </div>
      </div>

      {/* Popular Math Games (Immersive UI tactile card design with floating animation & depth of field blur) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h2 className="font-heading text-2xl font-black text-slate-800">
                Popular Games
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wide">
                <Layers className="w-3 h-3" /> 3D Floating &amp; Depth Blur
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold">Pick an arcade game to master arithmetic, fractions, and logic</p>
          </div>
          <button
            onClick={() => onNavigate('games')}
            className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            See All 12 Games <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickGames.map((game, index) => {
            const floatAnimClass = ['card-float-3d-1', 'card-float-3d-2', 'card-float-3d-3', 'card-float-3d-4'][index % 4];
            return (
              <div
                key={game.id}
                onClick={() => {
                  soundManager.playPop();
                  onSelectGame(game.id);
                }}
                className={`cursor-pointer dof-card ${floatAnimClass} p-6 flex flex-col justify-between group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-18 h-18 rounded-3xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-3xl shadow-md text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    {game.icon}
                  </div>
                  <h3 className="font-heading text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1.5">{game.desc}</p>
                  {/* Mini progress bar matching immersive UI card pattern */}
                  <div className="mt-4 w-full h-2 bg-slate-100/80 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-2/3" />
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-slate-100/90 flex items-center justify-between text-xs font-black text-blue-600">
                  <span>PLAY GAME</span>
                  <Play className="w-4 h-4 fill-blue-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade Syllabus Topics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Grade {currentGrade} Topics
            </h2>
            <p className="text-xs text-slate-500 font-bold">Structured curriculum aligned with primary school mathematics</p>
          </div>
          <button
            onClick={() => onNavigate('topics')}
            className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Explore Syllabus <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {gradeTopics.slice(0, 6).map(topic => (
            <button
              key={topic.id}
              onClick={() => {
                soundManager.playPop();
                onSelectTopic(topic.id);
              }}
              className="bg-white p-4 rounded-[28px] border-2 border-slate-200 border-b-4 hover:border-blue-400 hover:shadow-md text-left transition-all group flex flex-col items-center text-center cursor-pointer active:translate-y-0.5"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{topic.icon}</span>
              <span className="text-xs font-black text-slate-800 leading-tight">{topic.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Official MATH CHAMPIONS Showcase & Developer Attribution with Contact */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-[32px] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-b-8 border-indigo-950 shadow-xl">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md shrink-0">
            <img
              src={ASSETS_3D.trophy}
              alt="3D Trophy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
                MATH CHAMPIONS
              </span>
              <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Release
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 font-bold mt-1">
              Developed by <strong className="text-yellow-300 font-black">{DEVELOPER_INFO.leadDeveloper}</strong> and <strong className="text-cyan-300 font-black">{DEVELOPER_INFO.team}</strong>
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs font-black text-slate-300">
              <span>CONTACT: <strong className="text-emerald-400">{DEVELOPER_INFO.contactNumber}</strong></span>
              <span>•</span>
              <a
                href={`tel:${DEVELOPER_INFO.contactNumber}`}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline decoration-emerald-500"
              >
                <Phone className="w-3 h-3" />
                <span>Call Now</span>
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/92${DEVELOPER_INFO.contactNumber.slice(1)}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:text-green-300 flex items-center gap-1 underline decoration-green-500"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onOpenStudentLogin && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenStudentLogin();
              }}
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black text-xs sm:text-sm rounded-2xl border-b-4 border-yellow-600 shadow-md transition-all active:translate-y-0.5 cursor-pointer flex items-center gap-2 shrink-0"
            >
              <UserCheck className="w-4 h-4 text-yellow-950" />
              <span>Students Login / Switch Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
