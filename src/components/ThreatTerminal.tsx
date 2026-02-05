'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Wifi, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalLine {
  id: number;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  timestamp: string;
}

// realistic-looking threat detection log entries
const logEntries = [
  { text: '[SCAN] Analyzing incoming email from hr-dept@c0mpany.net...', type: 'info' as const },
  { text: '[DETECTED] Phishing attempt — sender domain spoofed', type: 'error' as const },
  { text: '[BLOCKED] Malicious attachment quarantined: invoice_final.exe', type: 'success' as const },
  { text: '[SCAN] Evaluating URL: https://secure-l0gin.accounts-verify.cc', type: 'info' as const },
  { text: '[DETECTED] Credential harvesting page — SSL mismatch', type: 'error' as const },
  { text: '[ALERT] Social engineering attempt on ext. 4401 — caller posing as IT', type: 'warning' as const },
  { text: '[BLOCKED] Unauthorized data export attempt — 2.4MB flagged', type: 'success' as const },
  { text: '[SCAN] SMS received: "Your package is held at customs, click to verify"', type: 'info' as const },
  { text: '[DETECTED] Smishing attack — shortened URL redirects to phishing kit', type: 'error' as const },
  { text: '[UPDATE] Threat signatures refreshed — 14 new patterns loaded', type: 'system' as const },
  { text: '[SCAN] Login attempt from unrecognized device — Bucharest, RO', type: 'info' as const },
  { text: '[BLOCKED] Brute force attempt — IP 185.43.xx.xx blacklisted', type: 'success' as const },
  { text: '[ALERT] Employee clicked simulated phishing link — training triggered', type: 'warning' as const },
  { text: '[SCAN] Attachment analysis: Q3_Report_v2.docm contains macro', type: 'info' as const },
  { text: '[DETECTED] Macro-enabled malware dropper — VBA obfuscation found', type: 'error' as const },
  { text: '[BLOCKED] Outbound connection to known C2 server prevented', type: 'success' as const },
  { text: '[SYSTEM] Adaptive engine recalibrated — targeting urgency tactics', type: 'system' as const },
  { text: '[SCAN] Reviewing email: "URGENT: Wire transfer needed by EOD"', type: 'info' as const },
  { text: '[DETECTED] BEC attack — CEO impersonation, mismatched reply-to', type: 'error' as const },
  { text: '[ALERT] Tailgating attempt detected at server room — badge #1847', type: 'warning' as const },
];

function getTimestamp(): string {
  let now = new Date();
  let h = String(now.getHours()).padStart(2, '0');
  let m = String(now.getMinutes()).padStart(2, '0');
  let s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function ThreatTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [entryIdx, setEntryIdx] = useState(0);
  const [threatCount, setThreatCount] = useState(47);
  const [scanCount, setScanCount] = useState(1283);
  const scrollRef = useRef<HTMLDivElement>(null);

  // seed a few initial lines so it doesn't start empty
  useEffect(() => {
    let seed: TerminalLine[] = [];
    for (let i = 0; i < 6; i++) {
      let entry = logEntries[i];
      seed.push({
        id: i,
        text: entry.text,
        type: entry.type,
        timestamp: getTimestamp(),
      });
    }
    setLines(seed);
    setEntryIdx(6);
  }, []);

  // add a new line every 2.5 seconds
  useEffect(() => {
    let timer = setInterval(() => {
      setEntryIdx(prev => {
        let nextIdx = prev >= logEntries.length ? 0 : prev;
        let entry = logEntries[nextIdx];

        let newLine: TerminalLine = {
          id: Date.now(),
          text: entry.text,
          type: entry.type,
          timestamp: getTimestamp(),
        };

        setLines(current => {
          let updated = [...current, newLine];
          // keep max 12 visible lines
          if (updated.length > 12) {
            updated = updated.slice(updated.length - 12);
          }
          return updated;
        });

        // bump stats on certain types
        if (entry.type === 'error' || entry.type === 'warning') {
          setThreatCount(c => c + 1);
        }
        if (entry.type === 'info') {
          setScanCount(c => c + 1);
        }

        return nextIdx + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  let colorMap = {
    info: 'text-cyan-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    system: 'text-cyber-400',
  };

  let glowMap = {
    info: '',
    success: 'drop-shadow-[0_0_3px_rgba(34,197,94,0.4)]',
    warning: 'drop-shadow-[0_0_3px_rgba(234,179,8,0.4)]',
    error: 'drop-shadow-[0_0_3px_rgba(239,68,68,0.4)]',
    system: 'drop-shadow-[0_0_3px_rgba(20,184,166,0.4)]',
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Glow backdrop */}
      <div className="absolute -inset-4 bg-cyber-500/5 rounded-2xl blur-xl" />

      <div className="relative bg-cyber-950/90 border border-cyber-700/60 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl shadow-cyber-500/10">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-cyber-900/80 border-b border-cyber-700/50">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-cyber-500 ml-2">threat-monitor v2.1</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Wifi className="h-3 w-3 text-green-400" />
            <span className="text-xs font-mono text-green-400">LIVE</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-900/50 border-b border-cyber-800/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-cyber-400" />
              <span className="text-xs font-mono text-cyber-300">
                Scans: <span className="text-cyber-400 font-semibold">{scanCount.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              <span className="text-xs font-mono text-cyber-300">
                Threats: <span className="text-red-400 font-semibold">{threatCount}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-cyber-500">monitoring</span>
          </div>
        </div>

        {/* Terminal Output */}
        <div
          ref={scrollRef}
          className="h-72 overflow-hidden px-4 py-3 space-y-1"
        >
          {lines.map((line, idx) => {
            let isLatest = idx === lines.length - 1;
            return (
              <div
                key={line.id}
                className={cn(
                  'flex items-start space-x-2 font-mono text-xs leading-relaxed transition-opacity duration-500',
                  isLatest ? 'opacity-100' : 'opacity-70'
                )}
              >
                <span className="text-cyber-700 flex-shrink-0 select-none">{line.timestamp}</span>
                <span className={cn(colorMap[line.type], glowMap[line.type])}>
                  {line.text}
                </span>
              </div>
            );
          })}

          {/* Blinking cursor */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-cyber-700">{getTimestamp()}</span>
            <span className="text-cyber-500">
              {'>'} <span className="animate-pulse">_</span>
            </span>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent" />
      </div>
    </div>
  );
}
