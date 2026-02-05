// src/components/simulators/SMSSimulator.tsx
// Realistic iPhone-style text message simulator
// Renders SMS phishing scenarios in a phone message bubble interface

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Phone,
  Video,
  Info,
  ExternalLink,
  ShieldAlert,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SMSContent } from '@/lib/scenarios/types';

// ============================================
// TYPES
// ============================================

interface SMSSimulatorProps {
  sms: SMSContent;
  className?: string;
}

// ============================================
// HELPERS
// ============================================

// Parse URLs out of message text
function parseMessageParts(message: string): Array<{ type: 'text' | 'url'; value: string }> {
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  let parts: Array<{ type: 'text' | 'url'; value: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: message.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'url', value: match[1] });
    lastIndex = match.index + match[1].length;
  }

  if (lastIndex < message.length) {
    parts.push({ type: 'text', value: message.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', value: message }];
}

function parseDomain(url: string): string {
  try {
    let match = url.match(/https?:\/\/([^/]+)/);
    return match ? match[1] : url;
  } catch {
    return url;
  }
}

function getTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '9:47 AM';
  }
}

// Is this a shortcode (5-6 digit number) or regular number?
function isShortCode(sender: string): boolean {
  let cleaned = sender.replace(/[^0-9]/g, '');
  return cleaned.length >= 4 && cleaned.length <= 6;
}

// Format sender as a phone-style display
function formatSender(sender: string): string {
  // If it looks like a phone number, format it
  let cleaned = sender.replace(/[^0-9+]/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return sender;
}

// ============================================
// URL PREVIEW CARD (in-bubble link preview)
// ============================================

function LinkPreviewCard({ url, expanded, onToggle }: { url: string; expanded: boolean; onToggle: () => void }) {
  let domain = parseDomain(url);

  return (
    <div className="mt-2">
      <button
        onClick={onToggle}
        className="w-full bg-[#1c1c1e] rounded-xl overflow-hidden text-left border border-gray-700/30"
      >
        {/* Link preview block */}
        <div className="px-3 py-2.5">
          <div className="flex items-center space-x-2 mb-1">
            <ExternalLink className="h-3 w-3 text-gray-500 shrink-0" />
            <span className="text-[11px] text-gray-500 truncate">{domain}</span>
          </div>
          <p className="text-[13px] text-blue-400 break-all leading-snug">{url}</p>
        </div>
      </button>

      {/* Expanded URL inspection */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-gray-900 border border-gray-700/50 rounded-lg mt-1 p-2.5 overflow-hidden"
        >
          <div className="flex items-center space-x-1.5 mb-1.5">
            <ShieldAlert className="h-3 w-3 text-yellow-400" />
            <span className="text-[10px] text-yellow-400 font-medium uppercase tracking-wider">URL Inspector</span>
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex">
              <span className="text-gray-600 w-16 shrink-0">Full URL:</span>
              <span className="text-gray-300 break-all">{url}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-16 shrink-0">Domain:</span>
              <span className="text-yellow-300">{domain}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-16 shrink-0">Protocol:</span>
              <span className={cn(
                url.startsWith('https') ? 'text-green-400' : 'text-red-400'
              )}>
                {url.startsWith('https') ? 'HTTPS (encrypted)' : 'HTTP (not encrypted)'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// MAIN SMS SIMULATOR
// ============================================

export default function SMSSimulator({ sms, className = '' }: SMSSimulatorProps) {
  let [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  let messageParts = parseMessageParts(sms.message);
  let hasUrl = messageParts.some(p => p.type === 'url');
  let shortCode = isShortCode(sms.sender);
  let time = getTimestamp(sms.timestamp);

  return (
    <div className={cn(
      'max-w-sm mx-auto',
      className
    )}>
      {/* iPhone frame */}
      <div className="bg-black rounded-[2rem] p-1 shadow-2xl border border-gray-800">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-1.5">
          <span className="text-white text-xs font-semibold">9:47</span>
          <div className="w-24 h-5 bg-black rounded-full mx-auto" /> {/* Notch/Dynamic Island */}
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
            <svg className="w-5 h-3" viewBox="0 0 25 12">
              <rect x="0" y="0" width="22" height="12" rx="2" stroke="white" strokeWidth="1" fill="none" />
              <rect x="2" y="2" width="14" height="8" rx="1" fill="white" />
              <rect x="23" y="4" width="2" height="4" rx="1" fill="white" />
            </svg>
          </div>
        </div>

        {/* Messages nav bar */}
        <div className="bg-[#1c1c1e] border-b border-gray-800">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-1 text-blue-400">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Messages</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-400">
              <Video className="h-5 w-5" />
              <Phone className="h-5 w-5" />
              <Info className="h-5 w-5" />
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-center pb-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mb-1">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <span className="text-white text-sm font-medium">{formatSender(sms.sender)}</span>
            {shortCode && (
              <span className="text-gray-500 text-[11px] mt-0.5">Short Code</span>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="bg-black min-h-[280px] p-3 flex flex-col justify-end">
          {/* Date stamp */}
          <div className="text-center mb-4">
            <span className="text-[11px] text-gray-600">Today {time}</span>
          </div>

          {/* The message bubble */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[85%]"
          >
            <div className="bg-[#262628] rounded-2xl rounded-tl-md px-3.5 py-2.5">
              <p className="text-[15px] text-white leading-relaxed">
                {messageParts.map((part, i) => {
                  if (part.type === 'url') {
                    return (
                      <span
                        key={i}
                        className="text-blue-400 underline cursor-pointer break-all"
                        onClick={() => setExpandedUrl(
                          expandedUrl === part.value ? null : part.value
                        )}
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={i}>{part.value}</span>;
                })}
              </p>

              {/* Inline link preview */}
              {messageParts
                .filter(p => p.type === 'url')
                .map((p, i) => (
                  <LinkPreviewCard
                    key={i}
                    url={p.value}
                    expanded={expandedUrl === p.value}
                    onToggle={() => setExpandedUrl(
                      expandedUrl === p.value ? null : p.value
                    )}
                  />
                ))
              }
            </div>

            {/* Delivery info */}
            <div className="flex items-center space-x-1 mt-1 ml-1">
              <span className="text-[10px] text-gray-600">{time}</span>
              {shortCode && (
                <span className="text-[10px] text-gray-700">• Short Code</span>
              )}
            </div>
          </motion.div>

          {/* Tap link hint */}
          {hasUrl && !expandedUrl && (
            <div className="text-center mt-4">
              <span className="text-[10px] text-gray-700">Tap any link to inspect the URL</span>
            </div>
          )}
        </div>

        {/* iMessage input bar */}
        <div className="bg-[#1c1c1e] border-t border-gray-800 px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-lg">+</span>
            </div>
            <div className="flex-1 bg-[#2c2c2e] rounded-full px-4 py-1.5">
              <span className="text-gray-600 text-sm">Text Message</span>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
