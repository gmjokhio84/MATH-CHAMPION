import React from 'react';
import { Award, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { GradeNumber } from '../types';
import { ASSETS_3D, DEVELOPER_INFO } from '../assets/images';

interface CertificateModalProps {
  studentName: string;
  grade: GradeNumber;
  topicOrMilestone?: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  grade,
  topicOrMilestone = 'Primary Mathematics Mastery',
  onClose,
}) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 border-b-8 border-yellow-500 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Certificate Frame */}
        <div id="mathquest-certificate" className="border-8 border-double border-yellow-400 p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-yellow-50/40 via-white to-amber-50/20 text-center relative overflow-hidden">
          {/* Subtle Corner Ornaments */}
          <div className="absolute top-3 left-3 text-yellow-500 text-xl font-serif">✦</div>
          <div className="absolute top-3 right-3 text-yellow-500 text-xl font-serif">✦</div>
          <div className="absolute bottom-3 left-3 text-yellow-500 text-xl font-serif">✦</div>
          <div className="absolute bottom-3 right-3 text-yellow-500 text-xl font-serif">✦</div>

          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-blue-600 font-black text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              MATH CHAMPIONS Primary Mathematics
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              CERTIFICATE OF EXCELLENCE
            </h1>
            <p className="text-xs font-black text-yellow-800 uppercase tracking-wider">
              IN MATHEMATICS MASTERY
            </p>
          </div>

          {/* Body */}
          <div className="my-6 space-y-3">
            <p className="text-xs text-slate-500 font-bold italic">
              This official certificate is proudly awarded to:
            </p>
            <div className="font-heading text-3xl sm:text-4xl font-black text-blue-600 py-1 border-b-4 border-dashed border-yellow-400 max-w-sm mx-auto">
              {studentName}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-1 font-bold">
              For demonstrating exceptional dedication, mathematical problem-solving skills, and academic excellence in <strong>Class {grade} {topicOrMilestone}</strong>.
            </p>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="pt-6 border-t-2 border-yellow-200 grid grid-cols-3 gap-3 items-end text-center">
            <div className="space-y-0.5">
              <div className="font-heading font-black text-[11px] sm:text-xs text-slate-800 pb-1 border-b-2 border-slate-300">
                {DEVELOPER_INFO.leadDeveloper}
              </div>
              <span className="text-[10px] text-blue-700 font-black block">{DEVELOPER_INFO.team}</span>
              <span className="text-[9px] text-slate-500 font-bold block">Contact: {DEVELOPER_INFO.contactNumber}</span>
            </div>

            {/* Official 3D Trophy Gold Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-amber-100">
                <img
                  src={ASSETS_3D.trophy}
                  alt="3D Gold Seal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider text-yellow-900 mt-1">Official 3D Seal</span>
            </div>

            <div className="space-y-0.5">
              <div className="font-heading font-black text-[11px] sm:text-xs text-slate-800 pb-1 border-b-2 border-slate-300">
                {currentDate}
              </div>
              <span className="text-[10px] text-slate-400 font-bold block">Date Awarded</span>
              <span className="text-[9px] text-emerald-600 font-black block">Verified Master</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 font-black text-xs transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 font-black text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:translate-y-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
