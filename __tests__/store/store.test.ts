import { act, renderHook } from '@testing-library/react';
import { 
  useModulesStore, 
  useSessionStore, 
  useProgressStore, 
  useSettingsStore,
  useUIStore,
} from '@/store';

describe('useModulesStore', () => {
  beforeEach(() => {
    // Reset store state
    useModulesStore.setState({
      activeModuleId: null,
    });
  });

  it('should have initial modules', () => {
    const { result } = renderHook(() => useModulesStore());
    expect(result.current.modules.length).toBeGreaterThan(0);
  });

  it('should set active module', () => {
    const { result } = renderHook(() => useModulesStore());
    
    act(() => {
      result.current.setActiveModule('phishing-101');
    });

    expect(result.current.activeModuleId).toBe('phishing-101');
  });

  it('should get module by id', () => {
    const { result } = renderHook(() => useModulesStore());
    const module = result.current.getModule('phishing-101');
    
    expect(module).toBeDefined();
    expect(module?.title).toBe('Phishing Detection Lab');
  });

  it('should update module status', () => {
    const { result } = renderHook(() => useModulesStore());
    
    act(() => {
      result.current.updateModuleStatus('phishing-101', 'completed');
    });

    const module = result.current.getModule('phishing-101');
    expect(module?.status).toBe('completed');
  });

  it('should update module score', () => {
    const { result } = renderHook(() => useModulesStore());
    
    act(() => {
      result.current.updateModuleScore('phishing-101', 85);
    });

    const module = result.current.getModule('phishing-101');
    expect(module?.bestScore).toBe(85);
  });

  it('should keep best score when new score is lower', () => {
    const { result } = renderHook(() => useModulesStore());
    
    act(() => {
      result.current.updateModuleScore('phishing-101', 90);
    });
    
    act(() => {
      result.current.updateModuleScore('phishing-101', 70);
    });

    const module = result.current.getModule('phishing-101');
    expect(module?.bestScore).toBe(90);
  });
});

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.getState().resetSession();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useSessionStore());
    
    expect(result.current.sessionId).toBeNull();
    expect(result.current.isActive).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.score).toBe(0);
  });

  it('should start session', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('phishing-101');
    });

    expect(result.current.sessionId).not.toBeNull();
    expect(result.current.moduleId).toBe('phishing-101');
    expect(result.current.isActive).toBe(true);
    expect(result.current.startTime).toBeInstanceOf(Date);
  });

  it('should add message', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.addMessage({
        role: 'user',
        content: 'Test message',
      });
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].content).toBe('Test message');
    expect(result.current.messages[0].id).toBeDefined();
    expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
  });

  it('should update score', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.updateScore(10);
    });

    expect(result.current.score).toBe(10);
  });

  it('should not exceed max score', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.updateScore(150);
    });

    expect(result.current.score).toBe(100);
  });

  it('should not go below 0', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.updateScore(-50);
    });

    expect(result.current.score).toBe(0);
  });

  it('should end session', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.endSession({ 
        overallScore: 85,
        maxScore: 100,
        correctActions: 8,
        totalActions: 10,
        missedRedFlags: [],
        identifiedRedFlags: ['Urgency'],
        strengths: ['Good detection'],
        improvements: ['Be faster'],
        detailedAnalysis: 'Good job!',
      });
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.feedback?.overallScore).toBe(85);
  });

  it('should reset session', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.addMessage({ role: 'user', content: 'test' });
      result.current.updateScore(50);
      result.current.resetSession();
    });

    expect(result.current.sessionId).toBeNull();
    expect(result.current.messages).toEqual([]);
    expect(result.current.score).toBe(0);
    expect(result.current.isActive).toBe(false);
  });

  it('should go to next scenario', () => {
    const { result } = renderHook(() => useSessionStore());
    
    act(() => {
      result.current.startSession('test');
      result.current.addMessage({ role: 'user', content: 'test' });
      result.current.nextScenario();
    });

    expect(result.current.scenarioIndex).toBe(1);
    expect(result.current.messages).toEqual([]);
  });
});

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('should have initial progress', () => {
    const { result } = renderHook(() => useProgressStore());
    
    expect(result.current.progress.level).toBe(1);
    expect(result.current.progress.xp).toBe(0);
    expect(result.current.progress.streak).toBe(0);
  });

  it('should update module progress', () => {
    const { result } = renderHook(() => useProgressStore());
    
    act(() => {
      result.current.updateModuleProgress('phishing-101', 85, true);
    });

    const moduleProgress = result.current.progress.moduleProgress['phishing-101'];
    expect(moduleProgress).toBeDefined();
    expect(moduleProgress.bestScore).toBe(85);
    expect(moduleProgress.status).toBe('completed');
    expect(moduleProgress.attempts).toBe(1);
  });

  it('should add XP and level up', () => {
    const { result } = renderHook(() => useProgressStore());
    
    act(() => {
      result.current.addXP(150);
    });

    expect(result.current.progress.level).toBe(2);
    expect(result.current.progress.xp).toBe(50);
  });

  it('should add badge', () => {
    const { result } = renderHook(() => useProgressStore());
    
    act(() => {
      result.current.addBadge({
        id: 'first-module',
        name: 'First Steps',
        description: 'Complete your first module',
        icon: '🎯',
        requirement: 'Complete 1 module',
        rarity: 'common',
      });
    });

    expect(result.current.progress.badges.length).toBe(1);
    expect(result.current.progress.badges[0].name).toBe('First Steps');
    expect(result.current.progress.badges[0].earnedAt).toBeInstanceOf(Date);
  });

  it('should update streak', () => {
    const { result } = renderHook(() => useProgressStore());
    
    // Set lastActiveDate to yesterday
    act(() => {
      useProgressStore.setState({
        progress: {
          ...result.current.progress,
          lastActiveDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          streak: 5,
        },
      });
    });

    act(() => {
      result.current.updateStreak();
    });

    expect(result.current.progress.streak).toBe(6);
  });
});

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().resetSettings();
  });

  it('should have default settings', () => {
    const { result } = renderHook(() => useSettingsStore());
    
    expect(result.current.settings.notifications).toBe(true);
    expect(result.current.settings.soundEffects).toBe(true);
    expect(result.current.settings.darkMode).toBe(true);
    expect(result.current.settings.difficulty).toBe('beginner');
  });

  it('should update settings', () => {
    const { result } = renderHook(() => useSettingsStore());
    
    act(() => {
      result.current.updateSettings({ soundEffects: false, difficulty: 'advanced' });
    });

    expect(result.current.settings.soundEffects).toBe(false);
    expect(result.current.settings.difficulty).toBe('advanced');
    expect(result.current.settings.notifications).toBe(true); // Unchanged
  });

  it('should reset settings', () => {
    const { result } = renderHook(() => useSettingsStore());
    
    act(() => {
      result.current.updateSettings({ soundEffects: false });
      result.current.resetSettings();
    });

    expect(result.current.settings.soundEffects).toBe(true);
  });
});

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      isSidebarOpen: true,
      isLoading: false,
      activeView: 'dashboard',
      modalContent: null,
      toast: null,
    });
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.isSidebarOpen).toBe(true);
    
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isSidebarOpen).toBe(false);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should set active view', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setActiveView('training');
    });

    expect(result.current.activeView).toBe('training');
  });

  it('should show and hide toast', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(result.current.toast?.message).toBe('Test message');
    expect(result.current.toast?.type).toBe('success');

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.toast).toBeNull();
  });
});
