import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  serverTimestamp,
  updateDoc,
  increment,
  onSnapshot
} from 'firebase/firestore';
import { db, AppGlobalStats } from './firebase';
import { EssayCorrectionResult } from '../types';

/**
 * Deeply sanitizes an object for Firestore by converting any undefined properties
 * into null or removing them, preventing "Unsupported field value: undefined" errors.
 */
function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      result[key] = sanitizeForFirestore(val);
    }
  }
  return result;
}

/**
 * Parses raw Firestore document data into a typed EssayCorrectionResult.
 */
function parseEssayDoc(docId: string, data: any): EssayCorrectionResult {
  return {
    id: data.id || docId,
    date: data.date || (data.createdAt ? new Date(data.createdAt).toLocaleDateString('pt-BR') : 'Recente'),
    theme: data.theme || '',
    essayText: data.essayText || '',
    totalScore: Number(data.totalScore) || 0,
    competencies: data.competencies || {
      c1: { score: 0, feedback: '', subCriteria: {} },
      c2: { score: 0, feedback: '', subCriteria: {} },
      c3: { score: 0, feedback: '', subCriteria: {} },
      c4: { score: 0, feedback: '', subCriteria: {} },
      c5: { score: 0, feedback: '', subCriteria: {} },
    },
    c1Deviations: data.c1Deviations || [],
    c5Structure: data.c5Structure || {
      agent: { present: false, text: '' },
      action: { present: false, text: '' },
      modeMedium: { present: false, text: '' },
      effect: { present: false, text: '' },
      detailing: { present: false, text: '' },
      respectsHumanRights: true,
      validElementsCount: 0
    },
    generalDiagnostic: data.generalDiagnostic || '',
    top3Problems: data.top3Problems || [],
    top3Strengths: data.top3Strengths || [],
    actionPlanToImprove: data.actionPlanToImprove || [],
    highPerformanceComparison: data.highPerformanceComparison || '',
    pedagogicalRewrites: data.pedagogicalRewrites || [],
    auditLog: data.auditLog || null,
    reviewerReport: data.reviewerReport || null,
    aiAnalysisLog: data.aiAnalysisLog || null,
    validationReport: data.validationReport || null,
    evidenceValidatorReport: data.evidenceValidatorReport || null,
    highPerformanceCurveReport: data.highPerformanceCurveReport || null,
    dualEvaluatorSimulation: data.dualEvaluatorSimulation || null,
    cartilhaBenchmark: data.cartilhaBenchmark || null,
    isHandwrittenOcr: data.isHandwrittenOcr || false,
    ocrConfidenceNote: data.ocrConfidenceNote || null,
    createdAt: data.createdAt || (data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : new Date().toISOString()),
  };
}

/**
 * Saves or updates an essay correction to Firestore for a user.
 */
export async function saveEssayToFirestore(userId: string, essay: EssayCorrectionResult): Promise<void> {
  if (!userId || !essay || !essay.id) return;

  const essayDocRef = doc(db, 'users', userId, 'essays', essay.id);
  
  // Format essay for Firestore safely with deep sanitization
  const rawPayload = {
    id: essay.id,
    userId: userId,
    date: essay.date || new Date().toLocaleDateString('pt-BR'),
    theme: essay.theme || '',
    essayText: essay.essayText || '',
    totalScore: essay.totalScore || 0,
    competencies: essay.competencies,
    c1Deviations: essay.c1Deviations || [],
    c5Structure: essay.c5Structure || null,
    generalDiagnostic: essay.generalDiagnostic || '',
    top3Problems: essay.top3Problems || [],
    top3Strengths: essay.top3Strengths || [],
    actionPlanToImprove: essay.actionPlanToImprove || [],
    highPerformanceComparison: essay.highPerformanceComparison || '',
    pedagogicalRewrites: essay.pedagogicalRewrites || [],
    auditLog: essay.auditLog || null,
    reviewerReport: essay.reviewerReport || null,
    aiAnalysisLog: essay.aiAnalysisLog || null,
    validationReport: essay.validationReport || null,
    evidenceValidatorReport: essay.evidenceValidatorReport || null,
    highPerformanceCurveReport: essay.highPerformanceCurveReport || null,
    dualEvaluatorSimulation: essay.dualEvaluatorSimulation || null,
    cartilhaBenchmark: essay.cartilhaBenchmark || null,
    isHandwrittenOcr: essay.isHandwrittenOcr || false,
    ocrConfidenceNote: essay.ocrConfidenceNote || null,
    createdAt: essay.createdAt || new Date().toISOString(),
    updatedAt: serverTimestamp(),
  };

  const cleanPayload = sanitizeForFirestore(rawPayload);

  await setDoc(essayDocRef, cleanPayload, { merge: true });

  // Update user's aggregate stats
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      totalEssaysCorrected: increment(1),
      lastActiveTimestamp: serverTimestamp(),
      bestScore: increment(0), // ensures field exists
    });
  } catch (e) {
    console.debug('Aggregate user stats note:', e);
  }

  // Update global stats
  try {
    const globalStatsRef = doc(db, 'app_metadata', 'global_stats');
    await setDoc(globalStatsRef, {
      totalEssaysSubmitted: increment(1),
      lastActiveAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.debug('Global stats note:', e);
  }
}

/**
 * Deletes an essay from Firestore.
 */
export async function deleteEssayFromFirestore(userId: string, essayId: string): Promise<void> {
  if (!userId || !essayId) return;
  const essayDocRef = doc(db, 'users', userId, 'essays', essayId);
  await deleteDoc(essayDocRef);
}

/**
 * Loads all essays of a user from Firestore once.
 */
export async function loadUserEssaysFromFirestore(userId: string): Promise<EssayCorrectionResult[]> {
  if (!userId) return [];
  try {
    const essaysRef = collection(db, 'users', userId, 'essays');
    const querySnapshot = await getDocs(essaysRef);
    
    const essays: EssayCorrectionResult[] = [];
    querySnapshot.forEach((docSnap) => {
      essays.push(parseEssayDoc(docSnap.id, docSnap.data()));
    });

    // Robust sorting in memory
    essays.sort((a, b) => {
      const timeB = new Date(b.createdAt || b.date || 0).getTime() || 0;
      const timeA = new Date(a.createdAt || a.date || 0).getTime() || 0;
      return timeB - timeA;
    });

    return essays;
  } catch (error) {
    console.warn('Error loading essays from Firestore:', error);
    return [];
  }
}

/**
 * Subscribes in real-time to a user's essay subcollection.
 * Synchronizes instantly across mobile, tablet, and desktop.
 */
export function subscribeUserEssays(
  userId: string,
  onUpdate: (essays: EssayCorrectionResult[]) => void,
  onError?: (error: any) => void
): () => void {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  const essaysRef = collection(db, 'users', userId, 'essays');
  
  return onSnapshot(
    essaysRef,
    (snapshot) => {
      const essays: EssayCorrectionResult[] = [];
      snapshot.forEach((docSnap) => {
        essays.push(parseEssayDoc(docSnap.id, docSnap.data()));
      });

      // Sort in memory descending
      essays.sort((a, b) => {
        const timeB = new Date(b.createdAt || b.date || 0).getTime() || 0;
        const timeA = new Date(a.createdAt || a.date || 0).getTime() || 0;
        return timeB - timeA;
      });

      onUpdate(essays);
    },
    (error) => {
      console.warn('Real-time user essays snapshot error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Syncs any local offline/guest essays to the user's cloud account upon login.
 */
export async function syncLocalEssaysToCloud(userId: string, localEssays: EssayCorrectionResult[]): Promise<void> {
  if (!userId || !localEssays || localEssays.length === 0) return;
  
  try {
    const existingRemote = await loadUserEssaysFromFirestore(userId);
    const existingIds = new Set(existingRemote.map(e => e.id));

    // Upload any local essays that aren't in Firestore yet
    const pendingUploads = localEssays.filter(essay => !existingIds.has(essay.id));
    for (const essay of pendingUploads) {
      await saveEssayToFirestore(userId, essay);
    }
  } catch (error) {
    console.warn('Error migrating local essays to cloud account:', error);
  }
}

/**
 * Listens in real-time to Global Application Stats (Total users logged in, total essays, etc.)
 */
export function subscribeToGlobalStats(callback: (stats: AppGlobalStats) => void): () => void {
  const globalStatsRef = doc(db, 'app_metadata', 'global_stats');
  return onSnapshot(globalStatsRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback({
        totalVisits: data.totalVisits || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        totalUniqueUsers: data.totalUniqueUsers || 0,
        totalLoginEvents: data.totalLoginEvents || 0,
        totalEssaysSubmitted: data.totalEssaysSubmitted || 0,
        lastActiveAt: data.lastActiveAt,
      });
    } else {
      callback({
        totalVisits: 0,
        uniqueVisitors: 0,
        totalUniqueUsers: 0,
        totalLoginEvents: 0,
        totalEssaysSubmitted: 0,
        lastActiveAt: null,
      });
    }
  }, (err) => {
    console.warn('Global stats snapshot listener error:', err);
  });
}


