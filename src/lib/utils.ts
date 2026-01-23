import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time elapsed
 */
export function formatTimeElapsed(startTime: Date): string {
  const elapsed = Date.now() - startTime.getTime();
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Delay/sleep function
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-orange-400',
    expert: 'text-red-400',
  };
  return colors[difficulty] || 'text-gray-400';
}

/**
 * Get threat level color class
 */
export function getThreatColor(level: string): string {
  const colors: Record<string, string> = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
    info: 'text-blue-500',
  };
  return colors[level] || 'text-gray-500';
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    locked: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    available: 'bg-cyber-500/20 text-cyber-400 border-cyber-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return classes[status] || '';
}

/**
 * Calculate XP for completing a module
 */
export function calculateXP(score: number, difficulty: string): number {
  const multipliers: Record<string, number> = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2,
    expert: 3,
  };
  const multiplier = multipliers[difficulty] || 1;
  return Math.round(score * multiplier);
}

/**
 * Get level title based on level number
 */
export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Security Novice',
    2: 'Security Trainee',
    3: 'Security Aware',
    4: 'Security Defender',
    5: 'Security Guardian',
    6: 'Security Specialist',
    7: 'Security Expert',
    8: 'Security Master',
    9: 'Security Champion',
    10: 'Security Legend',
  };
  if (level >= 10) return titles[10];
  return titles[level] || 'Unknown';
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Parse domain from email address
 */
export function parseDomain(email: string): string {
  const match = email.match(/@([^@]+)$/);
  return match ? match[1] : '';
}

/**
 * Check if URL looks suspicious
 */
export function analyzeSuspiciousURL(url: string): string[] {
  const redFlags: string[] = [];
  
  // Check for IP address instead of domain
  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    redFlags.push('Uses IP address instead of domain name');
  }
  
  // Check for misspelled common domains
  const commonDomains = ['google', 'microsoft', 'amazon', 'apple', 'facebook', 'paypal', 'netflix'];
  commonDomains.forEach((domain) => {
    const regex = new RegExp(`${domain.split('').join('.?')}`, 'i');
    if (regex.test(url) && !url.toLowerCase().includes(domain)) {
      redFlags.push(`Possible typosquatting of ${domain}`);
    }
  });
  
  // Check for excessive subdomains
  const subdomains = (url.match(/\./g) || []).length;
  if (subdomains > 3) {
    redFlags.push('Excessive subdomains');
  }
  
  // Check for URL shorteners
  const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly'];
  if (shorteners.some((s) => url.toLowerCase().includes(s))) {
    redFlags.push('Uses URL shortener to hide destination');
  }
  
  // Check for suspicious TLDs
  const suspiciousTLDs = ['.xyz', '.top', '.club', '.work', '.click', '.link'];
  if (suspiciousTLDs.some((tld) => url.toLowerCase().endsWith(tld))) {
    redFlags.push('Uses uncommon/suspicious TLD');
  }
  
  return redFlags;
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format score with grade
 */
export function formatScoreWithGrade(score: number): { score: number; grade: string; color: string } {
  let grade: string;
  let color: string;
  
  if (score >= 90) {
    grade = 'A';
    color = 'text-green-400';
  } else if (score >= 80) {
    grade = 'B';
    color = 'text-cyber-400';
  } else if (score >= 70) {
    grade = 'C';
    color = 'text-yellow-400';
  } else if (score >= 60) {
    grade = 'D';
    color = 'text-orange-400';
  } else {
    grade = 'F';
    color = 'text-red-400';
  }
  
  return { score, grade, color };
}
