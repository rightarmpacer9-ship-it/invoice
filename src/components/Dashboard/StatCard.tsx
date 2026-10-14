import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  colorClass: string;
  bgLightClass: string;
  accentGradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  colorClass,
  bgLightClass,
  accentGradient,
}) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-orange-200/60 p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 group relative overflow-hidden">
      {/* Subtle top ambient glow */}
      {accentGradient && (
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentGradient}`} />
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-display">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgLightClass} ${colorClass} shadow-xs transition-transform duration-200 group-hover:scale-105`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-extrabold tracking-tight text-stone-900 font-mono tabular-nums">
          {value}
        </h3>
        {subtext && <p className="text-xs text-stone-500 mt-1 font-medium">{subtext}</p>}
      </div>
    </div>
  );
};
