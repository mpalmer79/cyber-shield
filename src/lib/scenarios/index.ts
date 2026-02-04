// ============================================
// CyberShield - Scenarios Index
// Re-exports all scenarios and utility functions
// ============================================

// Types
export type { TrainingScenario } from './types';

// Images
export { scenarioImages } from './images';

// Scenario Collections
export { phishingScenarios } from './phishing';
export { socialEngineeringScenarios } from './social-engineering';
export { passwordSecurityScenarios } from './password-security';
export { secureBrowsingScenarios } from './secure-browsing';
export { incidentResponseScenarios } from './incident-response';
export { dataProtectionScenarios } from './data-protection';
export { malwareAwarenessScenarios } from './malware-awareness';
export { threatHuntingScenarios } from './threat-hunting';

// Import for internal use
import type { TrainingScenario } from './types';
import { phishingScenarios } from './phishing';
import { socialEngineeringScenarios } from './social-engineering';
import { passwordSecurityScenarios } from './password-security';
import { secureBrowsingScenarios } from './secure-browsing';
import { incidentResponseScenarios } from './incident-response';
import { dataProtectionScenarios } from './data-protection';
import { malwareAwarenessScenarios } from './malware-awareness';
import { threatHuntingScenarios } from './threat-hunting';
import type { VulnerabilityProfile } from '../adaptive';
import { selectAdaptiveScenarios } from '../adaptive';

// ============================================
// Utility Functions
// ============================================

/**
 * Get all scenarios for a specific module type
 */
export function getScenariosForModule(moduleType: string): TrainingScenario[] {
  switch (moduleType) {
    case 'phishing':
      return phishingScenarios;
    case 'social-engineering':
      return socialEngineeringScenarios;
    case 'password-security':
      return passwordSecurityScenarios;
    case 'secure-browsing':
      return secureBrowsingScenarios;
    case 'incident-response':
      return incidentResponseScenarios;
    case 'data-protection':
      return dataProtectionScenarios;
    case 'malware-awareness':
      return malwareAwarenessScenarios;
    case 'threat-hunting':
      return threatHuntingScenarios;
    default:
      return phishingScenarios;
  }
}

/**
 * Get random scenarios for a module (shuffled)
 */
export function getRandomScenarios(moduleType: string, count: number): TrainingScenario[] {
  const scenarios = getScenariosForModule(moduleType);
  const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, scenarios.length));
}

/**
 * Get adaptive scenarios weighted toward user's weak spots.
 * Falls back to random selection before calibration.
 */
export function getAdaptiveScenarios(
  moduleType: string,
  count: number,
  profile: VulnerabilityProfile,
  recentIds: string[] = []
): TrainingScenario[] {
  const scenarios = getScenariosForModule(moduleType);
  return selectAdaptiveScenarios(scenarios, count, profile, recentIds);
}

/**
 * Get a specific scenario by ID
 */
export function getScenarioById(id: string): TrainingScenario | undefined {
  const allScenarios = [
    ...phishingScenarios,
    ...socialEngineeringScenarios,
    ...passwordSecurityScenarios,
    ...secureBrowsingScenarios,
    ...incidentResponseScenarios,
    ...dataProtectionScenarios,
    ...malwareAwarenessScenarios,
    ...threatHuntingScenarios,
  ];
  return allScenarios.find(s => s.id === id);
}

/**
 * Get total scenario count
 */
export function getTotalScenarioCount(): number {
  return (
    phishingScenarios.length +
    socialEngineeringScenarios.length +
    passwordSecurityScenarios.length +
    secureBrowsingScenarios.length +
    incidentResponseScenarios.length +
    dataProtectionScenarios.length +
    malwareAwarenessScenarios.length +
    threatHuntingScenarios.length
  );
}

/**
 * Get scenario count per module
 */
export function getScenarioCountByModule(): Record<string, number> {
  return {
    'phishing': phishingScenarios.length,
    'social-engineering': socialEngineeringScenarios.length,
    'password-security': passwordSecurityScenarios.length,
    'secure-browsing': secureBrowsingScenarios.length,
    'incident-response': incidentResponseScenarios.length,
    'data-protection': dataProtectionScenarios.length,
    'malware-awareness': malwareAwarenessScenarios.length,
    'threat-hunting': threatHuntingScenarios.length,
  };
}
