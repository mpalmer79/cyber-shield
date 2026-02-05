// src/components/CoachingChat.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Target,
  ChevronDown,
  ChevronUp,
  Zap,
  Eye,
  EyeOff,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import {
  CoachingEngine,
  getGradeColor,
  getGradeBg,
} from '../lib/coaching';
import type {
  CoachMessage,
  CoachingScoreBreakdown,
} from '../lib/coaching';
import type { TrainingScenario } from '../lib/scenarios/types';

// ============================================
// TYPES
// ============================================

interface CoachingChatProps {
  scenario: TrainingScenario;
  onComplete: (score: CoachingScoreBreakdown, session: ReturnType<CoachingEngine['getSession']>) => void;
  onClose?: () => void;
  // Claude API call function — parent provides this
  callAI: (messages: Array<{ role: string; content: string }>) => Promise<string>;
  className?: string;
}

// ============================================
// HELPER COMPONENTS
// ============================================

function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-4 py-3">
      <div className="flex items-center space-x-1">
        <span className="text-xs text-cyan-400 mr-2">Coach</span>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function FlagProgress({ identified, total }: { identified: number; total: number }) {
  const pct = Math.round((identified / Math.max(total, 1)) * 100);
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 h-1.5 bg-cyber-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#6b7280',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] text-cyber-500 font-mono min-w-[3rem] text-right">
        {identified}/{total}
      </span>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CoachingChat({
  scenario,
  onComplete,
  onClose,
  callAI,
  className = '',
}: CoachingChatProps) {
  const [engine] = useState(() => new CoachingEngine(scenario));
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFlagTracker, setShowFlagTracker] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<CoachingScoreBreakdown | null>(null);
  const [verdictMode, setVerdictMode] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Send opening message on mount
  useEffect(() => {
    const opening = engine.getOpeningMessage();
    setMessages([opening]);
  }, [engine]);

  const progress = engine.getProgress();

  // Send a message to the coaching AI
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput('');

    // Add user message
    const userMsg = engine.addUserMessage(text);
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const apiMessages = engine.buildApiMessages();
      const response = await callAI(apiMessages);
      const coachMsg = engine.processCoachResponse(response);
      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error('Coaching AI error:', err);
      const errorMsg: CoachMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'system',
        content: 'Connection hiccup — try sending that again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, engine, callAI]);

  // Handle Enter key (shift+enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Submit final verdict
  const handleVerdict = (verdict: 'phishing' | 'legitimate' | 'threat' | 'safe') => {
    const score = engine.submitVerdict(verdict);
    setScoreBreakdown(score);
    setVerdictMode(false);
    onComplete(score, engine.getSession());
  };

  // Quick action buttons for common observations
  const quickActions = [
    { label: 'Suspicious URL', text: 'I notice the URL/domain looks suspicious' },
    { label: 'Urgency tactic', text: 'There\'s an urgency or pressure tactic here' },
    { label: 'Sender mismatch', text: 'The sender address doesn\'t match who they claim to be' },
    { label: 'Asks for info', text: 'They\'re requesting sensitive information' },
  ];

  // ============================================
  // RENDER: Score breakdown (post-verdict)
  // ============================================
  if (scoreBreakdown) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-cyber-950 border border-cyber-800 rounded-xl overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className={`px-4 py-3 border-b ${getGradeBg(scoreBreakdown.grade)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className={`h-5 w-5 ${getGradeColor(scoreBreakdown.grade)}`} />
              <span className="text-sm font-semibold text-white">Coaching Score</span>
            </div>
            <div className={`text-3xl font-bold font-mono ${getGradeColor(scoreBreakdown.grade)}`}>
              {scoreBreakdown.grade}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Total Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white font-mono">{scoreBreakdown.total}</div>
            <div className="text-xs text-cyber-500 mt-1">out of 100</div>
          </div>

          {/* Summary */}
          <p className="text-sm text-cyber-300 text-center">{scoreBreakdown.summary}</p>

          {/* Score breakdown bars */}
          <div className="space-y-2.5">
            <ScoreBar
              label="Flags You Found"
              value={scoreBreakdown.flagsIdentifiedScore}
              max={50}
              color="bg-green-500"
              icon={<Eye className="h-3.5 w-3.5" />}
            />
            <ScoreBar
              label="Flags (with hints)"
              value={scoreBreakdown.flagsHintedScore}
              max={20}
              color="bg-yellow-500"
              icon={<Target className="h-3.5 w-3.5" />}
            />
            <ScoreBar
              label="Analysis Depth"
              value={scoreBreakdown.depthScore}
              max={20}
              color="bg-cyan-500"
              icon={<MessageCircle className="h-3.5 w-3.5" />}
            />
            <ScoreBar
              label="Speed Bonus"
              value={scoreBreakdown.speedBonus}
              max={10}
              color="bg-purple-500"
              icon={<Zap className="h-3.5 w-3.5" />}
            />
          </div>

          {/* Red Flag Summary */}
          <div className="mt-4 pt-3 border-t border-cyber-800">
            <h4 className="text-xs font-semibold text-cyber-400 uppercase tracking-wider mb-2">
              Red Flag Breakdown
            </h4>
            <div className="space-y-1.5">
              {scenario.redFlags.map((flag, i) => {
                const session = engine.getSession();
                const wasIdentified = session.identifiedFlags.includes(flag);
                const wasHinted = session.hintedFlags.includes(flag);
                return (
                  <div key={i} className="flex items-start space-x-2 text-xs">
                    {wasIdentified ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
                    ) : wasHinted ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 mt-0.5 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                    )}
                    <span className={
                      wasIdentified ? 'text-green-300' :
                      wasHinted ? 'text-yellow-300' :
                      'text-red-300'
                    }>{flag}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-4 mt-3 text-[10px] text-cyber-600">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="h-3 w-3 text-green-400" /> <span>You found</span>
              </span>
              <span className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-yellow-400" /> <span>With hints</span>
              </span>
              <span className="flex items-center space-x-1">
                <X className="h-3 w-3 text-red-400" /> <span>Missed</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // RENDER: Minimized state
  // ============================================
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className={`flex items-center space-x-2 bg-cyber-950 border border-cyan-500/30 
          rounded-xl px-4 py-2.5 hover:border-cyan-500/50 transition-colors ${className}`}
      >
        <div className="relative">
          <Shield className="h-5 w-5 text-cyan-400" />
          {messages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
          )}
        </div>
        <span className="text-sm text-cyan-300 font-medium">Coach</span>
        <FlagProgress identified={progress.identified} total={progress.total} />
        <Maximize2 className="h-3.5 w-3.5 text-cyber-500" />
      </motion.button>
    );
  }

  // ============================================
  // RENDER: Full chat panel
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-cyber-950 border border-cyber-800 rounded-xl overflow-hidden flex flex-col ${className}`}
      style={{ maxHeight: '520px' }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-cyber-900/50 border-b border-cyber-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-cyber-900" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">CyberShield Coach</span>
              <span className="text-[10px] text-green-400 ml-2">Active</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowFlagTracker(!showFlagTracker)}
              className="p-1.5 text-cyber-500 hover:text-cyan-400 transition-colors"
              title="Toggle flag tracker"
            >
              {showFlagTracker ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-cyber-500 hover:text-cyan-400 transition-colors"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-cyber-500 hover:text-red-400 transition-colors"
                title="Close coach"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Flag progress bar */}
        <div className="mt-2">
          <FlagProgress identified={progress.identified} total={progress.total} />
        </div>

        {/* Optional: Expanded flag tracker */}
        <AnimatePresence>
          {showFlagTracker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 mt-2 border-t border-cyber-800/50 space-y-1">
                {scenario.redFlags.map((flag, i) => {
                  const session = engine.getSession();
                  const found = session.identifiedFlags.includes(flag);
                  const hinted = session.hintedFlags.includes(flag);
                  return (
                    <div key={i} className="flex items-center space-x-2 text-[11px]">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        found ? 'bg-green-400' : hinted ? 'bg-yellow-400' : 'bg-cyber-700'
                      }`} />
                      <span className={found ? 'text-green-300' : hinted ? 'text-yellow-300/70' : 'text-cyber-600'}>
                        {found ? flag : hinted ? '(Hint given)' : '???'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' ? (
                <div className="w-full text-center">
                  <span className="text-[11px] text-cyber-600 bg-cyber-900/50 px-3 py-1 rounded-full">
                    {msg.content}
                  </span>
                </div>
              ) : (
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                  {/* Flag identified badge */}
                  {msg.flagsIdentified && msg.flagsIdentified.length > 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center space-x-1 mb-1"
                    >
                      <ShieldCheck className="h-3 w-3 text-green-400" />
                      <span className="text-[10px] text-green-400 font-medium">
                        +{msg.flagsIdentified.length} red flag{msg.flagsIdentified.length > 1 ? 's' : ''} identified!
                      </span>
                    </motion.div>
                  )}

                  <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-600/20 text-cyan-50 border border-cyan-500/20 rounded-br-md'
                      : 'bg-cyber-900 text-cyber-200 border border-cyber-800 rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>

                  <div className={`text-[10px] text-cyber-600 mt-0.5 ${
                    msg.role === 'user' ? 'text-right' : ''
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Quick actions */}
      {messages.length <= 3 && !verdictMode && (
        <div className="px-3 pb-2 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(qa.text);
                  inputRef.current?.focus();
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-cyber-900 border border-cyber-800
                  text-cyber-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verdict buttons */}
      <AnimatePresence>
        {verdictMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 pb-2 shrink-0 overflow-hidden"
          >
            <div className="p-3 bg-cyber-900/50 rounded-lg border border-cyber-800">
              <p className="text-xs text-cyber-400 mb-2 font-medium">What's your final verdict?</p>
              <div className="grid grid-cols-2 gap-2">
                {scenario.moduleType === 'phishing' ? (
                  <>
                    <VerdictButton
                      label="Phishing"
                      icon={<ShieldAlert className="h-4 w-4" />}
                      color="red"
                      onClick={() => handleVerdict('phishing')}
                    />
                    <VerdictButton
                      label="Legitimate"
                      icon={<ShieldCheck className="h-4 w-4" />}
                      color="green"
                      onClick={() => handleVerdict('legitimate')}
                    />
                  </>
                ) : (
                  <>
                    <VerdictButton
                      label="Threat"
                      icon={<ShieldAlert className="h-4 w-4" />}
                      color="red"
                      onClick={() => handleVerdict('threat')}
                    />
                    <VerdictButton
                      label="Safe"
                      icon={<ShieldCheck className="h-4 w-4" />}
                      color="green"
                      onClick={() => handleVerdict('safe')}
                    />
                  </>
                )}
              </div>
              <button
                onClick={() => setVerdictMode(false)}
                className="w-full mt-2 text-[11px] text-cyber-500 hover:text-cyber-400"
              >
                Keep analyzing...
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="px-3 pb-3 pt-1 border-t border-cyber-800/50 shrink-0">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you notice about this..."
              rows={1}
              className="w-full bg-cyber-900 border border-cyber-800 rounded-xl px-3.5 py-2.5
                text-sm text-white placeholder-cyber-600 resize-none focus:outline-none
                focus:border-cyan-500/40 transition-colors"
              style={{ minHeight: '40px', maxHeight: '96px' }}
              disabled={isTyping}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyber-800 
                disabled:text-cyber-600 text-white rounded-xl transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVerdictMode(true)}
              className="p-2.5 bg-cyber-900 border border-cyber-800 hover:border-amber-500/40
                text-amber-400 rounded-xl transition-colors"
              title="Submit verdict"
            >
              <Target className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ScoreBar({
  label,
  value,
  max,
  color,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center space-x-1.5 text-cyber-400">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-mono text-white">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-cyber-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function VerdictButton({
  label,
  icon,
  color,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  color: 'red' | 'green';
  onClick: () => void;
}) {
  const styles = color === 'red'
    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
    : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20';

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg border 
        transition-colors text-sm font-medium ${styles}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
