import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Layers
} from 'lucide-react';
import { ASSETS_3D, DEVELOPER_INFO } from '../assets/images';
import { soundManager } from '../utils/audio';
import { usePWAInstall } from '../utils/usePWAInstall';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isAndroid, isIOS } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant' | 'standalone'>('instant');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const bubblewrapCommand = `# Option 1: Generate Android APK directly using Bubblewrap CLI (TWA)
npx @bubblewrap/cli init --manifest=https://${window.location.host}/manifest.webmanifest
npx @bubblewrap/cli build
# Output: math-champions-release-signed.apk`;

  const capacitorCommand = `# Option 2: Build Standalone APK using Capacitor & Android Studio
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "MATH CHAMPIONS" com.jefms.mathchampions --web-dir dist
npm run build
npx cap add android
npx cap open android
# In Android Studio: Click Build > Build Bundle(s) / APK(s) > Build APK(s)`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    soundManager.playCorrect();
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handle1ClickInstall = async () => {
    soundManager.playPop();
    const success = await install();
    if (success) {
      soundManager.playFanfare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-[36px] shadow-2xl border-4 border-blue-900/20 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with 3D Mascot & Brand */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-lg bg-indigo-950 shrink-0">
              <img
                src={ASSETS_3D.mascot}
                alt="3D Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Android APK &amp; Mobile App
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-black">
                  v1.2 Mobile Ready
                </span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white mt-1">
                MATH CHAMPIONS Mobile App (.APK)
              </h2>
              <p className="text-xs text-blue-200 font-bold">
                Install as a native Android app on your phone, tablet, or export standalone .APK
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2 mt-5 bg-black/30 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                soundManager.playPop();
                setActiveTab('instant');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'instant'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>1-Click Android App (WebAPK)</span>
            </button>
            <button
              onClick={() => {
                soundManager.playPop();
                setActiveTab('standalone');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'standalone'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Standalone .APK Build Package</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {activeTab === 'instant' && (
            <div className="space-y-5">
              {/* Highlight Card */}
              <div className="p-5 rounded-3xl bg-emerald-50/90 border-2 border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">✓</span>
                    <h3 className="font-heading font-black text-base text-emerald-950">
                      Official Android WebAPK Direct Installation
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                    Android devices (Chrome, Edge, Samsung Internet) automatically generate and install a native signed <strong>.APK package</strong> with real home screen launcher icon, full offline storage, and standalone immersive window!
                  </p>
                </div>

                {isInstallable ? (
                  <button
                    onClick={handle1ClickInstall}
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg border-b-4 border-emerald-800 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    <span>INSTALL ON ANDROID NOW</span>
                  </button>
                ) : isInstalled ? (
                  <span className="px-4 py-2 bg-emerald-200 text-emerald-900 text-xs font-black rounded-xl flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Already Installed!
                  </span>
                ) : null}
              </div>

              {/* Step by Step Manual Guide for Android & Other Browsers */}
              <div className="border-2 border-slate-200 rounded-3xl p-5 bg-slate-50 space-y-3">
                <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  How to Install on Any Android Mobile / Tablet:
                </h4>
                
                <ol className="space-y-2.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
                    <div>
                      <strong className="text-slate-900 block">Open in Google Chrome or Edge on your Android phone</strong>
                      <span className="text-slate-500">Visit this app URL directly in your mobile browser.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
                    <div>
                      <strong className="text-slate-900 block">Tap the 3 dots menu (⋮) in the top-right corner</strong>
                      <span className="text-slate-500">In Google Chrome, tap the upper-right menu icon.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">3</span>
                    <div>
                      <strong className="text-emerald-900 block">Select &quot;Install App&quot; or &quot;Add to Home screen&quot;</strong>
                      <span className="text-slate-500">Google Play Services will verify and install the <strong>MATH CHAMPIONS .apk</strong> directly onto your device with the official 3D trophy icon!</span>
                    </div>
                  </li>
                </ol>
              </div>

              {/* App Features grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-xs font-black text-slate-800 block">100% Safe</span>
                  <span className="text-[10px] text-slate-500 font-bold">No root or unknown sources</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs font-black text-slate-800 block">Offline Capable</span>
                  <span className="text-[10px] text-slate-500 font-bold">Plays without internet</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center">
                  <Layers className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs font-black text-slate-800 block">Full Screen</span>
                  <span className="text-[10px] text-slate-500 font-bold">No URL bar distraction</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <Smartphone className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-black text-slate-800 block">Fast 60 FPS</span>
                  <span className="text-[10px] text-slate-500 font-bold">Hardware accelerated</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'standalone' && (
            <div className="space-y-5">
              <div className="p-4 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-indigo-950 text-xs font-bold leading-relaxed">
                Want a physical <strong>.APK file</strong> to distribute directly or upload to the Google Play Store? We have already bundled the complete Android configuration (`capacitor.config.json` and `manifest.webmanifest`). Choose your preferred method below:
              </div>

              {/* Method 1: Bubblewrap CLI */}
              <div className="border-2 border-slate-200 rounded-3xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-400 text-slate-900 rounded-lg text-xs font-black">Method 1</span>
                    <h4 className="font-heading font-black text-sm text-slate-900">
                      Bubblewrap CLI (Instant Standalone .APK in 2 Minutes)
                    </h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bubblewrapCommand, 'bubblewrap')}
                    className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
                  >
                    {copiedCode === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'bubblewrap' ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {bubblewrapCommand}
                </pre>
                <p className="text-[11px] text-slate-500 font-bold">
                  Bubblewrap packages the PWA directly into an Android Studio project and generates signed `.apk` and `.aab` (Android App Bundle) packages automatically.
                </p>
              </div>

              {/* Method 2: Capacitor */}
              <div className="border-2 border-slate-200 rounded-3xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-black">Method 2</span>
                    <h4 className="font-heading font-black text-sm text-slate-900">
                      Capacitor / Android Studio Native APK
                    </h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(capacitorCommand, 'capacitor')}
                    className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
                  >
                    {copiedCode === 'capacitor' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'capacitor' ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-cyan-300 p-3.5 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {capacitorCommand}
                </pre>
                <p className="text-[11px] text-slate-500 font-bold">
                  After exporting this project via Settings &gt; Export to ZIP/GitHub, run these commands to build debug and release `.apk` files inside Android Studio.
                </p>
              </div>
            </div>
          )}

          {/* Developer Attribution & Contact Help Card */}
          <div className="p-4 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-slate-800">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-xs font-black text-yellow-300 flex items-center justify-center sm:justify-start gap-1.5">
                <span>Developer Assistance for APK &amp; Deployment:</span>
              </div>
              <div className="text-sm font-black text-white">
                {DEVELOPER_INFO.leadDeveloper} • {DEVELOPER_INFO.team}
              </div>
              <div className="text-xs text-slate-400 font-bold">
                Phone / WhatsApp: <strong className="text-emerald-400">{DEVELOPER_INFO.contactNumber}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${DEVELOPER_INFO.contactNumber}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/92${DEVELOPER_INFO.contactNumber.slice(1)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t-2 border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-500">
            Package Name: <strong className="text-slate-800 font-mono">com.jefms.mathchampions</strong>
          </span>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
