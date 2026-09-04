import React from 'react';

// 1. Analog Clock SVG
export const AnalogClockVisual: React.FC<{ hours: number; minutes: number }> = ({ hours, minutes }) => {
  // Minute hand angle: 360 deg / 60 mins = 6 deg/min
  const minuteAngle = minutes * 6;
  // Hour hand angle: 360 deg / 12 hours = 30 deg/hour + (minutes / 60) * 30 deg
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-amber-50/50 rounded-2xl border border-amber-200">
      <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-sm">
        {/* Clock Face Rim */}
        <circle cx="100" cy="100" r="95" fill="#ffffff" stroke="#f59e0b" strokeWidth="8" />
        <circle cx="100" cy="100" r="88" fill="#fefce8" stroke="#cbd5e1" strokeWidth="2" />

        {/* 12 Hour Numbers */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = 100 + 70 * Math.cos(angle);
          const y = 100 + 70 * Math.sin(angle);
          return (
            <text
              key={num}
              x={x}
              y={y + 5}
              textAnchor="middle"
              className="text-sm font-extrabold fill-slate-700 font-sans"
            >
              {num}
            </text>
          );
        })}

        {/* Minute ticks */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 100 + 82 * Math.cos(angle);
          const y1 = 100 + 82 * Math.sin(angle);
          const x2 = 100 + 86 * Math.cos(angle);
          const y2 = 100 + 86 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.5" />;
        })}

        {/* Hour Hand (shorter, thicker) */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="55"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 100 100)`}
        />

        {/* Minute Hand (longer, distinct blue/amber) */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 100 100)`}
        />

        {/* Center Pin */}
        <circle cx="100" cy="100" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
      </svg>
      <span className="text-[11px] font-bold text-amber-900 mt-2">
        Blue hand = Minutes • Dark hand = Hours
      </span>
    </div>
  );
};

// 2. Visual Fraction Pizza / Pie
export const FractionPieVisual: React.FC<{ total: number; shaded: number }> = ({ total, shaded }) => {
  const slices = [];
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const sliceAngle = 360 / total;

  for (let i = 0; i < total; i++) {
    const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const isShaded = i < shaded;

    slices.push(
      <path
        key={i}
        d={pathData}
        fill={isShaded ? '#f59e0b' : '#f8fafc'}
        stroke="#d97706"
        strokeWidth="2.5"
        className="transition-colors"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-2xl border border-amber-200">
      <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-xs">
        <circle cx={cx} cy={cy} r={radius + 4} fill="#fef3c7" stroke="#b45309" strokeWidth="3" />
        {slices}
      </svg>
      <span className="text-xs font-extrabold text-amber-900 mt-2">
        {shaded} parts shaded out of {total} total parts
      </span>
    </div>
  );
};

// 3. Shape Visualizer
export const ShapeVisual: React.FC<{ shape: string }> = ({ shape }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
      <svg width="160" height="160" viewBox="0 0 200 200">
        {shape === 'circle' && (
          <circle cx="100" cy="100" r="70" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
        )}
        {shape === 'square' && (
          <rect x="40" y="40" width="120" height="120" rx="8" fill="#a855f7" stroke="#7e22ce" strokeWidth="6" />
        )}
        {shape === 'rectangle' && (
          <rect x="25" y="55" width="150" height="90" rx="8" fill="#10b981" stroke="#047857" strokeWidth="6" />
        )}
        {shape === 'triangle' && (
          <polygon points="100,30 170,160 30,160" fill="#f59e0b" stroke="#d97706" strokeWidth="6" strokeLinejoin="round" />
        )}
        {shape === 'pentagon' && (
          <polygon points="100,25 175,80 145,165 55,165 25,80" fill="#ec4899" stroke="#be185d" strokeWidth="6" strokeLinejoin="round" />
        )}
        {shape === 'hexagon' && (
          <polygon points="100,25 165,65 165,135 100,175 35,135 35,65" fill="#6366f1" stroke="#4338ca" strokeWidth="6" strokeLinejoin="round" />
        )}
        {shape === 'octagon' && (
          <polygon points="65,25 135,25 175,65 175,135 135,175 65,175 25,135 25,65" fill="#f97316" stroke="#c2410c" strokeWidth="6" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};

// 4. Pakistani Rupee Note Card Visual
export const PakistaniCurrencyVisual: React.FC<{ rupeeNotes?: number[]; itemPrice?: number; paidAmount?: number }> = ({
  rupeeNotes,
  itemPrice,
  paidAmount,
}) => {
  const noteColors: Record<number, { bg: string; border: string; text: string }> = {
    10: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-900' },
    20: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-900' },
    50: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-900' },
    100: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-900' },
    500: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-900' },
    1000: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-900' },
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
      {rupeeNotes && rupeeNotes.map((val, idx) => {
        const c = noteColors[val] || { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-900' };
        return (
          <div
            key={idx}
            className={`w-32 h-16 ${c.bg} border-2 ${c.border} rounded-xl shadow-xs flex flex-col justify-between p-2 transform hover:scale-105 transition-transform`}
          >
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500">
              <span>State Bank</span>
              <span>Rs. {val}</span>
            </div>
            <div className={`text-center font-heading font-extrabold text-xl ${c.text}`}>
              Rs. {val}
            </div>
            <div className="text-[9px] font-bold text-slate-400 text-right">
              Rupees
            </div>
          </div>
        );
      })}

      {itemPrice !== undefined && paidAmount !== undefined && (
        <div className="flex items-center gap-4 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-emerald-300">
          <div>
            <span className="text-slate-400 block text-[10px]">Cash Paid:</span>
            <span className="text-emerald-700 font-extrabold text-sm">Rs. {paidAmount}</span>
          </div>
          <span className="text-slate-300 text-lg">−</span>
          <div>
            <span className="text-slate-400 block text-[10px]">Item Cost:</span>
            <span className="text-rose-600 font-extrabold text-sm">Rs. {itemPrice}</span>
          </div>
          <span className="text-slate-300 text-lg">=</span>
          <div>
            <span className="text-slate-400 block text-[10px]">Change Due:</span>
            <span className="text-blue-600 font-extrabold text-sm">Rs. ?</span>
          </div>
        </div>
      )}
    </div>
  );
};
