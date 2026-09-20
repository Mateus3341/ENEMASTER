import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Check, 
  Search, 
  Layers, 
  GraduationCap, 
  Scale, 
  Landmark, 
  Film, 
  Globe2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  History, 
  Zap, 
  FileText,
  Copy,
  Info,
  Tv
} from 'lucide-react';
import { GeneratedEssayResponse, HuntedRepertoireItem, RepertoireHunterResponse } from '../types';

export interface SelectedRepertoireItem {
  name: string;
  area: string;
  concept?: string;
  targetParagraph?: 'all' | 'intro' | 'd1' | 'd2';
}

interface RepertoireSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  essay?: GeneratedEssayResponse;
  currentEssay?: GeneratedEssayResponse;
  theme?: string;
  onSwapRepertoires: (params: {
    targetScope: 'all' | 'intro' | 'd1' | 'd2';
    newRepertoires: SelectedRepertoireItem[];
    customInstructions?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

type CategoryFilter = 
  | 'recommended' 
  | 'ai_searched' 
  | 'filmes' 
  | 'series' 
  | 'livros' 
  | 'documentarios' 
  | 'filosofia' 
  | 'sociologia' 
  | 'literatura_arte' 
  | 'legislacao' 
  | 'historia_geo' 
  | 'all';

// Curated library of high-impact ENEM repertoires with diverse works
const EXTENDED_REPERTOIRES: Array<{
  id: string;
  name: string;
  workOrConcept: string;
  mediaType?: 'filme' | 'serie' | 'livro' | 'documentario' | 'obra_literaria';
  area: string;
  category: 'filmes' | 'series' | 'livros' | 'documentarios' | 'filosofia' | 'sociologia' | 'literatura_arte' | 'legislacao' | 'historia_geo';
  directorOrAuthor?: string;
  releaseYear?: string;
  streamingPlatformOrPublisher?: string;
  summary: string;
  howToFit: string;
  sampleSentence?: string;
  keyThemes: string[];
}> = [
  // Filmes & Séries
  {
    id: 'film-1',
    name: 'Que Horas Ela Volta?',
    workOrConcept: 'Longa-metragem Nacional (2015) - Dir. Anna Muylaert',
    mediaType: 'filme',
    area: 'Cinema Nacional',
    category: 'filmes',
    directorOrAuthor: 'Anna Muylaert',
    releaseYear: '2015',
    streamingPlatformOrPublisher: 'Globoplay / Netflix',
    summary: 'A trama de Val retrata a naturalização da sobrecarga de trabalho reprodutivo, as barreiras invisíveis de classe e o apagamento materno em prol do sustento de famílias abastadas.',
    howToFit: 'Utilize na Introdução para contrapor o trabalho essencial de cuidado e a invisibilidade histórica enfrentada por mulheres periféricas.',
    sampleSentence: 'No aclamado filme "Que Horas Ela Volta?", dirigido por Anna Muylaert, a trajetória da protagonista Val evidencia a invisibilização histórica imposta às mulheres dedicadas ao trabalho doméstico e de cuidado no Brasil.',
    keyThemes: ['cuidado', 'mulheres', 'trabalho doméstico', 'desigualdade', 'invisibilidade', 'maternidade', 'classes sociais']
  },
  {
    id: 'serie-2',
    name: 'Maid',
    workOrConcept: 'Minissérie Dramática (2021) - Criada por Molly Smith Metzler',
    mediaType: 'serie',
    area: 'Séries & TV',
    category: 'series',
    directorOrAuthor: 'Molly Smith Metzler',
    releaseYear: '2021',
    streamingPlatformOrPublisher: 'Netflix',
    summary: 'Acompanha Alex, jovem mãe solo que assume trabalhos extenuantes de faxina e cuidado infantil para sobreviver à violência doméstica e à burocracia de assistência social.',
    howToFit: 'Mobilize no D1 para comprovar que a ausência de creches públicas e de amparo estatal condena mães solo à precarização e à sobrecarga solitária.',
    sampleSentence: 'Analogamente ao dilema central da minissérie "Maid", a carência de equipamentos públicos e creches condena milhares de mães brasileiras à precarização e à sobrecarga solitária do cuidado.',
    keyThemes: ['maternidade', 'creches', 'trabalho informal', 'violência doméstica', 'omissão estatal', 'mulheres']
  },
  {
    id: 'doc-3',
    name: 'O Dilema das Redes',
    workOrConcept: 'Documentário Investigativo (2020) - Dir. Jeff Orlowski',
    mediaType: 'documentario',
    area: 'Documentários',
    category: 'documentarios',
    directorOrAuthor: 'Jeff Orlowski',
    releaseYear: '2020',
    streamingPlatformOrPublisher: 'Netflix',
    summary: 'Ex-executivos e pesquisadores do Vale do Silício revelam a arquitetura algorítmica desenhada para maximizar o tempo de tela por meio da dopamina, polarização e manipulação do comportamento de massa.',
    howToFit: 'Empregue na Introdução ou D1 para fundamentar que o modelo de negócios das redes sociais manipula a atenção e fragmenta o debate público.',
    sampleSentence: 'No documentário "O Dilema das Redes", dirigido por Jeff Orlowski, explicita-se como o modelo de negócios das plataformas digitais mercantiliza a atenção e molda condutas cívicas no espaço público.',
    keyThemes: ['algoritmos', 'redes sociais', 'tecnologia', 'fake news', 'polarização', 'saúde mental', 'vigilância']
  },
  {
    id: 'film-4',
    name: 'Nise: O Coração da Loucura',
    workOrConcept: 'Longa-metragem Biográfico (2015) - Dir. Roberto Berliner',
    mediaType: 'filme',
    area: 'Cinema Nacional',
    category: 'filmes',
    directorOrAuthor: 'Roberto Berliner',
    releaseYear: '2015',
    streamingPlatformOrPublisher: 'Globoplay / Netflix',
    summary: 'Narra a atuação pioneira da psiquiatra Nise da Silveira contra métodos violentos como eletrochoques e lobotomias, humanizando o tratamento pela arte e afeto.',
    howToFit: 'Aplique na Introdução ou D1 para ressaltar a herança de violência e o estigma histórico em torno dos transtornos mentais no Brasil.',
    sampleSentence: 'No filme "Nise: O Coração da Loucura", dirigido por Roberto Berliner, a luta contra métodos desumanizantes dos manicômios reflete a urgência histórica de superar o estigma em torno da saúde mental no Brasil.',
    keyThemes: ['saúde mental', 'estigma', 'direitos humanos', 'medicina', 'invisibilidade', 'preconceito']
  },
  {
    id: 'book-5',
    name: 'A Queda do Céu',
    workOrConcept: 'Testemunho Antropológico & Obra Literária (2010) - Davi Kopenawa e Bruce Albert',
    mediaType: 'livro',
    area: 'Literatura & Antropologia',
    category: 'livros',
    directorOrAuthor: 'Davi Kopenawa e Bruce Albert',
    releaseYear: '2010',
    streamingPlatformOrPublisher: 'Companhia das Letras',
    summary: 'Relato profundo da cosmologia Yanomami e denúncia devastadora da destruição da floresta pelo garimpo ilegal e pela ganância predatória.',
    howToFit: 'Utilize na Introdução ou D1 para defender o valor inestimável dos saberes dos povos originários e contrapor a ótica exploratória com a preservação socioambiental.',
    sampleSentence: 'Na contundente obra "A Queda do Céu", de Davi Kopenawa e Bruce Albert, a sabedoria ancestral Yanomami adverte que o avanço predatório sobre os territórios tradicionais ameaça o equilíbrio existencial de toda a humanidade.',
    keyThemes: ['povos indígenas', 'meio ambiente', 'tradições', 'garimpo', 'sustentabilidade', 'cultura']
  },
  {
    id: 'book-6',
    name: 'Quarto de Despejo: Diário de uma Favelada',
    workOrConcept: 'Literatura Testemunhal (1960) - Carolina Maria de Jesus',
    mediaType: 'livro',
    area: 'Literatura & Vozes Marginais',
    category: 'livros',
    directorOrAuthor: 'Carolina Maria de Jesus',
    releaseYear: '1960',
    streamingPlatformOrPublisher: 'Editora Ática',
    summary: 'Registra a luta diária de uma mulher negra e mãe solo na favela do Canindé, evidenciando a fome, a invisibilidade social e o desamparo institucional.',
    howToFit: 'Empregue na Introdução ou D1 para ilustrar a dimensão humana e o esquecimento de grupos vulnerabilizados pelo poder público.',
    sampleSentence: 'Tal problemática encontra paralelo na obra "Quarto de Despejo", de Carolina Maria de Jesus, na qual o desamparo estatal e a invisibilidade social relegam indivíduos vulneráveis à periferia das garantias fundamentais.',
    keyThemes: ['fome', 'invisibilidade', 'mulheres', 'moradia', 'cuidado', 'desigualdade', 'pobreza']
  },

  // Filosofia
  {
    id: 'phil-1',
    name: 'Zygmunt Bauman',
    workOrConcept: 'Modernidade Líquida & Cegueira Moral',
    area: 'Filosofia',
    category: 'filosofia',
    summary: 'Explica a fragilização dos laços comunitários, a mercantilização da vida e a indiferença ética diante do sofrimento alheio.',
    howToFit: 'Mobilize no D1 ou D2 para argumentar que a indiferença da coletividade e o individualismo contemporâneo perpetuam a negligência social.',
    sampleSentence: 'Sob essa perspectiva, a tese da "cegueira moral", formulada por Zygmunt Bauman, elucida como a apatia social e o individualismo contemporâneo perpetuam a indiferença diante da vulnerabilidade de parcelas marginalizadas.',
    keyThemes: ['individualismo', 'consumismo', 'redes sociais', 'abandono', 'saúde mental', 'invisibilidade', 'idosos', 'mulheres']
  },
  {
    id: 'phil-2',
    name: 'Hannah Arendt',
    workOrConcept: 'Banalidade do Mal (Eichmann em Jerusalém)',
    area: 'Filosofia',
    category: 'filosofia',
    summary: 'Demonstra a naturalização e a burocratização de injustiças estruturais quando a sociedade para de refletir criticamente.',
    howToFit: 'Aplique no D1 para provar que a negligência das instituições e a passividade da população tornam crimes e desamparos banais no cotidiano.',
    sampleSentence: 'Nesse viés, o conceito de "banalidade do mal", cunhado por Hannah Arendt, aplica-se à naturalização com que a sociedade convive passivamente diante da violação de direitos essenciais.',
    keyThemes: ['violência', 'negligência estatal', 'discriminação', 'cuidado', 'direitos humanos', 'preconceito']
  },
  {
    id: 'phil-5',
    name: 'Byung-Chul Han',
    workOrConcept: 'Sociedade do Cansaço & Sociedade Paliativa',
    area: 'Filosofia',
    category: 'filosofia',
    summary: 'Critica a autoexploração desenfreada, a positividade tóxica e o esgotamento psíquico na era digital contemporânea.',
    howToFit: 'Encaixe no D1 ou D2 para analisar crises de ansiedade, esgotamento mental e a cobrança implacável por produtividade.',
    sampleSentence: 'Consoante a reflexão de Byung-Chul Han em "Sociedade do Cansaço", a busca compulsiva por desempenho e a autoexploração contínua convertem a saúde psíquica em mercadoria descartável.',
    keyThemes: ['saúde mental', 'burnout', 'trabalho', 'internet', 'algoritmos', 'ansiedade', 'solidão']
  },
  {
    id: 'phil-8',
    name: 'Ailton Krenak',
    workOrConcept: 'Ideias para Adiar o Fim do Mundo',
    area: 'Filosofia Indígena',
    category: 'filosofia',
    summary: 'Propõe a reconexão com a ancestralidade e a natureza contra o modelo predatório da modernidade consumista.',
    howToFit: 'Use na Introdução para criticar a dissociação do homem ocidental com o meio ambiente e o valor dos saberes originários.',
    sampleSentence: 'Segundo Ailton Krenak em "Ideias para Adiar o Fim do Mundo", a ilusão antropocêntrica de domínio sobre a natureza desagrega a comunidade e fomenta crises socioambientais recorrentes.',
    keyThemes: ['povos tradicionais', 'meio ambiente', 'indígenas', 'sustentabilidade', 'cultura']
  },

  // Sociologia
  {
    id: 'soc-1',
    name: 'Pierre Bourdieu',
    workOrConcept: 'Violência Simbólica & Reprodução Social',
    area: 'Sociologia',
    category: 'sociologia',
    summary: 'Mostra como desigualdades econômicas e culturais são perpetuadas e naturalizadas pelas próprias instituições sem contestação visível.',
    howToFit: 'Aplique no D2 para demonstrar que preconceitos estruturais históricos e estereótipos operam de modo invisível no imaginário social brasileiro.',
    sampleSentence: 'Ademais, a análise de Pierre Bourdieu sobre a violência simbólica torna-se imperativa, haja vista que preconceitos enraizados na cultura brasileira naturalizam a exclusão sem que haja repulsa coletiva explícita.',
    keyThemes: ['educação', 'desigualdade', 'escolas', 'cultura', 'preconceito de classe', 'acesso']
  },
  {
    id: 'soc-4',
    name: 'Djamila Ribeiro',
    workOrConcept: 'Pequeno Manual Antirracista & Lugar de Fala',
    area: 'Sociologia Crítica',
    category: 'sociologia',
    summary: 'Evidencia a necessidade de romper o silenciamento estrutural das minorias para a superação das opressões históricas.',
    howToFit: 'Use no D1 para defender o protagonismo de grupos historicamente subalternizados e a urgência de representatividade efetiva.',
    sampleSentence: 'Na perspectiva da filósofa Djamila Ribeiro, é indispensável reconhecer as estruturas coloniais que perpetuam a opressão para que se possa construir uma cidadania verdadeiramente equânime.',
    keyThemes: ['racismo', 'mulheres', 'interseccionalidade', 'visibilidade', 'cuidado', 'herança africana']
  },

  // Legislação
  {
    id: 'leg-1',
    name: 'Constituição Federal de 1988 (CF/88)',
    workOrConcept: 'Art. 6º (Direitos Sociais) & Art. 1º (Dignidade da Pessoa Humana)',
    area: 'Legislação & CF/88',
    category: 'legislacao',
    summary: 'A Constituição Cidadã consagra que saúde, educação, moradia, segurança, lazer e amparo social são direitos fundamentais inalienáveis.',
    howToFit: 'Utilize na Introdução como contextualização de partida para criar uma antítese entre a garantia da Carta Magna e o descompasso na realidade brasileira.',
    sampleSentence: 'Embora a Constituição Cidadã de 1988 preconize a dignidade humana e o amparo social pleno a todos os indivíduos, a persistência desse cenário no Brasil escancara a dissonância entre o preceito legal e a realidade empírica.',
    keyThemes: ['todos os temas', 'cidadania', 'dignidade', 'saúde', 'educação', 'idosos', 'cultura']
  },

  // História & Geografia
  {
    id: 'geo-1',
    name: 'Milton Santos',
    workOrConcept: 'O Espaço do Cidadão & Cidadanias Mutiladas',
    area: 'Geografia Crítica',
    category: 'historia_geo',
    summary: 'O geógrafo brasileiro postula que milhões de brasileiros possuem cidadania incompleta, na qual os direitos existem na lei, mas são cerceados por barreiras socioespaciais.',
    howToFit: 'Encaixe no D1 para comprovar que a disparidade no acesso a serviços públicos de qualidade cria uma massa de cidadãos incompletos no país.',
    sampleSentence: 'Nesse viés, o conceito de cidadania mutilada, cunhado por Milton Santos, sintetiza a condição dos cidadãos que, desprovidos de assistência pública adequada, são impedidos de usufruir seus direitos civis plenos.',
    keyThemes: ['registro civil', 'urbanização', 'invisibilidade', 'cidadania', 'desigualdade territorial']
  }
];

// 1-Click Themed Combinations (Packs)
const REPERTOIRE_PACKS = [
  {
    title: 'Cinema Nacional & Realidade Social',
    badge: '🎬 Obras Brasileiras',
    description: 'Que Horas Ela Volta? + Bacurau + CF/88',
    reps: [
      { name: 'Que Horas Ela Volta? (Anna Muylaert)', area: 'Cinema Nacional' },
      { name: 'Bacurau (Kleber Mendonça Filho)', area: 'Cinema Nacional' }
    ]
  },
  {
    title: 'Pensamento Brasileiro & Cidadania',
    badge: '🏛️ Brasil Autêntico',
    description: 'Milton Santos (Cidadanias Mutiladas) + Carolina Maria de Jesus',
    reps: [
      { name: 'Milton Santos (Cidadanias Mutiladas)', area: 'Geografia Crítica' },
      { name: 'Carolina Maria de Jesus (Quarto de Despejo)', area: 'Literatura & Vozes Marginais' }
    ]
  },
  {
    title: 'Filosofia Contemporânea & Crítica',
    badge: '🧠 Crítica Estrutural',
    description: 'Zygmunt Bauman (Cegueira Moral) + Byung-Chul Han',
    reps: [
      { name: 'Zygmunt Bauman (Modernidade Líquida & Cegueira Moral)', area: 'Filosofia' },
      { name: 'Byung-Chul Han (Sociedade do Cansaço)', area: 'Filosofia' }
    ]
  },
  {
    title: 'Vozes Originais & Socioambiental',
    badge: '🌿 Ancestralidade',
    description: 'Davi Kopenawa (A Queda do Céu) + Ailton Krenak',
    reps: [
      { name: 'Davi Kopenawa & Bruce Albert (A Queda do Céu)', area: 'Literatura & Antropologia' },
      { name: 'Ailton Krenak (Ideias para Adiar o Fim do Mundo)', area: 'Filosofia Indígena' }
    ]
  }
];

export const RepertoireSwapModal: React.FC<RepertoireSwapModalProps> = ({
  isOpen,
  onClose,
  essay,
  currentEssay,
  theme,
  onSwapRepertoires,
  isLoading
}) => {
  const activeEssay = essay || currentEssay;
  const currentTheme = activeEssay?.theme || theme || 'Tema da Redação ENEM';

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('recommended');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [targetScope, setTargetScope] = useState<'all' | 'intro' | 'd1' | 'd2'>('all');
  const [selectedRepertoires, setSelectedRepertoires] = useState<SelectedRepertoireItem[]>([]);
  const [customInputText, setCustomInputText] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  // Live AI & Web Search states (Google Search Grounding)
  const [aiSearchedRepertoires, setAiSearchedRepertoires] = useState<HuntedRepertoireItem[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState<boolean>(false);
  const [searchAIMessage, setSearchAIMessage] = useState<string | null>(null);
  const [copiedSampleId, setCopiedSampleId] = useState<string | null>(null);

  // Extract current repertoires safely
  const currentRepertoires = useMemo(() => {
    if (!activeEssay || !Array.isArray(activeEssay.repertoriosUsed)) return [];
    return activeEssay.repertoriosUsed.map((r) => {
      if (typeof r === 'string') {
        return { name: r, area: 'Repertório' };
      }
      return {
        name: r?.name || 'Repertório sem nome',
        area: r?.area || 'Área do Conhecimento'
      };
    });
  }, [activeEssay]);

  // Handle Search via AI + Google Search Grounding with context of current theme
  const handleSearchWithAI = async (queryTerm?: string, preferredAreaName?: string) => {
    const term = queryTerm !== undefined ? queryTerm : searchQuery;
    setIsSearchingAI(true);
    setSearchAIMessage(null);

    const areas = preferredAreaName ? [preferredAreaName] : [];

    try {
      const res = await fetch('/api/hunt-repertoires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: currentTheme,
          customFocus: term.trim() || undefined,
          preferredAreas: areas,
          enableSearch: true
        })
      });

      if (!res.ok) throw new Error('Falha ao buscar repertórios na web.');
      const data: RepertoireHunterResponse = await res.json();

      if (data.repertoires && Array.isArray(data.repertoires) && data.repertoires.length > 0) {
        setAiSearchedRepertoires(data.repertoires);
        setSelectedCategory('ai_searched');
        setSearchAIMessage(`Caçados ${data.repertoires.length} repertórios legitimados, obras e dados verificados para o tema!`);
      } else {
        setSearchAIMessage('A IA consultou a web mas retornou repertórios padrão. Experimente outro termo de busca.');
      }
    } catch (err) {
      console.error('[RepertoireSwapModal] Erro na busca com IA:', err);
      setSearchAIMessage('Não foi possível conectar à pesquisa online no momento. Exibindo catálogo local com sucesso.');
    } finally {
      setIsSearchingAI(false);
    }
  };

  // Filter static catalog based on theme keywords & category
  const themeLower = (currentTheme || '').toLowerCase();

  const filteredRepertoires = useMemo(() => {
    return EXTENDED_REPERTOIRES.filter((item) => {
      if (selectedCategory === 'ai_searched') return false;

      if (selectedCategory === 'recommended') {
        const isMatch = (item.keyThemes || []).some((k) => themeLower.includes(k.toLowerCase())) ||
          item.name.toLowerCase().includes('constituição') ||
          item.name.toLowerCase().includes('bauman') ||
          item.name.toLowerCase().includes('bourdieu') ||
          item.category === 'filmes' ||
          item.category === 'series';
        if (!isMatch && !searchQuery.trim()) return false;
      } else if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          (item.name || '').toLowerCase().includes(query) ||
          (item.workOrConcept || '').toLowerCase().includes(query) ||
          (item.summary || '').toLowerCase().includes(query) ||
          (item.area || '').toLowerCase().includes(query) ||
          (item.directorOrAuthor || '').toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedCategory, searchQuery, themeLower]);

  if (!isOpen) return null;

  const handleToggleSelectHuntedRepertoire = (rep: HuntedRepertoireItem) => {
    setSelectedRepertoires((prev) => {
      const repTitle = rep.workOrConcept ? `${rep.name} (${rep.workOrConcept})` : rep.name;
      const exists = prev.some((r) => r.name.toLowerCase() === repTitle.toLowerCase());
      if (exists) {
        return prev.filter((r) => r.name.toLowerCase() !== repTitle.toLowerCase());
      } else {
        const item: SelectedRepertoireItem = {
          name: repTitle,
          area: rep.area || 'Repertório Legitimado',
          concept: `${rep.summary || ''} — Como encaixar: ${rep.howToFit || ''}`,
          targetParagraph: targetScope
        };
        if (targetScope === 'd1' || targetScope === 'd2' || targetScope === 'intro') {
          return [item];
        }
        return [...prev, item];
      }
    });
  };

  const handleToggleSelectRepertoire = (item: typeof EXTENDED_REPERTOIRES[0]) => {
    setSelectedRepertoires((prev) => {
      const itemTitle = item.workOrConcept ? `${item.name} (${item.workOrConcept})` : item.name;
      const exists = prev.some((r) => r.name.toLowerCase() === itemTitle.toLowerCase());
      if (exists) {
        return prev.filter((r) => r.name.toLowerCase() !== itemTitle.toLowerCase());
      } else {
        const newItem: SelectedRepertoireItem = {
          name: itemTitle,
          area: item.area,
          concept: `${item.summary} — Como encaixar: ${item.howToFit}`,
          targetParagraph: targetScope
        };
        if (targetScope === 'd1' || targetScope === 'd2' || targetScope === 'intro') {
          return [newItem];
        }
        return [...prev, newItem];
      }
    });
  };

  const handleAddCustomRepertoire = () => {
    if (!customInputText.trim()) return;
    const newItem: SelectedRepertoireItem = {
      name: customInputText.trim(),
      area: 'Personalizado',
      targetParagraph: targetScope
    };
    setSelectedRepertoires((prev) => [...prev, newItem]);
    setCustomInputText('');
  };

  const handleApplyPack = (pack: typeof REPERTOIRE_PACKS[0]) => {
    const items: SelectedRepertoireItem[] = pack.reps.map((rep) => ({
      name: rep.name,
      area: rep.area,
      targetParagraph: 'all'
    }));
    setSelectedRepertoires(items);
    setTargetScope('all');
  };

  const handleExecuteSwap = async () => {
    if (selectedRepertoires.length === 0 && !customInputText.trim() && !customInstructions.trim()) {
      return;
    }

    let finalItems = [...selectedRepertoires];
    if (customInputText.trim()) {
      finalItems.push({
        name: customInputText.trim(),
        area: 'Personalizado',
        targetParagraph: targetScope
      });
    }

    await onSwapRepertoires({
      targetScope,
      newRepertoires: finalItems,
      customInstructions: customInstructions.trim()
    });
  };

  const handleCopySample = (id: string, sentence: string) => {
    if (!sentence) return;
    navigator.clipboard.writeText(sentence);
    setCopiedSampleId(id);
    setTimeout(() => setCopiedSampleId(null), 2500);
  };

  const renderAreaIcon = (area: string, className = "w-3.5 h-3.5") => {
    const a = (area || '').toLowerCase();
    if (a.includes('film') || a.includes('cinema')) return <Film className={className} />;
    if (a.includes('séri') || a.includes('tv') || a.includes('streaming')) return <Tv className={className} />;
    if (a.includes('livro') || a.includes('literat')) return <FileText className={className} />;
    if (a.includes('doc')) return <Globe2 className={className} />;
    if (a.includes('filos')) return <GraduationCap className={className} />;
    if (a.includes('sociol')) return <BookOpen className={className} />;
    if (a.includes('legis') || a.includes('lei') || a.includes('cf')) return <Scale className={className} />;
    if (a.includes('hist') || a.includes('geo')) return <Landmark className={className} />;
    return <Sparkles className={className} />;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-slate-50 dark:from-amber-950/40 dark:via-indigo-950/20 dark:to-slate-900 flex items-center justify-between gap-4 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Inteligência Argumentativa (C2)
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Padrão INEP Nota 1000
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate">
              <BookOpen className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Trocar Repertórios Socioculturais & Obras</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-2xl" title={currentTheme}>
              Contexto do Tema: <strong className="text-slate-900 dark:text-slate-200">{currentTheme}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Current Active Repertoires in Essay */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Repertórios Atualmente Mobilizados no Texto ({currentRepertoires.length}):
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Serão substituídos ou rearticulados na nova versão
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentRepertoires.length > 0 ? (
                currentRepertoires.map((rep, i) => (
                  <div 
                    key={i} 
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rep.name}</span>
                    <span className="text-[10px] text-slate-400">({rep.area})</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Nenhum repertório anterior registrado.</p>
              )}
            </div>
          </div>

          {/* Section 2: Scope Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Onde você quer aplicar a troca de repertório?</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Escopo da Modificação</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Toda a Redação', desc: 'Reescrever Intro, D1 e D2' },
                { id: 'd1', label: 'Apenas D1', desc: 'Trocar repertório do D1' },
                { id: 'd2', label: 'Apenas D2', desc: 'Trocar repertório do D2' },
                { id: 'intro', label: 'Apenas Introdução', desc: 'Trocar alusão inicial' },
              ].map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setTargetScope(scope.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    targetScope === scope.id
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/70 ring-2 ring-amber-200 dark:ring-amber-800 text-amber-950 dark:text-amber-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs block font-bold">{scope.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">{scope.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Priority AI Hunt & Real Web Search */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-indigo-900/80 border border-indigo-500/30 text-white space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Caçador de Repertórios Exclusivos para o Tema
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Pesquise por filmes, séries, conceitos ou clique em <strong className="text-white">Caçar Repertórios com IA</strong> para encontrar referências com Google Grounding.
                </p>
              </div>

              {/* Search input & Prominent AI Hunt button */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchWithAI(searchQuery);
                      }
                    }}
                    placeholder="Ex: Filme, série, filósofo ou conceito..."
                    className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-inner"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSearchWithAI(searchQuery)}
                  disabled={isSearchingAI}
                  className="group relative flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-950/30 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 shrink-0 ring-1 ring-white/30"
                  title="Pesquisar novos repertórios e dados oficiais usando IA com Google Search Grounding no contexto do tema"
                >
                  {isSearchingAI ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>Buscando na Web...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
                      <span>Caçar com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Search notification banner */}
            {searchAIMessage && (
              <div className="p-3 rounded-xl bg-indigo-900/60 border border-indigo-400/40 text-xs text-indigo-100 flex items-center justify-between animate-in fade-in">
                <span className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-medium">{searchAIMessage}</span>
                </span>
                {aiSearchedRepertoires.length > 0 && selectedCategory !== 'ai_searched' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ai_searched')}
                    className="font-bold underline text-amber-300 hover:text-white cursor-pointer ml-2"
                  >
                    Ver Obras Caçadas ({aiSearchedRepertoires.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section 4: 1-Click Packs (De-emphasized Accordion/Compact) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Combos Rápidos de Repertórios (1 Clique):
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {REPERTOIRE_PACKS.map((pack, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPack(pack)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                        {pack.badge}
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                        Aplicar +
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                      {pack.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {pack.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Extended Catalog & Filtering */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Catálogo de Repertórios Legitimados:
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {selectedCategory === 'ai_searched' ? `${aiSearchedRepertoires.length} descobertas da web` : `${filteredRepertoires.length} repertórios disponíveis`}
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'recommended', label: '⭐ Recomendados para o Tema' },
                ...(aiSearchedRepertoires.length > 0
                  ? [{ id: 'ai_searched', label: `⚡ Descobertas da IA & Web (${aiSearchedRepertoires.length})` }]
                  : []),
                { id: 'filmes', label: '🎬 Filmes' },
                { id: 'series', label: '📺 Séries' },
                { id: 'livros', label: '📖 Livros & Literatura' },
                { id: 'documentarios', label: '🎥 Documentários' },
                { id: 'filosofia', label: '🏛️ Filosofia' },
                { id: 'sociologia', label: '👥 Sociologia' },
                { id: 'legislacao', label: '⚖️ Legislação & CF/88' },
                { id: 'historia_geo', label: '📜 História & Geografia' },
                { id: 'all', label: 'Todos' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Repertoire Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {/* If AI Searched Category Selected */}
              {selectedCategory === 'ai_searched' ? (
                aiSearchedRepertoires.map((rep) => {
                  const repTitle = rep.workOrConcept ? `${rep.name} (${rep.workOrConcept})` : rep.name;
                  const isSelected = selectedRepertoires.some(
                    (r) => r.name.toLowerCase() === repTitle.toLowerCase() || r.name.toLowerCase().includes(rep.name.toLowerCase())
                  );
                  return (
                    <div
                      key={rep.id || Math.random().toString()}
                      onClick={() => handleToggleSelectHuntedRepertoire(rep)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/80 ring-2 ring-indigo-300 dark:ring-indigo-700 shadow-xs'
                          : 'border-indigo-200/90 dark:border-indigo-800/80 bg-white dark:bg-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {renderAreaIcon(rep.area || rep.mediaType || '', 'w-3.5 h-3.5 text-indigo-500')}
                              {rep.name}
                            </span>
                            {rep.workOrConcept && (
                              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {rep.workOrConcept}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300">
                              {rep.area || 'Legitimado'}
                            </span>
                            {isSelected && (
                              <span className="p-1 rounded-full bg-indigo-600 text-white">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Media details */}
                        {(rep.directorOrAuthor || rep.releaseYear || rep.streamingPlatformOrPublisher) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                            {rep.directorOrAuthor && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                👤 {rep.directorOrAuthor}
                              </span>
                            )}
                            {rep.releaseYear && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                📅 {rep.releaseYear}
                              </span>
                            )}
                            {rep.streamingPlatformOrPublisher && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold">
                                📺 {rep.streamingPlatformOrPublisher}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          {rep.summary}
                        </p>

                        {rep.howToFit && (
                          <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/50 text-[10.5px] text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900/60 leading-relaxed">
                            <strong>Como Encaixar no Texto:</strong> {rep.howToFit}
                          </div>
                        )}

                        {rep.sampleSentence && (
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10.5px] text-slate-700 dark:text-slate-300 font-serif italic relative group/sample">
                            <span>"{rep.sampleSentence}"</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySample(rep.id || rep.name, rep.sampleSentence!);
                              }}
                              className="absolute right-1.5 top-1.5 p-1 rounded bg-white dark:bg-slate-700 text-slate-500 hover:text-indigo-600 shadow-2xs cursor-pointer opacity-80 hover:opacity-100"
                              title="Copiar frase pronta"
                            >
                              {copiedSampleId === (rep.id || rep.name) ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px]">
                        <span className="text-slate-500 font-medium">
                          {rep.suggestedParagraph ? `Recomendado: ${rep.suggestedParagraph.toUpperCase()}` : 'Uso flexível'}
                        </span>
                        <span className={`font-bold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-indigo-600 dark:text-indigo-400'}`}>
                          {isSelected ? '✓ Selecionado' : '+ Selecionar para Troca'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                filteredRepertoires.map((rep) => {
                  const repTitle = rep.workOrConcept ? `${rep.name} (${rep.workOrConcept})` : rep.name;
                  const isSelected = selectedRepertoires.some(
                    (r) => r.name.toLowerCase() === repTitle.toLowerCase() || r.name.toLowerCase().includes(rep.name.toLowerCase())
                  );
                  return (
                    <div
                      key={rep.id}
                      onClick={() => handleToggleSelectRepertoire(rep)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/70 ring-2 ring-amber-300 dark:ring-amber-700 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {renderAreaIcon(rep.area, 'w-3.5 h-3.5 text-amber-500')}
                              {rep.name}
                            </span>
                            {rep.workOrConcept && (
                              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {rep.workOrConcept}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {rep.area}
                            </span>
                            {isSelected && (
                              <span className="p-1 rounded-full bg-amber-500 text-slate-950 font-black">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Media details */}
                        {(rep.directorOrAuthor || rep.releaseYear || rep.streamingPlatformOrPublisher) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                            {rep.directorOrAuthor && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                👤 {rep.directorOrAuthor}
                              </span>
                            )}
                            {rep.releaseYear && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                                📅 {rep.releaseYear}
                              </span>
                            )}
                            {rep.streamingPlatformOrPublisher && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold">
                                📺 {rep.streamingPlatformOrPublisher}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {rep.summary}
                        </p>

                        {rep.howToFit && (
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-[10.5px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 leading-relaxed">
                            <strong>Como Encaixar:</strong> {rep.howToFit}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px]">
                        <span className="text-slate-400 font-medium truncate max-w-[200px]">
                          Eixos: {(rep.keyThemes || []).slice(0, 3).join(', ')}
                        </span>
                        <span className={`font-bold ${isSelected ? 'text-amber-700 dark:text-amber-300' : 'text-indigo-600 dark:text-indigo-400'}`}>
                          {isSelected ? '✓ Selecionado' : '+ Selecionar'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {selectedCategory !== 'ai_searched' && filteredRepertoires.length === 0 && (
                <div className="col-span-2 p-8 text-center text-slate-500 dark:text-slate-400 space-y-3">
                  <p className="text-sm font-semibold">Nenhum repertório no catálogo estático para esta busca.</p>
                  <button
                    type="button"
                    onClick={() => handleSearchWithAI(searchQuery)}
                    disabled={isSearchingAI}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Buscar Obras na Web com IA (Google Search)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Custom Input & Repertoire Tray */}
          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 block">
              Adicionar Repertório Próprio ou Instruções Especiais:
            </span>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomRepertoire();
                  }
                }}
                placeholder="Ex: Filme Bacurau, Ailton Krenak (A Vida Não É Útil), Art. 215 da CF/88..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomRepertoire}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                + Adicionar
              </button>
            </div>

            {/* Selected items tray */}
            {selectedRepertoires.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Repertórios que serão integrados na nova versão ({selectedRepertoires.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRepertoires.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate max-w-[240px]">{item.name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedRepertoires(prev => prev.filter((_, i) => i !== idx))}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                        title="Remover"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional instructions */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Instrução Adicional para a IA (Opcional):
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Ex: Focar o D1 na raiz histórica e manter a proposta de intervenção centrada no MEC..."
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <span>Escopo: <strong>{targetScope === 'all' ? 'Toda a redação' : targetScope === 'd1' ? 'Desenvolvimento 1' : targetScope === 'd2' ? 'Desenvolvimento 2' : 'Introdução'}</strong></span>
            <span className="mx-2">•</span>
            <span>Repertórios selecionados: <strong>{selectedRepertoires.length}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isLoading || (selectedRepertoires.length === 0 && !customInputText.trim() && !customInstructions.trim())}
              onClick={handleExecuteSwap}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-950/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reescrevendo com Novos Repertórios...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>REESCREVER REDAÇÃO NOTA 1000</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
