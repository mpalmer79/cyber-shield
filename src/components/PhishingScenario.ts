'use client';

import { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Link2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Paperclip,
  ExternalLink,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PhishingScenario, EmailScenario, SMSScenario, URLScenario } from '@/types';

interface PhishingScenarioProps {
  scenario: PhishingScenario;
  onAnswer: (answer: boolean) => void;
  showResult?: boolean;
  userAnswer?: boolean;
}

export default function PhishingScenarioComponent({
  scenario,
  onAnswer,
  showResult = false,
  userAnswer,
}: PhishingScenarioProps) {
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);

  const isCorrect = showResult && userAnswer === scenario.isPhishing;

  const toggleRedFlag = (flag: string) => {
    setSelectedRedFlags((prev) =>
      prev.includes(flag)
        ? prev.filter((f) => f !== flag)
        : [...prev, flag]
    );
  };

  const renderEmailScenario = (content: EmailScenario) => (
    <div className="cyber-card overflow-hidden">
      {/* Email Header */}
      <div className="bg-cyber-800/50 px-4 py-3 border-b border-cyber-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-cyber-500" />
            <span className="text-xs text-cyber-500">EMAIL</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-cyber-600">
            <Clock className="h-3 w-3" />
            <span>{new Date(content.timestamp).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-start">
            <span className="text-xs text-cyber-500 w-16">From:</span>
            <div className="flex-1">
              <span className="text-sm text-cyber-200">{content.from}</span>
              <span className="text-xs text-cyber-500 ml-2">&lt;{content.fromEmail}&gt;</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-xs text-cyber-500 w-16">To:</span>
            <span className="text-sm text-cyber-300">{content.to}</span>
          </div>
          <div className="flex items-start">
            <span className="text-xs text-cyber-500 w-16">Subject:</span>
            <span className="text-sm text-cyber-100 font-medium">{content.subject}</span>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="p-4">
        <div 
          className="text-sm text-cyber-200 whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.body.replace(/\n/g, '<br/>') }}
        />

        {/* Attachments */}
        {content.attachments && content.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cyber-700/50">
            <div className="flex items-center space-x-2 text-xs text-cyber-500 mb-2">
              <Paperclip className="h-3 w-3" />
              <span>Attachments ({content.attachments.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-cyber-800/50 rounded border border-cyber-700/50 text-xs text-cyber-300"
                >
                  <Paperclip className="h-3 w-3" />
                  <span>{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSMSScenario = (content: SMSScenario) => (
    <div className="cyber-card overflow-hidden max-w-sm mx-auto">
      {/* Phone Header */}
      <div className="bg-cyber-800/50 px-4 py-3 border-b border-cyber-700/50 text-center">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <MessageSquare className="h-4 w-4 text-cyber-500" />
          <span className="text-xs text-cyber-500">TEXT MESSAGE</span>
        </div>
        <span className="text-sm text-cyber-300 font-medium">{content.sender}</span>
      </div>

      {/* Message */}
      <div className="p-4">
        <div className="bg-cyber-800/80 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
          <p className="text-sm text-cyber-100">{content.message}</p>
        </div>
        <div className="text-xs text-cyber-600 mt-2 ml-1">
          {new Date(content.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  const renderURLScenario = (content: URLScenario) => (
    <div className="cyber-card overflow-hidden">
      <div className="bg-cyber-800/50 px-4 py-3 border-b border-cyber-700/50">
        <div className="flex items-center space-x-2">
          <Link2 className="h-4 w-4 text-cyber-500" />
          <span className="text-xs text-cyber-500">URL ANALYSIS</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <span className="text-xs text-cyber-500 block mb-2">Context:</span>
          <p className="text-sm text-cyber-300">{content.context}</p>
        </div>

        <div>
          <span className="text-xs text-cyber-500 block mb-2">URL to analyze:</span>
          <div className="flex items-center space-x-2 p-3 bg-cyber-800/50 rounded-lg border border-cyber-700/50">
            <ExternalLink className="h-4 w-4 text-cyber-500 flex-shrink-0" />
            <code className="text-sm text-cyber-200 break-all font-mono">
              {content.displayUrl || content.url}
            </code>
          </div>
          {content.displayUrl && content.displayUrl !== content.url && (
            <div className="mt-2 text-xs text-cyber-500">
              Actual URL: <code className="text-cyber-400">{content.url}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Scenario Display */}
      <div className="relative">
        {scenario.type === 'email' && renderEmailScenario(scenario.content as EmailScenario)}
        {scenario.type === 'sms' && renderSMSScenario(scenario.content as SMSScenario)}
        {scenario.type === 'url' && renderURLScenario(scenario.content as URLScenario)}
      </div>

      {/* Action Buttons */}
      {!showResult && (
        <div className="space-y-4">
          <p className="text-center text-cyber-300 text-sm">
            Is this a phishing attempt?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onAnswer(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 font-medium transition-all duration-200"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Phishing</span>
            </button>
            <button
              onClick={() => onAnswer(false)}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 font-medium transition-all duration-200"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Legitimate</span>
            </button>
          </div>
        </div>
      )}

      {/* Result Display */}
      {showResult && (
        <div className="space-y-4">
          {/* Correct/Incorrect Banner */}
          <div
            className={cn(
              'flex items-center justify-center space-x-2 py-3 rounded-lg',
              isCorrect
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-red-500/20 border border-red-500/50'
            )}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="font-medium text-green-400">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="font-medium text-red-400">Incorrect</span>
              </>
            )}
          </div>

          {/* Explanation */}
          <div className="cyber-card p-4">
            <h4 className="font-medium text-cyber-200 mb-2">
              This {scenario.isPhishing ? 'IS' : 'is NOT'} a phishing attempt
            </h4>
            <p className="text-sm text-cyber-400">{scenario.explanation}</p>
          </div>

          {/* Red Flags */}
          {scenario.isPhishing && scenario.redFlags.length > 0 && (
            <div className="cyber-card p-4">
              <h4 className="font-medium text-cyber-200 mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span>Red Flags to Notice</span>
              </h4>
              <ul className="space-y-2">
                {scenario.redFlags.map((flag, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-sm text-cyber-300"
                  >
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
