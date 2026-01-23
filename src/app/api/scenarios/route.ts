import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SCENARIO_PROMPTS = {
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

  socialEngineering: `Generate a social engineering scenario for cybersecurity training.

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

  incidentResponse: `Generate an incident response scenario for cybersecurity training.

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleType, difficulty, previousScenarioIds } = body;

    if (!moduleType) {
      return NextResponse.json(
        { error: 'Missing required field: moduleType' },
        { status: 400 }
      );
    }

    const promptKey = moduleType.replace(/-/g, '') as keyof typeof SCENARIO_PROMPTS;
    let basePrompt = SCENARIO_PROMPTS[promptKey] || SCENARIO_PROMPTS.phishing;

    // Add difficulty instruction
    const difficultyInstructions: Record<string, string> = {
      beginner: 'Create an easy scenario with obvious red flags. This is for someone new to security awareness.',
      intermediate: 'Create a moderately challenging scenario with subtle red flags mixed with legitimate elements.',
      advanced: 'Create a sophisticated scenario that would challenge experienced security professionals. Red flags should be subtle and realistic.',
      expert: 'Create an extremely realistic scenario that mimics actual advanced persistent threats. Include sophisticated tactics.',
    };

    const fullPrompt = `${basePrompt}

Difficulty Level: ${difficulty || 'beginner'}
${difficultyInstructions[difficulty || 'beginner']}

${previousScenarioIds?.length ? `Avoid similarity to these previous scenarios: ${previousScenarioIds.join(', ')}` : ''}

Respond ONLY with the JSON object, no additional text or markdown.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === 'text');
    const responseText = textContent ? textContent.text : '';

    // Parse JSON from response
    let scenario;
    try {
      // Clean up potential markdown formatting
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      scenario = JSON.parse(cleanedResponse);
    } catch {
      console.error('Failed to parse scenario JSON:', responseText);
      return NextResponse.json(
        { error: 'Failed to generate valid scenario' },
        { status: 500 }
      );
    }

    // Add unique ID
    scenario.id = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Scenario Generation Error:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
