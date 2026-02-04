// ============================================
// CyberShield - Adaptive Difficulty Engine
// ============================================

export {
  RED_FLAG_CATEGORIES,
  getCategoryById,
  classifyRedFlag,
  classifyScenarioFlags,
  getAllCategoryIds,
} from './red-flag-taxonomy';
export type { RedFlagCategory } from './red-flag-taxonomy';

export {
  createEmptyProfile,
  recordScenarioResult,
  completeSession,
  getRadarData,
  getWeakCategories,
  getStrongCategories,
  getVulnerabilitySummary,
  selectAdaptiveScenarios,
  calculateSecurityIQ,
} from './engine';
export type {
  ScenarioResult,
  CategoryStats,
  VulnerabilityProfile,
  RadarDataPoint,
} from './engine';
