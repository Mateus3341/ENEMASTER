import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Scale, 
  Landmark, 
  GraduationCap, 
  Film, 
  BarChart3, 
  Globe2, 
  Check, 
  Copy, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  Sliders, 
  ExternalLink, 
  Layers, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  PenTool,
  RefreshCw,
  Target,
  Zap,
  Info,
  HelpCircle,
  FileText,
  Plus
} from 'lucide-react';
import { 
  HuntedRepertoireItem, 
  RepertoireHunterResponse, 
  RepertoireAreaCategory,
  GroundingSource
} from '../types';
import { AiProgressBar } from './AiProgressBar';
import { useAiProgress } from '../hooks/useAiProgress';
import { useSavedWork } from '../contexts/SavedWorkContext';
import { useBackgroundTasks } from '../contexts/BackgroundTasksContext';

interface RepertoireHunterViewProps {
  initialTheme?: string;
  onSendToCreation?: (theme: string, repertoireHint?: string) => void;
  onSendToCorrection?: (theme: string) => void;
  onSendToPractice?: (repertoire: string, theme: string) => void;
}

const SAMPLE_THEMES = [
  'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
  'Caminhos para combater a intolerância religiosa e valorizar a diversidade no Brasil',
  'Desafios para a preservação do patrimônio cultural e povos tradicionais no Brasil',
  'Impactos da inteligência artificial e dos algoritmos na autonomia informacional brasileira',
  'Garantia do acesso à saúde mental e combate ao estigma de doenças psíquicas no Brasil',
  'Democratização do acesso ao cinema e aos bens culturais na sociedade brasileira',
  'O estigma associado às doenças mentais na sociedade brasileira',
  'Caminhos para a inclusão socioeconômica de jovens e combate à evasão escolar'
];

const AREA_FILTERS: { id: RepertoireAreaCategory; label: string; icon: any }[] = [
  { id: 'todos', label: 'Todas as Obras', icon: Layers },
  { id: 'Filmes', label: '🎬 Filmes', icon: Film },
  { id: 'Séries', label: '📺 Séries & TV', icon: Film },
  { id: 'Livros & Literatura', label: '📖 Livros & Literatura', icon: FileText },
  { id: 'Documentários', label: '🎥 Documentários', icon: Globe2 },
  { id: 'Cinema & Artes', label: '🎨 Cinema & Artes', icon: Film },
  { id: 'Legislação', label: '⚖️ Legislação & CF/88', icon: Scale },
  { id: 'Filosofia', label: '🏛️ Filosofia', icon: GraduationCap },
  { id: 'Sociologia', label: '👥 Sociologia', icon: BookOpen },
  { id: 'História', label: '📜 História', icon: Landmark },
  { id: 'Dados & Estatísticas', label: '📊 Dados & Pesquisas', icon: BarChart3 }
];

const CURATED_DEFAULT_REPERTOIRES: HuntedRepertoireItem[] = [
  {
    id: 'curated-film-1',
    name: 'Que Horas Ela Volta?',
    workOrConcept: 'Longa-metragem Nacional (2015) - Dir. Anna Muylaert',
    mediaType: 'filme',
    area: 'Filmes',
    directorOrAuthor: 'Anna Muylaert',
    releaseYear: '2015',
    streamingPlatformOrPublisher: 'Globoplay / Netflix',
    sourceType: 'filme',
    summary: 'A trama retrata a rotina da empregada doméstica Val e expõe a naturalização da sobrecarga de trabalho reprodutivo, as barreiras invisíveis de classe e o apagamento do afeto materno em prol do sustento de famílias abastadas.',
    howToFit: 'Utilize na Introdução para retratar como o trabalho de cuidado no Brasil é historicamente precarizado e transferido a mulheres periféricas, servindo de contraponto à valorização cívica.',
    suggestedParagraph: 'intro',
    sampleSentence: 'No aclamado filme "Que Horas Ela Volta?", dirigido por Anna Muylaert, a trajetória da protagonista Val evidencia a invisibilização histórica imposta às mulheres dedicadas ao trabalho doméstico e de cuidado no Brasil.',
    keyTheses: ['Invisibilidade do cuidado', 'Divisão sexual do trabalho', 'Herança colonial de servidão']
  },
  {
    id: 'curated-serie-2',
    name: 'Maid',
    workOrConcept: 'Minissérie Dramática (2021) - Criada por Molly Smith Metzler',
    mediaType: 'serie',
    area: 'Séries',
    directorOrAuthor: 'Molly Smith Metzler',
    releaseYear: '2021',
    streamingPlatformOrPublisher: 'Netflix',
    sourceType: 'serie',
    summary: 'Acompanha Alex, uma jovem mãe solo que assume trabalhos extenuantes de faxina e cuidado infantil para sobreviver à violência doméstica e à burocracia de assistência social.',
    howToFit: 'Mobilize no D1 para comprovar que a ausência de creches públicas integrais e de redes de amparo empurra mães para a informalidade extrema e exaustão física.',
    suggestedParagraph: 'd1',
    sampleSentence: 'Analogamente ao dilema central da minissérie "Maid", a carência de equipamentos públicos e creches condena milhares de mães brasileiras à precarização e à sobrecarga solitária do cuidado.',
    keyTheses: ['Desamparo à maternidade', 'Falta de creches públicas', 'Sobrecarga física e emocional']
  },
  {
    id: 'curated-book-3',
    name: 'A Hora da Estrela',
    workOrConcept: 'Obra Literária / Romance Modernista (1977) - Clarice Lispector',
    mediaType: 'livro',
    area: 'Livros & Literatura',
    directorOrAuthor: 'Clarice Lispector',
    releaseYear: '1977',
    streamingPlatformOrPublisher: 'Editora Rocco',
    sourceType: 'livro',
    summary: 'Narra a existência apagada de Macabéa, jovem migrante nordestina no Rio de Janeiro que vive na mais completa insignificância social e desnutrição afetiva e econômica.',
    howToFit: 'Aplique no D2 para simbolizar como a sociedade brasileira normaliza a invisibilidade das mulheres que sustentam a base da pirâmide de afeto e serviços.',
    suggestedParagraph: 'd2',
    sampleSentence: 'Assim como a personagem Macabéa em "A Hora da Estrela", de Clarice Lispector, as mulheres responsáveis pelo labor de cuidado enfrentam o silenciamento sistemático de suas urgências vitais.',
    keyTheses: ['Invisibilidade social', 'Desamparo existencial', 'Marginalização de migrantes e trabalhadoras']
  },
  {
    id: 'curated-doc-4',
    name: 'O Dilema das Redes',
    workOrConcept: 'Documentário Investigativo (2020) - Dir. Jeff Orlowski',
    mediaType: 'documentario',
    area: 'Documentários',
    directorOrAuthor: 'Jeff Orlowski',
    releaseYear: '2020',
    streamingPlatformOrPublisher: 'Netflix',
    sourceType: 'documentario',
    summary: 'Engenheiros e ex-executivos do Vale do Silício revelam a arquitetura algorítmica desenhada para maximizar o tempo de tela por meio da dopamina, polarização e manipulação do comportamento de massa.',
    howToFit: 'Use na Introdução ou D1 para fundamentar que os algoritmos modernos operam não apenas como ferramentas neutras, mas como sistemas intencionais de engenharia comportamental.',
    suggestedParagraph: 'intro',
    sampleSentence: 'No aclamado documentário "O Dilema das Redes", dirigido por Jeff Orlowski, explicita-se como o modelo de negócios das plataformas digitais mercantiliza a atenção e molda condutas cívicas no espaço público.',
    keyTheses: ['Capitalismo de vigilância', 'Manipulação algorítmica', 'Polarização social']
  },
  {
    id: 'curated-film-5',
    name: 'Nise: O Coração da Loucura',
    workOrConcept: 'Longa-metragem Biográfico Nacional (2015) - Dir. Roberto Berliner',
    mediaType: 'filme',
    area: 'Filmes',
    directorOrAuthor: 'Roberto Berliner',
    releaseYear: '2015',
    streamingPlatformOrPublisher: 'Globoplay / Netflix',
    sourceType: 'filme',
    summary: 'Narra a atuação pioneira da psiquiatra Nise da Silveira no Hospital Psiquiátrico de Engenho de Dentro, que rejeitou métodos violentos como eletrochoque e lobotomia, humanizando o tratamento pela arte e afeto.',
    howToFit: 'Use na Introdução ou D1 para ressaltar a herança de violência e o estigma histórico que cercam os transtornos mentais no Brasil, exaltando o imperativo da escuta terapêutica humanizada.',
    suggestedParagraph: 'intro',
    sampleSentence: 'No aclamado filme "Nise: O Coração da Loucura", dirigido por Roberto Berliner, a luta contra os métodos desumanizantes dos manicômios reflete a urgência histórica de superar o estigma em torno da saúde mental no Brasil.',
    keyTheses: ['Humanização psiquiátrica', 'Superação do estigma', 'Luta antimanicomial']
  },
  {
    id: 'curated-book-6',
    name: 'A Queda do Céu: Palavras de um Xamã Yanomami',
    workOrConcept: 'Obra Literária / Testemunho Antropológico (2010) - Davi Kopenawa e Bruce Albert',
    mediaType: 'livro',
    area: 'Livros & Literatura',
    directorOrAuthor: 'Davi Kopenawa e Bruce Albert',
    releaseYear: '2010',
    streamingPlatformOrPublisher: 'Companhia das Letras',
    sourceType: 'livro',
    summary: 'Relato profundo da cosmologia Yanomami e denúncia devastadora da destruição da floresta pelo garimpo ilegal e pela ganância predatória da civilização dita ocidental.',
    howToFit: 'Utilize na Introdução ou D1 para defender o valor inestimável dos saberes dos povos originários e contrapor a ótica exploratória predatória com a preservação socioambiental.',
    suggestedParagraph: 'intro',
    sampleSentence: 'Na contundente obra "A Queda do Céu", de Davi Kopenawa e Bruce Albert, a sabedoria ancestral Yanomami adverte que o avanço predatório sobre os territórios tradicionais ameaça o equilíbrio existencial de toda a humanidade.',
    keyTheses: ['Cosmologia dos povos originários', 'Crítica ao garimpo predatório', 'Preservação da sociobiodiversidade']
  }
];

export const RepertoireHunterView: React.FC<RepertoireHunterViewProps> = ({
  initialTheme = '',
  onSendToCreation,
  onSendToCorrection,
  onSendToPractice
}) => {
  const { savedWork, setHuntResult: setPersistedHuntResult } = useSavedWork();
  const { startTask, updateTaskProgress, completeTask, failTask } = useBackgroundTasks();

  const [themeInput, setThemeInput] = useState<string>(() => {
    return initialTheme || savedWork.huntResult?.theme || savedWork.hunterThemeInput || '';
  });
  const [customFocus, setCustomFocus] = useState<string>('');
  const [enableGoogleSearch, setEnableGoogleSearch] = useState<boolean>(true);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<RepertoireAreaCategory>('todos');
  const [selectedParagraphFilter, setSelectedParagraphFilter] = useState<'todos' | 'intro' | 'd1' | 'd2'>('todos');
  const [searchInResults, setSearchInResults] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [huntResult, setHuntResult] = useState<RepertoireHunterResponse | null>(() => {
    return savedWork.huntResult || null;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Saved / Favorite Repertoires
  const [savedFavorites, setSavedFavorites] = useState<HuntedRepertoireItem[]>(() => {
    try {
      const stored = localStorage.getItem('enemaster_favorite_repertoires');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeSubTab, setActiveSubTab] = useState<'hunt' | 'favorites'>('hunt');

  const aiProgress = useAiProgress({
    steps: [
      'Analisando o tema e recortando o problema social brasileiro...',
      'Consultando bases legitimadas (Filosofia, Sociologia, Legislação e Artes)...',
      'Realizando busca e checagem factual com Google Search Grounding...',
      'Estruturando estratégias de encaixe produtivo e frases-modelo (C2/C3)...'
    ],
    estimatedDurationMs: 9000,
  });

  useEffect(() => {
    if (initialTheme && initialTheme !== themeInput) {
      setThemeInput(initialTheme);
    }
  }, [initialTheme]);

  // Sync state if background task completed while user was on another tab
  useEffect(() => {
    if (savedWork.huntResult && (!huntResult || savedWork.huntResult.theme !== huntResult.theme)) {
      setHuntResult(savedWork.huntResult);
      if (savedWork.huntResult.theme) {
        setThemeInput(savedWork.huntResult.theme);
      }
    }
  }, [savedWork.huntResult]);

  // Persist Favorites
  useEffect(() => {
    try {
      localStorage.setItem('enemaster_favorite_repertoires', JSON.stringify(savedFavorites));
    } catch (e) {
      console.error('Failed to save favorite repertoires:', e);
    }
  }, [savedFavorites]);

  const handleToggleFavorite = (rep: HuntedRepertoireItem) => {
    setSavedFavorites((prev) => {
      const exists = prev.some((r) => r.id === rep.id || (r.name === rep.name && r.workOrConcept === rep.workOrConcept));
      if (exists) {
        return prev.filter((r) => r.id !== rep.id && !(r.name === rep.name && r.workOrConcept === rep.workOrConcept));
      } else {
        return [{ ...rep, isCustomFavorite: true }, ...prev];
      }
    });
  };

  const isFavorite = (rep: HuntedRepertoireItem) => {
    return savedFavorites.some((r) => r.id === rep.id || (r.name === rep.name && r.workOrConcept === rep.workOrConcept));
  };

  const handleHuntRepertoires = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!themeInput.trim()) {
      setErrorMessage('Por favor, informe o tema da redação.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    aiProgress.startProgress();

    const taskId = `task-repertoire-${Date.now()}`;
    startTask(taskId, 'repertoire_hunter', 'Caçador de Repertórios', themeInput.trim());

    try {
      updateTaskProgress(taskId, 30, 'Consultando bases legitimadas e busca factual...');
      const response = await fetch('/api/hunt-repertoires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: themeInput.trim(),
          customFocus: customFocus.trim(),
          enableSearch: enableGoogleSearch,
          preferredAreas: selectedAreaFilter !== 'todos' ? [selectedAreaFilter] : [],
          repertoireCount: 4,
          excludeTitles: []
        })
      });

      if (!response.ok) {
        throw new Error('Não foi possível obter os repertórios no momento.');
      }

      updateTaskProgress(taskId, 75, 'Formatando estratégias de uso produtivo (C2/C3)...');
      const data: RepertoireHunterResponse = await response.json();
      aiProgress.completeProgress();
      
      // Ensure all repertoires have unique IDs so React keys never collide
      const sanitizedData: RepertoireHunterResponse = {
        ...data,
        repertoires: (data.repertoires || []).map((rep, idx) => ({
          ...rep,
          id: `hunt-rep-init-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`
        }))
      };
      setHuntResult(sanitizedData);
      setPersistedHuntResult(sanitizedData);
      completeTask(taskId, sanitizedData);
      setActiveSubTab('hunt');
    } catch (err: any) {
      aiProgress.resetProgress();
      console.error('Erro no Caçador de Repertórios:', err);
      setErrorMessage('Ocorreu uma instabilidade momentânea na busca de repertórios. Ativando repertórios clássicos curados...');
      // Fallback display
      const fallbackData = {
        theme: themeInput.trim(),
        socialProblem: 'Gargalos estruturais e desafio de efetivação de direitos no Brasil.',
        thematicCut: 'Realidade brasileira contemporânea.',
        pedagogicalInsight: 'Lembre-se: para atingir 200 pontos na C2 e C3, o repertório deve ser legítimo, pertinente e, acima de tudo, ter uso produtivo articulado com a tese.',
        repertoires: CURATED_DEFAULT_REPERTOIRES.slice(0, 4).map((item, idx) => ({
          ...item,
          id: `curated-${item.id}-${Date.now()}-${idx}`
        }))
      };
      setHuntResult(fallbackData);
      setPersistedHuntResult(fallbackData);
      completeTask(taskId, fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreRepertoires = async () => {
    const targetTheme = huntResult?.theme || themeInput.trim();
    if (!targetTheme) {
      setErrorMessage('Por favor, informe o tema da redação.');
      return;
    }

    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      const currentList = huntResult ? huntResult.repertoires : CURATED_DEFAULT_REPERTOIRES.slice(0, 4);
      const excludeTitles = currentList.map(r => r.name);

      const response = await fetch('/api/hunt-repertoires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: targetTheme,
          customFocus: customFocus.trim(),
          enableSearch: enableGoogleSearch,
          preferredAreas: selectedAreaFilter !== 'todos' ? [selectedAreaFilter] : [],
          repertoireCount: 4,
          excludeTitles
        })
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar mais repertórios.');
      }

      const data: RepertoireHunterResponse = await response.json();

      setHuntResult((prev) => {
        const base = prev || {
          theme: targetTheme,
          socialProblem: data.socialProblem || 'Desafios socioculturais associados ao tema.',
          thematicCut: data.thematicCut || 'Brasil contemporâneo.',
          pedagogicalInsight: data.pedagogicalInsight || 'Articule causa e efeito com o tema.',
          repertoires: currentList
        };

        const existingNames = new Set(base.repertoires.map((r) => r.name.toLowerCase().trim()));
        const uniqueNew = (data.repertoires || []).filter((r) => !existingNames.has(r.name.toLowerCase().trim()));
        const rawItems = uniqueNew.length > 0 ? uniqueNew : (data.repertoires || []);

        // Guarantee unique keys for added items so they never collide with previous batch
        const itemsToAdd = rawItems.map((item, idx) => ({
          ...item,
          id: `hunt-rep-more-${Date.now()}-${base.repertoires.length + idx}-${Math.random().toString(36).substring(2, 7)}`
        }));

        // Also merge any new grounding sources
        const existingUrls = new Set((base.groundingSources || []).map((g) => g.url));
        const newSources = (data.groundingSources || []).filter((g) => !existingUrls.has(g.url));

        return {
          ...base,
          groundingSources: [...(base.groundingSources || []), ...newSources],
          repertoires: [...base.repertoires, ...itemsToAdd]
        };
      });
    } catch (err: any) {
      console.error('Erro ao gerar mais repertórios:', err);
      setErrorMessage('Não foi possível gerar mais repertórios adicionais agora. Tente novamente em instantes.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Active repertoires list (from search or curated defaults)
  const activeRepertoires = useMemo(() => {
    const list = huntResult ? huntResult.repertoires : CURATED_DEFAULT_REPERTOIRES;

    return list.filter((rep) => {
      // Filter by Area
      if (selectedAreaFilter !== 'todos' && rep.area !== selectedAreaFilter) {
        return false;
      }
      // Filter by suggested paragraph
      if (selectedParagraphFilter !== 'todos' && rep.suggestedParagraph !== selectedParagraphFilter) {
        return false;
      }
      // Filter by internal search query
      if (searchInResults.trim()) {
        const query = searchInResults.toLowerCase();
        return (
          rep.name.toLowerCase().includes(query) ||
          rep.workOrConcept.toLowerCase().includes(query) ||
          rep.summary.toLowerCase().includes(query) ||
          rep.howToFit.toLowerCase().includes(query) ||
          rep.sampleSentence.toLowerCase().includes(query) ||
          (rep.keyTheses && rep.keyTheses.some(t => t.toLowerCase().includes(query)))
        );
      }
      return true;
    });
  }, [huntResult, selectedAreaFilter, selectedParagraphFilter, searchInResults]);

  const renderAreaIcon = (area: string, className = "w-4 h-4") => {
    switch (area) {
      case 'Filmes': return <Film className={className} />;
      case 'Séries': return <Film className={className} />;
      case 'Livros & Literatura': return <FileText className={className} />;
      case 'Documentários': return <Globe2 className={className} />;
      case 'Filosofia': return <GraduationCap className={className} />;
      case 'Sociologia': return <BookOpen className={className} />;
      case 'Legislação': return <Scale className={className} />;
      case 'Literatura': return <FileText className={className} />;
      case 'História': return <Landmark className={className} />;
      case 'Cinema & Artes': return <Film className={className} />;
      case 'Dados & Estatísticas': return <BarChart3 className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  const renderMediaTypeBadge = (mediaType?: string) => {
    if (!mediaType) return null;
    switch (mediaType) {
      case 'filme':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            🎬 Filme / Cinema
          </span>
        );
      case 'serie':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            📺 Série / Streaming
          </span>
        );
      case 'livro':
      case 'obra_literaria':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            📖 Obra Literária / Livro
          </span>
        );
      case 'documentario':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
            🎥 Documentário Investigativo
          </span>
        );
      default:
        return null;
    }
  };

  const renderSourceTypeBadge = (sourceType?: string) => {
    if (!sourceType) return null;
    switch (sourceType) {
      case 'filme':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            🎬 Cinema
          </span>
        );
      case 'serie':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            📺 Streaming / TV
          </span>
        );
      case 'livro':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            📖 Literatura
          </span>
        );
      case 'documentario':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
            🎥 Documentário
          </span>
        );
      case 'classico':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            🏛️ Clássico Consolidado
          </span>
        );
      case 'contemporaneo':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            ⚡ Crítica Contemporânea
          </span>
        );
      case 'legislativo':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            ⚖️ Base Constitucional / Legal
          </span>
        );
      case 'dados_pesquisa':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
            📊 Dados Oficiais / Pesquisa Real
          </span>
        );
      case 'arte_cultura':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
            🎨 Arte, Cinema & Literatura
          </span>
        );
      default:
        return null;
    }
  };

  const getParagraphBadgeLabel = (p: string) => {
    switch (p) {
      case 'intro': return 'Recomendado: Introdução';
      case 'd1': return 'Recomendado: D1 (Desenvolvimento 1)';
      case 'd2': return 'Recomendado: D2 (Desenvolvimento 2)';
      case 'conclusion': return 'Recomendado: Proposta de Intervenção';
      default: return 'Uso Flexível';
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-xs">
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                Busca de Repertórios & Matriz INEP
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Globe2 className="w-3 h-3 text-emerald-400" />
                Google Search Grounding
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Uso Produtivo C2 & C3
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Caçador de Repertórios Socioculturais & Obras
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Pesquise qualquer tema da redação ENEM para caçar <strong className="text-white">filmes premiados, séries, romances literários, documentários investigativos e dados atuais</strong> com conexão direta ao problema central e o <strong className="text-indigo-300">passo a passo de como encaixar legitimado e produtivo (C2/C3)</strong>.
            </p>
          </div>

          {/* Quick Sub-Tab Toggle (Hunt vs Saved Favorites) */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 p-1.5 rounded-2xl shrink-0">
            <button
              id="subtab-hunt-btn"
              onClick={() => setActiveSubTab('hunt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'hunt'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Caçar Repertórios</span>
            </button>
            <button
              id="subtab-favorites-btn"
              onClick={() => setActiveSubTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'favorites'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Meus Favoritos ({savedFavorites.length})</span>
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleHuntRepertoires} className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
            {/* Main Theme Input */}
            <div className="lg:col-span-7 relative">
              <label htmlFor="theme-hunt-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  Tema da Redação ENEM
                </span>
                <span className="text-[11px] text-indigo-300 font-normal">Digite ou use um tema rápido</span>
              </label>
              <div className="relative">
                <input
                  id="theme-hunt-input"
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder="Ex: Desafios para a valorização do patrimônio cultural e povos tradicionais..."
                  className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-inner"
                />
                {themeInput && (
                  <button
                    type="button"
                    onClick={() => setThemeInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Optional Specific Focus */}
            <div className="lg:col-span-5">
              <label htmlFor="custom-focus-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Foco ou Dúvida (Opcional)
              </label>
              <input
                id="custom-focus-input"
                type="text"
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                placeholder="Ex: Filósofos para D1, dados para D2..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Quick Suggestions & Primary Hunt Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            {/* Sample Theme Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-slate-400 font-semibold text-[11px] whitespace-nowrap flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Temas rápidos:
              </span>
              {SAMPLE_THEMES.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setThemeInput(sample)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 whitespace-nowrap transition-colors cursor-pointer text-left truncate max-w-[200px]"
                  title={sample}
                >
                  {sample.length > 28 ? sample.substring(0, 28) + '...' : sample}
                </button>
              ))}
            </div>

            {/* Search Grounding Toggle + Dominant Hunt Repertoires Button */}
            <div className="flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-2 text-xs text-slate-300 select-none cursor-pointer bg-slate-800/70 hover:bg-slate-800 px-3 py-2 rounded-xl border border-slate-700/70 transition-colors">
                <input
                  type="checkbox"
                  checked={enableGoogleSearch}
                  onChange={(e) => setEnableGoogleSearch(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Busca Web Real</span>
                </span>
              </label>

              <button
                id="submit-hunt-repertoires-btn"
                type="submit"
                disabled={isLoading || !themeInput.trim()}
                className="group relative flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ring-2 ring-white/20"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Caçando Repertórios no ENEM...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                    <span className="tracking-wide">Caçar Repertórios com IA</span>
                    <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Progress Bar during Generation */}
        {isLoading && (
          <div className="mt-4">
            <AiProgressBar
              isLoading={isLoading}
              progress={aiProgress.progress}
              currentStepIndex={aiProgress.currentStepIndex}
              steps={aiProgress.steps}
              title="Caçando Repertórios Socioculturais de Alto Impacto..."
              subtitle="Consultando fontes legitimadas, dados reais e critérios C2/C3 da Matriz INEP"
              accentColor="indigo"
              variant="card"
            />
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Aviso Pedagógico</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* VIEW 1: HUNT REPERTOIRES RESULT VIEW */}
      {activeSubTab === 'hunt' && (
        <div className="space-y-6">
          {/* Pedagogical Insight & Grounding Bar if Search Completed */}
          {huntResult ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Repertórios Selecionados para o Tema</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    "{huntResult.theme}"
                  </h2>
                </div>

                {/* Quick actions for whole theme */}
                <div className="flex items-center gap-2 shrink-0">
                  {onSendToCreation && (
                    <button
                      id="hunt-send-to-creator-btn"
                      onClick={() => onSendToCreation(huntResult.theme)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800/80 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Escrever no Criador</span>
                    </button>
                  )}
                  {onSendToCorrection && (
                    <button
                      id="hunt-send-to-correction-btn"
                      onClick={() => onSendToCorrection(huntResult.theme)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ir ao Corretor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Analytical Breakdown: Social Problem + Recorte */}
              {(huntResult.socialProblem || huntResult.thematicCut || huntResult.pedagogicalInsight) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {huntResult.socialProblem && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        🎯 Problema Central
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {huntResult.socialProblem}
                      </p>
                    </div>
                  )}

                  {huntResult.thematicCut && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        📍 Recorte Temático Brasil
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {huntResult.thematicCut}
                      </p>
                    </div>
                  )}

                  {huntResult.pedagogicalInsight && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                        Dica de Ouro do Corujito (C2/C3)
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {huntResult.pedagogicalInsight}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Grounding Sources (Google Search Metadata) */}
              {huntResult.groundingSources && huntResult.groundingSources.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <Globe2 className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Fontes e Dados Verificados via Busca Google:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {huntResult.groundingSources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:border-indigo-300 font-medium transition-colors"
                      >
                        <span className="truncate max-w-[220px]">{source.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-transparent border border-indigo-200/70 dark:border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Exibindo obras de referência geral. Deseja caçar para o seu tema específico?
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Preencha o tema acima e clique no botão <strong className="text-indigo-600 dark:text-indigo-400">Caçar Repertórios com IA</strong> para obter filmes, séries, livros e dados com conexão direta à sua redação.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const inputEl = document.getElementById('theme-hunt-input');
                  if (inputEl) {
                    inputEl.focus();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Digitar Meu Tema
              </button>
            </div>
          )}

          {/* Filtering Bar (Area Filters + Paragraph Filter + Text Search) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Area Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {AREA_FILTERS.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedAreaFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAreaFilter(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Internal search filter */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInResults}
                  onChange={(e) => setSearchInResults(e.target.value)}
                  placeholder="Filtrar nesta lista..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Paragraph Filter Chips & Count Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold text-[11px] whitespace-nowrap">
                  Filtrar por Parágrafo sugerido:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'todos', label: 'Todos os Parágrafos' },
                    { id: 'intro', label: 'Introdução' },
                    { id: 'd1', label: 'Desenvolvimento 1 (D1)' },
                    { id: 'd2', label: 'Desenvolvimento 2 (D2)' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedParagraphFilter(p.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        selectedParagraphFilter === p.id
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-750'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {activeRepertoires.length} {activeRepertoires.length === 1 ? 'repertório exibido' : 'repertórios exibidos'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Repertoires Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {activeRepertoires.map((rep, idx) => {
              const fav = isFavorite(rep);
              return (
                <div
                  key={rep.id ? `${rep.id}-${idx}` : `rep-${idx}`}
                  id={`rep-card-${rep.id || idx}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-all flex flex-col justify-between space-y-4 group"
                >
                  {/* Card Header: Area + SourceType + Paragraph Badge + Favorite Button */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {renderAreaIcon(rep.area, "w-3.5 h-3.5 text-indigo-500")}
                          <span>{rep.area}</span>
                        </span>
                        {renderMediaTypeBadge(rep.mediaType)}
                        {renderSourceTypeBadge(rep.sourceType)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(rep)}
                        title={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          fav
                            ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {fav ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Author / Work Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {rep.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {rep.workOrConcept}
                      </p>

                      {/* Media details (Director/Author, Release Year, Streaming/Publisher) */}
                      {(rep.directorOrAuthor || rep.releaseYear || rep.streamingPlatformOrPublisher) && (
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          {rep.directorOrAuthor && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              👤 {rep.directorOrAuthor}
                            </span>
                          )}
                          {rep.releaseYear && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              📅 {rep.releaseYear}
                            </span>
                          )}
                          {rep.streamingPlatformOrPublisher && (
                            <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-semibold">
                              📺 {rep.streamingPlatformOrPublisher}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Recommended Paragraph Pill */}
                    <div className="inline-block">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                        📌 {getParagraphBadgeLabel(rep.suggestedParagraph)}
                      </span>
                    </div>

                    {/* Concept Summary */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Síntese do Conceito / Dado:</span>
                      </p>
                      <p>{rep.summary}</p>
                    </div>

                    {/* How to Fit into Theme (Crucial for C2/C3) */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs leading-relaxed">
                      <p className="font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Como encaixar no tema (Uso Produtivo INEP):</span>
                      </p>
                      <p className="text-slate-800 dark:text-slate-200">
                        {rep.howToFit}
                      </p>
                    </div>

                    {/* Sample Sentence (Model Formulation) */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                          <PenTool className="w-3.5 h-3.5 text-amber-600" />
                          <span>Frase-Modelo Pronta para o Parágrafo:</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyText(rep.sampleSentence, rep.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          {copiedId === rep.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar Frase</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 italic font-serif text-[12.5px] leading-relaxed">
                        "{rep.sampleSentence}"
                      </p>
                    </div>

                    {/* Theses Chips */}
                    {rep.keyTheses && rep.keyTheses.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Teses compatíveis:
                        </span>
                        {rep.keyTheses.map((thesis, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            #{thesis}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyText(`${rep.name} (${rep.workOrConcept})\n\nConceito: ${rep.summary}\n\nComo Encaixar: ${rep.howToFit}\n\nFrase Pronta:\n"${rep.sampleSentence}"`, `full-${rep.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedId === `full-${rep.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copiado Completo!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Tudo</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {onSendToPractice && (
                        <button
                          type="button"
                          onClick={() => onSendToPractice(rep.name, huntResult?.theme || themeInput || 'Redação ENEM')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/80 transition-colors cursor-pointer"
                          title="Treinar a redação de um parágrafo com este repertório"
                        >
                          <Target className="w-3.5 h-3.5 text-amber-500" />
                          <span>Treinar Trecho</span>
                        </button>
                      )}

                      {onSendToCreation && (
                        <button
                          type="button"
                          onClick={() => onSendToCreation(huntResult?.theme || themeInput || 'Redação ENEM', `${rep.name} (${rep.workOrConcept})`)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          title="Abrir o Criador de Redações Nota 1000 com este repertório pré-selecionado"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Usar no Criador</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated "Gerar Mais 4 Repertórios" Action Card at the bottom, shown after generating initial 4 repertoires */}
          {huntResult && huntResult.repertoires && huntResult.repertoires.length >= 4 && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Quer caçar mais repertórios para este tema?</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      +4 Obras Inéditas
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    A IA busca uma nova seleção de 4 repertórios legitimados (filmes, literatura, filosofia, dados e leis) sem repetir os {huntResult.repertoires.length} já exibidos.
                  </p>
                </div>
              </div>

              <button
                id="btn-load-more-repertoires-bottom"
                type="button"
                onClick={handleLoadMoreRepertoires}
                disabled={isLoadingMore || isLoading}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 group"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Caçando Mais Repertórios...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                    <span>Caçar Mais Repertórios</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeRepertoires.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nenhum repertório encontrado com os filtros atuais
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tente limpar o filtro de busca ou selecionar "Todas as Áreas" para ver todos os repertórios disponíveis.
              </p>
              <button
                onClick={() => {
                  setSelectedAreaFilter('todos');
                  setSelectedParagraphFilter('todos');
                  setSearchInResults('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SAVED FAVORITES REPERTOIRES */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
                <span>Meus Repertórios Salvos & Favoritos ({savedFavorites.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seu acervo estratégico particular para memorizar e mobilizar com segurança no dia da prova do ENEM.
              </p>
            </div>

            {savedFavorites.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Deseja realmente limpar todos os repertórios favoritos?')) {
                    setSavedFavorites([]);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Favoritos</span>
              </button>
            )}
          </div>

          {savedFavorites.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center mx-auto text-amber-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Nenhum repertório favoritado ainda
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ao pesquisar repertórios no Caçador, clique no ícone de marcador 🔖 para salvar os melhores no seu caderno de repertórios.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('hunt')}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ir para o Caçador de Repertórios
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {savedFavorites.map((rep, idx) => (
                <div
                  key={rep.id ? `fav-${rep.id}-${idx}` : `fav-${idx}`}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {renderAreaIcon(rep.area, "w-3.5 h-3.5 text-indigo-500")}
                        <span>{rep.area}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(rep)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {rep.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {rep.workOrConcept}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Síntese:</p>
                      <p>{rep.summary}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Como Encaixar:</p>
                      <p className="text-slate-800 dark:text-slate-200">{rep.howToFit}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs">
                      <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Frase Pronta:</p>
                      <p className="italic font-serif text-slate-800 dark:text-slate-200">"{rep.sampleSentence}"</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleCopyText(rep.sampleSentence, `fav-${rep.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedId === `fav-${rep.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Frase</span>
                        </>
                      )}
                    </button>

                    {onSendToCreation && (
                      <button
                        type="button"
                        onClick={() => onSendToCreation(themeInput || 'Redação ENEM', `${rep.name} (${rep.workOrConcept})`)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Usar no Criador</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
