import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// -- Environment Validation --

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error('FATAL: ANTHROPIC_API_KEY is not set in environment variables');
}

// Lazy-init the client so the app doesn't crash on import if key is missing
let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// -- Constants --

const VALID_MODES = ['phishing', 'socialEngineering', 'incidentResponse', 'coaching'] as const;
type TrainingMode = typeof VALID_MODES[number];

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_LENGTH = 500;

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'];

// System prompts for different training modes
const SYSTEM_PROMPTS: Record<TrainingMode, string> = {
  phishing: `You are an AI cybersecurity training assistant for CyberShield. Your role is to help users learn to identify phishing attempts.

When generating phishing scenarios:
- Create realistic but educational examples
- Include both obvious and subtle red flags
- Vary the sophistication based on difficulty level
- Include different types: emails, SMS, social media messages, URLs

When providing coaching:
- Give immediate feedback on user decisions
- Explain what red flags they caught or missed
- Be encouraging while being educational
- Provide tips for real-world application

Always maintain a professional, supportive tone. Remember this is training - never provide actual malicious content.`,

  socialEngineering: `You are an AI cybersecurity training assistant simulating social engineering attacks for educational purposes.

Your role:
- Play the role of an attacker attempting various social engineering tactics
- Use realistic but obviously educational scenarios
- Include pretexting, baiting, tailgating scenarios, and vishing simulations
- Adapt your approach based on how the user responds

Important guidelines:
- Stay in character as the "attacker" but keep it educational
- If the user successfully identifies the attack, acknowledge it and explain the tactic
- If they fall for the manipulation, gently explain what happened
- Never provide actual harmful techniques - this is strictly for defense training

Red flags you should exhibit (for users to identify):
- Urgency tactics
- Authority impersonation
- Emotional manipulation
- Requests for sensitive information
- Unusual requests that bypass normal procedures`,

  incidentResponse: `You are an AI cybersecurity training assistant simulating security incidents for incident response training.

Your role:
- Present realistic security incident scenarios
- Play the role of affected employees, systems, or even attackers
- Provide system logs, alerts, and other indicators
- Evaluate user's incident response decisions

Incident types to simulate:
- Ransomware attacks
- Data breaches
- DDoS attacks
- Insider threats
- Malware infections
- Phishing attack aftermath

Scoring criteria:
- Proper incident classification
- Appropriate escalation
- Containment effectiveness
- Communication decisions
- Documentation quality
- Recovery procedures

Provide real-time feedback on decisions and explain industry best practices.`,

  coaching: `You are a supportive cybersecurity coach providing feedback during training exercises.

Your coaching style:
- Be encouraging and constructive
- Highlight what the user did well
- Gently explain areas for improvement
- Provide actionable tips
- Use real-world examples when relevant
- Keep explanations concise but thorough

Remember: Users are learning. Make them feel confident while helping them improve.`,
};

// -- Input Validation --

interface RequestBody {
  mode: string;
  messages: { role: string; content: string }[];
  difficulty?: string;
  context?: string;
}

function validateRequestBody(body: unknown): { valid: true; data: RequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  let parsed = body as Record<string, unknown>;

  // mode is required and must be a known value
  if (!parsed.mode || typeof parsed.mode !== 'string') {
    return { valid: false, error: 'Missing required field: mode' };
  }

  // messages is required and must be a non-empty array
  if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
    return { valid: false, error: 'Missing required field: messages (must be non-empty array)' };
  }

  if (parsed.messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }

  // validate each message has role and content
  for (let i = 0; i < parsed.messages.length; i++) {
    let msg = parsed.messages[i];
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `Invalid message at index ${i}` };
    }
    let m = msg as Record<string, unknown>;
    if (typeof m.role !== 'string' || typeof m.content !== 'string') {
      return { valid: false, error: `Message at index ${i} must have string role and content` };
    }
    if (m.role !== 'user' && m.role !== 'assistant') {
      return { valid: false, error: `Message role must be "user" or "assistant", got "${m.role}"` };
    }
    if (m.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message at index ${i} exceeds max length (${MAX_MESSAGE_LENGTH} chars)` };
    }
  }

  // optional difficulty validation
  if (parsed.difficulty !== undefined) {
    if (typeof parsed.difficulty !== 'string' || !VALID_DIFFICULTIES.includes(parsed.difficulty)) {
      return { valid: false, error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}` };
    }
  }

  // optional context - sanitize length
  if (parsed.context !== undefined && typeof parsed.context === 'string') {
    if (parsed.context.length > MAX_CONTEXT_LENGTH) {
      return { valid: false, error: `Context exceeds max length (${MAX_CONTEXT_LENGTH} chars)` };
    }
  }

  return {
    valid: true,
    data: {
      mode: parsed.mode,
      messages: parsed.messages as RequestBody['messages'],
      difficulty: parsed.difficulty as string | undefined,
      context: typeof parsed.context === 'string' ? parsed.context : undefined,
    },
  };
}

// Resolve mode string to a valid training mode, defaulting to coaching
function resolveMode(mode: string): TrainingMode {
  // normalize common variations
  let normalized = mode.toLowerCase().replace(/[-_\s]/g, '');

  let modeMap: Record<string, TrainingMode> = {
    phishing: 'phishing',
    socialengineering: 'socialEngineering',
    incidentresponse: 'incidentResponse',
    coaching: 'coaching',
  };

  return modeMap[normalized] || 'coaching';
}

// Sanitize user-provided context to prevent prompt injection
function sanitizeContext(context: string): string {
  // strip anything that looks like prompt injection attempts
  let cleaned = context
    .replace(/system:/gi, '')
    .replace(/ignore previous/gi, '')
    .replace(/forget your instructions/gi, '')
    .replace(/you are now/gi, '')
    .trim();

  return cleaned.slice(0, MAX_CONTEXT_LENGTH);
}

// -- Route Handler --

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // validate input
    let validation = validateRequestBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let { mode, messages, difficulty, context } = validation.data;

    // resolve to a valid system prompt
    let resolvedMode = resolveMode(mode);
    let systemPrompt = SYSTEM_PROMPTS[resolvedMode];

    // append difficulty context if provided
    if (difficulty) {
      systemPrompt = systemPrompt + `\n\nCurrent difficulty level: ${difficulty}. Adjust complexity accordingly.`;
    }

    // append sanitized context if provided
    if (context) {
      let safe = sanitizeContext(context);
      if (safe.length > 0) {
        systemPrompt = systemPrompt + `\n\nAdditional context: ${safe}`;
      }
    }

    let client = getClient();

    let response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    // extract text content from response
    let textBlock = response.content.find(block => block.type === 'text');
    let responseText = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    return NextResponse.json({
      success: true,
      message: responseText,
      usage: response.usage,
    });
  } catch (error) {
    console.error('AI API Error:', error);

    if (error instanceof Error && error.message === 'ANTHROPIC_API_KEY is not configured') {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set ANTHROPIC_API_KEY.' },
        { status: 503 }
      );
    }

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
