// ============================================
// CyberShield - Type Definitions
// ============================================

// Threat Levels
export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Training Module Types
export type ModuleType = 
  | 'phishing'
  | 'social-engineering'
  | 'incident-response'
  | 'password-security'
  | 'data-protection'
  | 'threat-hunting'
  | 'malware-awareness'
  | 'secure-browsing';

export type ModuleStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Training Module
export interface TrainingModule {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  status: ModuleStatus;
  estimatedMinutes: number;
  totalScenarios: number;
  completedScenarios: number;
  requiredScore: number;
  bestScore?: number;
  icon: string;
  image?: string;
  prerequisites?: string[];
  skills: string[];
}

// Scenario Types
export interface PhishingScenario {
  id: string;
  type: 'email' | 'sms' | 'url' | 'social-media';
  content: EmailScenario | SMSScenario | URLScenario;
  isPhishing: boolean;
  difficulty: DifficultyLevel;
  redFlags: string[];
  explanation: string;
}

export interface EmailScenario {
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  attachments?: string[];
  timestamp: string;
  headers?: Record<string, string>;
}

export interface SMSScenario {
  sender: string;
  message: string;
  timestamp: string;
  containsLink?: boolean;
}

export interface URLScenario {
  url: string;
  displayUrl?: string;
  context: string;
}

// Incident Response Scenario
export interface IncidentScenario {
  id: string;
  title: string;
  description: string;
  type: 'ransomware' | 'data-breach' | 'ddos' | 'insider-threat' | 'malware' | 'phishing-attack';
  severity: ThreatLevel;
  timeline: IncidentEvent[];
  correctActions: string[];
  availableActions: IncidentAction[];
}

export interface IncidentEvent {
  timestamp: string;
  description: string;
  source: string;
}

export interface IncidentAction {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
  consequences: string;
  points: number;
}

// Social Engineering Scenario
export interface SocialEngineeringScenario {
  id: string;
  attackType: 'pretexting' | 'baiting' | 'tailgating' | 'quid-pro-quo' | 'vishing';
  persona: AIPersona;
  objective: string;
  setting: string;
  redFlags: string[];
}

// AI Persona for simulations
export interface AIPersona {
  id: string;
  name: string;
  role: string;
  company?: string;
  backstory: string;
  personality: string;
  attackVector: string;
  difficulty: DifficultyLevel;
  avatar?: string;
}

// Chat/Conversation
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    isAttack?: boolean;
    redFlagTriggered?: string;
    scoreImpact?: number;
  };
}

export interface ConversationSession {
  id: string;
  moduleId: string;
  scenarioId: string;
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
  score: number;
  feedback?: SessionFeedback;
}

// Session Feedback
export interface SessionFeedback {
  overallScore: number;
  maxScore: number;
  correctActions: number;
  totalActions: number;
  missedRedFlags: string[];
  identifiedRedFlags: string[];
  strengths: string[];
  improvements: string[];
  detailedAnalysis: string;
}

// User Progress
export interface UserProgress {
  moduleProgress: Record<string, ModuleProgress>;
  totalScore: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
  streak: number;
  lastActiveDate: string;
}

export interface ModuleProgress {
  moduleId: string;
  status: ModuleStatus;
  bestScore: number;
  attempts: number;
  completedScenarios: string[];
  lastAttemptDate?: string;
  timeSpentMinutes: number;
}

// Badges/Achievements
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar?: string;
  totalScore: number;
  level: number;
  modulesCompleted: number;
  streak: number;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ScenarioGenerationRequest {
  moduleType: ModuleType;
  difficulty: DifficultyLevel;
  previousScenarios?: string[];
}

export interface CoachingRequest {
  sessionId: string;
  userAction: string;
  scenarioContext: string;
  currentScore: number;
}

export interface CoachingResponse {
  feedback: string;
  scoreAdjustment: number;
  hint?: string;
  explanation?: string;
  encouragement: string;
}

// Settings
export interface UserSettings {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  difficulty: DifficultyLevel;
  voiceInput: boolean;
  textToSpeech: boolean;
}

// Analytics
export interface AnalyticsEvent {
  event: string;
  moduleId?: string;
  scenarioId?: string;
  score?: number;
  duration?: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  averageScore: number;
  completionRate: number;
  moduleStats: ModuleStats[];
  recentActivity: ActivityLog[];
}

export interface ModuleStats {
  moduleId: string;
  moduleName: string;
  attempts: number;
  averageScore: number;
  completionRate: number;
  averageTimeMinutes: number;
}

export interface ActivityLog {
  userId: string;
  action: string;
  moduleId?: string;
  timestamp: Date;
  details?: string;
}
