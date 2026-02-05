// ============================================
// CyberShield - Scenario Type Definitions
// Typed content interfaces + type guards
// ============================================

import type { DifficultyLevel } from '@/types';

// -- Scenario Content Interfaces --

export interface EmailContent {
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  attachments?: string[];
}

export interface SMSContent {
  sender: string;
  message: string;
  timestamp: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ConversationLine {
  speaker: string;
  text: string;
}

export interface PhoneCallContent {
  scenario: string;
  callerClaim: string;
  callerName: string;
  conversation: ConversationLine[];
  options: ScenarioOption[];
}

export interface InPersonContent {
  scenario: string;
  setting: string;
  encounter: ConversationLine[];
  options: ScenarioOption[];
}

export interface URLOption {
  id: string;
  url: string;
  safe: boolean;
  reason: string;
}

export interface URLEvaluationContent {
  instruction: string;
  urls: URLOption[];
  correctAnswer: string;
}

export interface PasswordOption {
  id: string;
  password: string;
  strength: 'weak' | 'medium' | 'strong';
}

export interface PasswordEvaluationContent {
  instruction: string;
  passwords: PasswordOption[];
  correctAnswer: string;
}

export interface MultipleChoiceContent {
  scenario: string;
  question: string;
  options: ScenarioOption[];
  alertDetails?: Record<string, string>;
}

// -- Scenario Type Union --

export type ScenarioType =
  | 'email'
  | 'sms'
  | 'phone-call'
  | 'in-person'
  | 'url-evaluation'
  | 'password-evaluation'
  | 'scenario';

// -- Main Training Scenario Interface --

export interface TrainingScenario {
  id: string;
  moduleType: string;
  type: ScenarioType;
  title: string;
  difficulty: DifficultyLevel;
  content: Record<string, unknown>;
  isCorrectAnswer: boolean;
  redFlags: string[];
  explanation: string;
  learningPoints: string[];
  image?: string;
}

// -- Type-Safe Content Accessors --
// These narrow the content based on scenario type.
// Use them at the top of render branches for clean typed access.

export function asEmail(scenario: TrainingScenario): EmailContent {
  return scenario.content as EmailContent;
}

export function asSMS(scenario: TrainingScenario): SMSContent {
  return scenario.content as SMSContent;
}

export function asPhoneCall(scenario: TrainingScenario): PhoneCallContent {
  return scenario.content as PhoneCallContent;
}

export function asInPerson(scenario: TrainingScenario): InPersonContent {
  return scenario.content as InPersonContent;
}

export function asURLEvaluation(scenario: TrainingScenario): URLEvaluationContent {
  return scenario.content as URLEvaluationContent;
}

export function asPasswordEvaluation(scenario: TrainingScenario): PasswordEvaluationContent {
  return scenario.content as PasswordEvaluationContent;
}

export function asMultipleChoice(scenario: TrainingScenario): MultipleChoiceContent {
  return scenario.content as MultipleChoiceContent;
}

// -- Content Type Guards --
// Runtime checks if needed for dynamic/AI-generated scenarios

export function hasOptions(content: Record<string, unknown>): content is { options: ScenarioOption[] } {
  return Array.isArray(content.options);
}

export function hasCorrectAnswer(content: Record<string, unknown>): content is { correctAnswer: string } {
  return typeof content.correctAnswer === 'string';
}

// -- Pure Answer Checking --
// Single source of truth for answer correctness logic

export function checkAnswer(scenario: TrainingScenario, answer: string): boolean {
  let type = scenario.type;

  // Phishing detection: user picks "phishing" or "legitimate"
  if (type === 'email' || type === 'sms') {
    return (answer === 'phishing') === scenario.isCorrectAnswer;
  }

  // Direct answer match (URL or password selection)
  if (type === 'url-evaluation' || type === 'password-evaluation') {
    let content = scenario.content;
    if (hasCorrectAnswer(content)) {
      return answer === content.correctAnswer;
    }
    return false;
  }

  // Multiple choice (scenario, phone-call, in-person all use options)
  if (type === 'scenario' || type === 'phone-call' || type === 'in-person') {
    let content = scenario.content;
    if (hasOptions(content)) {
      let selected = content.options.find(opt => opt.id === answer);
      return selected?.isCorrect ?? false;
    }
    return false;
  }

  return false;
}

// -- Helper: Is this a phishing-judgment scenario? --

export function isPhishingJudgment(type: ScenarioType): boolean {
  return type === 'email' || type === 'sms';
}
