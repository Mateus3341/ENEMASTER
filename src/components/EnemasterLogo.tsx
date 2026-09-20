import React from 'react';

export interface EnemasterLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'compact' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
  dark?: boolean;
}

/**
 * Official ENEMASTER Logo Component
 * Renders the vector emblem: Stylized Pen Nib ('E') + Ascending Arrow + Graduation Cap + Golden Star
 * with official typography: "ENEMASTER" and slogan "ESCREVA. CORRIJA. EVOLUA."
 */
export const EnemasterLogoIcon: React.FC<{ className?: string; size?: number | string }> = ({ 
  className = '', 
  size = 40
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg 
      viewBox="0 0 160 160" 
      width={typeof size === 'number' ? size : 40}
      height={typeof size === 'number' ? size : 40}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 block ${className}`}
      style={{ width: pixelSize, height: pixelSize, minWidth: pixelSize, minHeight: pixelSize }}
      aria-label="Enemaster Logo Icon"
    >
      <defs>
        {/* Cap & Pen Primary Royal Gradient */}
        <linearGradient id="em-grad-royal" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="40%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Cap Top Facet Cyan Gradient */}
        <linearGradient id="em-grad-cyan" x1="40" y1="20" x2="120" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Ascending Arrow Gradient */}
        <linearGradient id="em-grad-arrow" x1="90" y1="130" x2="150" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        {/* Gold Star Gradient */}
        <linearGradient id="em-grad-gold" x1="120" y1="25" x2="150" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Pen Nib Dark Metallic Base */}
        <linearGradient id="em-grad-nib" x1="40" y1="120" x2="70" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>
      </defs>

      <g>
        {/* --- GOLD STAR (TOP RIGHT - NOTA 1000 EXCELLENCE) --- */}
        <path
          d="M 136 30 L 138.8 37.5 L 146.5 38 L 140.5 43 L 142.5 50.5 L 136 46 L 129.5 50.5 L 131.5 43 L 125.5 38 L 133.2 37.5 Z"
          fill="url(#em-grad-gold)"
          stroke="#b45309"
          strokeWidth="0.5"
        />

        {/* --- ASCENDING ARROW (RIGHT SIDE - EVOLUÇÃO) --- */}
        <path
          d="M 98 116 L 114 130 L 138 88 L 130 84 L 150 70 L 147 98 L 139 94 L 118 138 L 94 118 Z"
          fill="url(#em-grad-arrow)"
          stroke="#0284c7"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* --- MAIN PEN BARREL & 'E' MONOGRAM --- */}
        {/* Gold inner ribbon contour */}
        <path
          d="M 86 58 C 86 58, 98 66, 98 76 C 98 83, 93 88, 86 86 C 80 84, 80 76, 80 76 Z"
          fill="#f59e0b"
          opacity="0.9"
        />

        {/* Outer Pen Nib Spine */}
        <path
          d="M 76 60 
             C 86 64, 102 74, 98 94 
             C 95 106, 82 118, 70 128
             L 54 114
             C 64 104, 76 94, 76 86
             C 76 80, 70 76, 62 82
             C 56 86, 52 94, 52 102
             L 42 94
             C 42 80, 52 66, 68 60 
             Z"
          fill="url(#em-grad-royal)"
        />

        {/* 'E' Monogram White Cavity Bar */}
        <path
          d="M 60 86 
             L 76 74 
             C 82 70, 86 76, 82 82 
             L 66 94 
             C 62 98, 56 94, 60 86 Z"
          fill="#ffffff"
        />

        {/* Pen Nib Body */}
        <path
          d="M 52 112 
             L 68 126 
             L 54 148 
             L 40 134 
             Z"
          fill="url(#em-grad-nib)"
        />

        {/* Pen Nib Tip (Pointy triangle with slit and breather hole) */}
        <path
          d="M 40 134 L 54 148 L 47 154 L 33 140 Z"
          fill="#0284c7"
        />
        <path
          d="M 33 140 L 41 148"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="43" cy="144" r="2" fill="#38bdf8" />

        {/* Pen Body Light Highlight Edge */}
        <path
          d="M 46 98 C 48 88, 56 74, 68 64"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* --- GRADUATION CAP (MORTARBOARD APEX) --- */}
        {/* Skull Cap Base */}
        <path
          d="M 68 52 C 68 52, 80 62, 94 54 L 94 62 C 80 70, 68 60, 68 60 Z"
          fill="#1e1b4b"
        />

        {/* Diamond Top (Main Cap) */}
        <path
          d="M 80 24 L 118 42 L 80 58 L 44 42 Z"
          fill="url(#em-grad-royal)"
        />

        {/* Diamond Top Highlight (Left facet) */}
        <path
          d="M 80 24 L 118 42 L 80 46 L 44 42 Z"
          fill="url(#em-grad-cyan)"
          opacity="0.95"
        />

        {/* Mortarboard Central Button */}
        <ellipse cx="80" cy="42" rx="3" ry="1.8" fill="#e0f2fe" />

        {/* Tassel Hanging Left */}
        <path
          d="M 80 42 Q 58 46 50 56"
          stroke="#38bdf8"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tassel Fringe Knot */}
        <path
          d="M 48 56 L 53 56 L 54 68 L 47 68 Z"
          fill="#0284c7"
        />
      </g>
    </svg>
  );
};

export const EnemasterLogo: React.FC<EnemasterLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSlogan = true,
  className = '',
  onClick,
  dark
}) => {
  // Size mappings
  const iconSizes = {
    xs: 24,
    sm: 32,
    md: 42,
    lg: 56,
    xl: 72,
    '2xl': 96
  };

  const currentIconSize = iconSizes[size] || 42;

  // Render Icon Only
  if (variant === 'icon') {
    return (
      <div 
        className={`inline-flex items-center justify-center shrink-0 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <EnemasterLogoIcon size={currentIconSize} />
      </div>
    );
  }

  // Render Badge Style
  if (variant === 'badge') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all select-none cursor-pointer ${className}`}
      >
        <EnemasterLogoIcon size={28} />
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span className="font-black text-slate-900 dark:text-white tracking-tight text-sm">ENEM</span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400 tracking-tight text-sm">MASTER</span>
          </div>
          {showSlogan && (
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
              Escreva • Corrija • Evolua
            </span>
          )}
        </div>
      </div>
    );
  }

  // Render Full Stacked (Vertical) Layout
  if (variant === 'full') {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center select-none ${className}`}
      >
        <div className="relative mb-2 transition-transform duration-300 hover:scale-105">
          <EnemasterLogoIcon size={size === 'xl' || size === '2xl' ? 96 : 72} />
        </div>
        <div className="flex items-center tracking-tight text-3xl sm:text-4xl font-black text-slate-950 dark:text-white leading-none">
          <span className="font-black">ENEM</span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-cyan-400 dark:to-indigo-300 ml-1">MASTER</span>
        </div>
        {showSlogan && (
          <p className="mt-1.5 text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 tracking-[0.22em] uppercase">
            ESCREVA • CORRIJA • EVOLUA
          </p>
        )}
      </div>
    );
  }

  // Default: Horizontal Layout
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        <EnemasterLogoIcon size={currentIconSize} />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-tight leading-none text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
          <span className="font-black text-slate-950 dark:text-white">ENEM</span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 dark:from-cyan-400 dark:to-indigo-300 ml-1">MASTER</span>
        </div>
        {showSlogan && (
          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mt-1">
            ESCREVA • CORRIJA • EVOLUA
          </span>
        )}
      </div>
    </div>
  );
};
