// src/app/api/coaching/route.ts
// API route that proxies coaching chat messages to Claude
// Keeps API key server-side and adds rate limiting

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (per IP, 30 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Separate system messages from conversation messages
    const systemMessages = messages.filter((m: { role: string }) => m.role === 'system');
    const conversationMessages = messages.filter((m: { role: string }) => m.role !== 'system');

    // Combine all system messages into one system prompt
    const systemPrompt = systemMessages
      .map((m: { content: string }) => m.content)
      .join('\n\n');

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 512,
        system: systemPrompt,
        messages: conversationMessages.map((m: { role: string; content: string }) => ({
          role: m.role === 'coach' ? 'assistant' : m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'AI service error' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.content
      ?.map((block: { type: string; text?: string }) => block.type === 'text' ? block.text : '')
      .filter(Boolean)
      .join('') || '';

    return NextResponse.json({ content });
  } catch (err) {
    console.error('Coaching API route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
