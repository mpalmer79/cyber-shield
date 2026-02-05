import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// -- Environment Validation --

const apiKey = process.env.ANTHROPIC_API_KEY;

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

const VALID_MODULE_TYPES = [
  'phishing',
  'social-engineering',
  'incident-response',
  'password-security',
  'data-protection',
  'malware-awareness',
  'secure-browsing',
  'threat-hunting',
] as const;

type ModuleType = typeof VALID_MODULE_TYPES[number];

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
type Difficulty = typeof VALID_DIFFICULTIES[number];

const MAX_PREVIOUS_IDS = 50;

const SCENARIO_PROMPTS: Record<string, string> = {
  phishing: `Generate a phishing detection scenario for cybersecurity training.

Return a JSON object with this exact structure:
{
  "type": "email" | "sms" | "url",
  "isPhishing": boolean,
  "content": {
    // For email type:
    "from": "Display Name",
    "fromEmail": "email@domain.com",
    "subject": "Email subject",
    "body": "Email body content with realistic formatting",
    "timestamp": "ISO date string"
    
    // For sms type:
    "sender": "Phone number or short code",
    "message": "SMS content",
    "timestamp": "ISO date string"
    
    // For url type:
    "url": "The URL to analyze",
    "context": "Where/how the user encountered this URL"
  },
  "redFlags": ["List of red flags present in this scenario"],
  "explanation": "Detailed explanation of why this is/isn't phishing",
  "difficulty": "beginner" | "intermediate" | "advanced"
}

Guidelines:
- For phishing scenarios: Include realistic but identifiable red flags
- For legitimate scenarios: Create realistic business communications
- Match the requested difficulty level
- Be educational - make red flags learnable`,

  socialengineering: `Generate a social engineering scenario for cybersecurity training.

Return a JSON object with this exact structure:
{
  "attackType": "pretexting" | "baiting" | "tailgating" | "quid-pro-quo" | "vishing",
  "setting": "Description of where this takes place",
  "attackerPersona": {
    "name": "Attacker's claimed name",
    "role": "Attacker's claimed role",
    "company": "Claimed company if relevant",
    "backstory": "The pretense being used"
  },
  "objective": "What the attacker is trying to achieve",
  "openingMessage": "The attacker's initial approach",
  "redFlags": ["Behavioral red flags to identify"],
  "correctResponse": "How the user should handle this",
  "difficulty": "beginner" | "intermediate" | "advanced"
}

Make scenarios realistic and educational.`,

  incidentresponse: `Generate an incident response scenario for cybersecurity training.

Return a JSON object with this exact structure:
{
  "incidentType": "ransomware" | "data-breach" | "ddos" | "insider-threat" | "malware" | "phishing-attack",
  "title": "Brief incident title",
  "initialAlert": "The first indication something is wrong",
  "severity": "critical" | "high" | "medium" | "low",
  "timeline": [
    {
      "time": "T+0",
      "event": "Description of what happened"
    }
  ],
  "availableActions": [
    {
      "id": "action-1",
      "label": "Action name",
      "description": "What this action does",
      "isCorrect": boolean,
      "consequences": "What happens if user takes this action",
      "points": number
    }
  ],
  "artifacts": {
    "logs": ["Relevant log entries"],
    "alerts": ["Security alerts"],
    "reports": ["Any relevant reports"]
  },
  "correctSequence": ["Ordered list of correct action IDs"],
  "difficulty": "beginner" | "intermediate" | "advanced"
}

Create realistic scenarios with multiple decision points.`,
};

// -- Input Validation --

interface RequestBody {
  moduleType: string;
  difficulty: Difficulty;
  previousScenarioIds: string[];
}

function validateRequestBody(body: unknown): { valid: true; data: RequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  let parsed = body as Record<string, unknown>;

  if (!parsed.moduleType || typeof parsed.moduleType !== 'string') {
    return { valid: false, error: 'Missing required field: moduleType' };
  }

  if (!VALID_MODULE_TYPES.includes(parsed.moduleType as ModuleType)) {
    return { valid: false, error: `Invalid moduleType. Must be one of: ${VALID_MODULE_TYPES.join(', ')}` };
  }

  // default difficulty to beginner
  let difficulty: Difficulty = 'beginner';
  if (parsed.difficulty) {
    if (typeof parsed.difficulty !== 'string' || !VALID_DIFFICULTIES.includes(parsed.difficulty as Difficulty)) {
      return { valid: false, error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}` };
    }
    difficulty = parsed.difficulty as Difficulty;
  }

  // validate previousScenarioIds if present
  let previousIds: string[] = [];
  if (parsed.previousScenarioIds) {
    if (!Array.isArray(parsed.previousScenarioIds)) {
      return { valid: false, error: 'previousScenarioIds must be an array' };
    }
    if (parsed.previousScenarioIds.length > MAX_PREVIOUS_IDS) {
      return { valid: false, error: `Too many previousScenarioIds (max ${MAX_PREVIOUS_IDS})` };
    }
    // ensure all items are strings
    for (let id of parsed.previousScenarioIds) {
      if (typeof id !== 'string') {
        return { valid: false, error: 'All previousScenarioIds must be strings' };
      }
    }
    previousIds = parsed.previousScenarioIds as string[];
  }

  return {
    valid: true,
    data: { moduleType: parsed.moduleType as string, difficulty, previousScenarioIds: previousIds },
  };
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

    let validation = validateRequestBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let { moduleType, difficulty, previousScenarioIds } = validation.data;

    // resolve module type to prompt key (strip hyphens)
    let promptKey = moduleType.replace(/-/g, '');
    let basePrompt = SCENARIO_PROMPTS[promptKey] || SCENARIO_PROMPTS.phishing;

    let difficultyInstructions: Record<Difficulty, string> = {
      beginner: 'Create an easy scenario with obvious red flags. This is for someone new to security awareness.',
      intermediate: 'Create a moderately challenging scenario with subtle red flags mixed with legitimate elements.',
      advanced: 'Create a sophisticated scenario that would challenge experienced security professionals. Red flags should be subtle and realistic.',
      expert: 'Create an extremely realistic scenario that mimics actual advanced persistent threats. Include sophisticated tactics.',
    };

    let fullPrompt = `${basePrompt}\n\nDifficulty Level: ${difficulty}\n${difficultyInstructions[difficulty]}`;

    if (previousScenarioIds.length > 0) {
      fullPrompt = fullPrompt + `\n\nAvoid similarity to these previous scenarios: ${previousScenarioIds.join(', ')}`;
    }

    fullPrompt = fullPrompt + '\n\nRespond ONLY with the JSON object, no additional text or markdown.';

    let client = getClient();

    let response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    let textBlock = response.content.find(block => block.type === 'text');
    let responseText = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    // Parse JSON from response
    let scenario;
    try {
      let cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      scenario = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse scenario JSON:', responseText.slice(0, 200));
      return NextResponse.json(
        { error: 'Failed to generate valid scenario' },
        { status: 500 }
      );
    }

    // add unique ID
    scenario.id = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Scenario Generation Error:', error);

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
