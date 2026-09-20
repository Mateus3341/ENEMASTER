import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  loginWithGoogle, 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  sendResetPassword,
  logoutUser, 
  recordUserLogin, 
  getFriendlyAuthErrorMessage,
  AppUserProfile, 
  AppGlobalStats 
} from '../lib/firebase';
import { 
  saveEssayToFirestore, 
  deleteEssayFromFirestore, 
  loadUserEssaysFromFirestore, 
  subscribeToGlobalStats 
} from '../lib/firestoreStorage';
import { EssayCorrectionResult } from '../types';
import { clearAllAppDataAndCache } from '../lib/cacheManager';

interface AuthContextType {
  user: User | null;
  profile: AppUserProfile | null;
  isLoading: boolean;
  globalStats: AppGlobalStats;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearAuthError: () => void;
  signOut: () => Promise<void>;
  loginError: string | null;
  authSuccessMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [globalStats, setGlobalStats] = useState<AppGlobalStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    totalUniqueUsers: 0,
    totalLoginEvents: 0,
    totalEssaysSubmitted: 0,
    lastActiveAt: null,
  });

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProf = await recordUserLogin(currentUser);
          setProfile(userProf);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Global Application Stats in Real-Time
  useEffect(() => {
    const unsubGlobal = subscribeToGlobalStats((stats) => {
      setGlobalStats(stats);
    });
    return () => unsubGlobal();
  }, []);

  const clearAuthError = () => {
    setLoginError(null);
    setAuthSuccessMessage(null);
  };

  const signInGoogle = async () => {
    setLoginError(null);
    setAuthSuccessMessage(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      const msg = getFriendlyAuthErrorMessage(code) || err?.message || 'Falha ao conectar com o Google.';
      setLoginError(msg);
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    setLoginError(null);
    setAuthSuccessMessage(null);
    setIsLoading(true);
    try {
      await loginWithEmailPassword(email, pass);
    } catch (err: any) {
      const code = err?.code || '';
      const msg = getFriendlyAuthErrorMessage(code) || err?.message || 'Falha ao realizar login.';
      setLoginError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpEmail = async (email: string, pass: string, name?: string) => {
    setLoginError(null);
    setAuthSuccessMessage(null);
    setIsLoading(true);
    try {
      await registerWithEmailPassword(email, pass, name);
      setAuthSuccessMessage('Conta criada com sucesso!');
    } catch (err: any) {
      const code = err?.code || '';
      const msg = getFriendlyAuthErrorMessage(code) || err?.message || 'Falha ao criar conta.';
      setLoginError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoginError(null);
    setAuthSuccessMessage(null);
    try {
      await sendResetPassword(email);
      setAuthSuccessMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      const code = err?.code || '';
      const msg = getFriendlyAuthErrorMessage(code) || err?.message || 'Falha ao enviar e-mail de recuperação.';
      setLoginError(msg);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      setLoginError(null);
      // Apagar caches e rascunhos temporários locais ao sair, PRESERVANDO as avaliações salvas de usuários
      clearAllAppDataAndCache({ keepTheme: true, preserveUserEssays: true });
      setAuthSuccessMessage('Sessão encerrada com sucesso. Suas redações e avaliações permanecem 100% salvas.');
    } catch (err: any) {
      console.error('Logout failed:', err);
      // Mesmo se o logout falhar remotamente, garante limpeza do cache temporário mantendo as redações
      clearAllAppDataAndCache({ keepTheme: true, preserveUserEssays: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        globalStats,
        signInGoogle,
        signInEmail,
        signUpEmail,
        resetPassword,
        clearAuthError,
        signOut,
        loginError,
        authSuccessMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
