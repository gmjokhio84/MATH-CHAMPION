import React from 'react';
import { Volume2, VolumeX, Globe, Eye, Type, RotateCcw, X, ShieldAlert } from 'lucide-react';
import { AppSettings } from '../types';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetAllData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onClose,
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    soundManager.setSoundEnabled(next);
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const toggleMusic = () => {
    const next = !settings.musicEnabled;
    soundManager.setMusicEnabled(next);
    onUpdateSettings({ ...settings, musicEnabled: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-7 border-b-8 border-slate-300 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-100">
          <h3 className="font-heading text-xl font-black text-slate-800">
            Application Settings
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Audio & Sound Effects
          </span>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/50 border-2 border-blue-100">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-slate-700">Sound Effects</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/50 border-2 border-blue-100">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-slate-700">Background Synth Music</span>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.musicEnabled ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Language / زبان / ٻولي
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'en', label: 'English' },
              { id: 'ur', label: 'اردو (Urdu)' },
              { id: 'sd', label: 'سنڌي (Sindhi)' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => onUpdateSettings({ ...settings, language: lang.id as any })}
                className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer active:translate-y-0.5 ${
                  settings.language === lang.id
                    ? 'bg-yellow-400 text-yellow-950 border-b-4 border-yellow-600 shadow-sm'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Toggles */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Child Accessibility
          </span>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-xs font-black text-slate-700">
            <span>High Contrast Visuals</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={e => onUpdateSettings({ ...settings, highContrast: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-xs font-black text-slate-700">
            <span>Large Text Display</span>
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={e => onUpdateSettings({ ...settings, largeText: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Reset Progress */}
        <div className="pt-2 border-t-2 border-slate-100">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo student progress and scores?')) {
                onResetAllData();
              }
            }}
            className="w-full py-3 rounded-2xl border-b-4 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Progress & Scores</span>
          </button>
        </div>
      </div>
    </div>
  );
};
