// src/lib/coaching/engine.ts
// Real-Time AI Coaching Engine for CyberShield
// Manages conversation flow, red flag tracking, and depth-based scoring

import type { TrainingScenario } from '../scenarios/types';

// ============================================
// TYPES
// ============================================

export interface CoachMessage {
  id: string;
  role: 'user' | 'coach' | 'system';
  content: string;
  timestamp: number;
  // Tracks which red flags this message identified (coach messages only)
  flagsIdentified?: string[];
  // Hints given in this message (coach messages only)
  hintsGiven?: string[];
}

export interface CoachingSession {
  scenarioId: string;
  messages: CoachMessage[];
  identifiedFlags: string[];     // Red flags user correctly spotted
  hintedFlags: string[];         // Red flags coach hinted at
  missedFlags: string[];         // Red flags never discussed
  totalFlags: number;
  depthScore: number;            // 0-100 based on analysis depth
  startedAt: number;
  completedAt?: number;
  userVerdict?: 'phishing' | 'legitimate' | 'threat' | 'safe';
}

export interface CoachingScoreBreakdown {
  flagsIdentifiedScore: number;  // Points for self-identified flags (max 50)
  flagsHintedScore: number;      // Partial credit for hinted flags (max 20)
  depthScore: number;            // Quality of reasoning (max 20)
  speedBonus: number;            // Bonus for quick identification (max 10)
  total: number;                 // Combined score out of 100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
}

// ============================================
// PROMPT TEMPLATES
// ============================================

const COACHING_SYSTEM_PROMPT = `You are CyberShield Coach, an expert cybersecurity training AI embedded in a security awareness platform. You're having a real-time conversation with a user who is analyzing a potential security threat.

YOUR ROLE:
- Guide users to DISCOVER red flags themselves through Socratic questioning
- Confirm correct observations enthusiastically
- Give progressively stronger hints if they're stuck (never reveal answers outright)
- Track which red flags they identify vs which you need to hint at
- Be encouraging but honest — celebrate catches, gently redirect misses

CONVERSATION RULES:
1. NEVER reveal all red flags at once
2. If user identifies a flag correctly, confirm it and ask "What else do you notice?"
3. If user is stuck after 2 messages, give a gentle nudge toward ONE unidentified flag
4. After 4+ messages with no new flags found, give a stronger hint
5. Keep responses concise (2-3 sentences max)
6. Use a friendly, coach-like tone — think sports coach, not lecturer
7. If they ask to see the answer, encourage one more look first

RESPONSE FORMAT:
Always respond with valid JSON:
{
  "message": "Your coaching response text",
  "flagsConfirmed": ["exact red flag text if user identified one"],
  "hintCategory": "category of hint given, if any" | null,
  "confidence": "how confident are you the user understands (low/medium/high)",
  "suggestVerdict": false
}

Set suggestVerdict to true ONLY when the user has identified 60%+ of flags OR after 6+ exchanges.`;

function buildScenarioContext(scenario: TrainingScenario): string {
  const content = scenario.content;
  let ctx = `SCENARIO: "${scenario.title}" (${scenario.difficulty} difficulty)\n`;
  ctx += `TYPE: ${scenario.type}\n`;
  ctx += `MODULE: ${scenario.moduleType}\n\n`;

  // Build content description based on type
  if ('from' in content && 'body' in content) {
    ctx += `EMAIL DETAILS:\n`;
    ctx += `From: ${content.from} <${content.fromEmail}>\n`;
    ctx += `To: ${content.to}\n`;
    ctx += `Subject: ${content.subject}\n`;
    ctx += `Body: ${content.body}\n`;
  } else if ('scenario' in content && 'conversation' in content) {
    ctx += `SCENARIO: ${content.scenario}\n`;
    ctx += `Caller claims: ${content.callerClaim}\n`;
    ctx += `Conversation:\n`;
    const convo = content.conversation as Array<{ speaker: string; text: string }>;
    convo.forEach((line: { speaker: string; text: string }) => {
      ctx += `  [${line.speaker}]: ${line.text}\n`;
    });
  } else if ('scenario' in content) {
    ctx += `SCENARIO: ${content.scenario}\n`;
  }

  ctx += `\nCORRECT ANSWER: This IS ${scenario.isCorrectAnswer ? 'a threat/phishing' : 'legitimate/safe'}\n`;
  ctx += `\nRED FLAGS (DO NOT REVEAL DIRECTLY):\n`;
  scenario.redFlags.forEach((flag, i) => {
    ctx += `${i + 1}. ${flag}\n`;
  });

  ctx += `\nEXPLANATION (for your reference only): ${scenario.explanation}\n`;
  ctx += `\nLEARNING POINTS:\n`;
  scenario.learningPoints.forEach((pt, i) => {
    ctx += `${i + 1}. ${pt}\n`;
  });

  return ctx;
}

// ============================================
// COACHING ENGINE CLASS
// ============================================

export class CoachingEngine {
  private session: CoachingSession;
  private scenario: TrainingScenario;
  private conversationHistory: Array<{ role: string; content: string }>;

  constructor(scenario: TrainingScenario) {
    this.scenario = scenario;
    this.session = {
      scenarioId: scenario.id,
      messages: [],
      identifiedFlags: [],
      hintedFlags: [],
      missedFlags: [...scenario.redFlags],
      totalFlags: scenario.redFlags.length,
      depthScore: 0,
      startedAt: Date.now(),
    };

    // Initialize conversation with system context
    this.conversationHistory = [
      { role: 'system', content: COACHING_SYSTEM_PROMPT },
      { role: 'system', content: buildScenarioContext(scenario) },
    ];
  }

  getSession(): CoachingSession {
    return { ...this.session };
  }

  getProgress(): { identified: number; total: number; percent: number } {
    const identified = this.session.identifiedFlags.length;
    const total = this.session.totalFlags;
    return { identified, total, percent: Math.round((identified / Math.max(total, 1)) * 100) };
  }

  addUserMessage(content: string): CoachMessage {
    const msg: CoachMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    this.session.messages.push(msg);
    this.conversationHistory.push({ role: 'user', content });
    return msg;
  }

  /**
   * Build the messages array for the Claude API call.
   * Returns the full conversation history for context.
   */
  buildApiMessages(): Array<{ role: string; content: string }> {
    // Add tracking context so the AI knows what's been found
    const trackingNote = `[INTERNAL - Current tracking state:
    Flags identified by user: ${this.session.identifiedFlags.length}/${this.session.totalFlags} (${this.session.identifiedFlags.join('; ') || 'none yet'})
    Flags hinted at: ${this.session.hintedFlags.join('; ') || 'none'}
    Remaining unfound: ${this.session.missedFlags.join('; ') || 'all found!'}
    Message count: ${this.session.messages.filter(m => m.role === 'user').length}
    ]`;

    return [
      ...this.conversationHistory,
      { role: 'system', content: trackingNote },
    ];
  }

  /**
   * Process the AI's response and update session tracking.
   * Call this after receiving the API response.
   */
  processCoachResponse(rawResponse: string): CoachMessage {
    let parsed: {
      message: string;
      flagsConfirmed: string[];
      hintCategory: string | null;
      confidence: string;
      suggestVerdict: boolean;
    };

    try {
      // Try to parse as JSON first
      const cleaned = rawResponse.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, treat the whole response as the message
      parsed = {
        message: rawResponse,
        flagsConfirmed: [],
        hintCategory: null,
        confidence: 'medium',
        suggestVerdict: false,
      };
    }

    // Track confirmed flags
    const newlyIdentified: string[] = [];
    if (parsed.flagsConfirmed && parsed.flagsConfirmed.length > 0) {
      for (const confirmed of parsed.flagsConfirmed) {
        // Fuzzy match against remaining flags
        const matchIdx = this.session.missedFlags.findIndex(flag =>
          this.fuzzyFlagMatch(flag, confirmed)
        );
        if (matchIdx !== -1) {
          const matched = this.session.missedFlags.splice(matchIdx, 1)[0];
          this.session.identifiedFlags.push(matched);
          newlyIdentified.push(matched);
        }
      }
    }

    // Track hints
    const hintsGiven: string[] = [];
    if (parsed.hintCategory) {
      const hintMatch = this.session.missedFlags.find(flag =>
        flag.toLowerCase().includes(parsed.hintCategory!.toLowerCase()) ||
        parsed.hintCategory!.toLowerCase().includes(flag.toLowerCase().split(' ')[0])
      );
      if (hintMatch && !this.session.hintedFlags.includes(hintMatch)) {
        this.session.hintedFlags.push(hintMatch);
        hintsGiven.push(hintMatch);
      }
    }

    const coachMsg: CoachMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'coach',
      content: parsed.message,
      timestamp: Date.now(),
      flagsIdentified: newlyIdentified,
      hintsGiven,
    };

    this.session.messages.push(coachMsg);
    this.conversationHistory.push({ role: 'assistant', content: rawResponse });

    return coachMsg;
  }

  /**
   * Fuzzy matching for red flags — user descriptions won't be exact
   */
  private fuzzyFlagMatch(original: string, userVersion: string): boolean {
    const origWords = original.toLowerCase().split(/\s+/);
    const userWords = userVersion.toLowerCase().split(/\s+/);

    // Count overlapping meaningful words (skip short words)
    const meaningfulOrig = origWords.filter(w => w.length > 3);
    const matchCount = meaningfulOrig.filter(word =>
      userWords.some(uw => uw.includes(word) || word.includes(uw))
    ).length;

    // Match if 40%+ of meaningful words overlap
    return matchCount >= Math.ceil(meaningfulOrig.length * 0.4);
  }

  /**
   * Set the user's final verdict and calculate scores
   */
  submitVerdict(verdict: 'phishing' | 'legitimate' | 'threat' | 'safe'): CoachingScoreBreakdown {
    this.session.userVerdict = verdict;
    this.session.completedAt = Date.now();

    const totalFlags = this.session.totalFlags;
    const identified = this.session.identifiedFlags.length;
    const hinted = this.session.hintedFlags.length;
    const elapsed = (this.session.completedAt - this.session.startedAt) / 1000; // seconds

    // Score breakdown
    const flagsIdentifiedScore = Math.round((identified / Math.max(totalFlags, 1)) * 50);
    const flagsHintedScore = Math.round((hinted / Math.max(totalFlags, 1)) * 20);

    // Depth score based on message quality and count
    const userMessages = this.session.messages.filter(m => m.role === 'user');
    const avgMsgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / Math.max(userMessages.length, 1);
    let depth = 0;
    if (userMessages.length >= 2) depth += 5;
    if (userMessages.length >= 4) depth += 5;
    if (avgMsgLength > 50) depth += 5;
    if (avgMsgLength > 100) depth += 5;
    this.session.depthScore = depth;

    // Speed bonus — under 2 minutes for quick ID
    let speedBonus = 0;
    if (identified >= totalFlags * 0.6) {
      if (elapsed < 120) speedBonus = 10;
      else if (elapsed < 180) speedBonus = 7;
      else if (elapsed < 300) speedBonus = 3;
    }

    const total = Math.min(100, flagsIdentifiedScore + flagsHintedScore + depth + speedBonus);

    // Correct verdict bonus (baked into the flag scoring — if you caught flags, you likely got verdict right)
    const isVerdictCorrect = this.scenario.isCorrectAnswer
      ? (verdict === 'phishing' || verdict === 'threat')
      : (verdict === 'legitimate' || verdict === 'safe');

    let grade: CoachingScoreBreakdown['grade'];
    if (total >= 90 && isVerdictCorrect) grade = 'S';
    else if (total >= 80 && isVerdictCorrect) grade = 'A';
    else if (total >= 65) grade = 'B';
    else if (total >= 50) grade = 'C';
    else if (total >= 30) grade = 'D';
    else grade = 'F';

    let summary = '';
    if (grade === 'S') summary = 'Outstanding! You identified nearly every red flag on your own.';
    else if (grade === 'A') summary = 'Excellent analysis — you caught the key indicators.';
    else if (grade === 'B') summary = 'Good eye! A few flags slipped past, but solid overall.';
    else if (grade === 'C') summary = 'Decent start — keep training to sharpen your detection skills.';
    else if (grade === 'D') summary = 'There were several indicators you missed. Review the breakdown below.';
    else summary = 'This one was tricky. Let\'s review what to look for next time.';

    if (!isVerdictCorrect) {
      summary += ' Note: Your final verdict was incorrect — review the red flags to understand why.';
    }

    return { flagsIdentifiedScore, flagsHintedScore, depthScore: depth, speedBonus, total, grade, summary };
  }

  /**
   * Generate the opening coach message based on scenario type
   */
  getOpeningMessage(): CoachMessage {
    let content = '';
    const type = this.scenario.moduleType;

    if (type === 'phishing') {
      content = "Take a close look at this email. Before you decide if it's legit or phishing — what's the first thing that catches your eye?";
    } else if (type === 'social-engineering') {
      content = "You're in this situation right now. Something feel off? Tell me what's making your gut react.";
    } else if (type === 'incident-response') {
      content = "Alright, incident just dropped. Walk me through your first instinct — what's your read on this?";
    } else {
      content = "Let's analyze this together. What jumps out at you first?";
    }

    const msg: CoachMessage = {
      id: `msg-${Date.now()}-open`,
      role: 'coach',
      content,
      timestamp: Date.now(),
    };

    this.session.messages.push(msg);
    return msg;
  }
}

// ============================================
// SCORING UTILITIES
// ============================================

export function getGradeColor(grade: CoachingScoreBreakdown['grade']): string {
  const colors: Record<string, string> = {
    S: 'text-yellow-400',
    A: 'text-green-400',
    B: 'text-cyan-400',
    C: 'text-orange-400',
    D: 'text-red-400',
    F: 'text-red-600',
  };
  return colors[grade] || 'text-cyber-400';
}

export function getGradeBg(grade: CoachingScoreBreakdown['grade']): string {
  const bgs: Record<string, string> = {
    S: 'bg-yellow-500/10 border-yellow-500/30',
    A: 'bg-green-500/10 border-green-500/30',
    B: 'bg-cyan-500/10 border-cyan-500/30',
    C: 'bg-orange-500/10 border-orange-500/30',
    D: 'bg-red-500/10 border-red-500/30',
    F: 'bg-red-600/10 border-red-600/30',
  };
  return bgs[grade] || 'bg-cyber-800 border-cyber-700';
}
