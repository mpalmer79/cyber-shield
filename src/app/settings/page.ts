'use client';

import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Volume2, 
  Moon,
  Sun,
  Mic,
  Speaker,
  RotateCcw,
  Save,
  ChevronRight,
  Shield,
  AlertTriangle,
  Palette,
  Play
} from 'lucide-react';
import { Header, ThemeToggle, useTheme, useToast, InteractiveButton, useSoundEffect, useOnboarding } from '@/components';
import { useSettingsStore, useProgressStore } from '@/store';
import { cn } from '@/lib/utils';
import type { DifficultyLevel } from '@/types';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const { resetProgress } = useProgressStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const toast = useToast();
  const playSound = useSoundEffect();
  const { resetOnboarding } = useOnboarding();

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] });
      playSound('toggle');
      toast.success('Settings saved');
    }
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    updateSettings({ difficulty });
    playSound('click');
    toast.success(`Difficulty set to ${difficulty}`);
  };

  const handleResetProgress = () => {
    resetProgress();
    resetSettings();
    setShowResetConfirm(false);
    playSound('notification');
    toast.info('All progress has been reset');
  };

  const handleReplayOnboarding = () => {
    resetOnboarding();
    playSound('notification');
  };

  const handleTestSound = () => {
    playSound('success');
  };

  const difficulties: { value: DifficultyLevel; label: string; description: string }[] = [
    { value: 'beginner', label: 'Beginner', description: 'Easier scenarios with obvious red flags' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate difficulty with subtle indicators' },
    { value: 'advanced', label: 'Advanced', description: 'Challenging scenarios requiring careful analysis' },
    { value: 'expert', label: 'Expert', description: 'Highly sophisticated attack simulations' },
  ];

  return (
    <div className="min-h-screen">
      <Header currentPage="settings" />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyber-100 mb-2">Settings</h1>
            <p className="text-cyber-400">
              Customize your training experience.
            </p>
          </div>

          <div className="space-y-6">
            {/* Notifications Section */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                <Bell className="h-5 w-5 text-cyber-400" />
                <span>Notifications</span>
              </h2>

              <div className="space-y-4">
                <ToggleSetting
                  icon={Bell}
                  label="Push Notifications"
                  description="Get notified about training reminders and achievements"
                  enabled={settings.notifications}
                  onToggle={() => handleToggle('notifications')}
                />
              </div>
            </div>

            {/* Audio Section */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-cyber-400" />
                <span>Audio</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Volume2 className="h-5 w-5 text-cyber-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-cyber-200">Sound Effects</div>
                      <div className="text-xs text-cyber-500">Play sounds for interactions and achievements</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTestSound}
                      className="px-3 py-1 text-xs bg-cyber-800/50 hover:bg-cyber-700/50 text-cyber-400 rounded-lg transition-colors"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => handleToggle('soundEffects')}
                      className={cn(
                        'relative w-12 h-6 rounded-full transition-colors duration-200',
                        settings.soundEffects ? 'bg-cyber-600' : 'bg-cyber-800'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200',
                          settings.soundEffects && 'translate-x-6'
                        )}
                      />
                    </button>
                  </div>
                </div>

                <ToggleSetting
                  icon={Mic}
                  label="Voice Input"
                  description="Use voice commands during training sessions"
                  enabled={settings.voiceInput}
                  onToggle={() => handleToggle('voiceInput')}
                />

                <ToggleSetting
                  icon={Speaker}
                  label="Text-to-Speech"
                  description="Have scenarios and feedback read aloud"
                  enabled={settings.textToSpeech}
                  onToggle={() => handleToggle('textToSpeech')}
                />
              </div>
            </div>

            {/* Training Section */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-cyber-400" />
                <span>Training Preferences</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-cyber-300 mb-3 block">
                    Default Difficulty Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.value}
                        onClick={() => handleDifficultyChange(diff.value)}
                        className={cn(
                          'p-3 rounded-lg border text-left transition-all duration-200',
                          settings.difficulty === diff.value
                            ? 'bg-cyber-700/50 border-cyber-500 text-cyber-200'
                            : 'bg-cyber-800/30 border-cyber-700/50 text-cyber-400 hover:border-cyber-600'
                        )}
                      >
                        <div className="font-medium text-sm">{diff.label}</div>
                        <div className="text-xs text-cyber-500 mt-0.5">{diff.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Replay Onboarding */}
                <div className="pt-4 border-t border-cyber-800">
                  <button
                    onClick={handleReplayOnboarding}
                    className="flex items-center space-x-2 text-sm text-cyber-400 hover:text-cyber-300 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Replay Tutorial</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                <Palette className="h-5 w-5 text-cyber-400" />
                <span>Appearance</span>
              </h2>

              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Moon className="h-5 w-5 text-cyber-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-cyber-200">Theme</div>
                      <div className="text-xs text-cyber-500">Choose your preferred color scheme</div>
                    </div>
                  </div>
                  <ThemeToggle variant="switch" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="cyber-card p-6 border-red-500/30">
              <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </h2>

              <p className="text-sm text-cyber-400 mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>

              {!showResetConfirm ? (
                <InteractiveButton
                  variant="danger"
                  soundOnClick="error"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset All Progress</span>
                </InteractiveButton>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-sm text-red-300 mb-4">
                    Are you sure? This will permanently delete all your progress, scores, badges, and settings.
                  </p>
                  <div className="flex space-x-3">
                    <InteractiveButton
                      variant="danger"
                      onClick={handleResetProgress}
                    >
                      Yes, Reset Everything
                    </InteractiveButton>
                    <InteractiveButton
                      variant="secondary"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Cancel
                    </InteractiveButton>
                  </div>
                </div>
              )}
            </div>

            {/* App Info */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4">About CyberShield</h2>
              <div className="space-y-2 text-sm text-cyber-400">
                <p>Version: 1.0.0</p>
                <p>AI-Powered Cybersecurity Training Platform</p>
                <p className="text-cyber-500">
                  Built with Next.js and Claude AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Toggle Setting Component
function ToggleSetting({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 text-cyber-500 mt-0.5" />
        <div>
          <div className="font-medium text-cyber-200">{label}</div>
          <div className="text-xs text-cyber-500">{description}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors duration-200',
          enabled ? 'bg-cyber-600' : 'bg-cyber-800'
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200',
            enabled && 'translate-x-6'
          )}
        />
      </button>
    </div>
  );
}
