import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Lightbulb, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ChevronRight,
  HelpCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import Markdown from 'react-markdown';
import { EssayCorrectionResult, ProfessorMessage } from '../types';

interface EssayCorrectionProfessorChatProps {
  correctionResult: EssayCorrectionResult;
  onNavigateToFullChat?: () => void;
}

export const EssayCorrectionProfessorChat: React.FC<EssayCorrectionProfessorChatProps> = ({
  correctionResult,
  onNavigateToFullChat
}) => {
  const [messages, setMessages] = useState<ProfessorMessage[]>(() => [
    {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `### Olá! Sou o Professor AI de Redação do ENEM! 🎓\n\nEstou com a sua redação **"${correctionResult.theme}"** em mãos, junto à avaliação oficial da banca (Nota: **${correctionResult.totalScore}/1000**).\n\nEstou focado **exclusivamente no seu texto** e nos seus 4 parágrafos. Posso:\n- ✍️ **Reescrever parágrafos inteiros** no padrão Nota 1000 preservando suas ideias\n- 🎯 **Ajustar sua proposta de intervenção (C5)** garantindo todos os 5 elementos válidos\n- 💡 **Sugerir repertórios legitimados (C2)** e conectivos estratégicos (C4)\n- 🔍 **Explicar cada desconto de nota** e como eliminá-lo nos próximos treinos\n\nEscolha uma das **Melhorias Diretas** abaixo ou digite sua dúvida específica:`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Como reescrever a introdução para deixar a tese mais explícita?',
        'O que preciso mudar na proposta de intervenção para cravar 200 na C5?',
        'Quais repertórios legitimados combinam melhor com este tema?'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [persona, setPersona] = useState<'professor' | 'corretor' | 'escritor'>('professor');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Build the strict evaluation context string
  const buildAnalysisContext = (): string => {
    const c = correctionResult.competencies;
    return `
Tema da Redação: "${correctionResult.theme}"
Nota Geral Obtida: ${correctionResult.totalScore}/1000

Notas e Pareceres por Competência:
- C1 (Norma Padrão & Gramática): ${c.c1.score}/200 pts (Nível ${c.c1.level}) - Justificativa: ${c.c1.evaluation || c.c1.justificativa_analitica || c.c1.diagnostico || 'Sem observações'}
- C2 (Compreensão Temática & Repertório): ${c.c2.score}/200 pts (Nível ${c.c2.level}) - Justificativa: ${c.c2.evaluation || c.c2.justificativa_analitica || c.c2.diagnostico || 'Sem observações'}
- C3 (Projeto de Texto & Argumentação): ${c.c3.score}/200 pts (Nível ${c.c3.level}) - Justificativa: ${c.c3.evaluation || c.c3.justificativa_analitica || c.c3.diagnostico || 'Sem observações'}
- C4 (Coesão Inter e Intraparágrafos): ${c.c4.score}/200 pts (Nível ${c.c4.level}) - Justificativa: ${c.c4.evaluation || c.c4.justificativa_analitica || c.c4.diagnostico || 'Sem observações'}
- C5 (Proposta de Intervenção com 5 Elementos): ${c.c5.score}/200 pts (Nível ${c.c5.level}) - Justificativa: ${c.c5.evaluation || c.c5.justificativa_analitica || c.c5.diagnostico || 'Sem observações'}

3 Maiores Pontos Fortes do Texto:
${correctionResult.top3Strengths && correctionResult.top3Strengths.length > 0 ? correctionResult.top3Strengths.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'N/A'}

3 Maiores Problemas Diagnosticados:
${correctionResult.top3Problems && correctionResult.top3Problems.length > 0 ? correctionResult.top3Problems.map((p, i) => `${i + 1}. ${p}`).join('\n') : 'N/A'}

Plano de Ação do Corretor para Subir a Nota:
${correctionResult.actionPlanToImprove && correctionResult.actionPlanToImprove.length > 0 ? correctionResult.actionPlanToImprove.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'N/A'}
`.trim();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ProfessorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const historyPayload = messages.slice(-8).map(m => ({
      role: m.role,
      content: m.content
    }));

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/professor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          persona,
          history: historyPayload,
          enableSearch: false,
          modelMode: 'flash',
          essayContext: correctionResult.essayText,
          themeContext: correctionResult.theme,
          analysisContext: buildAnalysisContext(),
          focusCompetency: 'all'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao consultar o Professor AI.');
      }

      const botMessage: ProfessorMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Não foi possível gerar a resposta.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMsg: ProfessorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Houve uma oscilação na conexão com o Professor AI. Por favor, tente enviar novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Como reescrever o D1 para nota máxima?',
          'Como melhorar os conectivos na Competência 4?'
        ]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `### Conversa Reiniciada! 🦉\n\nEstou com os dados completos da sua redação sobre **"${correctionResult.theme}"** prontos. O que você deseja aprimorar no texto agora?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Reescreva meu D1 com argumento de autoridade',
          'Apresente uma proposta de intervenção nota 200 para a C5',
          'Como corrigir os principais desvios de gramática apontados?'
        ]
      }
    ]);
  };

  const quickActions = [
    {
      label: '✍️ Reescrever D1 (Nota 200)',
      prompt: 'Reescreva o meu primeiro parágrafo de desenvolvimento (D1) no padrão Nota 1000, preservando meu argumento e inserindo um repertório legítimo e produtivo.'
    },
    {
      label: '🎯 Reformular Proposta C5 (5 Elementos)',
      prompt: 'Analise a proposta de intervenção da minha redação e reescreva uma versão completa com os 5 elementos obrigatórios (Agente, Ação, Meio/Modo, Efeito e Detalhamento expresso) para nota máxima na C5.'
    },
    {
      label: '💡 Sugerir Repertórios Produtivos (C2)',
      prompt: 'Com base no tema da minha redação e na minha linha argumentativa, sugira 2 repertórios socioculturais legitimados (com citação e exemplo prático de uso) para substituir os pontos mais fracos do meu texto.'
    },
    {
      label: '🔗 Aprimorar Conectivos (C4)',
      prompt: 'Mostre exatamente quais operadores argumentativos interparágrafos e intraparágrafos eu posso adicionar no meu texto para atingir 200 pontos na Competência 4.'
    },
    {
      label: '⭐ O que falta para chegar a 960+?',
      prompt: 'Com base na minha nota atual de ' + correctionResult.totalScore + ' pontos, resuma cirurgicamente os 2 maiores gargalos que estão me impedindo de alcançar a faixa de 960 a 1000 pontos neste tema.'
    }
  ];

  return (
    <div id="essay-professor-chat-section" className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900/80 shadow-md overflow-hidden transition-colors">
      {/* Header with Essay Scoped Context */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>Professor AI • Mentor da Sua Redação</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Contexto Carregado
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5 line-clamp-1 max-w-xl">
              Focado exclusivamente no tema: <strong className="text-white font-medium">"{correctionResult.theme}"</strong> (Nota: {correctionResult.totalScore}/1000)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Persona selector */}
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPersona('professor')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                persona === 'professor' 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-indigo-200 hover:text-white'
              }`}
              title="Tom didático, focado em ensinar e enriquecer seus parágrafos"
            >
              Mentor
            </button>
            <button
              type="button"
              onClick={() => setPersona('corretor')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                persona === 'corretor' 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-indigo-200 hover:text-white'
              }`}
              title="Tom rígido de avaliador oficial do INEP"
            >
              Banca
            </button>
            <button
              type="button"
              onClick={() => setPersona('escritor')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                persona === 'escritor' 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-indigo-200 hover:text-white'
              }`}
              title="Foco em reescrita imediata no estilo Nota 1000"
            >
              Escritor
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white transition-colors cursor-pointer"
            title="Reiniciar conversa com esta redação"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scope Info Banner */}
      <div className="px-5 py-2.5 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Dados disponíveis para o Professor:</strong> Seu texto completo, notas C1-C5, 3 maiores pontos fortes e plano de ação.
          </span>
        </div>
        {onNavigateToFullChat && (
          <button
            type="button"
            onClick={onNavigateToFullChat}
            className="hidden md:flex items-center gap-1 font-bold text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
          >
            <span>Abrir no Chat Geral</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Quick Action Chips: Melhorias Diretas */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Melhorias Diretas na Sua Redação (1 Clique):</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {quickActions.map((qa, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(qa.prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="p-5 sm:p-6 space-y-5 max-h-[480px] min-h-[260px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[88%] sm:max-w-[80%] space-y-2 ${isAssistant ? 'items-start' : 'items-end'}`}>
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-xs ${
                    isAssistant
                      ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs ml-auto font-medium'
                  }`}
                >
                  {isAssistant ? (
                    <div className="markdown-body space-y-2 prose dark:prose-invert max-w-none text-xs sm:text-sm prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-li:my-0.5">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  <div className={`flex items-center justify-between gap-3 pt-2 text-[10px] ${
                    isAssistant ? 'text-slate-400 border-t border-slate-100 dark:border-slate-800 mt-2' : 'text-indigo-200'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isAssistant && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold cursor-pointer transition-colors"
                        title="Copiar texto do professor"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Follow-up suggestions */}
                {isAssistant && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="space-y-1.5 pl-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Perguntas sugeridas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          disabled={isLoading}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium transition-colors cursor-pointer text-left flex items-center gap-1"
                        >
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-xs flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.4s]" />
              <span className="ml-1 font-medium">Professor analisando trechos da sua redação...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
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
              id="input-essay-professor-chat"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Faça uma pergunta sobre esta redação ou peça para reescrever um parágrafo..."
              disabled={isLoading}
              className="w-full resize-none p-3.5 pr-10 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            id="btn-send-essay-professor-message"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar</span>
              </>
            )}
          </button>
        </form>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          Pressione <strong>Enter</strong> para enviar ou <strong>Shift + Enter</strong> para quebra de linha. O professor utiliza unicamente o texto desta redação analisada.
        </p>
      </div>
    </div>
  );
};
