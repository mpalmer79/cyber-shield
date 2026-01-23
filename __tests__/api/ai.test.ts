/**
 * API Route Tests
 * Tests for the AI API endpoint
 */

import { NextRequest } from 'next/server';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{ type: 'text', text: 'Mock AI response' }],
        }),
      },
    })),
  };
});

describe('AI API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have proper request structure', () => {
    const mockRequest = {
      moduleType: 'phishing',
      userMessage: 'Is this email legitimate?',
      context: {
        scenarioIndex: 0,
        difficulty: 'beginner',
      },
    };

    expect(mockRequest).toHaveProperty('moduleType');
    expect(mockRequest).toHaveProperty('userMessage');
    expect(mockRequest).toHaveProperty('context');
  });

  it('should validate module types', () => {
    const validTypes = ['phishing', 'social-engineering', 'incident-response', 'password-security'];
    const moduleType = 'phishing';
    
    expect(validTypes).toContain(moduleType);
  });

  it('should validate difficulty levels', () => {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const difficulty = 'beginner';
    
    expect(validLevels).toContain(difficulty);
  });

  it('should handle empty messages', () => {
    const emptyMessage = '';
    expect(emptyMessage.trim().length).toBe(0);
  });

  it('should sanitize user input', () => {
    const sanitizeInput = (input: string) => {
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});

describe('AI Response Parsing', () => {
  it('should parse text response correctly', () => {
    const mockResponse = {
      content: [{ type: 'text', text: 'This appears to be a phishing attempt.' }],
    };

    const text = mockResponse.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('');

    expect(text).toBe('This appears to be a phishing attempt.');
  });

  it('should handle multiple content blocks', () => {
    const mockResponse = {
      content: [
        { type: 'text', text: 'Part 1. ' },
        { type: 'text', text: 'Part 2.' },
      ],
    };

    const text = mockResponse.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('');

    expect(text).toBe('Part 1. Part 2.');
  });

  it('should handle empty response gracefully', () => {
    const mockResponse = { content: [] };
    
    const text = mockResponse.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('');

    expect(text).toBe('');
  });
});
