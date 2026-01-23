import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  TrainingModule,
  ModuleStatus,
  DifficultyLevel,
  ChatMessage,
  UserProgress,
  Badge,
  UserSettings,
  SessionFeedback,
} from '@/types';

// ============================================
// Training Modules Store
// ============================================

interface ModulesState {
  modules: TrainingModule[];
  activeModuleId: string | null;
  setActiveModule: (id: string | null) => void;
  updateModuleStatus: (id: string, status: ModuleStatus) => void;
  updateModuleScore: (id: string, score: number) => void;
  getModule: (id: string) => TrainingModule | undefined;
}

export const useModulesStore = create<ModulesState>((set, get) => ({
  modules: [
    {
      id: 'phishing-101',
      type: 'phishing',
      title: 'Phishing Detection Lab',
      description: 'Learn to identify and report phishing emails, texts, and suspicious links.',
      difficulty: 'beginner',
      status: 'available',
      estimatedMinutes: 15,
      totalScenarios: 10,
      completedScenarios: 0,
      requiredScore: 70,
      icon: '🎣',
      // Professional stock photo: Hacker/phishing concept
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
      skills: ['Email Analysis', 'URL Inspection', 'Sender Verification'],
    },
    {
      id: 'social-engineering-basics',
      type: 'social-engineering',
      title: 'Social Engineering Defense',
      description: 'Practice recognizing manipulation tactics and protecting sensitive information.',
      difficulty: 'beginner',
      status: 'available',
      estimatedMinutes: 20,
      totalScenarios: 8,
      completedScenarios: 0,
      requiredScore: 70,
      icon: '🎭',
      // Professional stock photo: Business manipulation/social engineering
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      skills: ['Threat Recognition', 'Information Protection', 'Verification Protocols'],
    },
    {
      id: 'incident-response-101',
      type: 'incident-response',
      title: 'Incident Response Simulator',
      description: 'Handle simulated security incidents and learn proper response procedures.',
      difficulty: 'intermediate',
      status: 'locked',
      estimatedMinutes: 30,
      totalScenarios: 6,
      completedScenarios: 0,
      requiredScore: 75,
      icon: '🚨',
      // Professional stock photo: Security Operations Center
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      prerequisites: ['phishing-101'],
      skills: ['Incident Triage', 'Escalation', 'Documentation', 'Containment'],
    },
    {
      id: 'password-security',
      type: 'password-security',
      title: 'Password & Authentication',
      description: 'Master password best practices and multi-factor authentication.',
      difficulty: 'beginner',
      status: 'available',
      estimatedMinutes: 12,
      totalScenarios: 8,
      completedScenarios: 0,
      requiredScore: 80,
      icon: '🔐',
      // Professional stock photo: Biometric/authentication
      image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80',
      skills: ['Password Creation', 'MFA Setup', 'Credential Management'],
    },
    {
      id: 'data-protection-fundamentals',
      type: 'data-protection',
      title: 'Data Protection Fundamentals',
      description: 'Learn to classify, handle, and protect sensitive data appropriately.',
      difficulty: 'intermediate',
      status: 'locked',
      estimatedMinutes: 25,
      totalScenarios: 10,
      completedScenarios: 0,
      requiredScore: 75,
      icon: '🛡️',
      // Professional stock photo: Data center/server room
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      prerequisites: ['password-security'],
      skills: ['Data Classification', 'Encryption Basics', 'Secure Sharing'],
    },
    {
      id: 'threat-hunting-basics',
      type: 'threat-hunting',
      title: 'Threat Hunting Basics',
      description: 'Analyze logs and indicators to identify potential security threats.',
      difficulty: 'advanced',
      status: 'locked',
      estimatedMinutes: 45,
      totalScenarios: 5,
      completedScenarios: 0,
      requiredScore: 80,
      icon: '🔍',
      // Professional stock photo: Analyst at multiple monitors
      image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&q=80',
      prerequisites: ['incident-response-101', 'data-protection-fundamentals'],
      skills: ['Log Analysis', 'IOC Detection', 'Pattern Recognition'],
    },
    {
      id: 'malware-awareness',
      type: 'malware-awareness',
      title: 'Malware Awareness',
      description: 'Understand different types of malware and how to prevent infections.',
      difficulty: 'intermediate',
      status: 'locked',
      estimatedMinutes: 20,
      totalScenarios: 8,
      completedScenarios: 0,
      requiredScore: 75,
      icon: '🦠',
      // Professional stock photo: Virus/malware visualization
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      prerequisites: ['phishing-101'],
      skills: ['Malware Types', 'Prevention', 'Safe Downloads'],
    },
    {
      id: 'secure-browsing',
      type: 'secure-browsing',
      title: 'Secure Browsing Practices',
      description: 'Navigate the web safely and recognize dangerous websites.',
      difficulty: 'beginner',
      status: 'available',
      estimatedMinutes: 15,
      totalScenarios: 10,
      completedScenarios: 0,
      requiredScore: 70,
      icon: '🌐',
      // Professional stock photo: Secure browsing/HTTPS
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      skills: ['HTTPS Recognition', 'Cookie Management', 'Safe Downloads'],
    },
  ],
  activeModuleId: null,
  setActiveModule: (id) => set({ activeModuleId: id }),
  updateModuleStatus: (id, status) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, status } : m
      ),
    })),
  updateModuleScore: (id, score) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id
          ? { ...m, bestScore: Math.max(score, m.bestScore || 0) }
          : m
      ),
    })),
  getModule: (id) => get().modules.find((m) => m.id === id),
}));

// ============================================
// Session Store (Active Training Session)
// ============================================

interface SessionState {
  sessionId: string | null;
  moduleId: string | null;
  scenarioIndex: number;
  messages: ChatMessage[];
  score: number;
  maxScore: number;
  isActive: boolean;
  startTime: Date | null;
  feedback: SessionFeedback | null;
  
  startSession: (moduleId: string) => void;
  endSession: (feedback?: SessionFeedback) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateScore: (delta: number) => void;
  setScore: (score: number) => void;
  nextScenario: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  moduleId: null,
  scenarioIndex: 0,
  messages: [],
  score: 0,
  maxScore: 100,
  isActive: false,
  startTime: null,
  feedback: null,

  startSession: (moduleId) =>
    set({
      sessionId: `session-${Date.now()}`,
      moduleId,
      scenarioIndex: 0,
      messages: [],
      score: 0,
      isActive: true,
      startTime: new Date(),
      feedback: null,
    }),

  endSession: (feedback) =>
    set({
      isActive: false,
      feedback: feedback || null,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        },
      ],
    })),

  updateScore: (delta) =>
    set((state) => ({
      score: Math.max(0, Math.min(state.maxScore, state.score + delta)),
    })),

  setScore: (score) => set({ score }),

  nextScenario: () =>
    set((state) => ({
      scenarioIndex: state.scenarioIndex + 1,
      messages: [],
    })),

  resetSession: () =>
    set({
      sessionId: null,
      moduleId: null,
      scenarioIndex: 0,
      messages: [],
      score: 0,
      isActive: false,
      startTime: null,
      feedback: null,
    }),
}));

// ============================================
// User Progress Store (Persisted)
// ============================================

interface ProgressState {
  progress: UserProgress;
  updateModuleProgress: (moduleId: string, score: number, completed: boolean) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: Badge) => void;
  updateStreak: () => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  moduleProgress: {},
  totalScore: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  badges: [],
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      updateModuleProgress: (moduleId, score, completed) =>
        set((state) => {
          const existing = state.progress.moduleProgress[moduleId];
          return {
            progress: {
              ...state.progress,
              moduleProgress: {
                ...state.progress.moduleProgress,
                [moduleId]: {
                  moduleId,
                  status: completed ? 'completed' : 'in-progress',
                  bestScore: Math.max(score, existing?.bestScore || 0),
                  attempts: (existing?.attempts || 0) + 1,
                  completedScenarios: existing?.completedScenarios || [],
                  lastAttemptDate: new Date().toISOString(),
                  timeSpentMinutes: (existing?.timeSpentMinutes || 0) + 1,
                },
              },
              totalScore: state.progress.totalScore + score,
            },
          };
        }),

      addXP: (amount) =>
        set((state) => {
          let newXP = state.progress.xp + amount;
          let newLevel = state.progress.level;
          let xpToNext = state.progress.xpToNextLevel;

          while (newXP >= xpToNext) {
            newXP -= xpToNext;
            newLevel += 1;
            xpToNext = Math.floor(xpToNext * 1.5);
          }

          return {
            progress: {
              ...state.progress,
              xp: newXP,
              level: newLevel,
              xpToNextLevel: xpToNext,
            },
          };
        }),

      addBadge: (badge) =>
        set((state) => ({
          progress: {
            ...state.progress,
            badges: [...state.progress.badges, { ...badge, earnedAt: new Date() }],
          },
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastActive = state.progress.lastActiveDate;
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

          let newStreak = state.progress.streak;
          if (lastActive === yesterday) {
            newStreak += 1;
          } else if (lastActive !== today) {
            newStreak = 1;
          }

          return {
            progress: {
              ...state.progress,
              streak: newStreak,
              lastActiveDate: today,
            },
          };
        }),

      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: 'cybershield-progress',
    }
  )
);

// ============================================
// Settings Store (Persisted)
// ============================================

interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  notifications: true,
  soundEffects: true,
  darkMode: true,
  difficulty: 'beginner',
  voiceInput: false,
  textToSpeech: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'cybershield-settings',
    }
  )
);

// ============================================
// UI Store
// ============================================

interface UIState {
  isSidebarOpen: boolean;
  isLoading: boolean;
  activeView: 'dashboard' | 'training' | 'progress' | 'leaderboard' | 'settings';
  modalContent: React.ReactNode | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setActiveView: (view: UIState['activeView']) => void;
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isLoading: false,
  activeView: 'dashboard',
  modalContent: null,
  toast: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
  setActiveView: (view) => set({ activeView: view }),
  showModal: (content) => set({ modalContent: content }),
  hideModal: () => set({ modalContent: null }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
