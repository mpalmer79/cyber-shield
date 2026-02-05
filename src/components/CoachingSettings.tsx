// src/components/CoachingSettings.tsx
// Drop-in settings panel for coaching preferences
// Add this to your existing settings page or modal

'use client';

import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
import { useCoachingStore } from '../store/coaching-store';

export default function CoachingSettings() {
  const {
    coachingEnabled,
    autoOpenChat,
    totalCoachingSessions,
    averageScore,
    bestGrade,
    toggleCoaching,
    toggleAutoOpen,
    clearHistory,
  } = useCoachingStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <MessageCircle className="h-5 w-5 text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">AI Coaching Chat</h3>
      </div>

      {/* Toggle: Enable coaching */}
      <ToggleRow
        label="Enable AI Coach"
        description="Chat with an AI coach during scenarios to discuss red flags"
        enabled={coachingEnabled}
        onToggle={toggleCoaching}
      />

      {/* Toggle: Auto-open */}
      <ToggleRow
        label="Auto-open on new scenario"
        description="Automatically show the coaching panel when a new scenario loads"
        enabled={autoOpenChat}
        onToggle={toggleAutoOpen}
        disabled={!coachingEnabled}
      />

      {/* Stats */}
      {totalCoachingSessions > 0 && (
        <div className="pt-3 border-t border-cyber-800">
          <p className="text-xs text-cyber-500 uppercase tracking-wider mb-2">Coaching Stats</p>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Sessions" value={totalCoachingSessions.toString()} />
            <StatBox label="Avg Score" value={`${averageScore}`} />
            <StatBox label="Best Grade" value={bestGrade || '-'} />
          </div>
          <button
            onClick={() => {
              if (confirm('Clear all coaching history? This cannot be undone.')) {
                clearHistory();
              }
            }}
            className="mt-3 text-xs text-red-400/60 hover:text-red-400 transition-colors"
          >
            Clear coaching history
          </button>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  disabled = false,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-40' : ''}`}>
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-cyber-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          enabled ? 'bg-cyan-600' : 'bg-cyber-800'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cyber-900/50 border border-cyber-800 rounded-lg p-2 text-center">
      <div className="text-lg font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] text-cyber-500">{label}</div>
    </div>
  );
}
