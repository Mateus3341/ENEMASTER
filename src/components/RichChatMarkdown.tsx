import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatTableData } from '../types';

export interface ParsedChatTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

export type ChatContentSegment =
  | { type: 'markdown'; text: string }
  | { type: 'table'; table: ParsedChatTable };

interface RichChatMarkdownProps {
  content: string | Record<string, any> | Array<Record<string, any>>;
  tableData?: ChatTableData | Array<Record<string, any>> | Record<string, any>;
  variant?: 'assistant' | 'user';
  className?: string;
}

/**
 * Converte comandos LaTeX comuns (como \rightarrow, $\rightarrow$, '$\rightarrow$')
 * em símbolos Unicode limpos.
 */
export function normalizeLatexAndArrows(raw: string): string {
  if (!raw) return '';

  return String(raw)
    .replace(/['"“”]?\$\s*\\(?:long)?rightarrow\s*\$['"“”]?/gi, ' → ')
    .replace(/['"“”]?\$\s*\\to\s*\$['"“”]?/gi, ' → ')
    .replace(/['"“”]?\$\s*\\(?:long)?Rightarrow\s*\$['"“”]?/gi, ' ⇒ ')
    .replace(/['"“”]?\$\s*\\(?:long)?leftarrow\s*\$['"“”]?/gi, ' ← ')
    .replace(/['"“”]?\$\s*\\(?:long)?leftrightarrow\s*\$['"“”]?/gi, ' ↔ ')
    .replace(/['"“”]?\$\s*\\(?:long)?Leftrightarrow\s*\$['"“”]?/gi, ' ⇔ ')
    .replace(/['"“”]?\\(?:long)?rightarrow['"“”]?/g, ' → ')
    .replace(/['"“”]?\\(?:long)?Rightarrow['"“”]?/g, ' ⇒ ')
    .replace(/['"“”]?\\(?:long)?leftarrow['"“”]?/g, ' ← ')
    .replace(/['"“”]?\\(?:long)?leftrightarrow['"“”]?/g, ' ↔ ')
    .replace(/\$\s*\\geq?\s*\$/gi, '≥')
    .replace(/\$\s*\\leq?\s*\$/gi, '≤')
    .replace(/\$\s*\\neq?\s*\$/gi, '≠')
    .replace(/\$\s*\\approx\s*\$/gi, '≈')
    .replace(/\$\s*\\times\s*\$/gi, '×')
    .replace(/\$\s*\\pm\s*\$/gi, '±')
    .replace(/\$\s*\\checkmark\s*\$/gi, '✓')
    .replace(/\$\s*\\bullet\s*\$/gi, '•')
    .replace(/\\textbf\{([^}]*)\}/g, '**$1**')
    .replace(/\\textit\{([^}]*)\}/g, '*$1*')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\$([^$\n]{1,40})\$/g, (_, inner) => {
      return inner
        .replace(/\\(?:long)?rightarrow/gi, ' → ')
        .replace(/\\to\b/gi, ' → ')
        .replace(/\\Rightarrow/gi, ' ⇒ ')
        .replace(/\\times/gi, '×')
        .replace(/\\geq?/gi, '≥')
        .replace(/\\leq?/gi, '≤')
        .trim();
    });
}

/**
 * Converte objetos de dados (arrays de objetos, { headers, rows }, ou dicionários comparativos)
 * em uma estrutura de tabela padronizada `{ headers, rows }`.
 */
export function parseTableFromDataObject(data: unknown): ParsedChatTable | null {
  if (!data || typeof data !== 'object') return null;

  // Caso 1: Array de elementos
  if (Array.isArray(data)) {
    if (data.length === 0) return null;

    // 1a. Array de arrays de strings: [ ["Elemento", "Redação Atual", "Nota 1000"], ["Argumentação", "...", "..."] ]
    if (Array.isArray(data[0])) {
      const headers = (data[0] as any[]).map((cell) => normalizeLatexAndArrows(String(cell ?? '')).trim());
      const rows = data
        .slice(1)
        .filter((r) => Array.isArray(r) && r.length > 0)
        .map((r: any[]) => r.map((cell) => normalizeLatexAndArrows(String(cell ?? '')).trim()));
      if (headers.length >= 2 && rows.length >= 1) {
        return { headers, rows };
      }
      return null;
    }

    // 1b. Array de objetos: [ { Elemento: "Argumentação", "Sua Redação Atual": "...", "Redação Nota 1000": "..." } ]
    if (typeof data[0] === 'object' && data[0] !== null) {
      const headerSet = new Set<string>();
      for (const item of data) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          Object.keys(item).forEach((k) => headerSet.add(k));
        }
      }
      const headers = Array.from(headerSet);
      if (headers.length === 0) return null;

      const rows = data
        .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
        .map((item: Record<string, any>) =>
          headers.map((h) => {
            const val = item[h];
            if (val === null || val === undefined) return '';
            if (typeof val === 'object') return normalizeLatexAndArrows(JSON.stringify(val));
            return normalizeLatexAndArrows(String(val)).trim();
          })
        );

      if (rows.length === 0) return null;
      return {
        headers: headers.map((h) => normalizeLatexAndArrows(h).trim()),
        rows,
      };
    }

    return null;
  }

  const obj = data as Record<string, any>;

  // Caso 2: Objeto com formato explícito { headers/columns, rows/data }
  const rawHeaders = obj.headers || obj.columns || obj.colunas || obj.cabecalhos;
  const rawRows = obj.rows || obj.data || obj.linhas || obj.items;
  if (Array.isArray(rawHeaders) && Array.isArray(rawRows) && rawHeaders.length > 0) {
    const headers = rawHeaders.map((h: any) => normalizeLatexAndArrows(String(h ?? '')).trim());
    const rows: string[][] = rawRows.map((row: any) => {
      if (Array.isArray(row)) {
        return row.map((cell) => normalizeLatexAndArrows(String(cell ?? '')).trim());
      }
      if (row && typeof row === 'object') {
        return headers.map((h) => normalizeLatexAndArrows(String(row[h] ?? '')).trim());
      }
      return [normalizeLatexAndArrows(String(row ?? '')).trim()];
    });

    if (rows.length > 0) {
      return {
        title: typeof obj.title === 'string' ? obj.title : undefined,
        headers,
        rows,
      };
    }
  }

  // Caso 3: Objeto aninhado { table: ... } ou { tabela: ... }
  if (obj.table || obj.tabela || obj.tableData) {
    return parseTableFromDataObject(obj.table || obj.tabela || obj.tableData);
  }

  // Caso 4: Dicionário comparativo { "Argumentação": { "Sua Redação Atual": "...", "Redação Nota 1000": "..." } }
  const entries = Object.entries(obj).filter(
    ([key, val]) =>
      !['text', 'content', 'reply', 'message', 'title'].includes(key) &&
      val &&
      typeof val === 'object' &&
      !Array.isArray(val)
  );
  if (entries.length >= 1) {
    const subKeysSet = new Set<string>();
    entries.forEach(([, val]) => {
      Object.keys(val as Record<string, any>).forEach((k) => subKeysSet.add(k));
    });
    const subKeys = Array.from(subKeysSet);
    if (subKeys.length >= 1) {
      const headers = ['Elemento', ...subKeys.map((k) => normalizeLatexAndArrows(k).trim())];
      const rows = entries.map(([rowKey, val]) => [
        normalizeLatexAndArrows(rowKey).trim(),
        ...subKeys.map((k) => normalizeLatexAndArrows(String((val as any)[k] ?? '')).trim()),
      ]);
      return { headers, rows };
    }
  }

  return null;
}

/**
 * Divide uma linha de células Markdown separadas por pipe "| A | B | C |" em um array ["A", "B", "C"].
 */
function splitPipeCells(pipeChunk: string): string[] {
  let trimmed = pipeChunk.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

/**
 * Reconstrói e extrai tabelas Markdown (sejam multilinhas tradicionais ou colapsadas em uma única linha)
 * e blocos JSON de dados dentro do texto da mensagem.
 */
export function extractChatSegments(
  rawContent: string | Record<string, any> | Array<Record<string, any>>,
  externalTableData?: unknown
): ChatContentSegment[] {
  const segments: ChatContentSegment[] = [];

  // Se o próprio content for um objeto ou array de dados
  if (rawContent && typeof rawContent === 'object') {
    const asObj = rawContent as Record<string, any>;
    const textPart =
      typeof asObj.content === 'string'
        ? asObj.content
        : typeof asObj.text === 'string'
        ? asObj.text
        : typeof asObj.reply === 'string'
        ? asObj.reply
        : '';

    if (textPart) {
      segments.push(...extractChatSegments(textPart));
    }

    const parsedObjTable = parseTableFromDataObject(rawContent);
    if (parsedObjTable) {
      segments.push({ type: 'table', table: parsedObjTable });
    }

    if (externalTableData) {
      const extTable = parseTableFromDataObject(externalTableData);
      if (extTable) segments.push({ type: 'table', table: extTable });
    }

    return segments;
  }

  let text = normalizeLatexAndArrows(String(rawContent || ''));

  // Verificar se a string inteira é um JSON de tabela/objeto de dados
  const trimmedWhole = text.trim();
  if (
    (trimmedWhole.startsWith('[') && trimmedWhole.endsWith(']')) ||
    (trimmedWhole.startsWith('{') && trimmedWhole.endsWith('}'))
  ) {
    try {
      const parsedJson = JSON.parse(trimmedWhole);
      const tableFromWholeJson = parseTableFromDataObject(parsedJson);
      if (tableFromWholeJson) {
        if (typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
          const introText = parsedJson.text || parsedJson.content || parsedJson.reply;
          if (typeof introText === 'string' && introText.trim()) {
            segments.push({ type: 'markdown', text: normalizeLatexAndArrows(introText.trim()) });
          }
        }
        segments.push({ type: 'table', table: tableFromWholeJson });
        if (externalTableData) {
          const extTable = parseTableFromDataObject(externalTableData);
          if (extTable) segments.push({ type: 'table', table: extTable });
        }
        return segments;
      }
    } catch {
      // Continua o fluxo normal caso não seja JSON puro
    }
  }

  // Extrair blocos ```json ... ``` que representem tabelas de dados
  const jsonFenceRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let lastIdx = 0;
  let fenceMatch: RegExpExecArray | null;
  const intermediateChunks: ChatContentSegment[] = [];

  while ((fenceMatch = jsonFenceRegex.exec(text)) !== null) {
    const candidateJson = fenceMatch[1].trim();
    let parsedTable: ParsedChatTable | null = null;
    if (
      (candidateJson.startsWith('[') && candidateJson.endsWith(']')) ||
      (candidateJson.startsWith('{') && candidateJson.endsWith('}'))
    ) {
      try {
        parsedTable = parseTableFromDataObject(JSON.parse(candidateJson));
      } catch {
        parsedTable = null;
      }
    }

    if (parsedTable) {
      const before = text.slice(lastIdx, fenceMatch.index);
      if (before.trim()) {
        intermediateChunks.push({ type: 'markdown', text: before });
      }
      intermediateChunks.push({ type: 'table', table: parsedTable });
      lastIdx = fenceMatch.index + fenceMatch[0].length;
    }
  }

  const remainingAfterFences = text.slice(lastIdx);
  if (remainingAfterFences.trim()) {
    intermediateChunks.push({ type: 'markdown', text: remainingAfterFences });
  }

  // Agora processamos cada segmento markdown para extrair tabelas Markdown (colapsadas na mesma linha ou multilinhas)
  for (const chunk of intermediateChunks) {
    if (chunk.type === 'table') {
      segments.push(chunk);
      continue;
    }

    const parsedSubSegments = extractMarkdownTablesFromText(chunk.text);
    segments.push(...parsedSubSegments);
  }

  if (externalTableData) {
    const extTable = parseTableFromDataObject(externalTableData);
    if (extTable) {
      segments.push({ type: 'table', table: extTable });
    }
  }

  return segments;
}

/**
 * Localiza divisores de tabela Markdown (ex: | :--- | :--- | :--- |) tanto em formato
 * multilinha quanto colapsado em uma única linha, extraindo cabeçalhos e linhas com precisão.
 */
function extractMarkdownTablesFromText(input: string): ChatContentSegment[] {
  const result: ChatContentSegment[] = [];
  let cursor = 0;

  // Encontra qualquer linha/trecho separador de tabela Markdown com pelo menos 2 colunas: | :--- | :--- |
  const sepRegex = /\|((?:\s*:?-{2,}:?\s*\|){2,})/g;
  let match: RegExpExecArray | null;

  while ((match = sepRegex.exec(input)) !== null) {
    const sepStart = match.index;
    const sepEnd = sepStart + match[0].length;

    // 1. Determinar o número de colunas (N) a partir do separador
    const sepCells = splitPipeCells(match[0]).filter((c) => /^:?-+:?$/.test(c));
    const numCols = sepCells.length;
    if (numCols < 2) continue;

    // 2. Localizar as N células de cabeçalho imediatamente antes do separador
    const textBeforeSep = input.slice(cursor, sepStart);
    const trimmedBeforeSep = textBeforeSep.trimEnd();
    if (!trimmedBeforeSep.endsWith('|')) continue;

    // Encontrar os pipes que delimitam as N células de cabeçalho antes do separador
    const lastPipePos = textBeforeSep.lastIndexOf('|');
    let headerStartPipePos = lastPipePos;
    let pipesFound = 0;

    for (let i = lastPipePos - 1; i >= 0; i--) {
      const ch = textBeforeSep[i];
      if (ch === '\n') {
        break;
      }
      if (ch === '|') {
        pipesFound++;
        headerStartPipePos = i;
        if (pipesFound === numCols) {
          break;
        }
      }
    }

    if (pipesFound < numCols) continue;

    const headerRaw = textBeforeSep.slice(headerStartPipePos, lastPipePos + 1);
    const headers = splitPipeCells(headerRaw);
    if (headers.length !== numCols) continue;

    // Texto livre que veio antes do início da tabela
    const markdownBeforeTable = textBeforeSep.slice(0, headerStartPipePos).trim();

    // 3. Extrair as linhas de dados após o separador
    const afterSepText = input.slice(sepEnd);
    const { rows, consumedLength } = consumeTableRowsAfterSeparator(afterSepText, numCols);

    if (rows.length === 0) continue;

    if (markdownBeforeTable) {
      result.push({ type: 'markdown', text: markdownBeforeTable });
    }

    result.push({
      type: 'table',
      table: {
        headers,
        rows,
      },
    });

    cursor = sepEnd + consumedLength;
    sepRegex.lastIndex = cursor;
  }

  const tail = input.slice(cursor).trim();
  if (tail) {
    result.push({ type: 'markdown', text: tail });
  }

  return result;
}

/**
 * Consome todas as linhas da tabela após o divisor `| :--- | :--- |`, suportando:
 * - Tabelas colapsadas na mesma linha separadas por `| |`
 * - Tabelas multilinhas tradicionais
 * - Texto livre após o fechamento da última linha da tabela
 */
function consumeTableRowsAfterSeparator(
  afterSep: string,
  numCols: number
): { rows: string[][]; consumedLength: number } {
  const rows: string[][] = [];
  let pos = 0;
  const len = afterSep.length;

  while (pos < len) {
    // Pular espaços e quebras de linha entre linhas da tabela
    let wsPos = pos;
    let newlineCount = 0;
    while (wsPos < len && (afterSep[wsPos] === ' ' || afterSep[wsPos] === '\t' || afterSep[wsPos] === '\r' || afterSep[wsPos] === '\n')) {
      if (afterSep[wsPos] === '\n') newlineCount++;
      wsPos++;
    }

    // Se houver uma linha em branco dupla ou o próximo caractere não for '|', encerramos a tabela
    if (newlineCount >= 2 || wsPos >= len || afterSep[wsPos] !== '|') {
      break;
    }

    // Ler N células delimitadas por '|' na mesma linha
    let currentPipePos = wsPos;
    let cellsFound = 0;
    let rowEndPipePos = -1;

    for (let i = currentPipePos + 1; i < len; i++) {
      const ch = afterSep[i];
      if (ch === '\n') {
        break;
      }
      if (ch === '|') {
        cellsFound++;
        if (cellsFound === numCols) {
          rowEndPipePos = i;
          break;
        }
      }
    }

    if (rowEndPipePos === -1) {
      break;
    }

    const rowChunk = afterSep.slice(currentPipePos, rowEndPipePos + 1);
    const cells = splitPipeCells(rowChunk);

    // Evitar capturar acidentalmente outra linha de separador `| :--- | :--- |`
    if (cells.every((c) => /^:?-+:?$/.test(c))) {
      pos = rowEndPipePos + 1;
      continue;
    }

    rows.push(cells);
    pos = rowEndPipePos + 1;
  }

  return { rows, consumedLength: pos };
}

/**
 * Normaliza o texto Markdown completo (para cópia de texto, TTS ou fallback).
 */
export function normalizeChatMarkdown(raw: string | Record<string, any> | Array<Record<string, any>>): string {
  if (!raw) return '';
  const segments = extractChatSegments(raw);
  return segments
    .map((seg) => {
      if (seg.type === 'markdown') return seg.text.trim();
      const { headers, rows } = seg.table;
      const headerLine = `| ${headers.join(' | ')} |`;
      const dividerLine = `| ${headers.map(() => ':---').join(' | ')} |`;
      const bodyLines = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
      return `\n${headerLine}\n${dividerLine}\n${bodyLines}\n`;
    })
    .join('\n\n')
    .trim();
}

/**
 * Verifica se o conteúdo ou `tableData` da mensagem contém ao menos uma tabela,
 * permitindo que a bolha de chat se expanda para melhor legibilidade das colunas.
 */
export function hasChatTable(
  content: string | Record<string, any> | Array<Record<string, any>>,
  tableData?: unknown
): boolean {
  if (tableData && parseTableFromDataObject(tableData)) return true;
  const segments = extractChatSegments(content, tableData);
  return segments.some((s) => s.type === 'table');
}

/**
 * Classifica o tipo semântico da coluna para destacar visualmente colunas como
 * "Redação Atual" e "Nota 1000" dentro da bolha de conversa.
 */
type ColumnSemanticKind = 'label' | 'current_essay' | 'target_1000' | 'default';

function getColumnKind(header: string, colIndex: number, totalCols: number): ColumnSemanticKind {
  const h = header.toLowerCase();

  if (
    /nota\s*1000|padr[aã]o\s*1000|padr[aã]o\s*inep|vers[aã]o\s*ideal|como\s*deve|reescrita|depois|meta|960\+|200\s*pts/i.test(
      h
    )
  ) {
    return 'target_1000';
  }

  if (
    /reda[cç][aã]o\s*atual|sua\s*reda[cç][aã]o|texto\s*atual|como\s*est[aá]|original|antes|rascunho|penaliza/i.test(
      h
    )
  ) {
    return 'current_essay';
  }

  if (
    (colIndex === 0 && totalCols >= 2) ||
    /^(elemento|crit[eé]rio|compet[eê]ncia|aspecto|pilar|item|dimens[aã]o|par[aá]grafo)$/i.test(h.trim())
  ) {
    return 'label';
  }

  return 'default';
}

/**
 * Renderiza texto destacando setas "→" e "⇒" como badges visuais claros de transformação ("Antes → Depois").
 */
function renderChildrenWithArrowBadges(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child !== 'string') return child;
    if (!child.includes('→') && !child.includes('⇒')) return child;

    const parts = child.split(/(\s*(?:→|⇒)\s*)/g);
    return parts.map((part, idx) => {
      if (/^\s*(?:→|⇒)\s*$/.test(part)) {
        return (
          <span
            key={idx}
            className="inline-flex items-center justify-center px-1.5 py-0.5 mx-1 rounded-md bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-200 font-black text-[11px] leading-none align-middle shadow-2xs border border-indigo-200 dark:border-indigo-700"
            title="Substituir por / Evoluir para"
          >
            →
          </span>
        );
      }
      return part;
    });
  });
}

/**
 * Formata o conteúdo de uma célula de tabela, destacando prefixos diagnósticos antes de ":"
 * (ex: "Expositiva: Constata que..." ou "Analítica: Discute a coisificação...") e setas "→".
 */
function renderFormattedTableCell(cellText: string, colKind: ColumnSemanticKind): React.ReactNode {
  const cleaned = cellText.trim();
  if (!cleaned) return <span className="text-slate-400">—</span>;

  // Se houver um rótulo curto antes de ":" (ex: "Expositiva: ...", "Analítica: ...", "Coringa: ...")
  const colonMatch = cleaned.match(/^([^:]{2,28}):\s+(.+)$/);
  if (colonMatch) {
    const [, prefix, rest] = colonMatch;
    const badgeClass =
      colKind === 'target_1000'
        ? 'bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-emerald-300/80 dark:border-emerald-700/70'
        : colKind === 'current_essay'
        ? 'bg-amber-100/90 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 border-amber-300/80 dark:border-amber-700/70'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

    return (
      <div className="space-y-1">
        <span
          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${badgeClass}`}
        >
          {prefix.replace(/\*\*/g, '')}
        </span>
        <div className="text-xs leading-relaxed">
          {renderChildrenWithArrowBadges(rest.replace(/\*\*/g, ''))}
        </div>
      </div>
    );
  }

  return renderChildrenWithArrowBadges(cleaned.replace(/\*\*(.*?)\*\*/g, '$1'));
}

/**
 * Renderizador dedicado de Tabela HTML para as bolhas de conversa do ProfessorChatView.
 */
const ChatHtmlTable: React.FC<{ table: ParsedChatTable }> = ({ table }) => {
  const { headers, rows, title } = table;
  const colKinds = headers.map((h, idx) => getColumnKind(h, idx, headers.length));

  return (
    <div className="my-3 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      {title && (
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200">
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/80">
              {headers.map((header, colIdx) => {
                const kind = colKinds[colIdx];
                const cleanHeader = header.replace(/\*\*/g, '');

                if (kind === 'target_1000') {
                  return (
                    <th
                      key={colIdx}
                      className="px-3.5 py-2.5 text-[11px] font-black uppercase tracking-wider bg-emerald-50/95 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-r last:border-r-0 border-emerald-200/70 dark:border-emerald-800/60"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>{renderChildrenWithArrowBadges(cleanHeader)}</span>
                      </div>
                    </th>
                  );
                }

                if (kind === 'current_essay') {
                  return (
                    <th
                      key={colIdx}
                      className="px-3.5 py-2.5 text-[11px] font-black uppercase tracking-wider bg-amber-50/95 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-r last:border-r-0 border-amber-200/70 dark:border-amber-800/60"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span>{renderChildrenWithArrowBadges(cleanHeader)}</span>
                      </div>
                    </th>
                  );
                }

                if (kind === 'label') {
                  return (
                    <th
                      key={colIdx}
                      className="px-3.5 py-2.5 text-[11px] font-black uppercase tracking-wider bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-r last:border-r-0 border-slate-200/80 dark:border-slate-700/80 w-[22%]"
                    >
                      {renderChildrenWithArrowBadges(cleanHeader)}
                    </th>
                  );
                }

                return (
                  <th
                    key={colIdx}
                    className="px-3.5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-200 border-r last:border-r-0 border-indigo-100 dark:border-indigo-900/60"
                  >
                    {renderChildrenWithArrowBadges(cleanHeader)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="even:bg-slate-50/40 dark:even:bg-slate-800/25 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-colors"
              >
                {headers.map((_, colIdx) => {
                  const cell = row[colIdx] ?? '';
                  const kind = colKinds[colIdx];

                  if (kind === 'target_1000') {
                    return (
                      <td
                        key={colIdx}
                        className="px-3.5 py-3 text-xs text-slate-800 dark:text-slate-100 align-top leading-relaxed bg-emerald-50/25 dark:bg-emerald-950/20 border-r last:border-r-0 border-slate-100 dark:border-slate-800/70"
                      >
                        {renderFormattedTableCell(cell, kind)}
                      </td>
                    );
                  }

                  if (kind === 'current_essay') {
                    return (
                      <td
                        key={colIdx}
                        className="px-3.5 py-3 text-xs text-slate-700 dark:text-slate-200 align-top leading-relaxed bg-amber-50/20 dark:bg-amber-950/15 border-r last:border-r-0 border-slate-100 dark:border-slate-800/70"
                      >
                        {renderFormattedTableCell(cell, kind)}
                      </td>
                    );
                  }

                  if (kind === 'label') {
                    return (
                      <td
                        key={colIdx}
                        className="px-3.5 py-3 text-xs font-extrabold text-indigo-950 dark:text-indigo-200 align-top leading-snug bg-slate-50/70 dark:bg-slate-800/50 border-r last:border-r-0 border-slate-200/70 dark:border-slate-800"
                      >
                        {renderFormattedTableCell(cell, kind)}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={colIdx}
                      className="px-3.5 py-3 text-xs text-slate-700 dark:text-slate-200 align-top leading-relaxed border-r last:border-r-0 border-slate-100 dark:border-slate-800/70"
                    >
                      {renderFormattedTableCell(cell, kind)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RichChatMarkdown: React.FC<RichChatMarkdownProps> = ({
  content,
  tableData,
  variant = 'assistant',
  className = '',
}) => {
  const segments = React.useMemo(
    () => extractChatSegments(content, tableData),
    [content, tableData]
  );

  const isUserBubble = variant === 'user';

  return (
    <div className={`markdown-body space-y-2.5 text-xs sm:text-sm leading-relaxed ${className}`}>
      {segments.map((segment, index) => {
        if (segment.type === 'table') {
          return <ChatHtmlTable key={`table-${index}`} table={segment.table} />;
        }

        return (
          <Markdown
            key={`md-${index}`}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h3
                  className={`text-sm sm:text-base font-black mt-3 mb-1.5 ${
                    isUserBubble ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {children}
                </h3>
              ),
              h2: ({ children }) => (
                <h4
                  className={`text-sm font-black mt-3 mb-1.5 ${
                    isUserBubble ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {children}
                </h4>
              ),
              h3: ({ children }) => (
                <h5
                  className={`text-xs sm:text-sm font-extrabold mt-2.5 mb-1 ${
                    isUserBubble ? 'text-indigo-100' : 'text-indigo-950 dark:text-indigo-200'
                  }`}
                >
                  {children}
                </h5>
              ),
              h4: ({ children }) => (
                <h6
                  className={`text-xs font-extrabold mt-2 mb-1 ${
                    isUserBubble ? 'text-slate-100' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p
                  className={`my-1.5 leading-relaxed whitespace-pre-line ${
                    isUserBubble ? 'text-white font-medium' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {renderChildrenWithArrowBadges(children)}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="my-2 pl-4 space-y-1.5 list-disc marker:text-indigo-500">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-2 pl-4 space-y-1.5 list-decimal marker:font-bold marker:text-indigo-600 dark:marker:text-indigo-400">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li
                  className={`leading-relaxed ${
                    isUserBubble ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {renderChildrenWithArrowBadges(children)}
                </li>
              ),
              strong: ({ children }) => (
                <strong
                  className={`font-extrabold ${
                    isUserBubble ? 'text-white underline decoration-indigo-300/50' : 'text-slate-950 dark:text-white'
                  }`}
                >
                  {renderChildrenWithArrowBadges(children)}
                </strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-2.5 pl-3.5 py-2 pr-3 border-l-3 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r-xl italic text-slate-700 dark:text-slate-200">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-3 border-slate-200 dark:border-slate-700/80" />,
              table: ({ children }) => (
                <div className="my-3 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs bg-white dark:bg-slate-900">
                  <table className="w-full text-left border-collapse text-xs min-w-[420px]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-950 dark:text-indigo-200 border-b border-indigo-200/80 dark:border-indigo-800/80">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="even:bg-slate-50/60 dark:even:bg-slate-800/35 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/25 transition-colors">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-3.5 py-2.5 font-extrabold text-[11px] uppercase tracking-wider text-indigo-900 dark:text-indigo-200 border-r last:border-r-0 border-indigo-100 dark:border-indigo-900/60">
                  {renderChildrenWithArrowBadges(children)}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 align-top leading-relaxed border-r last:border-r-0 border-slate-100 dark:border-slate-800/70 first:font-bold first:text-slate-900 dark:first:text-slate-100 first:bg-slate-50/60 dark:first:bg-slate-800/40">
                  {renderChildrenWithArrowBadges(children)}
                </td>
              ),
              code: ({ className: codeClass, children }) => {
                const isBlock = Boolean(codeClass && codeClass.includes('language-'));
                if (isBlock) {
                  return (
                    <pre className="my-2.5 p-3 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto text-xs font-mono">
                      <code>{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                    {renderChildrenWithArrowBadges(children)}
                  </code>
                );
              },
            }}
          >
            {segment.text}
          </Markdown>
        );
      })}
    </div>
  );
};
export default RichChatMarkdown;
