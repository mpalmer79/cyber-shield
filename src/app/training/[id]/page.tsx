'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Mail,
  Phone,
  Globe,
  Lock,
  Users,
  Lightbulb,
  Award,
  Target,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';
import { Header, ScoreDisplay } from '@/components';
import CoachingChat from '@/components/CoachingChat';
import { useModulesStore, useSessionStore, useProgressStore, useVulnerabilityStore } from '@/store';
import { useDemoStore } from '@/store/demo-store';
import { generateDemoResponse, resetDemoSession } from '@/lib/demo';
import { cn } from '@/lib/utils';
import { getAdaptiveScenarios, scenarioImages } from '@/lib/scenarios';
import {
  checkAnswer,
  isPhishingJudgment,
  asEmail,
  asSMS,
  asPhoneCall,
  asInPerson,
  asURLEvaluation,
  asPasswordEvaluation,
  asMultipleChoice,
} from '@/lib/scenarios/types';
import type {
  TrainingScenario,
  ScenarioOption,
  URLOption,
  PasswordOption,
  ConversationLine,
} from '@/lib/scenarios/types';
import type { SessionFeedback } from '@/types';
import type { ScenarioResult } from '@/lib/adaptive';
import type { CoachingScoreBreakdown } from '@/lib/coaching';

type TrainingPhase = 'intro' | 'training' | 'results';

// Module header images keyed by module type
const moduleHeaderImages: Record<string, string> = {
  'phishing': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
  'social-engineering': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
  'password-security': 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&q=80',
  'secure-browsing': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
  'incident-response': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  'data-protection': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  'malware-awareness': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
  'threat-hunting': 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1200&q=80',
};

const scenarioIconMap: Record<string, React.ReactNode> = {
  'email': <Mail className="h-6 w-6" />,
  'sms': <Phone className="h-6 w-6" />,
  'phone-call': <Phone className="h-6 w-6" />,
  'url-evaluation': <Globe className="h-6 w-6" />,
  'scenario': <Globe className="h-6 w-6" />,
  'password-evaluation': <Lock className="h-6 w-6" />,
  'in-person': <Users className="h-6 w-6" />,
};

// ============================================
// Sub-Renderers for each scenario type
// Each receives typed content — no `as any`
// ============================================

function EmailRenderer({ scenario }: { scenario: TrainingScenario }) {
  let email = asEmail(scenario);

  return (
    <div className="cyber-card p-6">
      <div className="border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">From:</span>
            <span className="text-white font-medium">{email.from}</span>
            <span className="text-white/50 text-sm">&lt;{email.fromEmail}&gt;</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-white/60 text-sm">To:</span>
          <span className="text-white/80">{email.to}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">Subject:</span>
          <span className="text-white font-semibold">{email.subject}</span>
        </div>
      </div>
      <div className="bg-white/[0.03] rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-white/90 font-sans text-sm leading-relaxed">
          {email.body}
        </pre>
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <span className="text-white/60 text-sm">Attachments: </span>
            <span className="text-yellow-400 text-sm">{email.attachments.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SMSRenderer({ scenario }: { scenario: TrainingScenario }) {
  let sms = asSMS(scenario);

  return (
    <div className="cyber-card p-6">
      <div className="max-w-sm mx-auto">
        <div className="bg-white/[0.03] rounded-2xl p-4">
          <div className="text-center text-white/60 text-sm mb-3">{sms.sender}</div>
          <div className="bg-green-600/20 border border-green-500/30 rounded-2xl rounded-tl-sm p-4">
            <p className="text-white text-sm">{sms.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationRenderer({
  scenario,
  onAnswer,
  selectedAnswer,
  showResult,
}: {
  scenario: TrainingScenario;
  onAnswer: (id: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
}) {
  let isPhone = scenario.type === 'phone-call';
  let lines: ConversationLine[] = [];
  let options: ScenarioOption[] = [];
  let contextText = '';
  let speakerLabel = 'Unknown';

  if (isPhone) {
    let content = asPhoneCall(scenario);
    lines = content.conversation || [];
    options = content.options || [];
    contextText = content.scenario;
    speakerLabel = content.callerName || 'Caller';
  } else {
    let content = asInPerson(scenario);
    lines = content.encounter || [];
    options = content.options || [];
    contextText = content.scenario;
    speakerLabel = 'Stranger';
  }

  return (
    <div className="cyber-card p-6">
      <div className="bg-white/[0.03] rounded-lg p-4 mb-4">
        <p className="text-white/80 italic">{contextText}</p>
      </div>
      <div className="space-y-3 mb-6">
        {lines.map((line, idx) => (
          <div key={idx} className={cn(
            "p-3 rounded-lg",
            line.speaker === 'caller' || line.speaker === 'stranger'
              ? "bg-red-500/10 border border-red-500/20 ml-0 mr-12"
              : "bg-white/[0.05] border border-white/10 ml-12 mr-0"
          )}>
            <span className="text-xs text-white/60 uppercase mb-1 block">{speakerLabel}</span>
            <p className="text-white/90 text-sm">{line.text}</p>
          </div>
        ))}
      </div>
      <OptionsRenderer
        options={options}
        onAnswer={onAnswer}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
      />
    </div>
  );
}

function URLEvaluationRenderer({
  scenario,
  onAnswer,
  selectedAnswer,
  showResult,
}: {
  scenario: TrainingScenario;
  onAnswer: (id: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
}) {
  let content = asURLEvaluation(scenario);

  return (
    <div className="cyber-card p-6">
      <p className="text-white/80 mb-6">{content.instruction}</p>
      <div className="space-y-3">
        {content.urls.map((urlOpt: URLOption) => (
          <button
            key={urlOpt.id}
            onClick={() => onAnswer(urlOpt.id)}
            disabled={showResult}
            className={cn(
              "w-full p-4 rounded-lg text-left transition-all font-mono text-sm",
              showResult
                ? urlOpt.safe
                  ? "bg-green-500/20 border-2 border-green-500"
                  : selectedAnswer === urlOpt.id
                    ? "bg-red-500/20 border-2 border-red-500"
                    : "bg-white/[0.03] border border-white/10 opacity-50"
                : selectedAnswer === urlOpt.id
                  ? "bg-cyber-600/30 border-2 border-cyber-500"
                  : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-white/90">{urlOpt.url}</span>
              {showResult && (
                urlOpt.safe
                  ? <CheckCircle className="h-5 w-5 text-green-400" />
                  : selectedAnswer === urlOpt.id && <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            {showResult && !urlOpt.safe && (
              <p className="text-xs text-red-400 mt-2">{urlOpt.reason}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PasswordEvaluationRenderer({
  scenario,
  onAnswer,
  selectedAnswer,
  showResult,
}: {
  scenario: TrainingScenario;
  onAnswer: (id: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
}) {
  let content = asPasswordEvaluation(scenario);

  return (
    <div className="cyber-card p-6">
      <p className="text-white/80 mb-6">{content.instruction}</p>
      <div className="space-y-3">
        {content.passwords.map((pwd: PasswordOption) => (
          <button
            key={pwd.id}
            onClick={() => onAnswer(pwd.id)}
            disabled={showResult}
            className={cn(
              "w-full p-4 rounded-lg text-left transition-all",
              showResult
                ? pwd.id === content.correctAnswer
                  ? "bg-green-500/20 border-2 border-green-500"
                  : selectedAnswer === pwd.id
                    ? "bg-red-500/20 border-2 border-red-500"
                    : "bg-white/[0.03] border border-white/10 opacity-50"
                : selectedAnswer === pwd.id
                  ? "bg-cyber-600/30 border-2 border-cyber-500"
                  : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
            )}
          >
            <div className="flex items-center justify-between">
              <code className="text-white/90 bg-white/[0.05] px-2 py-1 rounded">{pwd.password}</code>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                pwd.strength === 'strong' ? "bg-green-500/20 text-green-400" :
                pwd.strength === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              )}>
                {pwd.strength}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MultipleChoiceRenderer({
  scenario,
  onAnswer,
  selectedAnswer,
  showResult,
}: {
  scenario: TrainingScenario;
  onAnswer: (id: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
}) {
  let content = asMultipleChoice(scenario);

  return (
    <div className="cyber-card p-6">
      <p className="text-white/80 mb-4">{content.scenario}</p>
      <p className="text-white font-medium mb-6">{content.question}</p>
      <OptionsRenderer
        options={content.options}
        onAnswer={onAnswer}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
      />
    </div>
  );
}

// Shared options grid used by scenario, phone-call, in-person
function OptionsRenderer({
  options,
  onAnswer,
  selectedAnswer,
  showResult,
}: {
  options: ScenarioOption[];
  onAnswer: (id: string) => void;
  selectedAnswer: string | null;
  showResult: boolean;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onAnswer(option.id)}
          disabled={showResult}
          className={cn(
            "w-full p-4 rounded-lg text-left transition-all",
            showResult
              ? option.isCorrect
                ? "bg-green-500/20 border-2 border-green-500"
                : selectedAnswer === option.id
                  ? "bg-red-500/20 border-2 border-red-500"
                  : "bg-white/[0.03] border border-white/10 opacity-50"
              : selectedAnswer === option.id
                ? "bg-cyber-600/30 border-2 border-cyber-500"
                : "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
          )}
        >
          <div className="flex items-start space-x-3">
            <span className="text-white/60 font-medium">{option.id.toUpperCase()}.</span>
            <span className="text-white/90">{option.text}</span>
            {showResult && option.isCorrect && (
              <CheckCircle className="h-5 w-5 text-green-400 ml-auto flex-shrink-0" />
            )}
            {showResult && selectedAnswer === option.id && !option.isCorrect && (
              <XCircle className="h-5 w-5 text-red-400 ml-auto flex-shrink-0" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// Phishing judgment buttons (shared by email and sms)
function PhishingJudgmentButtons({
  onAnswer,
}: {
  onAnswer: (answer: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onAnswer('phishing')}
        className="cyber-card p-6 text-center hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
      >
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <span className="text-lg font-semibold text-white">This is Phishing</span>
        <p className="text-sm text-white/60 mt-1">This looks suspicious</p>
      </button>
      <button
        onClick={() => onAnswer('legitimate')}
        className="cyber-card p-6 text-center hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
      >
        <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <span className="text-lg font-semibold text-white">This is Legitimate</span>
        <p className="text-sm text-white/60 mt-1">This looks safe</p>
      </button>
    </div>
  );
}

// Result feedback after answering
function ResultFeedback({
  scenario,
  wasCorrect,
  onNext,
  isLast,
}: {
  scenario: TrainingScenario;
  wasCorrect: boolean;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Correct/Incorrect Banner */}
      <div className={cn(
        "cyber-card p-6",
        wasCorrect ? "bg-green-500/10 border-green-500/50" : "bg-red-500/10 border-red-500/50"
      )}>
        <div className="flex items-center space-x-3 mb-4">
          {wasCorrect ? (
            <>
              <CheckCircle className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold text-green-400">Correct!</span>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-red-400" />
              <span className="text-xl font-bold text-red-400">Incorrect</span>
            </>
          )}
        </div>
        <p className="text-white/90">{scenario.explanation}</p>
      </div>

      {/* Red Flags */}
      {scenario.redFlags.length > 0 && (
        <div className="cyber-card p-6">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span>Red Flags to Watch For</span>
          </h3>
          <ul className="space-y-2">
            {scenario.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-sm">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span className="text-white/80">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning Points */}
      <div className="cyber-card p-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Lightbulb className="h-5 w-5 text-cyan-400" />
          <span>Key Learning Points</span>
        </h3>
        <ul className="space-y-2">
          {scenario.learningPoints.map((point, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span className="text-white/80">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Button */}
      <div className="text-center pt-4">
        <button onClick={onNext} className="cyber-button inline-flex items-center space-x-2">
          <span>{isLast ? 'See Results' : 'Next Scenario'}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// ============================================
// Main Training Module Page
// ============================================

export default function TrainingModulePage() {
  let params = useParams();
  let router = useRouter();
  let moduleId = params.id as string;

  let { getModule, updateModuleStatus, updateModuleScore } = useModulesStore();
  let { startSession, endSession } = useSessionStore();
  let { updateModuleProgress, addXP, updateStreak } = useProgressStore();
  let { profile: vulnProfile, recordResult, finishSession: finishVulnSession, getRecentScenarioIds } = useVulnerabilityStore();
  let { isDemoMode, incrementScenarios: incrementDemoScenarios } = useDemoStore();

  let module = getModule(moduleId);

  let [phase, setPhase] = useState<TrainingPhase>('intro');
  let [scenarios, setScenarios] = useState<TrainingScenario[]>([]);
  let [scenarioIndex, setScenarioIndex] = useState(0);
  let [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  let [showResult, setShowResult] = useState(false);
  let [sessionFeedback, setSessionFeedback] = useState<SessionFeedback | null>(null);
  let [correctAnswers, setCorrectAnswers] = useState(0);
  let [answeredScenarios, setAnsweredScenarios] = useState<{ correct: boolean; scenario: TrainingScenario }[]>([]);
  let [showCoachingChat, setShowCoachingChat] = useState(false);

  let totalScenarios = 5;
  let currentScenario = scenarios[scenarioIndex];

  // === AI Call Function (demo-aware) ===
  // In demo mode: uses local engine. In production: hits /api/coaching
  let callAI = async (messages: Array<{ role: string; content: string }>): Promise<string> => {
    if (isDemoMode) {
      return generateDemoResponse(messages, currentScenario?.id || 'default');
    }
    // Production: call the real coaching API
    let resp = await fetch('/api/coaching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!resp.ok) throw new Error('Coaching API error');
    let data = await resp.json();
    return data.content || '';
  };

  // Open coaching chat automatically in demo mode when training starts
  let handleCoachingComplete = (_score: CoachingScoreBreakdown, _session: any) => {
    // Coaching session completed — score already tracked by CoachingChat
    setShowCoachingChat(false);
    if (isDemoMode) incrementDemoScenarios();
  };

  // Build scenario set using adaptive engine
  let initializeScenarios = () => {
    let recentIds = getRecentScenarioIds(15);
    let selected = getAdaptiveScenarios(
      module?.type || 'phishing',
      totalScenarios,
      vulnProfile,
      recentIds
    );
    setScenarios(selected);
  };

  // Start a training session
  let handleStartTraining = () => {
    initializeScenarios();
    startSession(moduleId);
    updateModuleStatus(moduleId, 'in-progress');
    setPhase('training');
    setScenarioIndex(0);
    setCorrectAnswers(0);
    setAnsweredScenarios([]);
    setSelectedAnswer(null);
    setShowResult(false);
    // Auto-open coaching chat in demo mode for phishing/social-engineering modules
    if (isDemoMode && (module?.type === 'phishing' || module?.type === 'social-engineering')) {
      setShowCoachingChat(true);
    }
  };

  // Process user answer - uses the pure checkAnswer function
  let handleAnswer = (answer: string) => {
    if (showResult || !currentScenario) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    let isCorrect = checkAnswer(currentScenario, answer);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Record into adaptive vulnerability tracker
    let vulnResult: ScenarioResult = {
      scenarioId: currentScenario.id,
      moduleType: currentScenario.moduleType,
      redFlags: currentScenario.redFlags,
      wasCorrect: isCorrect,
      timestamp: new Date().toISOString(),
    };
    recordResult(vulnResult);

    setAnsweredScenarios(prev => [...prev, { correct: isCorrect, scenario: currentScenario }]);
  };

  // Advance to next scenario or finish
  let handleNextScenario = () => {
    if (scenarioIndex + 1 >= totalScenarios) {
      finishTraining();
    } else {
      setScenarioIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      // Reset coaching for new scenario
      if (currentScenario) resetDemoSession(currentScenario.id);
      if (isDemoMode) setShowCoachingChat(true);
    }
  };

  // Wrap up training and compute results
  let finishTraining = () => {
    let finalScore = Math.round((correctAnswers / totalScenarios) * 100);
    let passed = finalScore >= (module?.requiredScore || 70);

    let missedRedFlags = answeredScenarios
      .filter(a => !a.correct)
      .flatMap(a => a.scenario.redFlags.slice(0, 2));

    let identifiedRedFlags = answeredScenarios
      .filter(a => a.correct)
      .flatMap(a => a.scenario.redFlags.slice(0, 1));

    let feedback: SessionFeedback = {
      overallScore: finalScore,
      maxScore: 100,
      correctActions: correctAnswers,
      totalActions: totalScenarios,
      missedRedFlags,
      identifiedRedFlags,
      strengths: correctAnswers >= 3 ? [
        'Good threat recognition skills',
        'Careful attention to details',
        'Strong security awareness',
      ].slice(0, Math.min(correctAnswers - 2, 3)) : [],
      improvements: correctAnswers < totalScenarios ? [
        'Review sender addresses more carefully',
        'Be skeptical of urgent requests',
        'Verify through official channels',
        'Check URLs before clicking',
      ].slice(0, totalScenarios - correctAnswers) : [],
      detailedAnalysis: passed
        ? 'Excellent work! You\'ve demonstrated strong security awareness. Keep practicing to stay sharp against evolving threats.'
        : 'Good effort! Security awareness is a skill that improves with practice. Review the scenarios you missed and try again.',
    };

    setSessionFeedback(feedback);
    endSession(feedback);

    updateModuleProgress(moduleId, finalScore, passed);
    updateModuleScore(moduleId, finalScore);
    addXP(Math.round(finalScore * 1.5));
    updateStreak();

    if (passed) {
      updateModuleStatus(moduleId, 'completed');
    }

    finishVulnSession();
    setPhase('results');
  };

  // Retry the module
  let handleRetry = () => {
    setSessionFeedback(null);
    handleStartTraining();
  };

  // -- Not Found State --

  if (!module) {
    return (
      <div className="min-h-screen">
        <Header currentPage="training" />
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Module Not Found</h1>
          <p className="text-white/60 mb-6">The requested training module could not be found.</p>
          <Link href="/training" className="cyber-button">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  // -- Determine if the last answer was correct (for result feedback) --

  let lastAnswerCorrect = false;
  if (showResult && currentScenario && selectedAnswer) {
    lastAnswerCorrect = checkAnswer(currentScenario, selectedAnswer);
  }

  // -- Render Scenario Content --

  let renderScenarioContent = () => {
    if (!currentScenario) return null;

    let { type, title, image } = currentScenario;

    return (
      <div className="space-y-6">
        {/* Scenario Header with Image */}
        <div className="cyber-card overflow-hidden">
          <div className="relative h-48 md:h-56">
            <Image
              src={image || scenarioImages.security}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-cyber-800/80 backdrop-blur-sm rounded-lg text-white/60">
                  {scenarioIconMap[type] || <Shield className="h-6 w-6" />}
                </div>
                <span className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  {type.replace('-', ' ')} Scenario
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
          </div>
        </div>

        {/* Type-specific content renderers */}
        {type === 'email' && <EmailRenderer scenario={currentScenario} />}
        {type === 'sms' && <SMSRenderer scenario={currentScenario} />}

        {(type === 'phone-call' || type === 'in-person') && (
          <ConversationRenderer
            scenario={currentScenario}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
          />
        )}

        {type === 'url-evaluation' && (
          <URLEvaluationRenderer
            scenario={currentScenario}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
          />
        )}

        {type === 'password-evaluation' && (
          <PasswordEvaluationRenderer
            scenario={currentScenario}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
          />
        )}

        {type === 'scenario' && (
          <MultipleChoiceRenderer
            scenario={currentScenario}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
          />
        )}

        {/* Phishing Judgment Buttons (email/sms only, before answering) */}
        {isPhishingJudgment(type) && !showResult && (
          <PhishingJudgmentButtons onAnswer={handleAnswer} />
        )}

        {/* Result Feedback (after answering) */}
        {showResult && (
          <ResultFeedback
            scenario={currentScenario}
            wasCorrect={lastAnswerCorrect}
            onNext={handleNextScenario}
            isLast={scenarioIndex + 1 >= totalScenarios}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="training" />

      <main className={`py-8 px-4 ${isDemoMode ? 'pt-16' : ''}`}>
        <div className={`container mx-auto ${isDemoMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
          {/* Back Navigation */}
          <Link
            href="/training"
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white/80 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Modules</span>
          </Link>

          {/* Intro Phase */}
          {phase === 'intro' && (
            <div className="cyber-card overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={moduleHeaderImages[module.type] || moduleHeaderImages['phishing']}
                  alt={module.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{module.title}</h1>
                  <p className="text-white/80 max-w-2xl">{module.description}</p>
                </div>
              </div>

              <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-cyber-800/50 rounded-xl p-5 text-center">
                    <Target className="h-8 w-8 text-white/60 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{totalScenarios}</div>
                    <div className="text-sm text-white/50">Scenarios</div>
                  </div>
                  <div className="bg-cyber-800/50 rounded-xl p-5 text-center">
                    <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{module.requiredScore}%</div>
                    <div className="text-sm text-white/50">To Pass</div>
                  </div>
                  <div className="bg-cyber-800/50 rounded-xl p-5 text-center">
                    <Clock className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{module.estimatedMinutes}</div>
                    <div className="text-sm text-white/50">Minutes</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-cyber-800/30 rounded-xl p-6 mb-8">
                  <h3 className="flex items-center space-x-2 font-semibold text-white mb-4">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span>What You&apos;ll Learn</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {module.skills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2 text-sm text-white/70">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  {isDemoMode && (
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <span className="text-xs text-amber-300 font-medium">Demo Mode — AI Coach will guide you through each scenario</span>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={handleStartTraining}
                      className="cyber-button text-lg px-10 py-4 inline-flex items-center space-x-3"
                    >
                      <Shield className="h-6 w-6" />
                      <span>{isDemoMode ? 'Start Demo Training' : 'Start Training'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Training Phase */}
          {phase === 'training' && (
            <div className={`${isDemoMode ? 'lg:grid lg:grid-cols-[1fr_380px] lg:gap-6' : ''}`}>
              <div>
                {/* Progress Bar */}
                <div className="cyber-card p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/60">
                      Scenario {scenarioIndex + 1} of {totalScenarios}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-green-400">
                        {correctAnswers} correct
                      </span>
                      {/* Coaching chat toggle button */}
                      {!showCoachingChat && (
                        <button
                          onClick={() => setShowCoachingChat(true)}
                          className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center space-x-1.5"
                        >
                          <Shield className="h-3 w-3" />
                          <span>AI Coach</span>
                        </button>
                      )}
                      <span className="text-sm text-white/80 font-medium">
                        {Math.round(((scenarioIndex + (showResult ? 1 : 0)) / totalScenarios) * 100)}% complete
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-cyber-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${((scenarioIndex + (showResult ? 1 : 0)) / totalScenarios) * 100}%` }}
                    />
                  </div>
                  {/* Progress Dots */}
                  <div className="flex justify-between mt-3">
                    {Array.from({ length: totalScenarios }).map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-8 h-1 rounded-full transition-all",
                          idx < scenarioIndex
                            ? answeredScenarios[idx]?.correct
                              ? "bg-green-500"
                              : "bg-red-500"
                            : idx === scenarioIndex
                              ? "bg-cyber-500"
                              : "bg-cyber-800"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Scenario Content */}
                {currentScenario && renderScenarioContent()}
              </div>

              {/* Coaching Chat Sidebar (visible in demo mode or when toggled) */}
              {showCoachingChat && currentScenario && (
                <div className="hidden lg:block sticky top-24 self-start">
                  <CoachingChat
                    scenario={currentScenario}
                    onComplete={handleCoachingComplete}
                    onClose={() => setShowCoachingChat(false)}
                    callAI={callAI}
                    className="w-full"
                  />
                </div>
              )}

              {/* Mobile coaching chat — fixed bottom sheet */}
              {showCoachingChat && currentScenario && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
                  <CoachingChat
                    scenario={currentScenario}
                    onComplete={handleCoachingComplete}
                    onClose={() => setShowCoachingChat(false)}
                    callAI={callAI}
                    className="w-full shadow-2xl shadow-black/50"
                  />
                </div>
              )}
            </div>
          )}

          {/* Results Phase */}
          {phase === 'results' && sessionFeedback && (
            <ScoreDisplay
              score={sessionFeedback.overallScore}
              maxScore={sessionFeedback.maxScore}
              feedback={sessionFeedback}
              onRetry={handleRetry}
              onContinue={() => router.push('/training')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
