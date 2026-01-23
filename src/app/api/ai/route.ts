import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// System prompts for different training modes
const SYSTEM_PROMPTS = {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, messages, difficulty, context } = body;

    if (!mode || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields: mode and messages' },
        { status: 400 }
      );
    }

    // Select appropriate system prompt
    let systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS];
    
    if (!systemPrompt) {
      systemPrompt = SYSTEM_PROMPTS.coaching;
    }

    // Add difficulty context
    if (difficulty) {
      systemPrompt += `\n\nCurrent difficulty level: ${difficulty}. Adjust complexity accordingly.`;
    }

    // Add any additional context
    if (context) {
      systemPrompt += `\n\nAdditional context: ${context}`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    });

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === 'text');
    const responseText = textContent ? textContent.text : '';

    return NextResponse.json({
      success: true,
      message: responseText,
      usage: response.usage,
    });
  } catch (error) {
    console.error('AI API Error:', error);
    
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
