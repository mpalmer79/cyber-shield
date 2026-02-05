// src/components/simulators/EmailSimulator.tsx
// Pixel-perfect email client simulator for phishing training
// Renders emails as they'd appear in Outlook/Gmail so users train
// in the same visual environment they encounter real threats

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Trash2,
  Archive,
  CornerUpLeft,
  CornerUpRight,
  MoreHorizontal,
  Paperclip,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Printer,
  ExternalLink,
  Shield,
  Info,
  X,
  Inbox,
  Send as SendIcon,
  File,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Clock,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EmailContent } from '@/lib/scenarios/types';

// ============================================
// TYPES
// ============================================

interface EmailSimulatorProps {
  email: EmailContent;
  className?: string;
}

// ============================================
// HELPERS
// ============================================

function getInitials(name: string): string {
  let parts = name.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(email: string): string {
  // Deterministic color from email string
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colors = [
    'bg-blue-600', 'bg-red-500', 'bg-green-600', 'bg-purple-600',
    'bg-orange-500', 'bg-teal-600', 'bg-pink-500', 'bg-indigo-600',
  ];
  return colors[Math.abs(hash) % colors.length];
}

function getFileIcon(filename: string) {
  let ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext)) return <FileText className="h-5 w-5 text-red-400" />;
  if (['doc', 'docx'].includes(ext)) return <FileText className="h-5 w-5 text-blue-400" />;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return <ImageIcon className="h-5 w-5 text-purple-400" />;
  if (['exe', 'bat', 'cmd', 'scr', 'js', 'vbs'].includes(ext)) return <AlertTriangle className="h-5 w-5 text-red-500" />;
  if (['zip', 'rar', '7z', 'tar'].includes(ext)) return <Archive className="h-5 w-5 text-yellow-400" />;
  return <File className="h-5 w-5 text-gray-400" />;
}

function isDangerousExtension(filename: string): boolean {
  let dangerous = ['exe', 'bat', 'cmd', 'scr', 'js', 'vbs', 'wsf', 'ps1', 'msi'];
  let ext = filename.split('.').pop()?.toLowerCase() || '';
  // Also detect double extensions like "invoice.pdf.exe"
  let parts = filename.split('.');
  if (parts.length > 2) return true;
  return dangerous.includes(ext);
}

// Extract URLs from email body text
function extractUrls(text: string): string[] {
  let urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
  return text.match(urlRegex) || [];
}

// Parse domain from URL
function parseDomain(url: string): string {
  try {
    let match = url.match(/https?:\/\/([^/]+)/);
    return match ? match[1] : url;
  } catch {
    return url;
  }
}

// Format email body with interactive hoverable links
function formatBodyWithLinks(
  body: string,
  onLinkHover: (url: string, rect: DOMRect) => void,
  onLinkLeave: () => void
): React.ReactNode[] {
  let urls = extractUrls(body);
  if (urls.length === 0) {
    return body.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < body.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  }

  let result: React.ReactNode[] = [];
  let remaining = body;
  let keyIdx = 0;

  for (let url of urls) {
    let idx = remaining.indexOf(url);
    if (idx === -1) continue;

    // Text before URL
    let before = remaining.slice(0, idx);
    before.split('\n').forEach((line, i, arr) => {
      result.push(<React.Fragment key={`t-${keyIdx++}`}>{line}</React.Fragment>);
      if (i < arr.length - 1) result.push(<br key={`br-${keyIdx++}`} />);
    });

    // The URL itself (interactive)
    result.push(
      <span
        key={`url-${keyIdx++}`}
        className="text-blue-400 underline cursor-pointer hover:text-blue-300 relative inline"
        onMouseEnter={(e) => {
          let rect = e.currentTarget.getBoundingClientRect();
          onLinkHover(url, rect);
        }}
        onMouseLeave={onLinkLeave}
        onClick={(e) => e.preventDefault()}
      >
        {url}
      </span>
    );

    remaining = remaining.slice(idx + url.length);
  }

  // Remaining text after last URL
  if (remaining) {
    remaining.split('\n').forEach((line, i, arr) => {
      result.push(<React.Fragment key={`r-${keyIdx++}`}>{line}</React.Fragment>);
      if (i < arr.length - 1) result.push(<br key={`rbr-${keyIdx++}`} />);
    });
  }

  return result;
}

// ============================================
// URL PREVIEW TOOLTIP
// ============================================

function LinkPreviewTooltip({
  url,
  position,
}: {
  url: string;
  position: { x: number; y: number };
}) {
  let domain = parseDomain(url);
  let isSuspicious = domain.includes('-') || domain.split('.').length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y + 28 }}
    >
      <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl px-3 py-2 max-w-xs">
        <div className="flex items-center space-x-2 mb-1">
          <ExternalLink className="h-3 w-3 text-gray-400 shrink-0" />
          <span className="text-[11px] text-gray-400">Link destination:</span>
        </div>
        <p className="text-xs font-mono text-blue-300 break-all leading-relaxed">{url}</p>
        <div className="flex items-center space-x-1.5 mt-1.5 pt-1.5 border-t border-gray-700">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isSuspicious ? 'bg-yellow-400' : 'bg-green-400'
          )} />
          <span className={cn(
            'text-[10px]',
            isSuspicious ? 'text-yellow-400' : 'text-green-400'
          )}>
            {isSuspicious ? 'Unusual domain structure' : 'Standard domain'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// HEADER INSPECTOR PANEL
// ============================================

function HeaderInspector({ email }: { email: EmailContent }) {
  let domain = email.fromEmail.split('@')[1] || 'unknown';
  let displayDomain = email.from.toLowerCase().replace(/\s+/g, '');

  // Detect mismatches for training
  let domainMismatch = !domain.includes(displayDomain.split('.')[0]) &&
    !displayDomain.includes(domain.split('.')[0]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3 mt-2 mb-1 font-mono text-xs space-y-1.5">
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <Shield className="h-3 w-3" />
          <span>Email Header Details</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">From:</span>
          <span className="text-gray-300">{email.from} &lt;{email.fromEmail}&gt;</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">Reply-To:</span>
          <span className="text-gray-300">{email.fromEmail}</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">To:</span>
          <span className="text-gray-300">{email.to}</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">Date:</span>
          <span className="text-gray-300">
            {new Date(email.timestamp).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">Domain:</span>
          <span className={cn(
            domainMismatch ? 'text-yellow-400' : 'text-gray-300'
          )}>
            {domain}
            {domainMismatch && (
              <span className="text-yellow-500 ml-2 text-[10px]">⚠ Domain may not match sender name</span>
            )}
          </span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">SPF:</span>
          <span className="text-gray-400">Not available in training mode</span>
        </div>
        <div className="flex">
          <span className="text-gray-500 w-28 shrink-0">DKIM:</span>
          <span className="text-gray-400">Not available in training mode</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// INBOX SIDEBAR (fake inbox for realism)
// ============================================

function InboxSidebar({ activeSubject, senderName }: { activeSubject: string; senderName: string }) {
  let fakeEmails = [
    { from: 'HR Department', subject: 'Updated Benefits Portal', time: '10:22 AM', unread: false },
    { from: senderName, subject: activeSubject, time: '9:47 AM', unread: true, active: true },
    { from: 'David Kim', subject: 'Re: Project timeline update', time: '8:15 AM', unread: false },
    { from: 'Calendar', subject: 'Reminder: Team standup in 30 min', time: 'Yesterday', unread: false },
    { from: 'IT Helpdesk', subject: 'Ticket #4821 resolved', time: 'Yesterday', unread: false },
  ];

  return (
    <div className="w-56 border-r border-gray-700/50 shrink-0 hidden lg:block">
      {/* Folders */}
      <div className="p-2 space-y-0.5">
        <div className="flex items-center space-x-2 px-2 py-1.5 bg-blue-500/10 rounded text-blue-400 text-xs font-medium">
          <Inbox className="h-3.5 w-3.5" />
          <span>Inbox</span>
          <span className="ml-auto text-[10px] bg-blue-500/20 px-1.5 rounded-full">1</span>
        </div>
        <div className="flex items-center space-x-2 px-2 py-1.5 text-gray-500 text-xs hover:bg-gray-800/50 rounded cursor-default">
          <Star className="h-3.5 w-3.5" />
          <span>Starred</span>
        </div>
        <div className="flex items-center space-x-2 px-2 py-1.5 text-gray-500 text-xs hover:bg-gray-800/50 rounded cursor-default">
          <SendIcon className="h-3.5 w-3.5" />
          <span>Sent</span>
        </div>
        <div className="flex items-center space-x-2 px-2 py-1.5 text-gray-500 text-xs hover:bg-gray-800/50 rounded cursor-default">
          <Trash2 className="h-3.5 w-3.5" />
          <span>Trash</span>
        </div>
      </div>

      {/* Email list */}
      <div className="border-t border-gray-700/50 mt-1">
        {fakeEmails.map((e, i) => (
          <div
            key={i}
            className={cn(
              'px-3 py-2.5 border-b border-gray-800/50 cursor-default',
              e.active
                ? 'bg-blue-500/10 border-l-2 border-l-blue-400'
                : 'hover:bg-gray-800/30'
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                'text-xs truncate',
                e.unread ? 'text-white font-semibold' : 'text-gray-400'
              )}>
                {e.from}
              </span>
              <span className="text-[10px] text-gray-600 shrink-0 ml-2">{e.time}</span>
            </div>
            <p className={cn(
              'text-[11px] truncate mt-0.5',
              e.unread ? 'text-gray-300' : 'text-gray-600'
            )}>
              {e.subject}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN EMAIL SIMULATOR
// ============================================

export default function EmailSimulator({ email, className = '' }: EmailSimulatorProps) {
  let [starred, setStarred] = useState(false);
  let [showHeaders, setShowHeaders] = useState(false);
  let [hoveredLink, setHoveredLink] = useState<{ url: string; pos: { x: number; y: number } } | null>(null);

  let avatarColor = getAvatarColor(email.fromEmail);
  let initials = getInitials(email.from);
  let urls = extractUrls(email.body);
  let hasAttachments = email.attachments && email.attachments.length > 0;

  let handleLinkHover = (url: string, rect: DOMRect) => {
    setHoveredLink({ url, pos: { x: rect.left, y: rect.bottom } });
  };

  return (
    <div className={cn(
      'bg-[#1a1a2e] border border-gray-700/60 rounded-xl overflow-hidden shadow-2xl',
      className
    )}>
      {/* Top toolbar — mimics email client */}
      <div className="bg-[#16162a] px-3 py-2 border-b border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<Archive className="h-4 w-4" />} tooltip="Archive" />
          <ToolbarButton icon={<Trash2 className="h-4 w-4" />} tooltip="Delete" />
          <div className="w-px h-4 bg-gray-700 mx-1" />
          <ToolbarButton icon={<CornerUpLeft className="h-4 w-4" />} tooltip="Reply" />
          <ToolbarButton icon={<CornerUpRight className="h-4 w-4" />} tooltip="Forward" />
        </div>
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<Printer className="h-4 w-4" />} tooltip="Print" />
          <ToolbarButton icon={<MoreHorizontal className="h-4 w-4" />} tooltip="More" />
        </div>
      </div>

      <div className="flex">
        {/* Inbox sidebar */}
        <InboxSidebar activeSubject={email.subject} senderName={email.from} />

        {/* Email content */}
        <div className="flex-1 min-w-0">
          {/* Subject line */}
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-lg font-normal text-gray-100 leading-snug">{email.subject}</h2>
          </div>

          {/* Sender info */}
          <div className="px-5 py-3">
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0',
                avatarColor
              )}>
                {initials}
              </div>

              {/* Sender details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-100">{email.from}</span>
                  <span className="text-xs text-gray-500">&lt;{email.fromEmail}&gt;</span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-gray-500">
                    to {email.to.split('@')[0]}
                  </span>
                  <button
                    onClick={() => setShowHeaders(!showHeaders)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    title="Show email headers"
                  >
                    {showHeaders ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right side: time + star */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs text-gray-500">
                  {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={() => setStarred(!starred)}
                  className="text-gray-600 hover:text-yellow-400 transition-colors"
                >
                  <Star className={cn('h-4 w-4', starred && 'fill-yellow-400 text-yellow-400')} />
                </button>
              </div>
            </div>

            {/* Header inspector */}
            <AnimatePresence>
              {showHeaders && <HeaderInspector email={email} />}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-gray-800/50" />

          {/* Email body */}
          <div className="px-5 py-4">
            <div className="text-sm text-gray-200 leading-relaxed font-sans">
              {formatBodyWithLinks(
                email.body,
                handleLinkHover,
                () => setHoveredLink(null)
              )}
            </div>
          </div>

          {/* Attachments */}
          {hasAttachments && (
            <div className="px-5 pb-4">
              <div className="border-t border-gray-800/50 pt-3">
                <div className="flex items-center space-x-1.5 text-xs text-gray-500 mb-2">
                  <Paperclip className="h-3 w-3" />
                  <span>{email.attachments!.length} Attachment{email.attachments!.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {email.attachments!.map((file, i) => {
                    let dangerous = isDangerousExtension(file);
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-default',
                          dangerous
                            ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                            : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60'
                        )}
                      >
                        {getFileIcon(file)}
                        <div>
                          <span className={cn(
                            'text-xs block',
                            dangerous ? 'text-red-300' : 'text-gray-300'
                          )}>
                            {file}
                          </span>
                          {dangerous && (
                            <span className="text-[9px] text-red-400/70 flex items-center space-x-1">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              <span>Potentially dangerous</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* URL count indicator */}
          {urls.length > 0 && (
            <div className="px-5 pb-3">
              <div className="flex items-center space-x-1.5 text-[11px] text-gray-600">
                <Info className="h-3 w-3" />
                <span>This email contains {urls.length} link{urls.length > 1 ? 's' : ''} — hover to inspect</span>
              </div>
            </div>
          )}

          {/* Inspect headers prompt */}
          {!showHeaders && (
            <div className="px-5 pb-4">
              <button
                onClick={() => setShowHeaders(true)}
                className="flex items-center space-x-1.5 text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
              >
                <Shield className="h-3 w-3" />
                <span>Click ▾ next to sender to inspect email headers</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Link preview tooltip */}
      <AnimatePresence>
        {hoveredLink && (
          <LinkPreviewTooltip
            url={hoveredLink.url}
            position={hoveredLink.pos}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// TOOLBAR BUTTON
// ============================================

function ToolbarButton({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <button
      className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded transition-colors"
      title={tooltip}
      onClick={(e) => e.preventDefault()}
    >
      {icon}
    </button>
  );
}
