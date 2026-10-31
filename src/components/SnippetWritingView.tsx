import React, { useState, useEffect, useRef } from 'react';
import {
  FileEdit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Check,
  Copy,
  Lightbulb,
  PenTool,
  ChevronDown,
  ChevronUp,
  History,
  Quote,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useSavedWork, PersistedSnippetTheme } from '../contexts/SavedWorkContext';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';
import { HISTORICAL_THEMES } from '../data/officialData';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';

export type SnippetSectionType = 'introducao' | 'desenvolvimento_1' | 'desenvolvimento_2' | 'conclusao';

export interface ArgumentBase {
  thesis: string;
  arg1: string;
  arg2: string;
}

export interface SnippetThemePreset {
  year?: string;
  theme: string;
  axis: string;
  argumentBase: ArgumentBase;
}

export interface ActiveCompetencyEval {
  code: string;
  name: string;
  score: number;
  evaluatorAScore?: number;
  evaluatorBScore?: number;
  level?: number;
  levelTitle?: string;
  evidenceQuote?: string;
  scoreJustification?: string;
  deductionOrCeilingReason?: string;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
  howToReach200?: string;
}

export interface SectionChecklistItem {
  label: string;
  present: boolean;
  detail: string;
  evidenceQuote?: string;
}

export interface C1DeviationItem {
  snippet: string;
  problem: string;
  bestForm: string;
  category?: string;
}

export interface C5ElementItem {
  present: boolean;
  text: string;
  targetElement?: string;
  details?: string;
}

export interface C5StructureAudit {
  agent: C5ElementItem;
  action: C5ElementItem;
  modeMedium: C5ElementItem;
  effect: C5ElementItem;
  detailing: C5ElementItem;
  respectsHumanRights: boolean;
  validElementsCount: number;
}

export interface DualEvaluatorSummary {
  evaluatorATotalAverage: number;
  evaluatorBTotalAverage: number;
  finalAverage: number;
  status: string;
  notes: string;
}

export interface SnippetEvaluationResult {
  sectionType: SnippetSectionType;
  averageScore: number;
  activeCompetencies: ActiveCompetencyEval[];
  dualEvaluatorSimulation?: DualEvaluatorSummary;
  c5Structure?: C5StructureAudit;
  sectionChecklist: SectionChecklistItem[];
  c1Deviations: C1DeviationItem[];
  strengths: string[];
  improvements: string[];
  generalFeedback: string;
  modelRewrite: string;
  rewriteExplanation?: string;
}

const SNIPPET_STORAGE_KEY = 'enem_snippet_writing_state_v1';

const HISTORICAL_ARGUMENT_BASES: Record<string, ArgumentBase> = {
  '2025': {
    thesis: 'Os desafios acerca do envelhecimento na sociedade brasileira decorrem da mentalidade utilitarista que alimenta o etarismo somada à insuficiência de políticas públicas de saúde geriátrica e amparo social.',
    arg1: 'Preconceito etário (etarismo) e marginalização simbólica da pessoa idosa em uma sociedade pautada pela produtividade imediata.',
    arg2: 'Lacuna na infraestrutura estatal de saúde preventiva no SUS, acessibilidade urbana e efetivação plena do Estatuto da Pessoa Idosa.'
  },
  '2024': {
    thesis: 'O apagamento da herança africana no Brasil decorre tanto da negligência no cumprimento das diretrizes educacionais antirracistas quanto da persistência do racismo estrutural e simbólico.',
    arg1: 'Lacuna na implementação efetiva da Lei nº 10.639/2003 nas escolas brasileiras para o ensino da história e cultura afro-brasileira.',
    arg2: 'Marginalização histórica e desvalorização simbólica das matrizes culturais e religiosas de origem africana na sociedade.'
  },
  '2023': {
    thesis: 'A desvalorização do trabalho doméstico e de cuidado exercido pelas mulheres é sustentada pela herança patriarcal e pela ausência de políticas públicas de suporte familiar.',
    arg1: 'Naturalização histórica do cuidado como obrigação exclusivamente feminina (cultura patriarcal).',
    arg2: 'Escassez de creches públicas, equipamentos de assistência e políticas de economia do cuidado pelo Estado.'
  },
  '2022': {
    thesis: 'A marginalização dos povos tradicionais decorre tanto da omissão governamental na proteção territorial quanto do apagamento histórico-cultural na sociedade brasileira.',
    arg1: 'Inoperância estatal na proteção dos territórios tradicionais contra a grilagem e a exploração predatória.',
    arg2: 'Invisibilidade midiática e educacional que perpetua preconceitos contra saberes ancestrais.'
  },
  '2021': {
    thesis: 'A persistência do sub-registro civil no Brasil decorre de entraves burocráticos e espaciais do Estado, aliados à vulnerabilidade socioeconômica de populações marginalizadas.',
    arg1: 'Distanciamento físico e burocrático dos serviços cartoriais em regiões periféricas e rurais remotas.',
    arg2: 'Desinformação e exclusão socioeconômica que perpetuam um ciclo intergeracional de invisibilidade jurídica.'
  },
  '2020': {
    thesis: 'A perpetuação do estigma em torno dos transtornos mentais resulta da desinformação histórica e da fragilidade da rede pública de atenção psicossocial.',
    arg1: 'Preconceito cultural e banalização do sofrimento psíquico nas relações sociais e laborais.',
    arg2: 'Insuficiência de investimentos estatais nos Centros de Atenção Psicossocial (CAPS) e em campanhas educativas.'
  },
  '2019': {
    thesis: 'A restrição do acesso ao cinema no Brasil é fruto da concentração geográfica e elitização das salas exibidoras somada à escassez de políticas descentralizadas de difusão cultural.',
    arg1: 'Concentração de salas de cinema nos grandes centros urbanos e alto custo dos ingressos para famílias de baixa renda.',
    arg2: 'Insuficiência de programas governamentais de interiorização cultural e incentivo ao cinema comunitário e educativo.'
  },
  '2018': {
    thesis: 'A manipulação algorítmica dos usuários na rede decorre da opacidade mercadológica das plataformas digitais aliada à carência de letramento informacional da população.',
    arg1: 'Exploração comercial de dados pessoais por algoritmos que criam bolhas ideológicas e dirigem escolhas de consumo e opinião.',
    arg2: 'Deficiência de educação midiática e pensamento crítico digital nas escolas para que o cidadão compreenda o funcionamento das redes.'
  }
};

const PAST_ENEM_THEMES: SnippetThemePreset[] = HISTORICAL_THEMES.map((item) => ({
  year: `ENEM ${item.year}`,
  theme: item.title,
  axis: `${item.axis} (ENEM ${item.year})`,
  argumentBase: HISTORICAL_ARGUMENT_BASES[item.year] || {
    thesis: `Os desafios referentes a "${item.title}" decorrem de falhas na atuação estatal somadas à invisibilidade sociocultural do problema.`,
    arg1: item.keyPoints.split(',')[0]?.trim() || 'Lacuna de políticas públicas efetivas sobre o tema.',
    arg2: item.keyPoints.split(',').slice(1).join(',').trim() || 'Necessidade de educação e conscientização social.'
  }
}));

const SECTION_CONFIGS: Record<
  SnippetSectionType,
  {
    title: string;
    shortTitle: string;
    subtitle: string;
    activeCompetencies: string[];
    competencySummary: string;
    placeholder: string;
    guidelines: string[];
    idealLines: string;
  }
> = {
  introducao: {
    title: 'Apenas a Introdução',
    shortTitle: 'Introdução',
    subtitle: 'Contextualização com repertório + recorte completo do tema + tese bipartida (A1 e A2)',
    activeCompetencies: ['C1', 'C2', 'C3', 'C4'],
    competencySummary: 'Avalia C1 (Norma Culta), C2 (Tema + Repertório Inicial), C3 (Projeto de Texto e Tese) e C4 (Coesão Intraparágrafo).',
    placeholder:
      'Escreva aqui seu parágrafo de Introdução (5 a 7 linhas)...\n\nDica estrutural:\n1º período: Contextualização (Repertório sociocultural legitimado)\n2º período: Conexão com os núcleos da frase-tema\n3º período: Tese explícita apresentando o Argumento 1 e o Argumento 2.',
    guidelines: [
      'Abra com um repertório sociocultural legitimado (Constituição, filósofo, obra literária ou período histórico).',
      'Aborde todas as palavras-chave da frase-tema sem tangenciar.',
      'Apresente claramente os 2 argumentos (A1 e A2) no período final da introdução.'
    ],
    idealLines: '5 a 7 linhas (3 períodos)'
  },
  desenvolvimento_1: {
    title: '1 Desenvolvimento',
    shortTitle: '1 Desenvolvimento',
    subtitle: 'Treine um parágrafo argumentativo completo (Tópico Frasal + Repertório Produtivo + Crítica)',
    activeCompetencies: ['C1', 'C2', 'C3', 'C4'],
    competencySummary: 'Avalia C1 (Norma Culta), C2 (Repertório Produtivo), C3 (Argumentação Crítica) e C4 (Operadores Argumentativos).',
    placeholder:
      'Escreva aqui seu parágrafo de Desenvolvimento (7 a 9 linhas)...\n\nDica estrutural:\n1º período: Operador interparágrafo ("Em primeira análise,") + Tópico frasal com a causa do problema\n2º período: Repertório sociocultural legitimado\n3º período: Conexão produtiva e aprofundamento crítico (causa e consequência)\n4º período: Breve fechamento reafirmando o argumento.',
    guidelines: [
      'Inicie com um operador argumentativo ("Em primeira análise,", "Sob esse viés,") seguido do tópico frasal.',
      'Mobilize um repertório legitimado e explique sua relação direta com o argumento (uso produtivo C2).',
      'Explicite a relação de causa e consequência com marcas de autoria crítica (C3).'
    ],
    idealLines: '7 a 9 linhas (3 a 4 períodos)'
  },
  desenvolvimento_2: {
    title: '2 Desenvolvimentos (D1 + D2)',
    shortTitle: '2 Desenvolvimentos',
    subtitle: 'Treine a dupla completa de argumentação (D1 e D2) com progressão temática e conectivos',
    activeCompetencies: ['C1', 'C2', 'C3', 'C4'],
    competencySummary: 'Avalia C1 (Norma Culta), C2 (Repertórios em D1/D2), C3 (Progressão D1→D2 e Autoria) e C4 (Conectivos Inter e Intraparágrafos).',
    placeholder: '',
    guidelines: [
      'No D1, desenvolva o Argumento 1 (ex.: falha estatal/institucional) com repertório próprio.',
      'No D2, inicie com operador de adição ou transição ("Ademais,", "Outrossim,") e defenda o Argumento 2.',
      'Evite repetir os mesmos conectivos e mantenha o equilíbrio de extensão entre os dois parágrafos.'
    ],
    idealLines: '7 a 9 linhas por parágrafo'
  },
  conclusao: {
    title: 'Apenas a Conclusão',
    shortTitle: 'Conclusão (C5)',
    subtitle: 'Construa a Proposta de Intervenção com base nos argumentos fornecidos e nos 5 elementos do INEP',
    activeCompetencies: ['C1', 'C3', 'C4', 'C5'],
    competencySummary: 'Avalia C1 (Norma Culta), C3 (Retomada da Base de Argumentos), C4 (Conectivo Conclusivo) e C5 (5 Elementos da Intervenção).',
    placeholder:
      'Escreva aqui seu parágrafo de Conclusão (6 a 8 linhas)...\n\nDica estrutural:\n1º período: Conectivo conclusivo ("Portanto,") + retomada da tese/base de argumentos\n2º e 3º períodos: Proposta de Intervenção contendo obrigatoriamente:\n• Agente (Quem fará?)\n• Ação (O que fará?)\n• Meio/Modo (Por meio de quê?)\n• Efeito (A fim de quê?)\n• Detalhamento (Explicação ou exemplificação de um dos elementos)',
    guidelines: [
      'Consulte o quadro "Base de Argumentos para Trabalhar" logo acima do editor para endereçar os dois problemas.',
      'Inicie obrigatoriamente com conectivo conclusivo ("Portanto,", "Diante desse cenário,", "Infere-se, portanto, que").',
      'Garanta a presença explícita dos 5 elementos da Competência 5 (Agente, Ação, Meio/Modo, Efeito e Detalhamento).'
    ],
    idealLines: '6 a 8 linhas (3 a 4 períodos)'
  }
};

interface SnippetWritingViewProps {
  initialTheme?: string;
  onSendToFullCorrection?: (text: string, theme: string) => void;
}

export const SnippetWritingView: React.FC<SnippetWritingViewProps> = ({
  initialTheme = '',
  onSendToFullCorrection
}) => {
  const { savedWork, setSnippetWritingState } = useSavedWork();
  const { startTask, updateTaskProgress, completeTask, failTask } = useBackgroundTasks();

  const themeTaskIdRef = useRef<string | null>(null);
  const argsTaskIdRef = useRef<string | null>(null);
  const evalTaskIdRef = useRef<string | null>(null);

  const initialPersisted = (() => {
    if (savedWork.snippetWritingState && savedWork.snippetWritingState.theme) {
      return savedWork.snippetWritingState;
    }
    try {
      const raw = localStorage.getItem(SNIPPET_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.theme) return parsed;
      }
    } catch {}
    return null;
  })();

  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(
    initialPersisted?.selectedPresetIndex ?? 0
  );
  const [theme, setTheme] = useState<string>(
    initialTheme || initialPersisted?.theme || PAST_ENEM_THEMES[0].theme
  );
  const [axis, setAxis] = useState<string>(
    initialPersisted?.axis || PAST_ENEM_THEMES[0].axis
  );
  const [isCustomThemeMode, setIsCustomThemeMode] = useState<boolean>(
    Boolean(initialPersisted?.isCustomThemeMode)
  );
  const [showPastThemesModal, setShowPastThemesModal] = useState<boolean>(false);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState<boolean>(false);
  const [isGeneratingArguments, setIsGeneratingArguments] = useState<boolean>(false);

  const [generatedThemes, setGeneratedThemes] = useState<PersistedSnippetTheme[]>(
    Array.isArray(initialPersisted?.generatedThemes) ? initialPersisted.generatedThemes : []
  );

  const [sectionType, setSectionType] = useState<SnippetSectionType>(
    initialPersisted?.sectionType || 'introducao'
  );

  // Argument base state (always available, highlighted in Conclusion and toggleable in Development)
  const [argumentBase, setArgumentBase] = useState<ArgumentBase>(
    initialPersisted?.argumentBase || PAST_ENEM_THEMES[0].argumentBase
  );
  const [isEditingBase, setIsEditingBase] = useState<boolean>(false);
  const [showBaseInOtherModes, setShowBaseInOtherModes] = useState<boolean>(true);

  // Text states
  const [singleParagraphText, setSingleParagraphText] = useState<string>(
    initialPersisted?.singleParagraphText || ''
  );
  const [paragraphD1, setParagraphD1] = useState<string>(
    initialPersisted?.paragraphD1 || ''
  );
  const [paragraphD2, setParagraphD2] = useState<string>(
    initialPersisted?.paragraphD2 || ''
  );

  // Evaluation states
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<SnippetEvaluationResult | null>(
    initialPersisted?.evaluationResult || null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedRewrite, setCopiedRewrite] = useState<boolean>(false);

  // Persist state whenever any field changes so tab switches never lose themes or drafts
  useEffect(() => {
    const nextState = {
      theme,
      axis,
      argumentBase,
      sectionType,
      singleParagraphText,
      paragraphD1,
      paragraphD2,
      evaluationResult,
      selectedPresetIndex,
      isCustomThemeMode,
      generatedThemes,
    };
    setSnippetWritingState(nextState);
    try {
      localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(nextState));
    } catch {}
  }, [
    theme,
    axis,
    argumentBase,
    sectionType,
    singleParagraphText,
    paragraphD1,
    paragraphD2,
    evaluationResult,
    selectedPresetIndex,
    isCustomThemeMode,
    generatedThemes,
    setSnippetWritingState,
  ]);

  useEffect(() => {
    if (initialTheme && initialTheme.trim().length > 0 && initialTheme.trim() !== theme) {
      const matchedPreset = PAST_ENEM_THEMES.find(
        (p) => p.theme.toLowerCase() === initialTheme.trim().toLowerCase()
      );
      const matchedGenerated = generatedThemes.find(
        (g) => g.theme.toLowerCase() === initialTheme.trim().toLowerCase()
      );
      setTheme(initialTheme.trim());
      if (matchedGenerated) {
        setAxis(matchedGenerated.axis);
        setArgumentBase(matchedGenerated.argumentBase);
      } else if (matchedPreset) {
        setAxis(matchedPreset.axis);
        setArgumentBase(matchedPreset.argumentBase);
      } else {
        setAxis('Tema Selecionado');
        setArgumentBase({
          thesis: `A persistência dos desafios ligados a "${initialTheme.trim()}" decorre da lacuna na atuação estatal somada à invisibilidade sociocultural do problema.`,
          arg1: 'Insuficiência de políticas públicas e fiscalização governamental efetiva sobre o tema.',
          arg2: 'Falta de debate educativo e visibilidade social que perpetua o problema no cotidiano brasileiro.'
        });
      }
    }
  }, [initialTheme]);

  // AI Progress Bars for the 3 AI operations in Treino de Trecho
  const themeAiProgress = useAiProgress({
    steps: [
      'Consultando matrizes temáticas do ENEM...',
      'Formulando recorte inédito no padrão oficial INEP...',
      'Estruturando tese bipartida e argumentos-base...',
      'Finalizando geração do tema...'
    ],
    estimatedDurationMs: 2000
  });

  const argumentsAiProgress = useAiProgress({
    steps: [
      'Analisando os núcleos da frase-tema atual...',
      'Explorando novos eixos causais (estatal e sociocultural)...',
      'Sintetizando nova tese bipartida (D1 + D2)...',
      'Finalizando novos argumentos por IA...'
    ],
    estimatedDurationMs: 2400
  });

  const evalAiProgress = useAiProgress({
    steps: [
      'Ativando motor oficial do Corretor INEP (Cartilha 2024/2025)...',
      'Executando simulação de Duplo Avaliador independente...',
      'Auditando evidências literais, desvios C1 e critérios do trecho...',
      'Gerando diagnóstico analítico e Reescrita Nota 200...'
    ],
    estimatedDurationMs: 6500
  });

  // Synchronize live progress and step labels to the global BackgroundTasksBanner
  useEffect(() => {
    if (themeAiProgress.isLoading && themeTaskIdRef.current) {
      updateTaskProgress(themeTaskIdRef.current, themeAiProgress.progress, themeAiProgress.currentStep);
    }
  }, [themeAiProgress.isLoading, themeAiProgress.progress, themeAiProgress.currentStep, updateTaskProgress]);

  useEffect(() => {
    if (argumentsAiProgress.isLoading && argsTaskIdRef.current) {
      updateTaskProgress(argsTaskIdRef.current, argumentsAiProgress.progress, argumentsAiProgress.currentStep);
    }
  }, [argumentsAiProgress.isLoading, argumentsAiProgress.progress, argumentsAiProgress.currentStep, updateTaskProgress]);

  useEffect(() => {
    if (evalAiProgress.isLoading && evalTaskIdRef.current) {
      updateTaskProgress(evalTaskIdRef.current, evalAiProgress.progress, evalAiProgress.currentStep);
    }
  }, [evalAiProgress.isLoading, evalAiProgress.progress, evalAiProgress.currentStep, updateTaskProgress]);

  const handleSelectPastEnemTheme = (preset: SnippetThemePreset, index: number) => {
    setSelectedPresetIndex(index);
    setTheme(preset.theme);
    setAxis(preset.axis);
    setArgumentBase(preset.argumentBase);
    setIsCustomThemeMode(false);
    setShowPastThemesModal(false);
    setEvaluationResult(null);
    setErrorMsg(null);
  };

  const UNPUBLISHED_AI_THEMES_FALLBACK: SnippetThemePreset[] = [
    {
      theme: 'O combate ao uso predatório de apostas esportivas online (bets) e o endividamento das famílias brasileiras',
      axis: 'Saúde Pública, Economia e Sociedade (Tema Inédito IA)',
      argumentBase: {
        thesis: 'A epidemia de dependência em apostas virtuais no Brasil é alimentada pela publicidade agressiva sem freios éticos e pela carência de educação financeira e amparo psicológico.',
        arg1: 'Bombardeio publicitário massivo e gamificação predatória que induzem jovens e famílias vulneráveis ao vício (ludopatia).',
        arg2: 'Deficiência de educação financeira nas escolas e de atendimento especializado em saúde mental no SUS.'
      }
    },
    {
      theme: 'Os impactos da inteligência artificial generativa no futuro do trabalho e na ética informacional no Brasil',
      axis: 'Tecnologia, Ciência e Sociedade (Tema Inédito IA)',
      argumentBase: {
        thesis: 'O avanço acelerado da inteligência artificial sem regulação adequada aprofunda a precarização laboral e fragiliza a integridade informacional no país.',
        arg1: 'Desigualdade na qualificação digital dos trabalhadores brasileiros frente à automação acelerada.',
        arg2: 'Lacuna regulatória e ética no combate à desinformação algorítmica (deepfakes) e ao uso indevido de dados.'
      }
    },
    {
      theme: 'Efeitos das mudanças climáticas extremas sobre as populações periféricas brasileiras (racismo ambiental)',
      axis: 'Meio Ambiente e Justiça Social (Tema Inédito IA)',
      argumentBase: {
        thesis: 'Os desastres climáticos atingem de modo desproporcional as populações vulneráveis devido ao déficit histórico de planejamento urbano e à negligência governamental na prevenção de riscos.',
        arg1: 'Ocupação desordenada e ausência de saneamento e drenagem urbana nas periferias (injustiça socioambiental).',
        arg2: 'Lentidão do Poder Público em implementar planos preventivos de adaptação climática e moradia digna.'
      }
    },
    {
      theme: 'Caminhos para combater a insegurança alimentar e o desperdício de alimentos no Brasil',
      axis: 'Direitos Sociais e Segurança Nutricional (Tema Inédito IA)',
      argumentBase: {
        thesis: 'A persistência da fome em um dos maiores produtores agrícolas do mundo decorre da concentração de renda e de falhas logísticas estruturais na distribuição de alimentos.',
        arg1: 'Ineficiência das cadeias de escoamento e armazenamento que gera desperdício massivo de alimentos.',
        arg2: 'Desigualdade socioeconômica e insuficiência de políticas permanentes de acesso à alimentação saudável.'
      }
    },
    {
      theme: 'Os impactos da hiperconectividade e do uso excessivo de telas na saúde mental de crianças e adolescentes no Brasil',
      axis: 'Saúde Pública, Educação e Tecnologia (Tema Inédito IA)',
      argumentBase: {
        thesis: 'O adoecimento psíquico infantojuvenil associado ao uso desregulado de telas resulta da arquitetura viciante das plataformas digitais somada à lacuna de mediação familiar e escolar.',
        arg1: 'Algoritmos de engajamento contínuo que estimulam a dependência dopaminérgica, a ansiedade e o isolamento social.',
        arg2: 'Falta de letramento digital das famílias e instituições de ensino para estabelecer limites saudáveis na infância.'
      }
    },
    {
      theme: 'Desafios para a inclusão efetiva de pessoas com transtorno do espectro autista (TEA) na educação e no mercado de trabalho brasileiro',
      axis: 'Inclusão Social, Educação e Cidadania (Tema Inédito IA)',
      argumentBase: {
        thesis: 'As barreiras à plena inclusão de pessoas autistas no Brasil originam-se do despreparo estrutural das instituições de ensino e trabalho e da persistência do capacitismo na sociedade.',
        arg1: 'Carência de profissionais de apoio capacitados e de adaptações pedagógicas e laborais nas redes pública e privada.',
        arg2: 'Desinformação e preconceito capacitista que reduzem as oportunidades de autonomia e inserção profissional.'
      }
    },
    {
      theme: 'A persistência da invisibilidade das pessoas em situação de rua e a aporofobia nos centros urbanos do Brasil',
      axis: 'Direitos Humanos e Questão Urbana (Tema Inédito IA)',
      argumentBase: {
        thesis: 'O crescimento da população em situação de rua decorre da fragilidade das políticas habitacionais e de assistência social aliada à cultura higienista de rejeição aos pobres (aporofobia).',
        arg1: 'Déficit habitacional e insuficiência de programas integrados de acolhimento, saúde e reinserção laboral pelo Estado.',
        arg2: 'Naturalização da indiferença social e emprego de arquitetura hostil que marginaliza cidadãos vulneráveis.'
      }
    },
    {
      theme: 'Desafios para a superação da evasão escolar e garantia da permanência de jovens no Ensino Médio brasileiro',
      axis: 'Educação, Juventude e Desigualdade (Tema Inédito IA)',
      argumentBase: {
        thesis: 'O abandono escolar no Ensino Médio brasileiro resulta da pressão socioeconômica pelo trabalho precoce somada à defasagem estrutural e pedagógica das escolas públicas.',
        arg1: 'Vulnerabilidade financeira das famílias que força adolescentes a abandonarem os estudos para complementar a renda.',
        arg2: 'Precariedade de infraestrutura escolar e falta de conexão entre o currículo tradicional e o projeto de vida juvenil.'
      }
    },
    {
      theme: 'Desafios para o combate ao descarte irregular de lixo eletrônico e promoção da economia circular no Brasil',
      axis: 'Meio Ambiente, Consumo e Sustentabilidade (Tema Inédito IA)',
      argumentBase: {
        thesis: 'O acúmulo de resíduos eletroeletrônicos no Brasil decorre da baixa efetividade na fiscalização da logística reversa somada à cultura do consumismo pautado pela obsolescência programada.',
        arg1: 'Escassez de pontos públicos de coleta especializada e leniência estatal no cumprimento da Política Nacional de Resíduos Sólidos.',
        arg2: 'Estímulo mercadológico à substituição acelerada de aparelhos sem conscientização ambiental dos consumidores.'
      }
    },
    {
      theme: 'O enfrentamento ao abandono paterno e à sobrecarga das mães solo na sociedade brasileira',
      axis: 'Família, Gênero e Direitos da Criança (Tema Inédito IA)',
      argumentBase: {
        thesis: 'A naturalização da deserção parental paterna no Brasil resulta do machismo estrutural que transfere a responsabilidade filial exclusivamente à mulher e da morosidade estatal no amparo às famílias monoparentais.',
        arg1: 'Cultura patriarcal que desvincula o homem do dever constitucional de cuidado afetivo e material com os filhos.',
        arg2: 'Insuficiência de creches em tempo integral, assistência jurídica ágil e políticas de empregabilidade para mães solo.'
      }
    }
  ];

  const applyGeneratedUnpublishedTheme = (newThemeStr: string, newAxisStr: string, newBase: ArgumentBase) => {
    const newItem: PersistedSnippetTheme = {
      theme: newThemeStr,
      axis: newAxisStr,
      argumentBase: newBase,
    };
    const updatedGenerated = [
      newItem,
      ...generatedThemes.filter((g) => g.theme.toLowerCase() !== newThemeStr.toLowerCase()),
    ].slice(0, 30);

    setTheme(newThemeStr);
    setAxis(newAxisStr);
    setArgumentBase(newBase);
    setGeneratedThemes(updatedGenerated);
    setIsCustomThemeMode(false);
    setShowPastThemesModal(false);
    setEvaluationResult(null);

    setSnippetWritingState((prev) => {
      const updatedState = {
        theme: newThemeStr,
        axis: newAxisStr,
        argumentBase: newBase,
        sectionType: prev?.sectionType || sectionType,
        singleParagraphText: prev?.singleParagraphText || singleParagraphText,
        paragraphD1: prev?.paragraphD1 || paragraphD1,
        paragraphD2: prev?.paragraphD2 || paragraphD2,
        evaluationResult: null,
        selectedPresetIndex: prev?.selectedPresetIndex ?? selectedPresetIndex,
        isCustomThemeMode: false,
        generatedThemes: updatedGenerated,
      };
      try {
        localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(updatedState));
      } catch {}
      return updatedState;
    });
  };

  const handleGenerateAiTheme = async () => {
    setIsGeneratingTheme(true);
    setErrorMsg(null);
    themeAiProgress.startProgress();

    const taskId = `task-snippet-theme-${Date.now()}`;
    themeTaskIdRef.current = taskId;
    startTask(
      taskId,
      'snippet_writing',
      'Treino de Trecho • Gerando Tema Inédito por IA',
      'Formulando proposta inédita e tese bipartida no padrão INEP...'
    );

    const allExcluded = Array.from(
      new Set([
        theme,
        ...generatedThemes.map((g) => g.theme),
        ...PAST_ENEM_THEMES.map((p) => p.theme),
      ].filter(Boolean))
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3200);

    try {
      const res = await fetch('/api/snippet-training/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTheme: theme,
          excludeThemes: allExcluded,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Falha ao gerar tema');
      const data = await res.json();
      const isPastEnem = PAST_ENEM_THEMES.some(
        (p) => p.theme.trim().toLowerCase() === String(data?.theme || '').trim().toLowerCase()
      );
      if (data.theme && !isPastEnem) {
        const newAxis = data.axis || 'Sociedade e Cidadania (Tema Inédito IA)';
        const newBase: ArgumentBase = {
          thesis: data.argumentBase?.thesis || '',
          arg1: data.argumentBase?.arg1 || '',
          arg2: data.argumentBase?.arg2 || ''
        };
        applyGeneratedUnpublishedTheme(data.theme, newAxis, newBase);
        themeAiProgress.completeProgress();
        completeTask(taskId, { theme: data.theme, axis: newAxis, argumentBase: newBase });
      } else {
        throw new Error('Tema repetido');
      }
    } catch {
      clearTimeout(timeoutId);
      const excludedLower = new Set(allExcluded.map((t) => t.trim().toLowerCase()));
      const unseenPool = UNPUBLISHED_AI_THEMES_FALLBACK.filter(
        (item) => !excludedLower.has(item.theme.trim().toLowerCase())
      );
      const pool = unseenPool.length > 0 ? unseenPool : UNPUBLISHED_AI_THEMES_FALLBACK;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      applyGeneratedUnpublishedTheme(chosen.theme, chosen.axis, chosen.argumentBase);
      themeAiProgress.completeProgress();
      completeTask(taskId, chosen);
    } finally {
      themeTaskIdRef.current = null;
      setIsGeneratingTheme(false);
    }
  };

  const handleGenerateAiArgumentsOnly = async () => {
    if (!theme.trim()) {
      setErrorMsg('Defina ou selecione um tema antes de modificar os argumentos por IA.');
      return;
    }
    setIsGeneratingArguments(true);
    setErrorMsg(null);
    argumentsAiProgress.startProgress();

    const taskId = `task-snippet-args-${Date.now()}`;
    argsTaskIdRef.current = taskId;
    startTask(
      taskId,
      'snippet_writing',
      'Treino de Trecho • Modificando Argumentos por IA',
      theme.trim()
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3600);

    try {
      const res = await fetch('/api/snippet-training/generate-arguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme.trim(),
          currentArguments: argumentBase
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Falha ao gerar novos argumentos');
      const data = await res.json();
      if (data.argumentBase?.arg1 && data.argumentBase?.arg2) {
        const newBase: ArgumentBase = {
          thesis: data.argumentBase.thesis || argumentBase.thesis,
          arg1: data.argumentBase.arg1,
          arg2: data.argumentBase.arg2
        };
        setArgumentBase(newBase);
        setShowBaseInOtherModes(true);
        setIsEditingBase(false);

        setSnippetWritingState((prev) => {
          const updatedState = {
            theme: prev?.theme || theme,
            axis: prev?.axis || axis,
            argumentBase: newBase,
            sectionType: prev?.sectionType || sectionType,
            singleParagraphText: prev?.singleParagraphText || singleParagraphText,
            paragraphD1: prev?.paragraphD1 || paragraphD1,
            paragraphD2: prev?.paragraphD2 || paragraphD2,
            evaluationResult: prev?.evaluationResult || evaluationResult,
            selectedPresetIndex: prev?.selectedPresetIndex ?? selectedPresetIndex,
            isCustomThemeMode: prev?.isCustomThemeMode ?? isCustomThemeMode,
            generatedThemes: prev?.generatedThemes || generatedThemes,
          };
          try {
            localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(updatedState));
          } catch {}
          return updatedState;
        });
        argumentsAiProgress.completeProgress();
        completeTask(taskId, newBase);
      } else {
        throw new Error('Base de argumentos inválida');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      argumentsAiProgress.resetProgress();
      failTask(taskId, err?.message || 'Não foi possível modificar os argumentos no momento.');
      setErrorMsg('Não foi possível modificar os argumentos no momento. Tente novamente.');
    } finally {
      argsTaskIdRef.current = null;
      setIsGeneratingArguments(false);
    }
  };

  const activeConfig = SECTION_CONFIGS[sectionType];

  const combinedCurrentText =
    sectionType === 'desenvolvimento_2'
      ? `${paragraphD1.trim()}\n\n${paragraphD2.trim()}`.trim()
      : singleParagraphText.trim();

  const wordCount = combinedCurrentText
    ? combinedCurrentText.split(/\s+/).filter(Boolean).length
    : 0;
  const estimatedLines = combinedCurrentText
    ? Math.max(1, Math.ceil(combinedCurrentText.length / 75))
    : 0;

  const handleEvaluateSnippet = async () => {
    if (sectionType === 'desenvolvimento_2') {
      if (paragraphD1.trim().length < 15 || paragraphD2.trim().length < 15) {
        setErrorMsg('Preencha tanto o Desenvolvimento 1 (D1) quanto o Desenvolvimento 2 (D2) para avaliar os 2 desenvolvimentos.');
        return;
      }
    } else if (singleParagraphText.trim().length < 15) {
      setErrorMsg('Escreva seu parágrafo (mínimo de 15 caracteres) antes de solicitar a correção do trecho.');
      return;
    }

    if (!theme.trim()) {
      setErrorMsg('Defina ou digite uma frase-tema antes de avaliar o trecho.');
      return;
    }

    setIsEvaluating(true);
    setErrorMsg(null);
    evalAiProgress.startProgress();

    const taskId = `task-snippet-eval-${Date.now()}`;
    evalTaskIdRef.current = taskId;
    startTask(
      taskId,
      'snippet_writing',
      `Treino de Trecho • Avaliando ${activeConfig.shortTitle}`,
      theme.trim()
    );

    try {
      const res = await fetch('/api/snippet-training/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme.trim(),
          sectionType,
          text: singleParagraphText,
          paragraphD1,
          paragraphD2,
          argumentBase
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao avaliar o trecho.');
      }

      setEvaluationResult(data);
      setSnippetWritingState((prev) => {
        const updatedState = {
          theme: prev?.theme || theme,
          axis: prev?.axis || axis,
          argumentBase: prev?.argumentBase || argumentBase,
          sectionType: prev?.sectionType || sectionType,
          singleParagraphText: prev?.singleParagraphText || singleParagraphText,
          paragraphD1: prev?.paragraphD1 || paragraphD1,
          paragraphD2: prev?.paragraphD2 || paragraphD2,
          evaluationResult: data,
          selectedPresetIndex: prev?.selectedPresetIndex ?? selectedPresetIndex,
          isCustomThemeMode: prev?.isCustomThemeMode ?? isCustomThemeMode,
          generatedThemes: prev?.generatedThemes || generatedThemes,
        };
        try {
          localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(updatedState));
        } catch {}
        return updatedState;
      });

      evalAiProgress.completeProgress();
      completeTask(taskId, data);
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } catch (err: any) {
      evalAiProgress.resetProgress();
      failTask(taskId, err?.message || 'Erro ao avaliar o trecho.');
      setErrorMsg(err?.message || 'Não foi possível avaliar o trecho no momento. Tente novamente.');
    } finally {
      evalTaskIdRef.current = null;
      setIsEvaluating(false);
    }
  };

  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  const handleCopyRewrite = () => {
    if (!evaluationResult?.modelRewrite) return;
    navigator.clipboard.writeText(evaluationResult.modelRewrite);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  const getScoreBadgeClasses = (score: number) => {
    if (score >= 180) {
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
    if (score >= 140) {
      return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
    if (score >= 100) {
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
    return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <FileEdit className="w-4 h-4" />
              <span>Escrita Focada por Parágrafo</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Correção simplificada apenas das competências do trecho
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Treino de Trecho
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Escolha um tema de <strong>anos anteriores do ENEM</strong> ou gere por IA e pratique isoladamente a <strong>Introdução</strong>, <strong>1 ou 2 Desenvolvimentos</strong> ou a <strong>Conclusão (com base de argumentos)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowPastThemesModal((prev) => !prev);
                setIsCustomThemeMode(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer whitespace-nowrap ${
                showPastThemesModal
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-transparent'
              }`}
            >
              <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Temas Anteriores</span>
              {showPastThemesModal ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleGenerateAiTheme}
              disabled={isGeneratingTheme || isGeneratingArguments}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGeneratingTheme ? 'Gerando Tema...' : 'Gerar Tema IA'}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateAiArgumentsOnly}
              disabled={isGeneratingArguments || isGeneratingTheme}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 disabled:opacity-60 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="Mantém o tema atual e gera novos argumentos por IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                {isGeneratingArguments ? 'Modificando Argumentos...' : 'Modificar Argumentos IA'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCustomThemeMode((prev) => !prev);
                setShowPastThemesModal(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                isCustomThemeMode
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{isCustomThemeMode ? 'Fechar Edição' : 'Tema Livre'}</span>
            </button>
          </div>
        </div>

        {/* Selector of Official Past ENEM Themes */}
        {showPastThemesModal && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800/70 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Selecione um Tema Oficial de Anos Anteriores do ENEM</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ao escolher um tema, a frase-tema e a base inicial de argumentos são carregadas automaticamente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPastThemesModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {PAST_ENEM_THEMES.map((item, idx) => {
                const isCurrent = item.theme.toLowerCase() === theme.trim().toLowerCase();
                return (
                  <button
                    key={item.theme}
                    type="button"
                    onClick={() => handleSelectPastEnemTheme(item, idx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          isCurrent
                            ? 'bg-indigo-500 text-amber-200'
                            : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                        }`}
                      >
                        {item.year}
                      </span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                    </div>
                    <p className="text-xs font-bold leading-snug">{item.theme}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Written Theme Box (Only the written theme, clean and direct) */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Frase-Tema da Redação {axis ? `· ${axis}` : ''}
            </span>
          </div>

          {isCustomThemeMode ? (
            <div className="space-y-2">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Digite ou cole aqui a frase-tema que deseja treinar..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Digite apenas a frase-tema. Você também pode clicar em "Modificar Argumentos IA" ou editar a base abaixo.
              </p>
            </div>
          ) : (
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              “{theme}”
            </h2>
          )}
        </div>

        {/* AI Progress Bar for Theme Generation or Argument Modification in Header */}
        {(themeAiProgress.isLoading || themeAiProgress.progress > 0) && (
          <div className="mt-4">
            <AiProgressBar
              isLoading={themeAiProgress.isLoading}
              progress={themeAiProgress.progress}
              currentStepIndex={themeAiProgress.currentStepIndex}
              steps={themeAiProgress.steps}
              title="Gerando Tema Inédito por IA no Padrão Oficial ENEM..."
              subtitle="Criando frase-tema escrita e base de argumentos bipartida (D1 + D2)"
              accentColor="indigo"
              variant="card"
            />
          </div>
        )}

        {(argumentsAiProgress.isLoading || argumentsAiProgress.progress > 0) && (
          <div className="mt-4">
            <AiProgressBar
              isLoading={argumentsAiProgress.isLoading}
              progress={argumentsAiProgress.progress}
              currentStepIndex={argumentsAiProgress.currentStepIndex}
              steps={argumentsAiProgress.steps}
              title="Modificando Base de Argumentos com Inteligência Artificial..."
              subtitle="Mantendo o tema atual e formulando nova tese bipartida (Argumento 1 + Argumento 2)"
              accentColor="amber"
              variant="card"
            />
          </div>
        )}
      </div>

      {/* Step 2: Section Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Escolha a Parte da Redação para Treinar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecione qual trecho deseja escrever agora e veja as competências avaliadas
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Competências ativas neste trecho:</span>
            <div className="flex items-center gap-1">
              {activeConfig.activeCompetencies.map((code) => (
                <span
                  key={code}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              {
                id: 'introducao',
                label: 'Apenas Introdução',
                desc: 'Contextualização + Tema + Tese (A1 e A2)',
                comps: 'C1 · C2 · C3 · C4'
              },
              {
                id: 'desenvolvimento_1',
                label: '1 Desenvolvimento',
                desc: '1 parágrafo argumentativo focado (D1)',
                comps: 'C1 · C2 · C3 · C4'
              },
              {
                id: 'desenvolvimento_2',
                label: '2 Desenvolvimentos',
                desc: 'Dupla argumentativa completa (D1 + D2)',
                comps: 'C1 · C2 · C3 · C4'
              },
              {
                id: 'conclusao',
                label: 'Apenas Conclusão',
                desc: 'Proposta de Intervenção + Base de Argumentos',
                comps: 'C1 · C3 · C4 · C5'
              }
            ] as const
          ).map((item) => {
            const isSelected = sectionType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSectionType(item.id);
                  setEvaluationResult(null);
                  setErrorMsg(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold">{item.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />}
                  </div>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
                <div
                  className={`text-[11px] font-bold pt-2 border-t ${
                    isSelected
                      ? 'border-indigo-500/60 text-amber-200'
                      : 'border-slate-200/70 dark:border-slate-700/70 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  Avalia: {item.comps}
                </div>
              </button>
            );
          })}
        </div>

        {/* Argument Base Box: Mandatory/Highlighted in Conclusion, Optional Helper in Development/Intro */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
            sectionType === 'conclusao'
              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/80'
              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb
                className={`w-4 h-4 shrink-0 ${
                  sectionType === 'conclusao'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              />
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {sectionType === 'conclusao'
                    ? 'Base de Argumentos para Trabalhar na Conclusão (Obrigatório Retomar)'
                    : 'Base de Argumentos Sugerida para o Tema (Apoio Opcional)'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {sectionType === 'conclusao'
                    ? 'Use estes 2 argumentos-base como ponto de partida para que sua Proposta de Intervenção resolva os problemas da redação.'
                    : 'Você pode usar estes argumentos como referência para alinhar sua tese ou desenvolvimento, modificá-los por IA ou editar livremente.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleGenerateAiArgumentsOnly}
                disabled={isGeneratingArguments || isGeneratingTheme}
                className="px-2.5 py-1 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 dark:bg-amber-950/60 dark:hover:bg-amber-900/70 border border-amber-300/80 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>
                  {isGeneratingArguments ? 'Gerando Argumentos...' : 'Modificar Argumentos por IA'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditingBase((prev) => !prev)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer whitespace-nowrap"
              >
                {isEditingBase ? 'Concluir Edição da Base' : 'Editar Manualmente'}
              </button>
              {sectionType !== 'conclusao' && (
                <button
                  type="button"
                  onClick={() => setShowBaseInOtherModes((prev) => !prev)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  title={showBaseInOtherModes ? 'Ocultar base' : 'Mostrar base'}
                >
                  {showBaseInOtherModes ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {(argumentsAiProgress.isLoading || argumentsAiProgress.progress > 0) && (
            <div className="mt-3">
              <AiProgressBar
                isLoading={argumentsAiProgress.isLoading}
                progress={argumentsAiProgress.progress}
                currentStepIndex={argumentsAiProgress.currentStepIndex}
                steps={argumentsAiProgress.steps}
                title="Modificando argumentos da base por IA..."
                accentColor="amber"
                variant="compact"
              />
            </div>
          )}

          {(sectionType === 'conclusao' || showBaseInOtherModes) && (
            <div className="mt-3.5 space-y-3">
              {isEditingBase ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Tese Central:
                    </label>
                    <input
                      type="text"
                      value={argumentBase.thesis}
                      onChange={(e) =>
                        setArgumentBase((prev) => ({ ...prev, thesis: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Argumento 1 (D1):
                    </label>
                    <input
                      type="text"
                      value={argumentBase.arg1}
                      onChange={(e) =>
                        setArgumentBase((prev) => ({ ...prev, arg1: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Argumento 2 (D2):
                    </label>
                    <input
                      type="text"
                      value={argumentBase.arg2}
                      onChange={(e) =>
                        setArgumentBase((prev) => ({ ...prev, arg2: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      Argumento 1 (Problema 1)
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      {argumentBase.arg1}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      Argumento 2 (Problema 2)
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                      {argumentBase.arg2}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upper Workspace: Focused Paragraph Editor + Main Buttons on Left, Static Checklist on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Focused Paragraph Editor & Main Action Buttons */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {activeConfig.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extensão recomendada: {activeConfig.idealLines}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              <span>{wordCount} palavras</span>
              <span aria-hidden="true">·</span>
              <span>~{estimatedLines} linhas</span>
            </div>
          </div>

          {sectionType === 'desenvolvimento_2' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  1º Parágrafo de Desenvolvimento (D1 — Argumento 1)
                </label>
                <textarea
                  rows={6}
                  value={paragraphD1}
                  onChange={(e) => setParagraphD1(e.target.value)}
                  placeholder="Em primeira análise, cabe pontuar que... (Desenvolva o Argumento 1 com repertório sociocultural e reflexão crítica)"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  2º Parágrafo de Desenvolvimento (D2 — Argumento 2)
                </label>
                <textarea
                  rows={6}
                  value={paragraphD2}
                  onChange={(e) => setParagraphD2(e.target.value)}
                  placeholder="Ademais, convém ressaltar que... (Desenvolva o Argumento 2 com novo repertório e progressão argumentativa)"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
              </div>
            </div>
          ) : (
            <div>
              <textarea
                rows={9}
                value={singleParagraphText}
                onChange={(e) => setSingleParagraphText(e.target.value)}
                placeholder={activeConfig.placeholder}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSingleParagraphText('');
                setParagraphD1('');
                setParagraphD2('');
                setEvaluationResult(null);
                setErrorMsg(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Trecho</span>
            </button>

            <button
              type="button"
              onClick={handleEvaluateSnippet}
              disabled={isEvaluating}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>
                {isEvaluating
                  ? 'Avaliando Competências do Trecho...'
                  : `Avaliar ${activeConfig.shortTitle}`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Compact Static Guidelines & Checklist for the Current Snippet */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              O que será avaliado neste trecho (INEP)
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeConfig.competencySummary}
          </p>

          <div className="space-y-2.5 pt-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Checklist para gabaritar ({activeConfig.shortTitle}):
            </p>
            {activeConfig.guidelines.map((g, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Width Loading & Evaluation Result Section BELOW the Main Buttons (Same Layout Philosophy as Main Corretor) */}
      <div ref={resultSectionRef} className="w-full space-y-6">
        {(evalAiProgress.isLoading || evalAiProgress.progress > 0) && (
          <AiProgressBar
            isLoading={evalAiProgress.isLoading}
            progress={evalAiProgress.progress}
            currentStepIndex={evalAiProgress.currentStepIndex}
            steps={evalAiProgress.steps}
            title={`Corrigindo ${activeConfig.shortTitle} (${activeConfig.activeCompetencies.join(', ')})`}
            subtitle="Motor Oficial do Corretor ENEM (Duplo Avaliador + Auditoria de Evidências Textuais)"
            accentColor="indigo"
            variant="card"
          />
        )}

        {evaluationResult && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
            {/* 1. Full-Width Top Hero Banner: Score + Dual Evaluator + General Synthesis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left (4 cols): Official Average Score Card */}
              <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block">
                      Resultado Oficial · {activeConfig.shortTitle}
                    </span>
                    <div className="flex items-baseline gap-2 mt-2 font-mono tabular-nums">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                        {evaluationResult.averageScore}
                      </span>
                      <span className="text-base font-bold text-slate-400 dark:text-slate-500">
                        / 200 pts
                      </span>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (evaluationResult.averageScore / 200) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Média aritmética das {evaluationResult.activeCompetencies.length} competências ativas ({evaluationResult.activeCompetencies.map((c) => c.code).join(', ')}) avaliadas neste parágrafo.
                  </p>
                </div>
              </div>

              {/* Middle (4 cols): Dual Evaluator Simulation */}
              {evaluationResult.dualEvaluatorSimulation ? (
                <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-3">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Banca Duplo Avaliador INEP</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                        {evaluationResult.dualEvaluatorSimulation.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                          Avaliador 1 (Normativo)
                        </span>
                        <span className="text-lg font-mono font-black text-slate-900 dark:text-slate-100 block">
                          {evaluationResult.dualEvaluatorSimulation.evaluatorATotalAverage}
                          <span className="text-xs font-normal text-slate-400"> / 200</span>
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                          Avaliador 2 (Argumentativo)
                        </span>
                        <span className="text-lg font-mono font-black text-slate-900 dark:text-slate-100 block">
                          {evaluationResult.dualEvaluatorSimulation.evaluatorBTotalAverage}
                          <span className="text-xs font-normal text-slate-400"> / 200</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {evaluationResult.dualEvaluatorSimulation.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
                      {evaluationResult.dualEvaluatorSimulation.notes}
                    </p>
                  )}
                </div>
              ) : null}

              {/* Right (4 cols or 8 cols if no dual evaluator): General Analytical Synthesis */}
              <div
                className={`${
                  evaluationResult.dualEvaluatorSimulation ? 'lg:col-span-4' : 'lg:col-span-8'
                } p-5 sm:p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/60 flex flex-col justify-between gap-4`}
              >
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Parecer Geral da Banca sobre o Trecho</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {evaluationResult.generalFeedback}
                  </p>
                </div>

                {onSendToFullCorrection && (
                  <button
                    type="button"
                    onClick={() => onSendToFullCorrection(combinedCurrentText, theme)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Levar este Tema para o Corretor de Redação Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Active Competencies Detailed Breakdown (2x2 Grid on Desktop instead of a tall single column) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Diagnóstico Analítico por Competência Ativa (0 a 200)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Análise individualizada com justificativa textual explícita, evidências do seu rascunho e critérios oficiais de nível INEP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                {evaluationResult.activeCompetencies.map((comp) => (
                  <div
                    key={comp.code}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col justify-between space-y-3.5"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                            {comp.code} — {comp.name}
                          </span>
                          {comp.levelTitle && (
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                              {comp.levelTitle}
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black border font-mono tabular-nums shrink-0 ${getScoreBadgeClasses(
                            comp.score
                          )}`}
                        >
                          {comp.score} / 200
                        </span>
                      </div>

                      {/* Evaluator A & B individual scores + Progress Bar */}
                      <div className="space-y-2">
                        {(typeof comp.evaluatorAScore === 'number' || typeof comp.evaluatorBScore === 'number') && (
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              Avaliador 1: <strong>{comp.evaluatorAScore ?? comp.score}</strong>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                              Avaliador 2: <strong>{comp.evaluatorBScore ?? comp.score}</strong>
                            </span>
                          </div>
                        )}

                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (comp.score / 200) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Verbatim Evidence Quote from Student's Text */}
                      {comp.evidenceQuote && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                          <Quote className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                              Evidência textual auditada no seu rascunho:
                            </span>
                            <span className="italic">“{comp.evidenceQuote}”</span>
                          </div>
                        </div>
                      )}

                      {/* Explicit Textual Score Justification (Official INEP Criterion) */}
                      {comp.scoreJustification && (
                        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/70 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-extrabold text-indigo-900 dark:text-indigo-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>Justificativa Textual Explícita da Nota ({comp.score}/200):</span>
                          </div>
                          <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                            {comp.scoreJustification}
                          </p>
                        </div>
                      )}

                      {/* Deduction or Level Ceiling Criterion */}
                      {comp.deductionOrCeilingReason && (
                        <div
                          className={`p-3 rounded-xl border text-xs leading-relaxed ${
                            comp.score === 200
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200'
                              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/70 text-amber-900 dark:text-amber-200'
                          }`}
                        >
                          <span className="font-extrabold block mb-0.5">
                            {comp.score === 200
                              ? 'Auditoria de Teto (Nível 5 — Sem Descontos):'
                              : 'Critério de Desconto / Limite de Nível INEP:'}
                          </span>
                          <span>{comp.deductionOrCeilingReason}</span>
                        </div>
                      )}

                      {/* Detailed Analytical Feedback */}
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                          Análise Técnica da Competência:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {comp.feedback}
                        </p>
                      </div>

                      {/* Side-by-side Strengths & Improvements inside the Competency Card */}
                      {((comp.strengths && comp.strengths.length > 0) ||
                        (comp.improvements && comp.improvements.length > 0)) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {comp.strengths && comp.strengths.length > 0 && (
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1.5">
                              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 block">
                                Acertos comprovados:
                              </span>
                              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                                {comp.strengths.map((st, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold">✓</span>
                                    <span>{st}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {comp.improvements && comp.improvements.length > 0 && (
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-amber-200/70 dark:border-amber-900/50 space-y-1.5">
                              <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 block">
                                O que ajustar:
                              </span>
                              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                                {comp.improvements.map((imp, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <span>{imp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* How to reach 200 in this competency */}
                    {comp.howToReach200 && (
                      <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 mt-3">
                        <span className="font-extrabold block mb-0.5">
                          Como chegar aos 200 pts na {comp.code}:
                        </span>
                        <span>{comp.howToReach200}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Official C5 5-Elements Audit Card (Horizontal 5-Column Grid on Desktop when evaluating Conclusao) */}
            {evaluationResult.sectionType === 'conclusao' && evaluationResult.c5Structure && (
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/70 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        Auditoria Oficial dos 5 Elementos da Proposta de Intervenção (C5 INEP)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Cada elemento válido e articulado na conclusão equivale a +40 pontos na Competência 5
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-black font-mono">
                    {evaluationResult.c5Structure.validElementsCount} / 5 Elementos Válidos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {(
                    [
                      { key: 'agent', title: '1. Agente', subtitle: 'Quem fará?', data: evaluationResult.c5Structure.agent },
                      { key: 'action', title: '2. Ação', subtitle: 'O que fará?', data: evaluationResult.c5Structure.action },
                      { key: 'modeMedium', title: '3. Meio/Modo', subtitle: 'Como fará?', data: evaluationResult.c5Structure.modeMedium },
                      { key: 'effect', title: '4. Efeito', subtitle: 'Para que fará?', data: evaluationResult.c5Structure.effect },
                      { key: 'detailing', title: '5. Detalhamento', subtitle: 'Explicação extra', data: evaluationResult.c5Structure.detailing },
                    ] as const
                  ).map((el) => (
                    <div
                      key={el.key}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs flex flex-col justify-between space-y-2"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">
                            {el.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 ${
                              el.data?.present
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {el.data?.present ? '+40 pts' : '0 pts'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                          {el.subtitle}
                        </span>
                        {el.data?.text && (
                          <p className="text-[11px] italic text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                            “{el.data.text}”
                          </p>
                        )}
                      </div>
                      {el.data?.details && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                          {el.data.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Structural X-Ray & C1 Normative Deviations (Side by Side on Desktop) */}
            {((evaluationResult.sectionChecklist && evaluationResult.sectionChecklist.length > 0) ||
              (evaluationResult.c1Deviations && evaluationResult.c1Deviations.length > 0)) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Raio-X Estrutural do Parágrafo */}
                {evaluationResult.sectionChecklist && evaluationResult.sectionChecklist.length > 0 && (
                  <div
                    className={`${
                      evaluationResult.c1Deviations && evaluationResult.c1Deviations.length > 0
                        ? 'lg:col-span-6'
                        : 'lg:col-span-12'
                    } space-y-3`}
                  >
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Raio-X Estrutural do Parágrafo
                    </h4>
                    <div
                      className={`grid grid-cols-1 ${
                        !(evaluationResult.c1Deviations && evaluationResult.c1Deviations.length > 0)
                          ? 'md:grid-cols-3'
                          : ''
                      } gap-3`}
                    >
                      {evaluationResult.sectionChecklist.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs"
                        >
                          {item.present ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <p className="font-extrabold text-slate-900 dark:text-slate-100">
                              {item.label}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {item.detail}
                            </p>
                            {item.evidenceQuote && (
                              <p className="text-[11px] italic text-indigo-600 dark:text-indigo-400 pt-0.5">
                                Trecho: “{item.evidenceQuote}”
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auditoria da Norma-Padrão (Desvios C1 Detectados) */}
                {evaluationResult.c1Deviations && evaluationResult.c1Deviations.length > 0 && (
                  <div
                    className={`${
                      evaluationResult.sectionChecklist && evaluationResult.sectionChecklist.length > 0
                        ? 'lg:col-span-6'
                        : 'lg:col-span-12'
                    } space-y-3`}
                  >
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Auditoria da Norma-Padrão (Desvios C1 Detectados)
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {evaluationResult.c1Deviations.map((dev, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-extrabold text-rose-800 dark:text-rose-300">
                              Trecho: “{dev.snippet}”
                            </p>
                            {dev.category && (
                              <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-[10px] font-bold">
                                {dev.category}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{dev.problem}</p>
                          <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
                            Correção recomendada: {dev.bestForm}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. General Strengths & Action Plan (Side by Side on Desktop) */}
            {((evaluationResult.strengths && evaluationResult.strengths.length > 0) ||
              (evaluationResult.improvements && evaluationResult.improvements.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
                  <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2.5">
                    <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 block">
                      Pontos Fortes do Trecho
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {evaluationResult.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluationResult.improvements && evaluationResult.improvements.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 space-y-2.5">
                    <span className="text-sm font-extrabold text-amber-800 dark:text-amber-300 block">
                      Plano de Ação para Gabaritar este Parágrafo
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {evaluationResult.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span className="leading-relaxed">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 6. Full-Width Model Rewrite Nota 200 (Nível 5 INEP) */}
            {evaluationResult.modelRewrite && (
              <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/70 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Reescrita Pedagógica Nota 200 (Nível 5 INEP)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRewrite}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedRewrite ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Reescrita</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic whitespace-pre-line bg-white/70 dark:bg-slate-900/60 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  “{evaluationResult.modelRewrite}”
                </p>
                {evaluationResult.rewriteExplanation && (
                  <p className="text-xs text-indigo-900/80 dark:text-indigo-300/90 pt-1 leading-relaxed">
                    <strong>O que foi aprimorado:</strong> {evaluationResult.rewriteExplanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
