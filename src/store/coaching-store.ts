// src/store/coaching-store.ts
// Add this store alongside your existing stores in src/store/index.ts
// Persists coaching session history and preferences

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CoachingScoreBreakdown, CoachingSession } from '../lib/coaching';

// ============================================
// TYPES
// ============================================

interface CoachingHistoryEntry {
  scenarioId: string;
  scenarioTitle: string;
  moduleType: string;
  score: CoachingScoreBreakdown;
  flagsIdentified: number;
  flagsTotal: number;
  messageCount: number;
  completedAt: number;
}

interface CoachingStore {
  // Settings
  coachingEnabled: boolean;
  autoOpenChat: boolean;

  // History (last 100 sessions)
  history: CoachingHistoryEntry[];

  // Stats
  totalCoachingSessions: number;
  averageScore: number;
  bestGrade: CoachingScoreBreakdown['grade'] | null;

  // Actions
  toggleCoaching: () => void;
  toggleAutoOpen: () => void;
  recordSession: (
    scenario: { id: string; title: string; moduleType: string },
    score: CoachingScoreBreakdown,
    session: CoachingSession
  ) => void;
  clearHistory: () => void;
}

// ============================================
// STORE
// ============================================

const gradeRank: Record<string, number> = { S: 6, A: 5, B: 4, C: 3, D: 2, F: 1 };

export const useCoachingStore = create<CoachingStore>()(
  persist(
    (set, get) => ({
      coachingEnabled: true,
      autoOpenChat: true,
      history: [],
      totalCoachingSessions: 0,
      averageScore: 0,
      bestGrade: null,

      toggleCoaching: () => set(s => ({ coachingEnabled: !s.coachingEnabled })),
      toggleAutoOpen: () => set(s => ({ autoOpenChat: !s.autoOpenChat })),

      recordSession: (scenario, score, session) => {
        const entry: CoachingHistoryEntry = {
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          moduleType: scenario.moduleType,
          score,
          flagsIdentified: session.identifiedFlags.length,
          flagsTotal: session.identifiedFlags.length + session.missedFlags.length + session.hintedFlags.length,
          messageCount: session.messages.filter(m => m.role === 'user').length,
          completedAt: Date.now(),
        };

        const state = get();
        const updatedHistory = [entry, ...state.history].slice(0, 100);
        const totalSessions = state.totalCoachingSessions + 1;
        const avgScore = Math.round(
          ((state.averageScore * state.totalCoachingSessions) + score.total) / totalSessions
        );

        // Track best grade
        let bestGrade = state.bestGrade;
        if (!bestGrade || gradeRank[score.grade] > gradeRank[bestGrade]) {
          bestGrade = score.grade;
        }

        set({
          history: updatedHistory,
          totalCoachingSessions: totalSessions,
          averageScore: avgScore,
          bestGrade,
        });
      },

      clearHistory: () => set({
        history: [],
        totalCoachingSessions: 0,
        averageScore: 0,
        bestGrade: null,
      }),
    }),
    {
      name: 'cybershield-coaching',
    }
  )
);
