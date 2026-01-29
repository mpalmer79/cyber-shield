// ============================================
// CyberShield - Scenario Type Definitions
// ============================================

import type { DifficultyLevel } from '@/types';

// Generic scenario type for all module types
export interface TrainingScenario {
  id: string;
  moduleType: string;
  type: string;
  title: string;
  difficulty: DifficultyLevel;
  content: Record<string, unknown>;
  isCorrectAnswer: boolean;
  redFlags: string[];
  explanation: string;
  learningPoints: string[];
  image?: string;
}
