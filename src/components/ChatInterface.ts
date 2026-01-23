'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertTriangle, ShieldCheck, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showSuspicionMeter?: boolean;
  suspicionLevel?: number;
  quickResponses?: string[];
  onReportAttack?: () => void;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Type your response...',
  disabled = false,
  showSuspicionMeter = false,
  suspicionLevel = 0,
  quickResponses = [],
  onReportAttack,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickResponse = (response: string) => {
    if (!isLoading && !disabled) {
      onSendMessage(response);
    }
  };

  const getSuspicionColor = (level: number) => {
    if (level < 30) return 'text-green-400';
    if (level < 60) return 'text-yellow-400';
    if (level < 80) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSuspicionBg = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    if (level < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Suspicion Meter */}
      {showSuspicionMeter && (
        <div className="px-4 py-3 border-b border-cyber-700/50 bg-cyber-900/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-cyber-400" />
              <span className="text-sm text-cyber-300">Suspicion Level</span>
            </div>
            <span className={cn('text-sm font-medium', getSuspicionColor(suspicionLevel))}>
              {suspicionLevel}%
            </span>
          </div>
          <div className="h-2 bg-cyber-800 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500', getSuspicionBg(suspicionLevel))}
              style={{ width: `${suspicionLevel}%` }}
            />
          </div>
          {suspicionLevel >= 70 && (
            <p className="text-xs text-yellow-400 mt-2 flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>High suspicion! Consider reporting this as a potential attack.</span>
            </p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start space-x-3',
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.role === 'user'
                  ? 'bg-cyber-600'
                  : message.metadata?.isAttack
                  ? 'bg-red-500/20 border border-red-500/50'
                  : 'bg-cyber-800 border border-cyber-700'
              )}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-cyber-100" />
              ) : (
                <Bot className={cn(
                  'h-4 w-4',
                  message.metadata?.isAttack ? 'text-red-400' : 'text-cyber-400'
                )} />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={cn(
                'max-w-[75%] rounded-2xl px-4 py-2.5',
                message.role === 'user'
                  ? 'bg-cyber-600 text-cyber-50 rounded-tr-none'
                  : 'bg-cyber-800/80 text-cyber-200 rounded-tl-none border border-cyber-700/50'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Red flag indicator */}
              {message.metadata?.redFlagTriggered && (
                <div className="mt-2 pt-2 border-t border-cyber-700/50 flex items-center space-x-1 text-xs text-yellow-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Potential manipulation detected</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyber-800 border border-cyber-700 flex items-center justify-center">
              <Bot className="h-4 w-4 text-cyber-400" />
            </div>
            <div className="bg-cyber-800/80 rounded-2xl rounded-tl-none px-4 py-3 border border-cyber-700/50">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-cyber-400 animate-spin" />
                <span className="text-sm text-cyber-400">Typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      {quickResponses.length > 0 && (
        <div className="px-4 py-2 border-t border-cyber-700/50 bg-cyber-900/30">
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                disabled={isLoading || disabled}
                className="px-3 py-1.5 text-xs bg-cyber-800/50 hover:bg-cyber-700/50 border border-cyber-700/50 rounded-full text-cyber-300 transition-colors disabled:opacity-50"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report Attack Button */}
      {onReportAttack && (
        <div className="px-4 py-2 border-t border-cyber-700/50 bg-cyber-900/30">
          <button
            onClick={onReportAttack}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Report as Social Engineering Attack</span>
          </button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-cyber-700/50 bg-cyber-900/50">
        <div className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            className="flex-1 cyber-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200',
              input.trim() && !isLoading && !disabled
                ? 'bg-cyber-600 hover:bg-cyber-500 text-cyber-50'
                : 'bg-cyber-800 text-cyber-600 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
