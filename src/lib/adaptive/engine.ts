// ============================================
// CyberShield - Adaptive Difficulty Engine
// Tracks weaknesses and weights future training toward gaps
// ============================================

import { classifyScenarioFlags, getAllCategoryIds, RED_FLAG_CATEGORIES } from './red-flag-taxonomy';
import type { TrainingScenario } from '../scenarios/types';

// -- Types --

export interface ScenarioResult {
  scenarioId: string;
  moduleType: string;
  redFlags: string[];
  wasCorrect: boolean;
  timestamp: string;
}

export interface CategoryStats {
  categoryId: string;
  encountered: number;   // how many scenarios with this category we've seen
  detected: number;      // how many of those we got right
  missed: number;        // how many we missed
  detectionRate: number;  // detected / encountered (0-1)
}

export interface VulnerabilityProfile {
  categoryStats: Record<string, CategoryStats>;
  totalSessions: number;
  totalScenarios: number;
  sessionHistory: ScenarioResult[];
  lastUpdated: string;
  isCalibrated: boolean;  // true after 3+ sessions
}

export interface RadarDataPoint {
  categoryId: string;
  label: string;
  shortLabel: string;
  value: number;         // 0-100 detection rate
  encountered: number;
  icon: string;
}

// -- Factory --

export function createEmptyProfile(): VulnerabilityProfile {
  let stats: Record<string, CategoryStats> = {};
  for (let catId of getAllCategoryIds()) {
    stats[catId] = {
      categoryId: catId,
      encountered: 0,
      detected: 0,
      missed: 0,
      detectionRate: 0,
    };
  }

  return {
    categoryStats: stats,
    totalSessions: 0,
    totalScenarios: 0,
    sessionHistory: [],
    lastUpdated: new Date().toISOString(),
    isCalibrated: false,
  };
}

// -- Core Engine Functions --

/**
 * Record a single scenario result into the vulnerability profile.
 * Each scenario's red flags get classified and stats update accordingly.
 */
export function recordScenarioResult(
  profile: VulnerabilityProfile,
  result: ScenarioResult
): VulnerabilityProfile {
  let newStats = { ...profile.categoryStats };

  // classify the scenario's red flags into categories
  let categoryCounts = classifyScenarioFlags(result.redFlags);

  // update stats for each category present in this scenario
  for (let catId of Object.keys(categoryCounts)) {
    let existing = newStats[catId] || {
      categoryId: catId,
      encountered: 0,
      detected: 0,
      missed: 0,
      detectionRate: 0,
    };

    let updated = { ...existing };
    updated.encountered = updated.encountered + 1;

    if (result.wasCorrect) {
      updated.detected = updated.detected + 1;
    } else {
      updated.missed = updated.missed + 1;
    }

    // recalculate detection rate
    updated.detectionRate = updated.encountered > 0
      ? updated.detected / updated.encountered
      : 0;

    newStats[catId] = updated;
  }

  let newHistory = [...profile.sessionHistory, result];
  // keep history manageable - last 200 results
  if (newHistory.length > 200) {
    newHistory = newHistory.slice(newHistory.length - 200);
  }

  return {
    ...profile,
    categoryStats: newStats,
    totalScenarios: profile.totalScenarios + 1,
    sessionHistory: newHistory,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Increment the session counter and check calibration status.
 * Call this when a training session completes (after all scenarios recorded).
 */
export function completeSession(profile: VulnerabilityProfile): VulnerabilityProfile {
  let sessions = profile.totalSessions + 1;
  return {
    ...profile,
    totalSessions: sessions,
    isCalibrated: sessions >= 3,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get radar chart data from the vulnerability profile.
 * Returns sorted by detection rate (weakest first).
 */
export function getRadarData(profile: VulnerabilityProfile): RadarDataPoint[] {
  return RED_FLAG_CATEGORIES.map(cat => {
    let stats = profile.categoryStats[cat.id];
    let rate = stats && stats.encountered > 0
      ? Math.round(stats.detectionRate * 100)
      : -1; // -1 means "not yet tested"

    return {
      categoryId: cat.id,
      label: cat.label,
      shortLabel: cat.shortLabel,
      value: rate === -1 ? 0 : rate,
      encountered: stats?.encountered || 0,
      icon: cat.icon,
    };
  });
}

/**
 * Get the user's weakest categories (lowest detection rates).
 * Only includes categories with at least 1 encounter.
 */
export function getWeakCategories(profile: VulnerabilityProfile, count: number = 3): CategoryStats[] {
  let tested = Object.values(profile.categoryStats)
    .filter(s => s.encountered > 0)
    .sort((a, b) => a.detectionRate - b.detectionRate);

  return tested.slice(0, count);
}

/**
 * Get the user's strongest categories.
 */
export function getStrongCategories(profile: VulnerabilityProfile, count: number = 3): CategoryStats[] {
  let tested = Object.values(profile.categoryStats)
    .filter(s => s.encountered > 0)
    .sort((a, b) => b.detectionRate - a.detectionRate);

  return tested.slice(0, count);
}

/**
 * Generate a human-readable vulnerability summary.
 */
export function getVulnerabilitySummary(profile: VulnerabilityProfile): string[] {
  let insights: string[] = [];

  if (!profile.isCalibrated) {
    let remaining = 3 - profile.totalSessions;
    insights.push(
      `Complete ${remaining} more training session${remaining > 1 ? 's' : ''} to calibrate your vulnerability profile.`
    );
    return insights;
  }

  let weak = getWeakCategories(profile, 2);
  let strong = getStrongCategories(profile, 2);

  for (let cat of strong) {
    let catInfo = RED_FLAG_CATEGORIES.find(c => c.id === cat.categoryId);
    if (catInfo && cat.detectionRate >= 0.8) {
      insights.push(
        `Strong at ${catInfo.label}: You catch ${Math.round(cat.detectionRate * 100)}% of these threats.`
      );
    }
  }

  for (let cat of weak) {
    let catInfo = RED_FLAG_CATEGORIES.find(c => c.id === cat.categoryId);
    if (catInfo && cat.detectionRate < 0.7) {
      insights.push(
        `Needs work on ${catInfo.label}: Only ${Math.round(cat.detectionRate * 100)}% detection rate. Future sessions will focus here.`
      );
    }
  }

  if (insights.length === 0) {
    insights.push('Well-rounded performance across all threat categories. Keep practicing to stay sharp!');
  }

  return insights;
}

// -- Adaptive Scenario Selection --

/**
 * Score a scenario based on how well it targets the user's weaknesses.
 * Higher score = better fit for adaptive training.
 */
function scoreScenarioForUser(scenario: TrainingScenario, profile: VulnerabilityProfile): number {
  let categories = classifyScenarioFlags(scenario.redFlags);
  let score = 0;

  for (let catId of Object.keys(categories)) {
    let stats = profile.categoryStats[catId];
    if (!stats || stats.encountered === 0) {
      // untested category gets moderate priority
      score = score + 5;
    } else {
      // lower detection rate = higher priority (invert the rate)
      let weakness = 1 - stats.detectionRate;
      score = score + (weakness * 10);
    }
  }

  return score;
}

/**
 * Select scenarios adaptively based on the vulnerability profile.
 * Before calibration (< 3 sessions), returns random selection.
 * After calibration, weights toward weak categories.
 *
 * @param allScenarios - full pool of scenarios for the module
 * @param count - how many to pick
 * @param profile - user's vulnerability profile
 * @param previousIds - scenario IDs to avoid (already done recently)
 */
export function selectAdaptiveScenarios(
  allScenarios: TrainingScenario[],
  count: number,
  profile: VulnerabilityProfile,
  previousIds: string[] = []
): TrainingScenario[] {
  // filter out recently completed
  let available = allScenarios.filter(s => !previousIds.includes(s.id));

  // if not enough after filtering, allow repeats
  if (available.length < count) {
    available = [...allScenarios];
  }

  // before calibration, just shuffle
  if (!profile.isCalibrated) {
    let shuffled = [...available];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // after calibration, score and weight selection
  let scored = available.map(s => ({
    scenario: s,
    score: scoreScenarioForUser(s, profile),
  }));

  // sort by adaptive score descending (highest priority first)
  scored.sort((a, b) => b.score - a.score);

  // take top 60% from weakness-targeted, 40% random for variety
  let targetedCount = Math.ceil(count * 0.6);
  let randomCount = count - targetedCount;

  let targeted = scored.slice(0, targetedCount).map(s => s.scenario);

  // remaining pool for random picks
  let remainingPool = scored.slice(targetedCount).map(s => s.scenario);
  for (let i = remainingPool.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = remainingPool[i];
    remainingPool[i] = remainingPool[j];
    remainingPool[j] = temp;
  }
  let randomPicks = remainingPool.slice(0, randomCount);

  // combine and shuffle the final set so order isn't predictable
  let combined = [...targeted, ...randomPicks];
  for (let i = combined.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = combined[i];
    combined[i] = combined[j];
    combined[j] = temp;
  }

  return combined.slice(0, count);
}

/**
 * Calculate an overall "Security IQ" score from 0-100.
 * Weighted average of all tested categories.
 */
export function calculateSecurityIQ(profile: VulnerabilityProfile): number {
  let tested = Object.values(profile.categoryStats).filter(s => s.encountered > 0);

  if (tested.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (let stat of tested) {
    // weight by number of encounters (more data = more confidence)
    let w = Math.min(stat.encountered, 10); // cap at 10 for fairness
    weightedSum = weightedSum + (stat.detectionRate * w);
    totalWeight = totalWeight + w;
  }

  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
}
