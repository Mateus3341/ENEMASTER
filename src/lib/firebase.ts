import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  deleteDoc,
  serverTimestamp,
  increment,
  onSnapshot
} from 'firebase/firestore';

// Embedded Firebase applet config
const firebaseConfig = {
  projectId: "splendid-oxygen-tnm9t",
  appId: "1:846749500176:web:343d83cfa4aa8f7cdf1b95",
  apiKey: "AIzaSyAY6aMG-_t7FwJvHMDSPP5VOhcM1V-jl8A",
  authDomain: "splendid-oxygen-tnm9t.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-enemasterredaoen-f44aeb29-76bc-4e07-8d0c-019d85ae70c0",
  storageBucket: "splendid-oxygen-tnm9t.firebasestorage.app",
  messagingSenderId: "846749500176",
  oAuthClientId: "846749500176-v0i7qk04da9nftol0h5blkrq2pkic1ll.apps.googleusercontent.com"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Auth & Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider custom params
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure resilient auth persistence for Safari / iOS WebKit / Private Mode / Firefox
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    setPersistence(auth, browserSessionPersistence).catch(() => {
      setPersistence(auth, inMemoryPersistence).catch(() => {});
    });
  });
}

// Test connection on boot
export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is currently offline or unreachable.');
    }
  }
}

// User Profile Interface
export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstLoginAt: any;
  lastLoginAt: any;
  totalLogins: number;
  totalEssaysCorrected: number;
  bestScore: number;
}

// Global App Telemetry Interface for Admin / Owner
export interface AppGlobalStats {
  totalVisits: number;
  uniqueVisitors: number;
  totalUniqueUsers: number;
  totalLoginEvents: number;
  totalEssaysSubmitted: number;
  lastActiveAt: any;
}

/**
 * Tracks site visitors safely in Firestore without collecting any personal data.
 * Counts unique browsers and session visits.
 */
export async function trackSiteVisit(): Promise<void> {
  try {
    const isNewSession = !sessionStorage.getItem('enem_session_tracked');
    let isFirstTimeVisitor = false;

    let visitorId = localStorage.getItem('enem_visitor_token');
    if (!visitorId) {
      isFirstTimeVisitor = true;
      visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      try {
        localStorage.setItem('enem_visitor_token', visitorId);
      } catch {}
    }

    if (isNewSession) {
      sessionStorage.setItem('enem_session_tracked', '1');
      const globalStatsRef = doc(db, 'app_metadata', 'global_stats');

      const updatePayload: Record<string, any> = {
        totalVisits: increment(1),
        lastActiveAt: serverTimestamp(),
      };

      if (isFirstTimeVisitor) {
        updatePayload.uniqueVisitors = increment(1);
      }

      await setDoc(globalStatsRef, updatePayload, { merge: true });
    }
  } catch (error) {
    // Non-blocking telemetry tracking
    console.debug('Visitor tracking check:', error);
  }
}

/**
 * Subscribe to real-time global visitor & app statistics
 */
export function subscribeGlobalStats(onUpdate: (stats: AppGlobalStats) => void): () => void {
  const globalStatsRef = doc(db, 'app_metadata', 'global_stats');
  return onSnapshot(globalStatsRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      onUpdate({
        totalVisits: data.totalVisits || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        totalUniqueUsers: data.totalUniqueUsers || 0,
        totalLoginEvents: data.totalLoginEvents || 0,
        totalEssaysSubmitted: data.totalEssaysSubmitted || 0,
        lastActiveAt: data.lastActiveAt || null,
      });
    } else {
      onUpdate({
        totalVisits: 0,
        uniqueVisitors: 0,
        totalUniqueUsers: 0,
        totalLoginEvents: 0,
        totalEssaysSubmitted: 0,
        lastActiveAt: null,
      });
    }
  }, (err) => {
    console.debug('Global stats subscription:', err);
  });
}

/**
 * Helper to translate Firebase Auth errors into friendly Portuguese
 */
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'O formato do e-mail inserido é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/user-not-found':
      return 'Nenhuma conta encontrada com este e-mail. Crie seu cadastro abaixo.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta cadastrada com este e-mail. Faça login.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return '';
    case 'auth/popup-blocked':
      return 'A janela de autenticação foi bloqueada pelo navegador. Redirecionando para login seguro...';
    case 'auth/network-request-failed':
      return 'Falha de comunicação temporária. Verifique sua conexão e tente novamente.';
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/web-storage-unsupported':
      return 'O armazenamento seguro do seu navegador está restrito. Conectando em modo compatível...';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde alguns instantes antes de tentar novamente.';
    default:
      return 'Ocorreu um erro na autenticação. Tente novamente.';
  }
}

/**
 * Registers / Updates User Login in Firestore and updates Global User Count safely
 */
export async function recordUserLogin(user: User): Promise<AppUserProfile> {
  const defaultProfile: AppUserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Estudante ENEM'),
    photoURL: user.photoURL,
    firstLoginAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    totalLogins: 1,
    totalEssaysCorrected: 0,
    bestScore: 0,
  };

  try {
    const userRef = doc(db, 'users', user.uid);
    const globalStatsRef = doc(db, 'app_metadata', 'global_stats');

    const userSnap = await getDoc(userRef);
    const now = new Date();

    if (!userSnap.exists()) {
      // Brand new user
      const newProfile: AppUserProfile = {
        ...defaultProfile,
        firstLoginAt: now.toISOString(),
        lastLoginAt: now.toISOString(),
      };

      await setDoc(userRef, {
        ...newProfile,
        firstLoginTimestamp: serverTimestamp(),
        lastLoginTimestamp: serverTimestamp(),
      });

      // Increment global unique user count safely
      try {
        await setDoc(globalStatsRef, {
          totalUniqueUsers: increment(1),
          totalLoginEvents: increment(1),
          lastActiveAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.debug('Global stats increment note:', e);
      }

      return newProfile;
    } else {
      // Existing user returning
      const data = userSnap.data();
      const updatedProfile: AppUserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || data.displayName || defaultProfile.displayName,
        photoURL: user.photoURL || data.photoURL,
        firstLoginAt: data.firstLoginAt || now.toISOString(),
        lastLoginAt: now.toISOString(),
        totalLogins: (data.totalLogins || 1) + 1,
        totalEssaysCorrected: data.totalEssaysCorrected || 0,
        bestScore: data.bestScore || 0,
      };

      await updateDoc(userRef, {
        displayName: updatedProfile.displayName,
        photoURL: updatedProfile.photoURL,
        lastLoginAt: updatedProfile.lastLoginAt,
        lastLoginTimestamp: serverTimestamp(),
        totalLogins: increment(1),
      });

      try {
        await setDoc(globalStatsRef, {
          totalLoginEvents: increment(1),
          lastActiveAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.debug('Login event increment note:', e);
      }

      return updatedProfile;
    }
  } catch (error) {
    console.warn('recordUserLogin offline or non-blocking fallback:', error);
    return defaultProfile;
  }
}

/**
 * Sign in with Google (supports Popup with automatic Redirect fallback for iPhones, Safari, and Firefox)
 */
export async function loginWithGoogle(): Promise<User | null> {
  const isMobile = typeof window !== 'undefined' && (
    /iPad|iPhone|iPod|Android/i.test(navigator.userAgent || '') ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );

  // On iOS / Android mobile devices, signInWithRedirect is the recommended standard
  // to avoid blank popup tabs, strict popup blocking and context drops.
  if (isMobile) {
    try {
      await signInWithRedirect(auth, googleProvider);
      return null;
    } catch (e: any) {
      console.warn('Mobile redirect flow unavailable (e.g. inside strict iframe), attempting popup:', e);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        recordUserLogin(result.user).catch(() => {});
        return result.user;
      }
      return null;
    }
  }

  // On desktop browsers, try popup first for fast in-place auth
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      recordUserLogin(result.user).catch(() => {});
      return result.user;
    }
    return null;
  } catch (error: any) {
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      console.info('Google login popup was closed by the user.');
      return null;
    }

    // In browsers that block popups or restrict third-party storage (Safari, Firefox, Brave):
    // Fall back to redirect seamlessly
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-supported-in-this-environment' ||
      code === 'auth/internal-error' ||
      code === 'auth/network-request-failed' ||
      code === 'auth/web-storage-unsupported'
    ) {
      console.info('Desktop popup blocked or restricted. Redirecting to Google login...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectErr: any) {
        console.warn('Redirect login attempt error:', redirectErr);
        throw redirectErr;
      }
    }

    console.warn('Google login issue:', error?.message || error);
    throw error;
  }
}

/**
 * Sign in with Email and Password (resilient and non-blocking profile sync)
 */
export async function loginWithEmailPassword(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  if (result.user) {
    recordUserLogin(result.user).catch((e) => console.debug('Non-blocking login record note:', e));
    return result.user;
  }
  throw new Error('Falha ao autenticar.');
}

/**
 * Register with Email, Password and optional Display Name
 */
export async function registerWithEmailPassword(email: string, pass: string, displayName?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (result.user) {
    if (displayName && displayName.trim()) {
      try {
        await updateProfile(result.user, { displayName: displayName.trim() });
      } catch (err) {
        console.warn('Could not update display name:', err);
      }
    }
    recordUserLogin(result.user).catch((e) => console.debug('Non-blocking register record note:', e));
    return result.user;
  }
  throw new Error('Falha ao criar conta.');
}

/**
 * Password Reset Email
 */
export async function sendResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign Out
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

