import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  EssayCorrectionResult, 
  GeneratedEssayResponse, 
  GeneratedThemeResponse, 
  RepertoireHunterResponse 
} from '../types';

export interface PersistedSnippetTheme {
  theme: string;
  axis: string;
  argumentBase: {
    thesis: string;
    arg1: string;
    arg2: string;
  };
}

export interface PersistedSnippetWritingState {
  theme: string;
  axis: string;
  argumentBase: {
    thesis: string;
    arg1: string;
    arg2: string;
  };
  sectionType: 'introducao' | 'desenvolvimento_1' | 'desenvolvimento_2' | 'conclusao';
  singleParagraphText: string;
  paragraphD1: string;
  paragraphD2: string;
  evaluationResult: any | null;
  selectedPresetIndex: number;
  isCustomThemeMode: boolean;
  generatedThemes: PersistedSnippetTheme[];
}

interface SavedWorkState {
  // Correction
  activeCorrection: EssayCorrectionResult | null;
  correctionDraftText: string;
  correctionDraftTheme: string;
  
  // Creation
  generatedEssay: GeneratedEssayResponse | null;
  creationTheme: string;
  focusDraft: string;

  // Theme Generator
  generatedTheme: GeneratedThemeResponse | null;
  generatedThemesHistory: GeneratedThemeResponse[];

  // Snippet Writing (Treino de Trecho)
  snippetWritingState: PersistedSnippetWritingState | null;

  // Repertoire Hunter
  huntResult: RepertoireHunterResponse | null;
  hunterThemeInput: string;
}

interface SavedWorkContextType {
  savedWork: SavedWorkState;
  isLoadingSavedWork: boolean;
  setActiveCorrection: (result: EssayCorrectionResult | null) => void;
  setCorrectionDraft: (text: string, theme: string) => void;
  setGeneratedEssay: (essay: GeneratedEssayResponse | null) => void;
  setCreationDraft: (focusDraft: string, creationTheme: string) => void;
  setGeneratedTheme: (theme: GeneratedThemeResponse | null) => void;
  addGeneratedThemeToHistory: (theme: GeneratedThemeResponse) => void;
  removeGeneratedThemeFromHistory: (idOrTitle: string) => void;
  setSnippetWritingState: (
    stateOrUpdater:
      | PersistedSnippetWritingState
      | ((prev: PersistedSnippetWritingState | null) => PersistedSnippetWritingState)
  ) => void;
  setHuntResult: (result: RepertoireHunterResponse | null, themeInput?: string) => void;
  clearActiveCorrection: () => void;
  clearGeneratedEssay: () => void;
  clearAllSavedWork: () => void;
}

const STORAGE_KEY = 'enemaster_saved_work_v2';

const defaultState: SavedWorkState = {
  activeCorrection: null,
  correctionDraftText: '',
  correctionDraftTheme: '',
  generatedEssay: null,
  creationTheme: '',
  focusDraft: '',
  generatedTheme: null,
  generatedThemesHistory: [],
  snippetWritingState: null,
  huntResult: null,
  hunterThemeInput: '',
};

const SavedWorkContext = createContext<SavedWorkContextType | undefined>(undefined);

export const SavedWorkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoadingSavedWork, setIsLoadingSavedWork] = useState<boolean>(true);
  const [savedWork, setSavedWork] = useState<SavedWorkState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultState,
          ...parsed,
          generatedThemesHistory: Array.isArray(parsed.generatedThemesHistory)
            ? parsed.generatedThemesHistory
            : [],
        };
      }
    } catch (e) {
      console.warn('Erro ao restaurar trabalho salvo do localStorage:', e);
    }
    return defaultState;
  });

  // Brief hydration completion cycle to allow smooth initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingSavedWork(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Listen for global cache purge / restart events
  useEffect(() => {
    const handleCacheCleared = () => {
      setSavedWork(defaultState);
    };
    window.addEventListener('enemaster:cache-cleared', handleCacheCleared);
    return () => window.removeEventListener('enemaster:cache-cleared', handleCacheCleared);
  }, []);

  // Sync to localStorage immediately whenever savedWork updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWork));
    } catch (e) {
      console.warn('Erro ao salvar trabalho no localStorage:', e);
    }
  }, [savedWork]);

  const setActiveCorrection = useCallback((result: EssayCorrectionResult | null) => {
    setSavedWork(prev => {
      if (prev.activeCorrection === result) return prev;
      return {
        ...prev,
        activeCorrection: result,
        ...(result ? { correctionDraftTheme: result.theme, correctionDraftText: result.essayText } : {})
      };
    });
  }, []);

  const setCorrectionDraft = useCallback((text: string, theme: string) => {
    setSavedWork(prev => {
      if (prev.correctionDraftText === text && prev.correctionDraftTheme === theme) {
        return prev;
      }
      return {
        ...prev,
        correctionDraftText: text,
        correctionDraftTheme: theme,
      };
    });
  }, []);

  const setGeneratedEssay = useCallback((essay: GeneratedEssayResponse | null) => {
    setSavedWork(prev => {
      if (prev.generatedEssay === essay) return prev;
      return {
        ...prev,
        generatedEssay: essay,
        ...(essay ? { creationTheme: essay.theme } : {})
      };
    });
  }, []);

  const setCreationDraft = useCallback((focusDraft: string, creationTheme: string) => {
    setSavedWork(prev => {
      if (prev.focusDraft === focusDraft && prev.creationTheme === creationTheme) {
        return prev;
      }
      return {
        ...prev,
        focusDraft,
        creationTheme,
      };
    });
  }, []);

  const setGeneratedTheme = useCallback((theme: GeneratedThemeResponse | null) => {
    setSavedWork(prev => {
      if (prev.generatedTheme === theme) return prev;
      const updatedHistory = theme
        ? [
            theme,
            ...(prev.generatedThemesHistory || []).filter(
              t => t.id !== theme.id && t.title !== theme.title
            ),
          ].slice(0, 30)
        : prev.generatedThemesHistory || [];
      return {
        ...prev,
        generatedTheme: theme,
        generatedThemesHistory: updatedHistory,
      };
    });
  }, []);

  const addGeneratedThemeToHistory = useCallback((theme: GeneratedThemeResponse) => {
    setSavedWork(prev => {
      const existing = prev.generatedThemesHistory || [];
      const filtered = existing.filter(t => t.id !== theme.id && t.title !== theme.title);
      return {
        ...prev,
        generatedTheme: theme,
        generatedThemesHistory: [theme, ...filtered].slice(0, 30),
      };
    });
  }, []);

  const removeGeneratedThemeFromHistory = useCallback((idOrTitle: string) => {
    setSavedWork(prev => ({
      ...prev,
      generatedThemesHistory: (prev.generatedThemesHistory || []).filter(
        t => t.id !== idOrTitle && t.title !== idOrTitle
      ),
    }));
  }, []);

  const setSnippetWritingState = useCallback(
    (
      stateOrUpdater:
        | PersistedSnippetWritingState
        | ((prev: PersistedSnippetWritingState | null) => PersistedSnippetWritingState)
    ) => {
      setSavedWork(prev => {
        const nextSnippetState =
          typeof stateOrUpdater === 'function'
            ? stateOrUpdater(prev.snippetWritingState)
            : stateOrUpdater;
        return {
          ...prev,
          snippetWritingState: nextSnippetState,
        };
      });
    },
    []
  );

  const setHuntResult = useCallback((result: RepertoireHunterResponse | null, themeInput?: string) => {
    setSavedWork(prev => {
      if (prev.huntResult === result && (themeInput === undefined || prev.hunterThemeInput === themeInput)) {
        return prev;
      }
      return {
        ...prev,
        huntResult: result,
        ...(themeInput !== undefined ? { hunterThemeInput: themeInput } : {})
      };
    });
  }, []);

  const clearActiveCorrection = useCallback(() => {
    setSavedWork(prev => {
      if (!prev.activeCorrection && !prev.correctionDraftText && !prev.correctionDraftTheme) {
        return prev;
      }
      return {
        ...prev,
        activeCorrection: null,
        correctionDraftText: '',
        correctionDraftTheme: '',
      };
    });
  }, []);

  const clearGeneratedEssay = useCallback(() => {
    setSavedWork(prev => {
      if (!prev.generatedEssay) return prev;
      return {
        ...prev,
        generatedEssay: null,
      };
    });
  }, []);

  const clearAllSavedWork = useCallback(() => {
    setSavedWork(defaultState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const contextValue = useMemo(() => ({
    savedWork,
    isLoadingSavedWork,
    setActiveCorrection,
    setCorrectionDraft,
    setGeneratedEssay,
    setCreationDraft,
    setGeneratedTheme,
    addGeneratedThemeToHistory,
    removeGeneratedThemeFromHistory,
    setSnippetWritingState,
    setHuntResult,
    clearActiveCorrection,
    clearGeneratedEssay,
    clearAllSavedWork,
  }), [
    savedWork,
    isLoadingSavedWork,
    setActiveCorrection,
    setCorrectionDraft,
    setGeneratedEssay,
    setCreationDraft,
    setGeneratedTheme,
    addGeneratedThemeToHistory,
    removeGeneratedThemeFromHistory,
    setSnippetWritingState,
    setHuntResult,
    clearActiveCorrection,
    clearGeneratedEssay,
    clearAllSavedWork,
  ]);

  return (
    <SavedWorkContext.Provider value={contextValue}>
      {children}
    </SavedWorkContext.Provider>
  );
};

export const useSavedWork = () => {
  const context = useContext(SavedWorkContext);
  if (!context) {
    throw new Error('useSavedWork must be used within a SavedWorkProvider');
  }
  return context;
};
