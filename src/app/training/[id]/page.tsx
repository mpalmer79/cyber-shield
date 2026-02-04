'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  Mail,
  Phone,
  Globe,
  Lock,
  Users,
  Lightbulb,
  Award,
  Target,
  RotateCcw,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';
import { Header, ScoreDisplay } from '@/components';
import { useModulesStore, useSessionStore, useProgressStore, useVulnerabilityStore } from '@/store';
import { cn } from '@/lib/utils';
import { getAdaptiveScenarios, TrainingScenario, scenarioImages } from '@/lib/scenarios';
import type { SessionFeedback } from '@/types';
import type { ScenarioResult } from '@/lib/adaptive';

type TrainingPhase = 'intro' | 'training' | 'results';

// Stock images for module headers
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

// Get icon for scenario type
const getScenarioIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-6 w-6" />;
    case 'sms':
    case 'phone-call':
      return <Phone className="h-6 w-6" />;
    case 'url-evaluation':
    case 'scenario':
      return <Globe className="h-6 w-6" />;
    case 'password-evaluation':
      return <Lock className="h-6 w-6" />;
    case 'in-person':
      return <Users className="h-6 w-6" />;
    default:
      return <Shield className="h-6 w-6" />;
  }
};

export default function TrainingModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;

  const { getModule, updateModuleStatus, updateModuleScore } = useModulesStore();
  const { startSession, endSession, score } = useSessionStore();
  const { updateModuleProgress, addXP, updateStreak } = useProgressStore();
  const { profile: vulnProfile, recordResult, finishSession: finishVulnSession, getRecentScenarioIds } = useVulnerabilityStore();

  const module = getModule(moduleId);

  const [phase, setPhase] = useState<TrainingPhase>('intro');
  const [scenarios, setScenarios] = useState<TrainingScenario[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<SessionFeedback | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredScenarios, setAnsweredScenarios] = useState<{ correct: boolean; scenario: TrainingScenario }[]>([]);

  const totalScenarios = 5;
  const currentScenario = scenarios[scenarioIndex];

  // Initialize scenarios when training starts (adaptive engine)
  const initializeScenarios = () => {
    const recentIds = getRecentScenarioIds(15);
    const moduleScenarios = getAdaptiveScenarios(
      module?.type || 'phishing',
      totalScenarios,
      vulnProfile,
      recentIds
    );
    setScenarios(moduleScenarios);
  };

  // Handle starting the training
  const handleStartTraining = () => {
    initializeScenarios();
    startSession(moduleId);
    updateModuleStatus(moduleId, 'in-progress');
    setPhase('training');
    setScenarioIndex(0);
    setCorrectAnswers(0);
    setAnsweredScenarios([]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Handle user's answer for different scenario types
  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    let isCorrect = false;

    // Determine if answer is correct based on scenario type
    if (currentScenario.type === 'email' || currentScenario.type === 'sms') {
      // For phishing scenarios: answer is "phishing" or "legitimate"
      isCorrect = (answer === 'phishing') === currentScenario.isCorrectAnswer;
    } else if (currentScenario.content && 'options' in currentScenario.content) {
      // For multiple choice scenarios
      const options = currentScenario.content.options as { id: string; isCorrect: boolean }[];
      const selectedOption = options.find(o => o.id === answer);
      isCorrect = selectedOption?.isCorrect || false;
    } else if (currentScenario.content && 'correctAnswer' in currentScenario.content) {
      // For URL evaluation or password evaluation
      isCorrect = answer === currentScenario.content.correctAnswer;
    }

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Record into adaptive vulnerability tracker
    const vulnResult: ScenarioResult = {
      scenarioId: currentScenario.id,
      moduleType: currentScenario.moduleType,
      redFlags: currentScenario.redFlags,
      wasCorrect: isCorrect,
      timestamp: new Date().toISOString(),
    };
    recordResult(vulnResult);

    setAnsweredScenarios((prev) => [...prev, { correct: isCorrect, scenario: currentScenario }]);
  };

  // Handle moving to next scenario
  const handleNextScenario = () => {
    if (scenarioIndex + 1 >= totalScenarios) {
      finishTraining();
    } else {
      setScenarioIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Finish training and show results
  const finishTraining = () => {
    const finalScore = Math.round((correctAnswers / totalScenarios) * 100);
    const passed = finalScore >= (module?.requiredScore || 70);

    const missedRedFlags = answeredScenarios
      .filter(a => !a.correct)
      .flatMap(a => a.scenario.redFlags.slice(0, 2));

    const identifiedRedFlags = answeredScenarios
      .filter(a => a.correct)
      .flatMap(a => a.scenario.redFlags.slice(0, 1));

    const feedback: SessionFeedback = {
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

    // Mark adaptive engine session as complete (counts toward calibration)
    finishVulnSession();

    setPhase('results');
  };

  // Handle retry
  const handleRetry = () => {
    setSessionFeedback(null);
    handleStartTraining();
  };

  if (!module) {
    return (
      <div className="min-h-screen">
        <Header currentPage="training" />
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-cyber-100 mb-2">Module Not Found</h1>
          <p className="text-cyber-400 mb-6">The requested training module could not be found.</p>
          <Link href="/training" className="cyber-button">
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  // Render different scenario types
  const renderScenarioContent = () => {
    if (!currentScenario) return null;

    const { type, content, title, image } = currentScenario;

    return (
      <div className="space-y-6">
        {/* Scenario Header */}
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
                <div className="p-2 bg-cyber-800/80 backdrop-blur-sm rounded-lg text-cyber-400">
                  {getScenarioIcon(type)}
                </div>
                <span className="text-sm font-medium text-cyber-400 uppercase tracking-wide">
                  {type.replace('-', ' ')} Scenario
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
          </div>
        </div>

        {/* Scenario Content Based on Type */}
        {(type === 'email') && (
          <div className="cyber-card p-6">
            <div className="border-b border-cyber-700/50 pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-cyber-400 text-sm">From:</span>
                  <span className="text-cyber-200 font-medium">{(content as any).from}</span>
                  <span className="text-cyber-500 text-sm">&lt;{(content as any).fromEmail}&gt;</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-cyber-400 text-sm">To:</span>
                <span className="text-cyber-300">{(content as any).to}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-cyber-400 text-sm">Subject:</span>
                <span className="text-cyber-100 font-semibold">{(content as any).subject}</span>
              </div>
            </div>
            <div className="bg-cyber-800/30 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-cyber-200 font-sans text-sm leading-relaxed">
                {(content as any).body}
              </pre>
              {(content as any).attachments && (
                <div className="mt-4 pt-4 border-t border-cyber-700/50">
                  <span className="text-cyber-400 text-sm">Attachments: </span>
                  <span className="text-yellow-400 text-sm">{(content as any).attachments.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(type === 'sms') && (
          <div className="cyber-card p-6">
            <div className="max-w-sm mx-auto">
              <div className="bg-cyber-800/50 rounded-2xl p-4">
                <div className="text-center text-cyber-400 text-sm mb-3">{(content as any).sender}</div>
                <div className="bg-green-600/20 border border-green-500/30 rounded-2xl rounded-tl-sm p-4">
                  <p className="text-cyber-100 text-sm">{(content as any).message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(type === 'phone-call' || type === 'in-person') && (
          <div className="cyber-card p-6">
            <div className="bg-cyber-800/30 rounded-lg p-4 mb-4">
              <p className="text-cyber-300 italic">{(content as any).scenario}</p>
            </div>
            <div className="space-y-3">
              {(content as any).conversation?.map((line: any, idx: number) => (
                <div key={idx} className={cn(
                  "p-3 rounded-lg",
                  line.speaker === 'caller' || line.speaker === 'stranger'
                    ? "bg-red-500/10 border border-red-500/20 ml-0 mr-12"
                    : "bg-cyber-500/10 border border-cyber-500/20 ml-12 mr-0"
                )}>
                  <span className="text-xs text-cyber-400 uppercase mb-1 block">
                    {line.speaker === 'caller' ? (content as any).callerName || 'Caller' : 'Unknown'}
                  </span>
                  <p className="text-cyber-200 text-sm">{line.text}</p>
                </div>
              )) || (content as any).encounter?.map((line: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-xs text-cyber-400 uppercase mb-1 block">Stranger</span>
                  <p className="text-cyber-200 text-sm">{line.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(type === 'url-evaluation') && (
          <div className="cyber-card p-6">
            <p className="text-cyber-300 mb-6">{(content as any).instruction}</p>
            <div className="space-y-3">
              {(content as any).urls?.map((urlOption: any) => (
                <button
                  key={urlOption.id}
                  onClick={() => handleAnswer(urlOption.id)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 rounded-lg text-left transition-all font-mono text-sm",
                    showResult
                      ? urlOption.safe
                        ? "bg-green-500/20 border-2 border-green-500"
                        : selectedAnswer === urlOption.id
                          ? "bg-red-500/20 border-2 border-red-500"
                          : "bg-cyber-800/30 border border-cyber-700/50 opacity-50"
                      : selectedAnswer === urlOption.id
                        ? "bg-cyber-600/30 border-2 border-cyber-500"
                        : "bg-cyber-800/30 border border-cyber-700/50 hover:border-cyber-500/50 hover:bg-cyber-700/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-200">{urlOption.url}</span>
                    {showResult && (
                      urlOption.safe
                        ? <CheckCircle className="h-5 w-5 text-green-400" />
                        : selectedAnswer === urlOption.id && <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  {showResult && !urlOption.safe && (
                    <p className="text-xs text-red-400 mt-2">{urlOption.reason}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {(type === 'password-evaluation') && (
          <div className="cyber-card p-6">
            <p className="text-cyber-300 mb-6">{(content as any).instruction}</p>
            <div className="space-y-3">
              {(content as any).passwords?.map((pwdOption: any) => (
                <button
                  key={pwdOption.id}
                  onClick={() => handleAnswer(pwdOption.id)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 rounded-lg text-left transition-all",
                    showResult
                      ? pwdOption.id === (content as any).correctAnswer
                        ? "bg-green-500/20 border-2 border-green-500"
                        : selectedAnswer === pwdOption.id
                          ? "bg-red-500/20 border-2 border-red-500"
                          : "bg-cyber-800/30 border border-cyber-700/50 opacity-50"
                      : selectedAnswer === pwdOption.id
                        ? "bg-cyber-600/30 border-2 border-cyber-500"
                        : "bg-cyber-800/30 border border-cyber-700/50 hover:border-cyber-500/50 hover:bg-cyber-700/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <code className="text-cyber-200 bg-cyber-900/50 px-2 py-1 rounded">{pwdOption.password}</code>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      pwdOption.strength === 'strong' ? "bg-green-500/20 text-green-400" :
                      pwdOption.strength === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    )}>
                      {pwdOption.strength}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(type === 'scenario' && 'options' in content) && (
          <div className="cyber-card p-6">
            <p className="text-cyber-300 mb-4">{(content as any).scenario}</p>
            <p className="text-cyber-100 font-medium mb-6">{(content as any).question}</p>
            <div className="space-y-3">
              {(content as any).options?.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
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
          </div>
        )}

        {/* Phishing Detection Buttons (for email/sms) */}
        {(type === 'email' || type === 'sms') && !showResult && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer('phishing')}
              className="cyber-card p-6 text-center hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
            >
              <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-semibold text-cyber-100">This is Phishing</span>
              <p className="text-sm text-cyber-400 mt-1">This looks suspicious</p>
            </button>
            <button
              onClick={() => handleAnswer('legitimate')}
              className="cyber-card p-6 text-center hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
            >
              <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-semibold text-cyber-100">This is Legitimate</span>
              <p className="text-sm text-cyber-400 mt-1">This looks safe</p>
            </button>
          </div>
        )}

        {/* Result Feedback */}
        {showResult && (
          <div className="space-y-4">
            {/* Correct/Incorrect Banner */}
            <div className={cn(
              "cyber-card p-6",
              (selectedAnswer === 'phishing' && currentScenario.isCorrectAnswer) ||
              (selectedAnswer === 'legitimate' && !currentScenario.isCorrectAnswer) ||
              (currentScenario.content && 'options' in currentScenario.content && 
                (currentScenario.content as any).options?.find((o: any) => o.id === selectedAnswer)?.isCorrect) ||
              (currentScenario.content && 'correctAnswer' in currentScenario.content && 
                selectedAnswer === (currentScenario.content as any).correctAnswer)
                ? "bg-green-500/10 border-green-500/50"
                : "bg-red-500/10 border-red-500/50"
            )}>
              <div className="flex items-center space-x-3 mb-4">
                {((selectedAnswer === 'phishing' && currentScenario.isCorrectAnswer) ||
                  (selectedAnswer === 'legitimate' && !currentScenario.isCorrectAnswer) ||
                  (currentScenario.content && 'options' in currentScenario.content && 
                    (currentScenario.content as any).options?.find((o: any) => o.id === selectedAnswer)?.isCorrect) ||
                  (currentScenario.content && 'correctAnswer' in currentScenario.content && 
                    selectedAnswer === (currentScenario.content as any).correctAnswer)) ? (
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
              <p className="text-cyber-200">{currentScenario.explanation}</p>
            </div>

            {/* Red Flags */}
            {currentScenario.redFlags.length > 0 && (
              <div className="cyber-card p-6">
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-cyber-100 mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span>Red Flags to Watch For</span>
                </h3>
                <ul className="space-y-2">
                  {currentScenario.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span className="text-cyber-300">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learning Points */}
            <div className="cyber-card p-6">
              <h3 className="flex items-center space-x-2 text-lg font-semibold text-cyber-100 mb-4">
                <Lightbulb className="h-5 w-5 text-cyan-400" />
                <span>Key Learning Points</span>
              </h3>
              <ul className="space-y-2">
                {currentScenario.learningPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-cyber-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleNextScenario}
                className="cyber-button inline-flex items-center space-x-2"
              >
                <span>{scenarioIndex + 1 >= totalScenarios ? 'See Results' : 'Next Scenario'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="training" />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Navigation */}
          <Link
            href="/training"
            className="inline-flex items-center space-x-2 text-cyber-400 hover:text-cyber-300 mb-6 transition-colors"
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
                  <p className="text-cyber-300 max-w-2xl">{module.description}</p>
                </div>
              </div>

              <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-cyber-800/50 rounded-xl p-5 text-center">
                    <Target className="h-8 w-8 text-cyber-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-cyber-200">{totalScenarios}</div>
                    <div className="text-sm text-cyber-500">Scenarios</div>
                  </div>
                  <div className="bg-cyber-800/50 rounded-xl p-5 text-center">
                    <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-cyber-200">{module.requiredScore}%</div>
                    <div className="text-sm text-cyber-500">To Pass</div>
                  </div>
                  <div className="bg-cyber-800/50 rounded-xl p-5 text-center">
                    <Clock className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-cyber-200">{module.estimatedMinutes}</div>
                    <div className="text-sm text-cyber-500">Minutes</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-cyber-800/30 rounded-xl p-6 mb-8">
                  <h3 className="flex items-center space-x-2 font-semibold text-cyber-200 mb-4">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span>What You'll Learn</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {module.skills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2 text-sm text-cyber-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <button 
                    onClick={handleStartTraining} 
                    className="cyber-button text-lg px-10 py-4 inline-flex items-center space-x-3"
                  >
                    <Shield className="h-6 w-6" />
                    <span>Start Training</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Training Phase */}
          {phase === 'training' && (
            <div>
              {/* Progress Bar */}
              <div className="cyber-card p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-cyber-400">
                    Scenario {scenarioIndex + 1} of {totalScenarios}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-green-400">
                      {correctAnswers} correct
                    </span>
                    <span className="text-sm text-cyber-300 font-medium">
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
