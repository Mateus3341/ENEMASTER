import React from 'react';
import { 
  Sparkles, 
  PenTool, 
  Search, 
  GraduationCap, 
  Compass, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  BookMarked,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { EnemasterMascot } from './EnemasterMascot';
import { useAuth } from '../contexts/AuthContext';

interface WelcomeOnboardingCardProps {
  setActiveTab: (tab: string) => void;
  onSelectThemeForCorrection: (theme: string) => void;
}

export const WelcomeOnboardingCard: React.FC<WelcomeOnboardingCardProps> = ({
  setActiveTab,
  onSelectThemeForCorrection
}) => {
  const { user, globalStats, signInGoogle } = useAuth();

  const suggestedThemes = [
    {
      title: "Desafios para o enfrentamento da invisibilidade do trabalho de cuidado no Brasil",
      year: "ENEM 2023",
      category: "Sociedade e Direitos"
    },
    {
      title: "Desafios para a valorização da herança africana no Brasil",
      year: "ENEM 2024",
      category: "Cultura e História"
    },
    {
      title: "Impactos dos algoritmos e da inteligência artificial na formação cívica jovem",
      year: "Inédito 2025",
      category: "Tecnologia e Ética"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-[2.5rem] p-6 sm:p-8 text-white border border-indigo-500/40 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Intro Hero */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Boas-vindas ao ENEM Master 2025</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
              <span>Matriz Oficial INEP</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Sua jornada rumo aos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">1000 Pontos</span> começa aqui!
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed font-normal">
              O ENEM Master é sua central pedagógica completa. Você tem acesso à correção instantânea nas 5 competências, caçador de repertórios socioculturais, criador guiado com parágrafos nota 1000 e chat com o Professor IA.
            </p>
          </div>

          {/* Quick Motivation 3 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                <strong className="block text-white font-bold">Escolha um Tema</strong>
                Selecione uma proposta real ou gere um tema inédito.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                <strong className="block text-white font-bold">Corrija seu Texto</strong>
                Cole seu rascunho ou tire foto da folha manuscrita.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                <strong className="block text-white font-bold">Evolua por Critério</strong>
                Receba diagnóstico das C1-C5 e conquiste medalhas!
              </p>
            </div>
          </div>
        </div>

        {/* Right CTA Mascot Box */}
        <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col items-center text-center shrink-0 space-y-4">
          <div className="p-2 rounded-2xl bg-white/10 shadow-inner">
            <EnemasterMascot size="lg" variant="hero" mood="scholar" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-white text-base">Pronto para o 1º Rascunho?</h4>
            <p className="text-xs text-indigo-200">
              Mestre Corujito está pronto para auditar seu texto nas 5 competências.
            </p>
          </div>

          <div className="w-full space-y-2">
            <button
              id="onboarding-correct-first-essay-btn"
              type="button"
              onClick={() => setActiveTab('correction')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <PenTool className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Corrigir Minha 1ª Redação</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="onboarding-create-assistant-btn"
              type="button"
              onClick={() => setActiveTab('creation')}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Montar Rascunho com o Criador</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Themes Carousel / List */}
      <div className="mt-7 pt-6 border-t border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Sugestões de Temas para Começar Agora:</span>
          </div>
          <button
            onClick={() => setActiveTab('themes')}
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Ver banco completo com 100+ temas</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestedThemes.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectThemeForCorrection(item.title)}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-cyan-300">{item.year}</span>
                  <span className="text-slate-400">{item.category}</span>
                </div>
                <p className="text-xs font-semibold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                  {item.title}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-indigo-300 group-hover:text-emerald-300">
                <span>Escrever sobre este tema</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
