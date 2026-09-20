import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  PenTool, 
  CheckCircle2,
  FileText,
  User,
  Bot,
  Globe,
  Zap,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ArrowRight,
  Layers,
  Lightbulb,
  MessageSquare,
  Plus,
  History,
  AlertTriangle,
  Edit2,
  X
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ProfessorMessage, ProfessorChatSession, ChatModelMode, GroundingSource } from '../types';
import { EnemasterMascot } from './EnemasterMascot';

interface ProfessorChatViewProps {
  essayContext?: string;
  themeContext?: string;
}

const STORAGE_KEYS = {
  SESSIONS: 'enem_professor_chat_sessions_v3',
  ACTIVE_SESSION_ID: 'enem_professor_active_session_id_v3',
  LEGACY_MESSAGES: 'enem_professor_chat_messages_v2',
  PERSONA: 'enem_professor_chat_persona_v2',
  MODEL_MODE: 'enem_professor_chat_model_mode_v2',
  ENABLE_SEARCH: 'enem_professor_chat_enable_search_v2',
  FOCUS_COMPETENCY: 'enem_professor_chat_focus_comp_v2',
  INPUT_DRAFT: 'enem_professor_chat_input_draft_v1',
};

const createDefaultWelcomeMessage = (): ProfessorMessage => ({
  id: `welcome-${Date.now()}`,
  role: 'assistant',
  content: `### Olá! Sou o Mestre Corujito, seu mentor especialista em Redação do ENEM! 🎓\n\nEstou equipado com a **Matriz Oficial de Correção do INEP** e **Busca Google em Tempo Real** para te guiar rumo à **Redação Nota 1000**.\n\nComo posso te ajudar hoje?\n- 🔍 **Pesquise dados e repertórios atuais** com fundamentação real do Brasil\n- ✍️ **Cole um parágrafo** para análise cirúrgica e reescrita modelo\n- 🎯 **Tire dúvidas** sobre teses bipartidas, operadores coesivos ou os 5 elementos da C5.`,
  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  suggestedFollowUps: [
    'Como formular uma tese bipartida perfeita na introdução?',
    'Quais dados recentes e repertórios posso usar para o tema atual?',
    'Qual a fórmula garantida dos 5 elementos da proposta de intervenção?'
  ]
});

const createNewSession = (title = 'Nova Conversa'): ProfessorChatSession => {
  const id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [createDefaultWelcomeMessage()],
    persona: 'professor',
    focusCompetency: 'all'
  };
};

export const ProfessorChatView: React.FC<ProfessorChatViewProps> = ({ 
  essayContext = '', 
  themeContext = '' 
}) => {
  const [persona, setPersona] = useState<'professor' | 'corretor' | 'escritor' | 'analista_trecho'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERSONA);
      if (stored && ['professor', 'corretor', 'escritor', 'analista_trecho'].includes(stored)) {
        return stored as any;
      }
    } catch {}
    return 'professor';
  });

  const [modelMode, setModelMode] = useState<ChatModelMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MODEL_MODE);
      if (stored && ['flash', 'search', 'fast', 'pro'].includes(stored)) {
        return stored as any;
      }
    } catch {}
    return 'flash';
  });

  const [enableSearch, setEnableSearch] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENABLE_SEARCH);
      if (stored !== null) return stored === 'true';
    } catch {}
    return true;
  });

  const [focusCompetency, setFocusCompetency] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FOCUS_COMPETENCY);
      if (stored) return stored;
    } catch {}
    return 'all';
  });

  const [useEssayContext, setUseEssayContext] = useState<boolean>(true);

  // Multi-session state with migration
  const [sessions, setSessions] = useState<ProfessorChatSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Check legacy messages to migrate
      const legacyStored = localStorage.getItem(STORAGE_KEYS.LEGACY_MESSAGES);
      if (legacyStored) {
        const legacyParsed = JSON.parse(legacyStored);
        if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
          const migratedSession: ProfessorChatSession = {
            id: `session-migrated-${Date.now()}`,
            title: 'Conversa Anterior',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: legacyParsed,
            persona: 'professor',
            focusCompetency: 'all'
          };
          return [migratedSession];
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar sessões de chat:', err);
    }
    return [createNewSession('Primeira Conversa')];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
      if (stored) return stored;
    } catch {}
    return sessions[0]?.id || '';
  });

  // Ensure active session exists
  useEffect(() => {
    if (!sessions.some(s => s.id === activeSessionId)) {
      if (sessions.length > 0) {
        setActiveSessionId(sessions[0].id);
      } else {
        const newSess = createNewSession('Nova Conversa');
        setSessions([newSess]);
        setActiveSessionId(newSess.id);
      }
    }
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || createNewSession();
  const messages = activeSession.messages || [];

  // Local UI State
  const [inputValue, setInputValue] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.INPUT_DRAFT) || '';
    } catch {
      return '';
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedSourcesId, setExpandedSourcesId] = useState<string | null>(null);
  const [showSessionsDrawer, setShowSessionsDrawer] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isLoading]);

  // Persist sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, activeSessionId);
    } catch (e) {
      console.warn('Erro ao salvar sessões no localStorage:', e);
    }
  }, [sessions, activeSessionId]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONA, persona);
      localStorage.setItem(STORAGE_KEYS.MODEL_MODE, modelMode);
      localStorage.setItem(STORAGE_KEYS.ENABLE_SEARCH, String(enableSearch));
      localStorage.setItem(STORAGE_KEYS.FOCUS_COMPETENCY, focusCompetency);
    } catch (e) {
      console.warn('Erro ao salvar configurações do chat no localStorage:', e);
    }
  }, [persona, modelMode, enableSearch, focusCompetency]);

  // Persist typed message draft to localStorage to prevent accidental data loss
  useEffect(() => {
    try {
      if (inputValue && inputValue.trim()) {
        localStorage.setItem(STORAGE_KEYS.INPUT_DRAFT, inputValue);
      } else {
        localStorage.removeItem(STORAGE_KEYS.INPUT_DRAFT);
      }
    } catch (e) {
      console.warn('Erro ao salvar rascunho de mensagem do chat:', e);
    }
  }, [inputValue]);

  // Clean speech when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update active session messages helper
  const updateActiveMessages = (updater: (prevMessages: ProfessorMessage[]) => ProfessorMessage[]) => {
    setSessions((prevSessions) => {
      return prevSessions.map((sess) => {
        if (sess.id === activeSessionId) {
          const updatedMessages = updater(sess.messages || []);
          return {
            ...sess,
            messages: updatedMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return sess;
      });
    });
  };

  // Create a brand new clean chat session
  const handleCreateNewChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    const newSession = createNewSession(`Conversa ${sessions.length + 1}`);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowSessionsDrawer(false);
    setShowClearConfirm(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Delete a specific session
  const handleDeleteSession = (sessionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);

    setSessions((prev) => {
      const remaining = prev.filter(s => s.id !== sessionId);
      if (remaining.length === 0) {
        const fresh = createNewSession('Nova Conversa');
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
    setSessionToDelete(null);
  };

  // Clear all messages in current session
  const handleClearCurrentChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    updateActiveMessages(() => [
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        content: `### Nova Conversa Iniciada! 🦉\n\nPronto para continuar. Envie sua dúvida, peça sugestões de dados atuais do Brasil ou envie um parágrafo para correção técnica.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Quais repertórios legitimados posso usar em temas de tecnologia?',
          'Como estruturar o parágrafo de desenvolvimento (D1)?',
          'Quais são os 5 elementos da proposta de intervenção na C5?'
        ]
      }
    ]);
    setShowClearConfirm(false);
  };

  // Delete an individual message
  const handleDeleteMessage = (msgId: string) => {
    if (window.speechSynthesis && speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    updateActiveMessages((prev) => {
      const filtered = prev.filter(m => m.id !== msgId);
      if (filtered.length === 0) {
        return [createDefaultWelcomeMessage()];
      }
      return filtered;
    });
  };

  // Rename a session title
  const handleSaveSessionTitle = (sessionId: string) => {
    if (!editTitleInput.trim()) {
      setEditingSessionId(null);
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: editTitleInput.trim() } : s))
    );
    setEditingSessionId(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ProfessorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Auto-rename session if it's the default name or first interaction
    const isFirstUserMessage = !messages.some(m => m.role === 'user');
    if (isFirstUserMessage) {
      const autoTitle = text.trim().slice(0, 32) + (text.trim().length > 32 ? '...' : '');
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId && (s.title.startsWith('Nova Conversa') || s.title.startsWith('Conversa ') || s.title === 'Primeira Conversa')
            ? { ...s, title: autoTitle }
            : s
        )
      );
    }

    // Prepare bounded message history (last 8 messages for speed & accuracy)
    const historyPayload = messages.slice(-8).map(m => ({
      role: m.role,
      content: m.content
    }));

    updateActiveMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInputValue('');
      try {
        localStorage.removeItem(STORAGE_KEYS.INPUT_DRAFT);
      } catch {}
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/professor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          persona,
          history: historyPayload,
          enableSearch: enableSearch || modelMode === 'search',
          modelMode,
          focusCompetency,
          essayContext: useEssayContext ? essayContext : '',
          themeContext: useEssayContext ? themeContext : '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro no chat.');
      }

      const botMsg: ProfessorMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Não foi possível gerar a resposta.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: data.suggestedFollowUps || [],
        groundingSources: data.groundingSources || [],
        searchQueries: data.searchQueries || [],
        modelUsed: data.modelUsed,
        personaUsed: data.personaUsed,
      };

      updateActiveMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ProfessorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu uma instabilidade momentânea na conexão com o professor. Por favor, tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Como evitar perder pontos na Competência 3?',
          'Exemplo de conectivos interparágrafos para o D2',
          'Regras de crase mais cobradas na Competência 1'
        ]
      };
      updateActiveMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner TTS voice
    const cleanText = text
      .replace(/###|##|#|\*\*|\*|`|\[|\]\([^)]*\)/g, '')
      .replace(/SUGESTÕES_DE_CONTINUIDADE:[\s\S]*/, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingId(msgId);
  };

  const personasList = [
    { 
      id: 'professor', 
      name: 'Mestre Didático', 
      icon: GraduationCap, 
      desc: 'Explica o porquê de cada regra, estimula o pensamento crítico e exemplifica.',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    { 
      id: 'corretor', 
      name: 'Corretor Rígido INEP', 
      icon: ShieldAlert, 
      desc: 'Foco técnico impiedoso: diagnostica perda de pontos e lacunas argumentativas.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    { 
      id: 'escritor', 
      name: 'Escritor Nota 1000', 
      icon: Sparkles, 
      desc: 'Modelos de períodos complexos, conectivos raros e sofisticação estilística.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    { 
      id: 'analista_trecho', 
      name: 'Analista de Trechos', 
      icon: PenTool, 
      desc: 'Envie seu parágrafo ou frase e receba reescrita padrão Nota 1000 imediata.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
  ];

  const competencyFilterOptions = [
    { id: 'all', label: 'Todas as Competências' },
    { id: 'c1', label: 'C1: Gramática & Sintaxe' },
    { id: 'c2', label: 'C2: Repertório & Tema' },
    { id: 'c3', label: 'C3: Projeto de Texto' },
    { id: 'c4', label: 'C4: Coesão' },
    { id: 'c5', label: 'C5: Proposta (5 Elementos)' },
  ];

  const quickPromptsByCompetency: Record<string, string[]> = {
    all: [
      'Repertórios para "Segurança alimentar e combate ao desperdício no Brasil"',
      '🔍 Pesquisar dados estatísticos recentes (IBGE/IPEA/FAO) para o tema',
      'Como criar uma tese bipartida sem deixar lacuna argumentativa na C3?',
      'Qual a fórmula garantida dos 5 elementos da proposta de intervenção (C5)?',
      'Quais são os erros mais comuns de estrutura sintática na C1?'
    ],
    c1: [
      'Quais as regras de crase mais cobradas pelos corretores do INEP?',
      'Como evitar truncamento de períodos e orações subordinadas soltas?',
      'Exemplos de paralelismo sintático correto em teses duplas'
    ],
    c2: [
      'Repertórios para o tema "Os desafios para a garantia da segurança alimentar e o combate ao desperdício na sociedade brasileira"',
      '🔍 Buscar pesquisas e dados oficiais do Brasil sobre este tema',
      'Como legitimar e tornar produtivo um repertório filosófico?',
      'Como evitar o "repertório de bolso" genérico criticado pelo INEP?'
    ],
    c3: [
      'Como montar o projeto de texto estratégico no rascunho?',
      'Como desenvolver causa e consequência profunda no D1 sem superficialidade?',
      'Como garantir que os dois argumentos da introdução sejam defendidos?'
    ],
    c4: [
      'Lista dos melhores conectivos interparágrafos para iniciar o D2 e a Conclusão',
      'Como diversificar conectivos intraparágrafos sem repetir "além disso"?',
      'Quais operadores coesivos expressam conformidade e oposição com elegância?'
    ],
    c5: [
      'Exemplo de proposta com Agente + Ação + Modo/Meio + Efeito + Detalhamento',
      'O que conta como detalhamento válido para a banca do INEP?',
      'Como evitar propostas genéricas como "medidas devem ser tomadas"?'
    ]
  };

  const currentPrompts = quickPromptsByCompetency[focusCompetency] || quickPromptsByCompetency.all;
  const isConversationLong = messages.length >= 10;

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* Top Header Card with Chat Sessions & Clear Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/80 rounded-2xl border border-indigo-100 dark:border-indigo-900 shrink-0">
            <EnemasterMascot size="md" variant="avatar" mood="scholar" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Professor IA & Mentor INEP
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black tracking-wider uppercase shadow-xs">
                Otimizado com Gemini
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Busca Web</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Tire dúvidas, peça dados e corrija trechos sem histórico infinito.
            </p>
          </div>
        </div>

        {/* Action Controls: New Chat, Sessions Selector, Clear Chat */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          {/* My Chats Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setShowSessionsDrawer(!showSessionsDrawer)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              showSessionsDrawer
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Ver histórico de conversas salvas"
          >
            <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Conversas ({sessions.length})</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showSessionsDrawer ? 'rotate-180' : ''}`} />
          </button>

          {/* New Chat Button */}
          <button
            type="button"
            id="new-chat-btn"
            onClick={handleCreateNewChat}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-indigo-600/20 active:scale-95"
            title="Iniciar um novo chat limpo"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Novo Chat</span>
          </button>

          {/* Delete / Clear Active Chat */}
          <button
            type="button"
            id="clear-chat-btn"
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/70 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Apagar mensagens desta conversa"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden sm:inline">Limpar Chat</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal: Clear Current Chat */}
      {showClearConfirm && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Deseja limpar todas as mensagens desta conversa?
              </p>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                O histórico atual será resetado e você poderá começar do zero.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleClearCurrentChat}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sim, Limpar Tudo</span>
            </button>
          </div>
        </div>
      )}

      {/* Sessions Management Dropdown Drawer */}
      {showSessionsDrawer && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Minhas Conversas Salvas
              </span>
            </div>
            <button
              type="button"
              onClick={handleCreateNewChat}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Nova Conversa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-0.5">
            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              const isEditing = editingSessionId === sess.id;
              const msgCount = sess.messages?.length || 0;

              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    if (!isEditing) {
                      setActiveSessionId(sess.id);
                      setShowSessionsDrawer(false);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all relative group flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-xs ring-2 ring-indigo-300 dark:ring-indigo-800'
                      : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitleInput}
                          onChange={(e) => setEditTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveSessionTitle(sess.id);
                            if (e.key === 'Escape') setEditingSessionId(null);
                          }}
                          autoFocus
                          className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-indigo-400 rounded-lg text-slate-900 dark:text-white outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSessionTitle(sess.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {sess.title}
                          </span>
                          {isActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-extrabold bg-indigo-600 text-white shrink-0">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          {msgCount} {msgCount === 1 ? 'mensagem' : 'mensagens'}
                        </p>
                      </div>
                    )}

                    {/* Action buttons on card */}
                    {!isEditing && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(sess.id);
                            setEditTitleInput(sess.title);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                          title="Renomear conversa"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Excluir esta conversa"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Control Bar: Persona, Model Mode, Google Search Toggle, Competency Filter */}
      <div className="bg-slate-50/90 dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
        {/* Persona Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Especialidade do Professor (Persona):</span>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {personasList.map((p) => {
              const Icon = p.icon;
              const isSelected = persona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id as any)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 ring-2 ring-indigo-300 dark:ring-indigo-800 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`p-1 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Search Grounding Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-200/80 dark:border-slate-800">
          {/* Competency Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Foco:</span>
            <select
              value={focusCompetency}
              onChange={(e) => setFocusCompetency(e.target.value)}
              className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 py-1.5 outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              {competencyFilterOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Model Speed & Google Search Grounding Control */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Google Search Grounding Toggle */}
            <button
              onClick={() => setEnableSearch(!enableSearch)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                enableSearch
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Ativar busca em tempo real no Google para dados atuais do Brasil"
            >
              <Globe className={`w-3.5 h-3.5 ${enableSearch ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span>Busca Google: {enableSearch ? 'Ativada' : 'Desativada'}</span>
            </button>

            {/* Model Mode Switcher */}
            <div className="flex items-center bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setModelMode('flash')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  modelMode === 'flash'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Modo Inteligente Equilibrado (Gemini Flash)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Padrão</span>
              </button>

              <button
                onClick={() => setModelMode('fast')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  modelMode === 'fast'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Modo Ultra Rápido (Flash Lite)"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Rápido</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Essay & Theme Context Indicator */}
        {(themeContext || essayContext) && (
          <div className="p-2.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">
                <strong>Contexto anexado:</strong> {themeContext ? `"${themeContext}"` : 'Redação em edição'}
              </span>
            </div>

            <button
              onClick={() => setUseEssayContext(!useEssayContext)}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                useEssayContext
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              {useEssayContext ? 'Contexto Ativo' : 'Ignorar Contexto'}
            </button>
          </div>
        )}
      </div>

      {/* Long Conversation Warning (Anti-Infinite Helper) */}
      {isConversationLong && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Esta conversa possui <strong>{messages.length} mensagens</strong>. Inicie um novo chat a qualquer momento para respostas mais focadas.
            </span>
          </div>
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-2xs cursor-pointer shrink-0"
          >
            + Novo Chat
          </button>
        </div>
      )}

      {/* Main Chat Thread Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCurrentSpeaking = speakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 group/msg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                      : 'bg-indigo-700 text-white p-0.5'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <EnemasterMascot size="sm" variant="avatar" mood="scholar" />}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-[88%] sm:max-w-[80%] space-y-2`}>
                  {/* Bubble Content */}
                  <div
                    className={`rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed relative ${
                      isUser
                        ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80 shadow-2xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-line font-medium">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none text-slate-800 dark:text-slate-200 prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-indigo-950 dark:prose-strong:text-indigo-300 prose-strong:font-black prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-ul:my-2 prose-li:my-0.5 prose-p:my-2">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    )}

                    {/* Sources / Grounding Web Citations if returned */}
                    {!isUser && msg.groundingSources && msg.groundingSources.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                        <button
                          onClick={() => setExpandedSourcesId(expandedSourcesId === msg.id ? null : msg.id)}
                          className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Fontes Consultadas no Google ({msg.groundingSources.length})</span>
                          {expandedSourcesId === msg.id ? (
                            <ChevronUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </button>

                        {expandedSourcesId === msg.id && (
                          <div className="grid grid-cols-1 gap-1.5 pt-1 animate-fade-in">
                            {msg.groundingSources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center justify-between gap-2 transition-colors"
                              >
                                <span className="truncate">{source.title || source.url}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timestamp & Tool Actions Bar */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span
                        className={`text-[10px] font-medium ${
                          isUser ? 'text-slate-300 dark:text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </span>

                      <div className="flex items-center gap-1">
                        {!isUser && (
                          <>
                            {/* Speak TTS Button */}
                            <button
                              onClick={() => handleToggleSpeak(msg.id, msg.content)}
                              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                                isCurrentSpeaking 
                                  ? 'bg-amber-400 text-indigo-950' 
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                              }`}
                              title={isCurrentSpeaking ? 'Pausar áudio' : 'Ouvir resposta'}
                            >
                              {isCurrentSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                              title="Copiar texto da resposta"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}

                        {/* Delete Single Message Button */}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Excluir esta mensagem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Follow-up Suggestions Chips */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Próximas perguntas sugeridas:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((suggest, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(suggest)}
                            className="text-left px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-white text-[11px] font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <ArrowRight className="w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                            <span>{suggest}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <EnemasterMascot size="sm" variant="avatar" mood="thinking" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5 shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white">
                    {enableSearch ? 'Mestre Corujito pesquisando e formulando resposta...' : 'O Professor está formulando o diagnóstico...'}
                  </span>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                    Consultando matriz INEP e estruturando exemplos práticos...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips Bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Perguntas Frequentes:</span>
          </span>
          {currentPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-white text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Pergunte ao professor, peça dados com busca ou cole um parágrafo..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
              />
            </div>

            <button
              id="professor-chat-send-btn"
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-5 py-3 rounded-2xl font-black text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 shrink-0 active:scale-95"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1 gap-1">
            <div className="flex items-center gap-2">
              <span>Pressione <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded text-[9px] font-mono">Enter</kbd> para enviar ou <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded text-[9px] font-mono">Shift+Enter</kbd> para nova linha</span>
              {inputValue.trim().length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Rascunho salvo
                </span>
              )}
            </div>
            <span>Enemaster Pedagógico INEP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
