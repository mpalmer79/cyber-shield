'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Zap,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Award,
  Target,
  Mail,
  Phone,
  Globe,
  Lock,
  Users,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { Header } from '@/components';
import { useDailyChallengeStore, useProgressStore, useVulnerabilityStore } from '@/store';
import { cn } from '@/lib/utils';
import {
  phishingScenarios,
  socialEngineeringScenarios,
  passwordSecurityScenarios,
  secureBrowsingScenarios,
  incidentResponseScenarios,
  dataProtectionScenarios,
  malwareAwarenessScenarios,
  threatHuntingScenarios,
} from '@/lib/scenarios';
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
import type { ScenarioResult } from '@/lib/adaptive';

// ============================================
// Stock images for page sections
// ============================================

const dailyImages = {
  // Hero: dark SOC / command center vibe
  hero: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80',
  // Accuracy: data visualization / analytics
  accuracy: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  // Badges: trophy / achievement aesthetic
  badges: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  // Tips: keyboard / cyber workspace
  tips: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
};

// ============================================
// Deterministic daily scenario picker
// Uses date string as seed for consistent daily selection
// ============================================

function hashDateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    let ch = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash | 0;
  }
  return Math.abs(hash);
}

function getDailyScenario(dateStr: string): TrainingScenario {
  let allScenarios = [
    ...phishingScenarios,
    ...socialEngineeringScenarios,
    ...passwordSecurityScenarios,
    ...secureBrowsingScenarios,
    ...incidentResponseScenarios,
    ...dataProtectionScenarios,
    ...malwareAwarenessScenarios,
    ...threatHuntingScenarios,
  ];

  let idx = hashDateSeed(dateStr) % allScenarios.length;
  return allScenarios[idx];
}

// module type display labels
const moduleLabels: Record<string, string> = {
  'phishing': 'Phishing Detection',
  'social-engineering': 'Social Engineering',
  'password-security': 'Password Security',
  'secure-browsing': 'Secure Browsing',
  'incident-response': 'Incident Response',
  'data-protection': 'Data Protection',
  'malware-awareness': 'Malware Awareness',
  'threat-hunting': 'Threat Hunting',
};

const moduleIcons: Record<string, React.ReactNode> = {
  'phishing': <Mail className="h-5 w-5" />,
  'social-engineering': <Users className="h-5 w-5" />,
  'password-security': <Lock className="h-5 w-5" />,
  'secure-browsing': <Globe className="h-5 w-5" />,
  'incident-response': <AlertTriangle className="h-5 w-5" />,
  'data-protection': <Shield className="h-5 w-5" />,
  'malware-awareness': <AlertTriangle className="h-5 w-5" />,
  'threat-hunting': <Target className="h-5 w-5" />,
};

// ============================================
// Scenario Renderers (matched from training page)
// ============================================

function EmailRenderer({ scenario }: { scenario: TrainingScenario }) {
  let email = asEmail(scenario);
  return (
    <div className="cyber-card p-6">
      <div className="border-b border-cyber-700/50 pb-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-cyber-400 text-sm">From:</span>
            <span className="text-cyber-200 font-medium">{email.from}</span>
            <span className="text-cyber-500 text-sm">&lt;{email.fromEmail}&gt;</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-cyber-400 text-sm">To:</span>
          <span className="text-cyber-300">{email.to}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-cyber-400 text-sm">Subject:</span>
          <span className="text-cyber-100 font-semibold">{email.subject}</span>
        </div>
      </div>
      <div className="bg-cyber-800/30 rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-cyber-200 font-sans text-sm leading-relaxed">
          {email.body}
        </pre>
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cyber-700/50">
            <span className="text-cyber-400 text-sm">Attachments: </span>
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
        <div className="bg-cyber-800/50 rounded-2xl p-4">
          <div className="text-center text-cyber-400 text-sm mb-3">{sms.sender}</div>
          <div className="bg-green-600/20 border border-green-500/30 rounded-2xl rounded-tl-sm p-4">
            <p className="text-cyber-100 text-sm">{sms.message}</p>
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
      <div className="bg-cyber-800/30 rounded-lg p-4 mb-4">
        <p className="text-cyber-300 italic">{contextText}</p>
      </div>
      <div className="space-y-3 mb-6">
        {lines.map((line, idx) => (
          <div key={idx} className={cn(
            "p-3 rounded-lg",
            line.speaker === 'caller' || line.speaker === 'stranger'
              ? "bg-red-500/10 border border-red-500/20 ml-0 mr-12"
              : "bg-cyber-500/10 border border-cyber-500/20 ml-12 mr-0"
          )}>
            <span className="text-xs text-cyber-400 uppercase mb-1 block">{speakerLabel}</span>
            <p className="text-cyber-200 text-sm">{line.text}</p>
          </div>
        ))}
      </div>
      <OptionsRenderer options={options} onAnswer={onAnswer} selectedAnswer={selectedAnswer} showResult={showResult} />
    </div>
  );
}

function URLEvaluationRenderer({
  scenario, onAnswer, selectedAnswer, showResult,
}: {
  scenario: TrainingScenario; onAnswer: (id: string) => void; selectedAnswer: string | null; showResult: boolean;
}) {
  let content = asURLEvaluation(scenario);
  return (
    <div className="cyber-card p-6">
      <p className="text-cyber-300 mb-6">{content.instruction}</p>
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
                    : "bg-cyber-800/30 border border-cyber-700/50 opacity-50"
                : selectedAnswer === urlOpt.id
                  ? "bg-cyber-600/30 border-2 border-cyber-500"
                  : "bg-cyber-800/30 border border-cyber-700/50 hover:border-cyber-500/50 hover:bg-cyber-700/30"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-cyber-200">{urlOpt.url}</span>
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
  scenario, onAnswer, selectedAnswer, showResult,
}: {
  scenario: TrainingScenario; onAnswer: (id: string) => void; selectedAnswer: string | null; showResult: boolean;
}) {
  let content = asPasswordEvaluation(scenario);
  return (
    <div className="cyber-card p-6">
      <p className="text-cyber-300 mb-6">{content.instruction}</p>
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
                    : "bg-cyber-800/30 border border-cyber-700/50 opacity-50"
                : selectedAnswer === pwd.id
                  ? "bg-cyber-600/30 border-2 border-cyber-500"
                  : "bg-cyber-800/30 border border-cyber-700/50 hover:border-cyber-500/50 hover:bg-cyber-700/30"
            )}
          >
            <div className="flex items-center justify-between">
              <code className="text-cyber-200 bg-cyber-900/50 px-2 py-1 rounded">{pwd.password}</code>
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
  scenario, onAnswer, selectedAnswer, showResult,
}: {
  scenario: TrainingScenario; onAnswer: (id: string) => void; selectedAnswer: string | null; showResult: boolean;
}) {
  let content = asMultipleChoice(scenario);
  return (
    <div className="cyber-card p-6">
      <p className="text-cyber-300 mb-4">{content.scenario}</p>
      <p className="text-cyber-100 font-medium mb-6">{content.question}</p>
      <OptionsRenderer options={content.options} onAnswer={onAnswer} selectedAnswer={selectedAnswer} showResult={showResult} />
    </div>
  );
}

function OptionsRenderer({
  options, onAnswer, selectedAnswer, showResult,
}: {
  options: ScenarioOption[]; onAnswer: (id: string) => void; selectedAnswer: string | null; showResult: boolean;
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
                  : "bg-cyber-800/30 border border-cyber-700/50 opacity-50"
              : selectedAnswer === option.id
                ? "bg-cyber-600/30 border-2 border-cyber-500"
                : "bg-cyber-800/30 border border-cyber-700/50 hover:border-cyber-500/50 hover:bg-cyber-700/30"
          )}
        >
          <div className="flex items-start space-x-3">
            <span className="text-cyber-400 font-medium">{option.id.toUpperCase()}.</span>
            <span className="text-cyber-200">{option.text}</span>
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

function PhishingJudgmentButtons({ onAnswer }: { onAnswer: (answer: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onAnswer('phishing')}
        className="cyber-card p-6 text-center hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
      >
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <span className="text-lg font-semibold text-cyber-100">This is Phishing</span>
        <p className="text-sm text-cyber-400 mt-1">This looks suspicious</p>
      </button>
      <button
        onClick={() => onAnswer('legitimate')}
        className="cyber-card p-6 text-center hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
      >
        <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <span className="text-lg font-semibold text-cyber-100">This is Legitimate</span>
        <p className="text-sm text-cyber-400 mt-1">This looks safe</p>
      </button>
    </div>
  );
}

// ============================================
// Streak Badge Milestones
// ============================================

interface BadgeMilestone {
  id: string;
  label: string;
  icon: React.ReactNode;
  requiredStreak: number;
  color: string;
}

const BADGES: BadgeMilestone[] = [
  { id: 'defender', label: 'Daily Defender', icon: <Shield className="h-6 w-6" />, requiredStreak: 3, color: 'text-blue-400' },
  { id: 'warrior', label: 'Week Warrior', icon: <Flame className="h-6 w-6" />, requiredStreak: 7, color: 'text-orange-400' },
  { id: 'guardian', label: 'Month Guardian', icon: <Award className="h-6 w-6" />, requiredStreak: 30, color: 'text-amber-400' },
];

// ============================================
// Watermark Card Wrapper — stock image bg + dark overlay
// ============================================

function WatermarkCard({
  imageUrl,
  overlayFrom,
  overlayTo,
  children,
  className = '',
}: {
  imageUrl: string;
  overlayFrom: string;
  overlayTo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-white/[0.06]", className)}>
      {/* Stock image watermark */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover opacity-[0.07]"
          sizes="400px"
        />
      </div>
      {/* Gradient overlay for readability */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        overlayFrom,
        overlayTo
      )} />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ============================================
// Main Daily Challenge Page
// ============================================

export default function DailyChallengePage() {
  let router = useRouter();
  let {
    currentStreak, longestStreak, lastCompletedDate,
    todayCompleted, todayResult,
    totalChallengesCompleted, history,
    dailyDefenderEarned, weekWarriorEarned, monthGuardianEarned,
    completeDaily, checkAndResetIfNewDay,
  } = useDailyChallengeStore();
  let { addXP, updateStreak: updateProgressStreak } = useProgressStore();
  let { recordResult } = useVulnerabilityStore();

  let [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  let [showResult, setShowResult] = useState(false);
  let [xpAwarded, setXpAwarded] = useState(0);
  let [mounted, setMounted] = useState(false);

  // check for new day on mount
  useEffect(() => {
    checkAndResetIfNewDay();
    setMounted(true);
  }, [checkAndResetIfNewDay]);

  // get today's scenario deterministically
  let todayStr = new Date().toISOString().split('T')[0];
  let scenario = useMemo(() => getDailyScenario(todayStr), [todayStr]);

  // restore completed state
  useEffect(() => {
    if (todayCompleted) {
      setShowResult(true);
    }
  }, [todayCompleted]);

  let isPhishing = isPhishingJudgment(scenario.type);

  function handleAnswer(answer: string) {
    if (showResult || todayCompleted) return;

    setSelectedAnswer(answer);
    let correct = checkAnswer(scenario, answer);

    // calculate xp
    let xp = 25;
    if (correct) xp = xp + 25;
    let streakBonus = Math.min((currentStreak + 1) * 5, 50);
    xp = xp + streakBonus;
    setXpAwarded(xp);

    // record in daily challenge store
    completeDaily(scenario.id, correct);

    // record in vulnerability profile
    let result: ScenarioResult = {
      scenarioId: scenario.id,
      moduleType: scenario.moduleType,
      redFlags: scenario.redFlags,
      wasCorrect: correct,
      timestamp: new Date().toISOString(),
    };
    recordResult(result);

    // add XP to progress
    addXP(xp);
    updateProgressStreak();

    setShowResult(true);
  }

  // streak week calendar
  let weekDays = useMemo(() => {
    let days = [];
    let today = new Date();
    for (let i = 6; i >= 0; i--) {
      let d = new Date(today);
      d.setDate(d.getDate() - i);
      let key = d.toISOString().split('T')[0];
      let completed = history.some(h => h.date === key);
      let isToday = i === 0;
      days.push({ key, completed, isToday, label: d.toLocaleDateString('en-US', { weekday: 'short' }) });
    }
    return days;
  }, [history]);

  // recent stats
  let recentCorrect = history.filter(h => {
    let d = new Date(h.date);
    let cutoff = new Date(Date.now() - 30 * 86400000);
    return d >= cutoff && h.wasCorrect;
  }).length;

  let recentTotal = history.filter(h => {
    let d = new Date(h.date);
    let cutoff = new Date(Date.now() - 30 * 86400000);
    return d >= cutoff;
  }).length;

  let accuracy = recentTotal > 0 ? Math.round((recentCorrect / recentTotal) * 100) : 0;

  // badge status
  let badgeStatus = [
    { ...BADGES[0], earned: dailyDefenderEarned },
    { ...BADGES[1], earned: weekWarriorEarned },
    { ...BADGES[2], earned: monthGuardianEarned },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <Header currentPage="daily" />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse text-cyber-400">Loading daily challenge...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header currentPage="daily" />

      {/* ============================================ */}
      {/* HERO BANNER — Full-width image card          */}
      {/* ============================================ */}
      <section className="px-4 pt-6 pb-2">
        <div className="container mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]" style={{ minHeight: '260px' }}>
            {/* Background stock image */}
            <Image
              src={dailyImages.hero}
              alt="Cybersecurity operations center"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/95 via-[#0a0f1c]/80 to-[#0a0f1c]/50" />
            {/* Accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-transparent" />

            {/* Content */}
            <div className="relative z-10 px-6 md:px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left: Title + date + description */}
              <div className="max-w-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-orange-400/80">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  Daily Challenge
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  One scenario per day. Stay sharp, build your streak, earn badges. Takes under 60 seconds.
                </p>

                {/* Streak pills */}
                <div className="flex items-center space-x-3 mt-5">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <Flame className={cn(
                      "h-4 w-4",
                      currentStreak >= 3 ? "text-orange-400" : currentStreak >= 1 ? "text-orange-300" : "text-gray-600"
                    )} />
                    <span className="text-sm font-bold text-white">{currentStreak}</span>
                    <span className="text-xs text-gray-500">streak</span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">{longestStreak}</span>
                    <span className="text-xs text-gray-500">best</span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">{totalChallengesCompleted}</span>
                    <span className="text-xs text-gray-500">total</span>
                  </div>
                </div>
              </div>

              {/* Right: Week calendar */}
              <div className="flex items-center space-x-1.5 md:space-x-2.5">
                {weekDays.map((day) => (
                  <div key={day.key} className="flex flex-col items-center space-y-1.5">
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      day.isToday ? "text-orange-400" : day.completed ? "text-white/60" : "text-white/25"
                    )}>
                      {day.label}
                    </span>
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                      day.completed
                        ? "bg-orange-500/20 border-orange-400 text-orange-400"
                        : day.isToday
                          ? "border-white/30 text-white/50 border-dashed"
                          : "border-white/[0.06] text-white/15"
                    )}>
                      {day.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : day.isToday ? (
                        <Flame className="h-3.5 w-3.5" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MAIN CONTENT                                 */}
      {/* ============================================ */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Scenario */}
            <div className="lg:col-span-2">
              {/* Scenario Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  {moduleIcons[scenario.moduleType] || <Globe className="h-5 w-5" />}
                  <span className="text-sm text-gray-300">{moduleLabels[scenario.moduleType] || scenario.moduleType}</span>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium",
                  scenario.difficulty === 'beginner' ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" :
                  scenario.difficulty === 'intermediate' ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" :
                  scenario.difficulty === 'advanced' ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" :
                  "bg-red-500/15 text-red-400 border border-red-500/20"
                )}>
                  {scenario.difficulty}
                </div>
                {todayCompleted && (
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold",
                    todayResult ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"
                  )}>
                    {todayResult ? 'Correct' : 'Incorrect'}
                  </div>
                )}
              </div>

              {/* Scenario Title */}
              <h2 className="text-2xl font-bold text-white mb-6">{scenario.title}</h2>

              {/* Scenario Content */}
              {scenario.type === 'email' && <EmailRenderer scenario={scenario} />}
              {scenario.type === 'sms' && <SMSRenderer scenario={scenario} />}
              {(scenario.type === 'phone-call' || scenario.type === 'in-person') && (
                <ConversationRenderer
                  scenario={scenario}
                  onAnswer={handleAnswer}
                  selectedAnswer={selectedAnswer}
                  showResult={showResult}
                />
              )}
              {scenario.type === 'url-evaluation' && (
                <URLEvaluationRenderer
                  scenario={scenario}
                  onAnswer={handleAnswer}
                  selectedAnswer={selectedAnswer}
                  showResult={showResult}
                />
              )}
              {scenario.type === 'password-evaluation' && (
                <PasswordEvaluationRenderer
                  scenario={scenario}
                  onAnswer={handleAnswer}
                  selectedAnswer={selectedAnswer}
                  showResult={showResult}
                />
              )}
              {scenario.type === 'scenario' && (
                <MultipleChoiceRenderer
                  scenario={scenario}
                  onAnswer={handleAnswer}
                  selectedAnswer={selectedAnswer}
                  showResult={showResult}
                />
              )}

              {/* Answer Buttons (for phishing types) */}
              {isPhishing && !showResult && (
                <div className="mt-6">
                  <PhishingJudgmentButtons onAnswer={handleAnswer} />
                </div>
              )}

              {/* Result Panel */}
              {showResult && (
                <div className="mt-6 cyber-card p-6">
                  <div className="flex items-start space-x-4">
                    {todayResult ? (
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
                        <XCircle className="h-7 w-7 text-red-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className={cn(
                        "text-xl font-bold mb-2",
                        todayResult ? "text-emerald-400" : "text-red-400"
                      )}>
                        {todayResult ? 'Correct!' : 'Not Quite'}
                      </h3>
                      <p className="text-gray-300 mb-4">{scenario.explanation}</p>

                      {/* Red Flags */}
                      {scenario.redFlags.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <span>Red Flags to Watch For</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {scenario.redFlags.map((flag, i) => (
                              <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-300">
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Points */}
                      {scenario.learningPoints.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
                            <Lightbulb className="h-4 w-4 text-blue-400" />
                            <span>Key Takeaways</span>
                          </h4>
                          <ul className="space-y-1">
                            {scenario.learningPoints.map((pt, i) => (
                              <li key={i} className="text-sm text-gray-400 flex items-start space-x-2">
                                <ChevronRight className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* XP Awarded */}
                      <div className="flex items-center space-x-4 pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <Zap className="h-5 w-5 text-amber-400" />
                          <span className="text-lg font-bold text-amber-400">+{xpAwarded} XP</span>
                        </div>
                        {currentStreak > 1 && (
                          <div className="flex items-center space-x-2 text-sm text-orange-400">
                            <Flame className="h-4 w-4" />
                            <span>{currentStreak} day streak bonus!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                    <Link
                      href="/training"
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                    >
                      <span>Continue Training</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/progress"
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors border border-white/10"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>View Progress</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================ */}
            {/* RIGHT SIDEBAR — Watermarked image cards      */}
            {/* ============================================ */}
            <div className="space-y-6">

              {/* 30-Day Accuracy */}
              <WatermarkCard
                imageUrl={dailyImages.accuracy}
                overlayFrom="from-[#0c1222]/95"
                overlayTo="to-[#111827]/90"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    <span>30-Day Accuracy</span>
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/[0.06]" />
                        <circle
                          cx="64" cy="64" r="56"
                          stroke="currentColor" strokeWidth="8" fill="none"
                          className={cn(
                            accuracy >= 80 ? "text-emerald-400" :
                            accuracy >= 60 ? "text-amber-400" :
                            accuracy >= 40 ? "text-orange-400" :
                            "text-red-400"
                          )}
                          strokeDasharray={`${(accuracy / 100) * 352} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{accuracy}%</span>
                        <span className="text-xs text-gray-500">{recentCorrect}/{recentTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </WatermarkCard>

              {/* Streak Badges */}
              <WatermarkCard
                imageUrl={dailyImages.badges}
                overlayFrom="from-[#120c1c]/95"
                overlayTo="to-[#1a1025]/90"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <span>Streak Badges</span>
                  </h3>
                  <div className="space-y-3">
                    {badgeStatus.map((badge) => (
                      <div
                        key={badge.id}
                        className={cn(
                          "flex items-center space-x-4 p-3 rounded-lg border transition-all",
                          badge.earned
                            ? "bg-white/[0.04] border-white/10"
                            : "bg-white/[0.02] border-white/[0.04] opacity-50"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full",
                          badge.earned
                            ? `bg-white/[0.06] ${badge.color}`
                            : "bg-white/[0.03] text-gray-700"
                        )}>
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <span className={cn(
                            "font-medium block",
                            badge.earned ? "text-white" : "text-gray-600"
                          )}>
                            {badge.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {badge.requiredStreak}-day streak
                          </span>
                        </div>
                        {badge.earned && (
                          <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </WatermarkCard>

              {/* Tips */}
              <WatermarkCard
                imageUrl={dailyImages.tips}
                overlayFrom="from-[#0c1a1c]/95"
                overlayTo="to-[#0f1720]/90"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    <span>Streak Tips</span>
                  </h3>
                  <ul className="space-y-2.5 text-sm text-gray-400">
                    <li className="flex items-start space-x-2.5">
                      <Flame className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span>Complete one challenge daily to keep your streak alive</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <Zap className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Longer streaks earn bonus XP per challenge</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <Star className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>Unlock badges at 3, 7, and 30 day milestones</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <Calendar className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>New scenario every day from all 8 training modules</span>
                    </li>
                  </ul>
                </div>
              </WatermarkCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
