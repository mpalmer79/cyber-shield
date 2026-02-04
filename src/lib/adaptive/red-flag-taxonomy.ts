// ============================================
// CyberShield - Red Flag Taxonomy
// Maps scenario red flags to canonical vulnerability categories
// ============================================

export interface RedFlagCategory {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  keywords: string[];
}

// 10 canonical categories that cover all red flag types across every module
export const RED_FLAG_CATEGORIES: RedFlagCategory[] = [
  {
    id: 'domain_spoofing',
    label: 'Domain Spoofing',
    shortLabel: 'Domains',
    description: 'Spotting fake or mismatched sender domains and URL structures',
    icon: '🌐',
    keywords: [
      'domain', 'sender domain', 'suspicious domain', 'subdomain',
      'fromEmail', 'email domain', '.net', '.info', '.com',
      'company-support', 'official domain', 'doesn\'t match',
      'actual domain', 'password-reset.net',
    ],
  },
  {
    id: 'urgency_pressure',
    label: 'Urgency & Pressure',
    shortLabel: 'Urgency',
    description: 'Recognizing artificial time pressure and fear-based deadlines',
    icon: '⏰',
    keywords: [
      'urgent', 'urgency', 'pressure', 'immediately', 'deadline',
      'expires', '24 hours', '48 hours', 'act now', 'end of day',
      'locked out', 'overdue', 'right away', 'time-sensitive',
      'act immediately', 'losing', 'lose access',
    ],
  },
  {
    id: 'authority_impersonation',
    label: 'Authority Impersonation',
    shortLabel: 'Authority',
    description: 'Detecting fake authority figures like CEOs, IT staff, and officials',
    icon: '👔',
    keywords: [
      'ceo', 'executive', 'impersonat', 'pretexting', 'authority',
      'it support', 'it help desk', 'wire transfer', 'manager',
      'boss', 'director', 'official', 'president', 'government',
      'law enforcement', 'irs', 'fbi',
    ],
  },
  {
    id: 'suspicious_links',
    label: 'Suspicious Links',
    shortLabel: 'Links',
    description: 'Identifying fake URLs, redirects, and deceptive link text',
    icon: '🔗',
    keywords: [
      'link', 'url', 'click', 'http', 'suspicious link',
      'destination', 'non-', 'redelivery', 'tracking', 'verify',
      'shortened', 'hover', 'actual link', 'button links',
      'fake website', 'non-microsoft', 'non-official',
    ],
  },
  {
    id: 'attachment_threats',
    label: 'Attachment Threats',
    shortLabel: 'Attachments',
    description: 'Spotting dangerous attachments, double extensions, and malware delivery',
    icon: '📎',
    keywords: [
      'attachment', 'attached', '.exe', 'double extension',
      'download', 'file', 'malware', 'executable', 'macro',
      'pdf.exe', 'enable content', 'open', 'zip', 'install',
    ],
  },
  {
    id: 'generic_communication',
    label: 'Generic Communication',
    shortLabel: 'Generic',
    description: 'Recognizing impersonal greetings and vague content lacking specifics',
    icon: '📝',
    keywords: [
      'generic', 'dear employee', 'dear customer', 'without your name',
      'vague', 'no specific', 'unspecified', 'general reference',
      'impersonal', 'without details', 'name not used', 'services rendered',
    ],
  },
  {
    id: 'credential_harvesting',
    label: 'Credential Harvesting',
    shortLabel: 'Credentials',
    description: 'Detecting attempts to steal passwords, logins, and personal data',
    icon: '🔑',
    keywords: [
      'password', 'credential', 'login', 'verify your',
      'confirm your', 'account', 'username', 'personal information',
      'ssn', 'credit card', 'bank details', 'identity', 'reset',
      'requesting password', 'ask for password',
    ],
  },
  {
    id: 'emotional_manipulation',
    label: 'Emotional Manipulation',
    shortLabel: 'Emotion',
    description: 'Recognizing fear, greed, curiosity, and guilt exploitation',
    icon: '🎭',
    keywords: [
      'fear', 'emotion', 'curiosity', 'greed', 'too good',
      'congratulations', 'won', 'prize', 'reward', 'threat',
      'scare', 'alarming', 'worried', 'compromised',
      'unexpected', 'social proof',
    ],
  },
  {
    id: 'process_bypass',
    label: 'Process Bypass',
    shortLabel: 'Process',
    description: 'Spotting requests to skip procedures, maintain secrecy, or use unusual channels',
    icon: '🚧',
    keywords: [
      'bypass', 'confidential', 'secret', 'don\'t tell',
      'don\'t discuss', 'skip', 'approval', 'normal process',
      'unusual channel', 'not follow', 'special exception',
      'off the record', 'between us', 'discretion', 'secrecy',
      'tailgating', 'badge', 'hold the door',
    ],
  },
  {
    id: 'brand_impersonation',
    label: 'Brand Impersonation',
    shortLabel: 'Branding',
    description: 'Detecting fake but professional-looking brand mimicry and spoofed logos',
    icon: '🏷️',
    keywords: [
      'brand', 'logo', 'professional-looking', 'legitimate',
      'designed to seem', 'impersonating', 'official-looking',
      'fake branding', 'looks real', 'mimicked', 'counterfeit',
      'ups', 'microsoft', 'chase', 'apple', 'google', 'amazon',
      'phone number', 'short code',
    ],
  },
];

// Build a quick lookup map
const categoryMap = new Map<string, RedFlagCategory>();
RED_FLAG_CATEGORIES.forEach(cat => categoryMap.set(cat.id, cat));

export function getCategoryById(id: string): RedFlagCategory | undefined {
  return categoryMap.get(id);
}

/**
 * Classify a red flag string into one or more categories.
 * Uses keyword matching against the canonical taxonomy.
 * Returns at most 2 categories per flag (primary + secondary).
 */
export function classifyRedFlag(flag: string): string[] {
  let flagLower = flag.toLowerCase();
  let matches: { id: string; score: number }[] = [];

  for (let cat of RED_FLAG_CATEGORIES) {
    let score = 0;
    for (let keyword of cat.keywords) {
      if (flagLower.includes(keyword.toLowerCase())) {
        // longer keyword matches get more weight
        score = score + keyword.length;
      }
    }
    if (score > 0) {
      matches.push({ id: cat.id, score });
    }
  }

  // sort by match score, take top 2
  matches.sort((a, b) => b.score - a.score);
  let results = matches.slice(0, 2).map(m => m.id);

  // fallback: if nothing matched, try broader heuristics
  if (results.length === 0) {
    if (flagLower.includes('domain') || flagLower.includes('email') || flagLower.includes('sender')) {
      results.push('domain_spoofing');
    } else if (flagLower.includes('urgent') || flagLower.includes('pressure') || flagLower.includes('deadline')) {
      results.push('urgency_pressure');
    } else {
      // last resort - tag as emotional manipulation (catch-all for tricky social tactics)
      results.push('emotional_manipulation');
    }
  }

  return results;
}

/**
 * Classify all red flags from a scenario into category counts.
 * Returns a map of categoryId -> number of flags in that category.
 */
export function classifyScenarioFlags(redFlags: string[]): Record<string, number> {
  let categoryCounts: Record<string, number> = {};

  for (let flag of redFlags) {
    let categories = classifyRedFlag(flag);
    for (let catId of categories) {
      categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
    }
  }

  return categoryCounts;
}

/**
 * Get all category IDs as an array.
 */
export function getAllCategoryIds(): string[] {
  return RED_FLAG_CATEGORIES.map(c => c.id);
}
