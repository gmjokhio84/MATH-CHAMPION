import React from 'react';
import { X, Sparkles, Heart, Award, BookOpen, ShieldCheck, CheckCircle2, Phone, MessageCircle, Box } from 'lucide-react';
import { ASSETS_3D, DEVELOPER_INFO } from '../assets/images';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-[36px] max-w-xl w-full p-6 sm:p-8 border-b-8 border-blue-600 shadow-2xl relative space-y-5 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm shrink-0">
            <img
              src={ASSETS_3D.trophy}
              alt="MATH CHAMPIONS 3D Trophy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-black text-slate-800">
              MATH CHAMPIONS
            </h2>
            <p className="text-xs font-black text-blue-600">
              “Play • Learn • Practice • Master Maths”
            </p>
          </div>
        </div>

        {/* 3D Graphics Banner & Vision */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-sm bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-yellow-400/80 shrink-0 shadow-md">
              <img
                src={ASSETS_3D.mascot}
                alt="3D Math Champion Hero"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-yellow-300 text-[11px] font-black uppercase tracking-wider">
                <Box className="w-3.5 h-3.5" />
                <span>Photorealistic 3D Graphics &amp; Environments</span>
              </div>
              <p className="text-xs font-bold text-indigo-100 mt-0.5 leading-relaxed">
                Featuring cinematic 3D floating mathematics academies, ray-traced geometric arenas, and high-fidelity student champion avatars.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Objective */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-bold leading-relaxed bg-blue-50/60 p-4 rounded-2xl border-2 border-blue-100">
          <p>
            <strong>MATH CHAMPIONS</strong> is an interactive mathematics learning and gaming ecosystem designed specifically for primary school students in <strong>Grades 1 through 5 (Ages 5–11)</strong>.
          </p>
          <p>
            It turns abstract numbers into joyful exploration through 12 dynamic games, daily quests, realistic Pakistani Rupee shopping, visual geometry, and encouraging AI assistance.
          </p>
        </div>

        {/* Key Features Bullet List */}
        <div className="space-y-2 text-xs font-bold text-slate-700">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Key Platform Highlights
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-slate-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Cinematic 3D Visuals &amp; Realms</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-slate-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>12 Dedicated Math Games</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-slate-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pakistani Currency (Rs.)</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-slate-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Students Login &amp; Switch</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-slate-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Questie AI Step-by-Step Tutor</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border-2 border-slate-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Printable Certificates</span>
            </div>
          </div>
        </div>

        {/* Developer Credit & Official Contact Card */}
        <div className="pt-4 border-t-2 border-slate-100 space-y-3">
          <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">Lead Developer &amp; Creators</span>
              <div className="font-heading font-black text-sm sm:text-base text-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <span>{DEVELOPER_INFO.leadDeveloper}</span>
                <span className="text-slate-400 font-normal">and</span>
                <span className="text-blue-700">{DEVELOPER_INFO.team}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-black text-slate-600 mt-1">
                <span className="text-slate-400">Direct Contact:</span>
                <a
                  href={`tel:${DEVELOPER_INFO.contactNumber}`}
                  className="text-emerald-700 hover:text-emerald-800 underline decoration-emerald-400 font-extrabold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{DEVELOPER_INFO.contactNumber}</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${DEVELOPER_INFO.contactNumber}`}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors"
                title="Call Developer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/92${DEVELOPER_INFO.contactNumber.slice(1)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors"
                title="WhatsApp Developer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold">
              MATH CHAMPIONS • Interactive Primary Mathematics
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black text-xs rounded-2xl shadow-sm transition-all cursor-pointer active:translate-y-0.5"
            >
              Got it, Let's Play!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
