// src/lib/demo/engine.ts
// Smart Demo AI Engine for CyberShield
// Generates realistic coaching responses WITHOUT an API key
// Works with ANY scenario's red flags via keyword analysis

// ============================================
// TYPES
// ============================================

interface DemoState {
  messageCount: number;
  confirmedFlags: string[];
  hintedFlags: string[];
  remainingFlags: string[];
  allFlags: string[];
  lastHintIndex: number;
}

interface DemoResponse {
  message: string;
  flagsConfirmed: string[];
  hintCategory: string | null;
  confidence: string;
  suggestVerdict: boolean;
}

// ============================================
// KEYWORD MAPS
// Red flag concepts mapped to words a user might type
// ============================================

const FLAG_KEYWORD_MAP: Record<string, string[]> = {
  // Domain / sender issues
  domain: ['domain', 'sender', 'email address', 'from address', '.net', '.info', '.org', 'not from', 'fake domain', 'wrong domain', 'company-support', 'doesn\'t match', 'mismatch', 'spoofed', 'impersonat'],
  url: ['url', 'link', 'http', 'website', 'click', 'hover', 'destination', 'redirect', 'suspicious link', 'fake site', 'non-official', 'phish', 'fake website'],
  urgency: ['urgent', 'urgency', 'pressure', 'rush', 'hurry', 'immediately', 'deadline', 'expires', '24 hours', '48 hours', 'act now', 'time limit', 'right away', 'quick', 'fast'],
  generic: ['generic', 'dear employee', 'dear customer', 'no name', 'impersonal', 'vague', 'doesn\'t use my name', 'not addressed', 'not personal', 'dear sir'],
  attachment: ['attachment', 'file', '.exe', 'download', 'double extension', 'macro', 'open file', 'suspicious file', 'malware'],
  credential: ['password', 'credential', 'login', 'verify', 'confirm', 'account', 'personal info', 'sensitive', 'ssn', 'credit card', 'bank', 'reset password'],
  authority: ['ceo', 'boss', 'manager', 'executive', 'it department', 'it support', 'authority', 'impersonat', 'pretend', 'claim to be'],
  emotion: ['fear', 'scare', 'worried', 'threat', 'locked out', 'compromised', 'too good', 'prize', 'won', 'reward', 'curious', 'alarming'],
  process: ['bypass', 'skip', 'unusual', 'secret', 'confidential', 'don\'t tell', 'off the record', 'between us', 'normal process'],
  brand: ['brand', 'logo', 'professional', 'looks real', 'official', 'impersonating', 'mimick', 'fake brand', 'ups', 'microsoft', 'chase', 'apple', 'google', 'amazon'],
};

// ============================================
// RESPONSE TEMPLATES
// ============================================

const CONFIRM_RESPONSES = [
  "Excellent catch! {flag} — that's a major red flag. What else stands out to you?",
  "Sharp eye! You nailed it — {flag}. That's exactly the kind of thing attackers hope you'll overlook. Anything else?",
  "Spot on! {flag} is a clear indicator. You're building a solid case here. See anything else suspicious?",
  "Great observation! {flag} is definitely concerning. Keep going — what else do you notice?",
  "Bingo! {flag} — that's a textbook red flag. Can you spot any more?",
  "You got it! {flag}. Attackers rely on people missing that. What other warning signs do you see?",
];

const PARTIAL_MATCH_RESPONSES = [
  "You're on the right track! Look more carefully at {hint_area} — there's something specific there worth investigating.",
  "Good instinct! You're close. Take another look at {hint_area} — what exactly seems off about it?",
  "Warm! That area is worth scrutinizing. Can you be more specific about what's wrong with {hint_area}?",
];

const HINT_RESPONSES = [
  "Here's a nudge: take a close look at {hint_area}. Does anything seem off about it?",
  "Let me point you somewhere: examine {hint_area} more carefully. What do you notice?",
  "Try focusing on {hint_area}. There's something there that doesn't quite add up.",
  "I'll steer you a bit — {hint_area} deserves a second look. What strikes you about it?",
];

const STRONGER_HINT_RESPONSES = [
  "Let me be more direct: {strong_hint}. Does that change your assessment?",
  "Here's a bigger clue: {strong_hint}. What does that tell you?",
  "Pay close attention — {strong_hint}. That's a significant red flag in security.",
];

const ENCOURAGEMENT_AFTER_FIND = [
  "You've found {count} out of {total} red flags so far. Keep digging!",
  "That's {count}/{total} flags identified. You're getting sharp at this!",
  "Nice work — {count} of {total} red flags spotted. Can you find more?",
];

const VERDICT_PROMPTS = [
  "You've done solid analysis here. Ready to make your call? Is this a threat or legitimate?",
  "Good detective work! You've identified the key indicators. Time to render your verdict — what's your final call?",
  "Strong analysis! Based on everything you've found, what's your verdict?",
];

const NO_MATCH_RESPONSES = [
  "Interesting thought! Let's look at this from another angle — what about the technical details? Anything feel off?",
  "That's worth considering. Try examining the sender information and any links more closely. What do you see?",
  "Good thinking, but dig deeper into the specifics. Check things like domains, URLs, and how the message is worded.",
  "I hear you. Let's focus on the concrete elements — who sent this, where do the links go, and how is the message trying to make you feel?",
];

const OPENING_FOLLOW_UPS = [
  "Take your time examining every detail. What's the first thing that catches your eye?",
  "Look at the sender, the content, and any links or requests. What seems suspicious?",
  "Think about this: would a legitimate organization communicate this way? What feels wrong?",
];

// ============================================
// CORE ENGINE
// ============================================

// Extract red flags from the coaching system prompt context
function extractRedFlags(messages: Array<{ role: string; content: string }>): string[] {
  for (let msg of messages) {
    if (msg.role === 'system' && msg.content.includes('RED FLAGS')) {
      let lines = msg.content.split('\n');
      let flags: string[] = [];
      let inFlags = false;
      for (let line of lines) {
        if (line.includes('RED FLAGS')) {
          inFlags = true;
          continue;
        }
        if (inFlags && line.match(/^\d+\.\s/)) {
          flags.push(line.replace(/^\d+\.\s*/, '').trim());
        }
        if (inFlags && (line.includes('EXPLANATION') || line.includes('LEARNING'))) {
          break;
        }
      }
      return flags;
    }
  }
  return [];
}

// Score how well a user message matches a specific red flag
function scoreFlagMatch(userMsg: string, flag: string): number {
  let msgLower = userMsg.toLowerCase();
  let flagLower = flag.toLowerCase();
  let score = 0;

  // Direct word overlap with the flag text
  let flagWords = flagLower.split(/\s+/).filter(w => w.length > 3);
  let matchedWords = flagWords.filter(w => msgLower.includes(w));
  score = score + (matchedWords.length / Math.max(flagWords.length, 1)) * 60;

  // Check against keyword categories
  for (let category of Object.keys(FLAG_KEYWORD_MAP)) {
    let categoryInFlag = FLAG_KEYWORD_MAP[category].some(kw => flagLower.includes(kw));
    let categoryInMsg = FLAG_KEYWORD_MAP[category].some(kw => msgLower.includes(kw));
    if (categoryInFlag && categoryInMsg) {
      score = score + 25;
      break;
    }
  }

  // Bonus for longer, more detailed messages mentioning flag-specific terms
  if (msgLower.length > 80 && matchedWords.length > 0) {
    score = score + 10;
  }

  return Math.min(score, 100);
}

// Determine which category a flag belongs to (for hint text)
function getFlagCategory(flag: string): string {
  let flagLower = flag.toLowerCase();
  if (flagLower.includes('domain') || flagLower.includes('sender') || flagLower.includes('email')) return 'the sender address and domain';
  if (flagLower.includes('link') || flagLower.includes('url') || flagLower.includes('http')) return 'the links and URLs';
  if (flagLower.includes('urgent') || flagLower.includes('pressure') || flagLower.includes('hour')) return 'the tone and urgency';
  if (flagLower.includes('generic') || flagLower.includes('dear') || flagLower.includes('name')) return 'how the message addresses you';
  if (flagLower.includes('attachment') || flagLower.includes('file') || flagLower.includes('.exe')) return 'the attachments';
  if (flagLower.includes('password') || flagLower.includes('credential') || flagLower.includes('verify')) return 'what information is being requested';
  if (flagLower.includes('ceo') || flagLower.includes('authority') || flagLower.includes('manager')) return 'who is claiming to contact you';
  if (flagLower.includes('fear') || flagLower.includes('threat') || flagLower.includes('locked')) return 'the emotional pressure tactics';
  if (flagLower.includes('bypass') || flagLower.includes('secret') || flagLower.includes('unusual')) return 'the unusual process being requested';
  return 'the overall message details';
}

// Generate a stronger hint that reveals more about a specific flag
function getStrongHint(flag: string): string {
  let flagLower = flag.toLowerCase();
  if (flagLower.includes('domain')) return 'look at the EXACT domain in the sender\'s email — does it match the real company?';
  if (flagLower.includes('link') || flagLower.includes('url')) return 'the URL in the message doesn\'t point to the official website — check the actual domain name';
  if (flagLower.includes('urgent') || flagLower.includes('24') || flagLower.includes('48')) return 'the artificial time pressure (\"act within X hours\") is a classic manipulation tactic';
  if (flagLower.includes('generic') || flagLower.includes('dear')) return 'a real company would address you by name, not with a generic greeting';
  if (flagLower.includes('attachment') || flagLower.includes('.exe')) return 'that attachment has a suspicious file type — legitimate companies rarely send executables';
  if (flagLower.includes('password') || flagLower.includes('credential')) return 'legitimate organizations never ask you to verify credentials through email links';
  return `here's a key detail: "${flag.substring(0, 60)}..."`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// MAIN RESPONSE GENERATOR
// ============================================

// State persists per session via closure in the component
let sessionStates = new Map<string, DemoState>();

export function resetDemoSession(scenarioId: string): void {
  sessionStates.delete(scenarioId);
}

export function generateDemoResponse(
  messages: Array<{ role: string; content: string }>,
  scenarioId: string = 'default'
): Promise<string> {
  return new Promise((resolve) => {
    // Simulate network delay (400-1200ms)
    let delay = 400 + Math.floor(Math.random() * 800);

    setTimeout(() => {
      let response = buildResponse(messages, scenarioId);
      resolve(JSON.stringify(response));
    }, delay);
  });
}

function buildResponse(
  messages: Array<{ role: string; content: string }>,
  scenarioId: string
): DemoResponse {
  // Initialize or retrieve session state
  if (!sessionStates.has(scenarioId)) {
    let flags = extractRedFlags(messages);
    sessionStates.set(scenarioId, {
      messageCount: 0,
      confirmedFlags: [],
      hintedFlags: [],
      remainingFlags: [...flags],
      allFlags: flags,
      lastHintIndex: 0,
    });
  }

  let state = sessionStates.get(scenarioId)!;

  // Find the last user message
  let userMessages = messages.filter(m => m.role === 'user');
  let lastUserMsg = userMessages[userMessages.length - 1]?.content || '';
  state.messageCount = state.messageCount + 1;

  // Check if user identified any remaining flags
  let bestMatch: { flag: string; score: number } | null = null;
  let secondMatch: { flag: string; score: number } | null = null;

  for (let flag of state.remainingFlags) {
    let score = scoreFlagMatch(lastUserMsg, flag);
    if (score > 40 && (!bestMatch || score > bestMatch.score)) {
      secondMatch = bestMatch;
      bestMatch = { flag, score };
    } else if (score > 35 && (!secondMatch || score > secondMatch.score)) {
      secondMatch = { flag, score };
    }
  }

  // === CASE 1: Strong match — confirm the flag ===
  if (bestMatch && bestMatch.score >= 50) {
    let confirmed = [bestMatch.flag];
    state.remainingFlags = state.remainingFlags.filter(f => f !== bestMatch!.flag);
    state.confirmedFlags.push(bestMatch.flag);

    // If second match is also strong, confirm both
    if (secondMatch && secondMatch.score >= 55) {
      confirmed.push(secondMatch.flag);
      state.remainingFlags = state.remainingFlags.filter(f => f !== secondMatch!.flag);
      state.confirmedFlags.push(secondMatch.flag);
    }

    let template = pickRandom(CONFIRM_RESPONSES);
    let msg = template.replace('{flag}', `"${bestMatch.flag}"`);

    // Add encouragement with count
    if (state.confirmedFlags.length >= 2 && state.remainingFlags.length > 0) {
      let enc = pickRandom(ENCOURAGEMENT_AFTER_FIND);
      msg = msg + ' ' + enc
        .replace('{count}', String(state.confirmedFlags.length))
        .replace('{total}', String(state.allFlags.length));
    }

    let shouldVerdict = state.confirmedFlags.length >= Math.ceil(state.allFlags.length * 0.6)
      || state.messageCount >= 6;

    return {
      message: msg,
      flagsConfirmed: confirmed,
      hintCategory: null,
      confidence: state.confirmedFlags.length >= 3 ? 'high' : 'medium',
      suggestVerdict: shouldVerdict,
    };
  }

  // === CASE 2: Partial match — user is close ===
  if (bestMatch && bestMatch.score >= 35) {
    let category = getFlagCategory(bestMatch.flag);
    let template = pickRandom(PARTIAL_MATCH_RESPONSES);
    let msg = template.replace('{hint_area}', category);

    return {
      message: msg,
      flagsConfirmed: [],
      hintCategory: category,
      confidence: 'medium',
      suggestVerdict: false,
    };
  }

  // === CASE 3: No match — provide hints based on message count ===
  if (state.remainingFlags.length === 0) {
    // All flags found
    let msg = pickRandom(VERDICT_PROMPTS);
    return {
      message: msg,
      flagsConfirmed: [],
      hintCategory: null,
      confidence: 'high',
      suggestVerdict: true,
    };
  }

  // First message with no match — gentle redirect
  if (state.messageCount <= 2) {
    let msg = pickRandom(NO_MATCH_RESPONSES);
    return {
      message: msg,
      flagsConfirmed: [],
      hintCategory: null,
      confidence: 'low',
      suggestVerdict: false,
    };
  }

  // After 2+ messages — start hinting at remaining flags
  let hintFlag = state.remainingFlags[state.lastHintIndex % state.remainingFlags.length];
  state.lastHintIndex = state.lastHintIndex + 1;

  if (state.messageCount <= 4) {
    // Gentle hint
    let category = getFlagCategory(hintFlag);
    let template = pickRandom(HINT_RESPONSES);
    let msg = template.replace('{hint_area}', category);

    if (!state.hintedFlags.includes(hintFlag)) {
      state.hintedFlags.push(hintFlag);
    }

    return {
      message: msg,
      flagsConfirmed: [],
      hintCategory: category,
      confidence: 'low',
      suggestVerdict: false,
    };
  }

  // After 4+ messages — stronger hints
  let strongHint = getStrongHint(hintFlag);
  let template = pickRandom(STRONGER_HINT_RESPONSES);
  let msg = template.replace('{strong_hint}', strongHint);

  if (!state.hintedFlags.includes(hintFlag)) {
    state.hintedFlags.push(hintFlag);
  }

  let shouldVerdict = state.messageCount >= 6 || state.confirmedFlags.length >= 2;

  if (shouldVerdict) {
    msg = msg + ' ' + pickRandom(VERDICT_PROMPTS);
  }

  return {
    message: msg,
    flagsConfirmed: [],
    hintCategory: getFlagCategory(hintFlag),
    confidence: 'medium',
    suggestVerdict: shouldVerdict,
  };
}

// ============================================
// DEMO SEED DATA
// Pre-populated progress to make the app look alive
// ============================================

export const DEMO_LEADERBOARD = [
  { rank: 1, displayName: 'SecurityNinja', totalScore: 4250, level: 12, modulesCompleted: 7, streak: 23 },
  { rank: 2, displayName: 'CyberHawk', totalScore: 3890, level: 11, modulesCompleted: 6, streak: 15 },
  { rank: 3, displayName: 'PhishDetector', totalScore: 3540, level: 10, modulesCompleted: 6, streak: 31 },
  { rank: 4, displayName: 'You (Demo)', totalScore: 1200, level: 5, modulesCompleted: 2, streak: 3 },
  { rank: 5, displayName: 'DataGuard', totalScore: 2180, level: 8, modulesCompleted: 4, streak: 7 },
  { rank: 6, displayName: 'NetSentinel', totalScore: 1950, level: 7, modulesCompleted: 4, streak: 11 },
  { rank: 7, displayName: 'AlertEagle', totalScore: 1620, level: 6, modulesCompleted: 3, streak: 5 },
  { rank: 8, displayName: 'ShieldBearer', totalScore: 980, level: 4, modulesCompleted: 2, streak: 2 },
];
