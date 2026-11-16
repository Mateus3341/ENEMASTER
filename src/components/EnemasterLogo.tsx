import React from 'react';

export interface EnemasterLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'compact' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
  dark?: boolean;
}

export const ENEMASTER_LOGO_SRC = '/assets/aistudio/Gemini_Generated_Image_xpiiawxpiiawxpii_7fe8fdf9.png';

/**
 * Official ENEMASTER Logo Component
 * Renders the updated official ENEMASTER emblem (Owl + Graduation Cap + Ascending Arrow + Golden Star)
 * with official typography: "ENEMASTER" and slogan "ESCREVA. CORRIJA. EVOLUA."
 */
export const EnemasterLogoIcon: React.FC<{ className?: string; size?: number | string }> = ({ 
  className = '', 
  size = 44
}) => {
  const hasExplicitSizeClass = /\b(w-\d+|h-\d+|size-\d+|w-full|h-full)\b/.test(className);
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const sizeStyle = hasExplicitSizeClass
    ? undefined
    : { width: pixelSize, height: pixelSize, minWidth: pixelSize, minHeight: pixelSize };

  return (
    <img
      src={ENEMASTER_LOGO_SRC}
      alt="Logo ENEMASTER"
      style={sizeStyle}
      aria-label="Enemaster Logo Icon"
      className={`shrink-0 object-contain object-center self-center select-none pointer-events-none block ${className}`}
      loading="eager"
      decoding="async"
    />
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
          <div className="flex items-center leading-none tracking-tight">
            <span className="font-black text-slate-900 dark:text-white text-sm">ENE</span>
            <span className="font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,#0f172a_0%,#0f172a_50%,#4f46e5_50%,#6366f1_100%)] dark:bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_50%,#22d3ee_50%,#67e8f9_100%)] text-sm">M</span>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-cyan-300 dark:to-indigo-300 text-sm">ASTER</span>
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
          <span className="font-black">ENE</span>
          <span className="font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,#020617_0%,#020617_50%,#4f46e5_50%,#6366f1_100%)] dark:bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_50%,#22d3ee_50%,#67e8f9_100%)]">M</span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-cyan-300 dark:to-indigo-300">ASTER</span>
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
          <span className="font-black text-slate-950 dark:text-white">ENE</span>
          <span className="font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,#020617_0%,#020617_50%,#4f46e5_50%,#6366f1_100%)] dark:bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_50%,#22d3ee_50%,#67e8f9_100%)]">M</span>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-cyan-300 dark:to-indigo-300">ASTER</span>
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
