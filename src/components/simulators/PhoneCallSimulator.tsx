// src/components/simulators/PhoneCallSimulator.tsx
// Realistic incoming/active phone call simulator
// Shows the call screen then reveals conversation transcript

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Keyboard,
  User,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PhoneCallContent, ConversationLine } from '@/lib/scenarios/types';

// ============================================
// TYPES
// ============================================

interface PhoneCallSimulatorProps {
  call: PhoneCallContent;
  className?: string;
}

type CallPhase = 'ringing' | 'active' | 'transcript';

// ============================================
// HELPERS
// ============================================

function formatDuration(seconds: number): string {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// INCOMING CALL SCREEN
// ============================================

function RingingScreen({
  callerName,
  callerClaim,
  onAnswer,
  onDecline,
}: {
  callerName: string;
  callerClaim: string;
  onAnswer: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black min-h-[480px] flex flex-col items-center justify-between py-12 px-6">
      {/* Caller info */}
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="h-10 w-10 text-gray-400" />
        </motion.div>
        <h3 className="text-2xl font-light text-white mb-1">{callerName}</h3>
        <p className="text-gray-400 text-sm">Claiming: {callerClaim}</p>

        <motion.p
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-green-400 text-sm mt-4"
        >
          Incoming Call...
        </motion.p>
      </div>

      {/* Answer/Decline buttons */}
      <div className="flex items-center space-x-16">
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={onDecline}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="h-7 w-7 text-white" />
          </button>
          <span className="text-xs text-gray-400">Decline</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <motion.button
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            onClick={onAnswer}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg shadow-green-500/30"
          >
            <Phone className="h-7 w-7 text-white" />
          </motion.button>
          <span className="text-xs text-gray-400">Accept</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ACTIVE CALL SCREEN
// ============================================

function ActiveCallScreen({
  callerName,
  callerClaim,
  duration,
  onRevealTranscript,
}: {
  callerName: string;
  callerClaim: string;
  duration: number;
  onRevealTranscript: () => void;
}) {
  let [muted, setMuted] = useState(false);
  let [speaker, setSpeaker] = useState(false);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black min-h-[480px] flex flex-col items-center justify-between py-10 px-6">
      {/* Caller info */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-light text-white mb-1">{callerName}</h3>
        <p className="text-gray-500 text-sm">{callerClaim}</p>
        <div className="flex items-center justify-center space-x-1.5 mt-3 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-mono">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Call controls */}
      <div className="w-full max-w-xs">
        <div className="grid grid-cols-3 gap-6 mb-10">
          <CallControl
            icon={muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            label={muted ? 'Unmute' : 'Mute'}
            active={muted}
            onClick={() => setMuted(!muted)}
          />
          <CallControl
            icon={<Keyboard className="h-6 w-6" />}
            label="Keypad"
            onClick={() => {}}
          />
          <CallControl
            icon={<Volume2 className="h-6 w-6" />}
            label="Speaker"
            active={speaker}
            onClick={() => setSpeaker(!speaker)}
          />
        </div>

        {/* View transcript button */}
        <button
          onClick={onRevealTranscript}
          className="w-full py-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors mb-6"
        >
          View Call Transcript
        </button>

        {/* End call */}
        <div className="flex justify-center">
          <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors shadow-lg shadow-red-500/30">
            <PhoneOff className="h-7 w-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CallControl({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-1.5">
      <button
        onClick={onClick}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center transition-colors',
          active
            ? 'bg-white text-gray-900'
            : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
        )}
      >
        {icon}
      </button>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

// ============================================
// CONVERSATION TRANSCRIPT VIEW
// ============================================

function TranscriptView({
  callerName,
  lines,
  context,
}: {
  callerName: string;
  lines: ConversationLine[];
  context: string;
}) {
  return (
    <div className="bg-[#1c1c1e] min-h-[480px] p-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-800">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <Phone className="h-4 w-4 text-green-400" />
        </div>
        <div>
          <span className="text-sm text-white font-medium">Call Transcript</span>
          <span className="text-[11px] text-gray-500 block">with {callerName}</span>
        </div>
      </div>

      {/* Context */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700/30">
        <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          <Clock className="h-3 w-3" />
          <span>Situation</span>
        </div>
        <p className="text-sm text-gray-300 italic">{context}</p>
      </div>

      {/* Conversation */}
      <div className="space-y-3">
        {lines.map((line, i) => {
          let isCaller = line.speaker === 'caller';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={cn('flex', isCaller ? 'justify-start' : 'justify-end')}
            >
              <div className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5',
                isCaller
                  ? 'bg-[#262628] rounded-tl-md'
                  : 'bg-blue-600 rounded-tr-md'
              )}>
                {isCaller && (
                  <span className="text-[10px] text-red-400/80 uppercase tracking-wider font-medium block mb-1">
                    {callerName}
                  </span>
                )}
                <p className={cn(
                  'text-[14px] leading-relaxed',
                  isCaller ? 'text-gray-200' : 'text-white'
                )}>
                  {line.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN PHONE CALL SIMULATOR
// ============================================

export default function PhoneCallSimulator({ call, className = '' }: PhoneCallSimulatorProps) {
  let [phase, setPhase] = useState<CallPhase>('ringing');
  let [callDuration, setCallDuration] = useState(0);

  // Timer when call is active
  useEffect(() => {
    if (phase !== 'active') return;
    let interval = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className={cn(
      'max-w-sm mx-auto',
      className
    )}>
      {/* Phone frame */}
      <div className="bg-black rounded-[2rem] p-1 shadow-2xl border border-gray-800 overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-1.5 bg-gray-900">
          <span className="text-white text-xs font-semibold">9:47</span>
          <div className="w-24 h-5 bg-black rounded-full mx-auto" />
          <div className="flex items-center space-x-1">
            <div className="flex space-x-0.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn(
                  'w-0.5 rounded-sm',
                  i <= 3 ? 'bg-white' : 'bg-gray-600'
                )} style={{ height: `${6 + i * 2}px` }} />
              ))}
            </div>
            <span className="text-white text-[10px] ml-0.5">5G</span>
          </div>
        </div>

        {/* Call content */}
        <AnimatePresence mode="wait">
          {phase === 'ringing' && (
            <motion.div
              key="ringing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RingingScreen
                callerName={call.callerName}
                callerClaim={call.callerClaim}
                onAnswer={() => setPhase('active')}
                onDecline={() => setPhase('transcript')}
              />
            </motion.div>
          )}

          {phase === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActiveCallScreen
                callerName={call.callerName}
                callerClaim={call.callerClaim}
                duration={callDuration}
                onRevealTranscript={() => setPhase('transcript')}
              />
            </motion.div>
          )}

          {phase === 'transcript' && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TranscriptView
                callerName={call.callerName}
                lines={call.conversation}
                context={call.scenario}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase indicator */}
        <div className="bg-[#1c1c1e] border-t border-gray-800 px-4 py-2">
          <div className="flex items-center justify-center space-x-4">
            {(['ringing', 'active', 'transcript'] as CallPhase[]).map(p => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={cn(
                  'text-[10px] px-2.5 py-1 rounded-full transition-colors capitalize',
                  phase === p
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-600 hover:text-gray-400'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2 bg-black">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
