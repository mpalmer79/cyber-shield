'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Header, PhishingScenario, ChatInterface, ScoreDisplay } from '@/components';
import { useModulesStore, useSessionStore, useProgressStore } from '@/store';
import { cn, generateId } from '@/lib/utils';
import type { PhishingScenario as PhishingScenarioType, ChatMessage, SessionFeedback } from '@/types';

type TrainingPhase = 'intro' | 'training' | 'results';

export default function TrainingModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;

  const { getModule, updateModuleStatus, updateModuleScore } = useModulesStore();
  const { startSession, endSession, addMessage, updateScore, score, messages, isActive } = useSessionStore();
  const { updateModuleProgress, addXP, updateStreak } = useProgressStore();

  const module = getModule(moduleId);

  const [phase, setPhase] = useState<TrainingPhase>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<PhishingScenarioType | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | undefined>();
  const [sessionFeedback, setSessionFeedback] = useState<SessionFeedback | null>(null);
  const [totalScenarios] = useState(5);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Generate a new scenario
  const generateScenario = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setUserAnswer(undefined);

    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: module?.type || 'phishing',
          difficulty: module?.difficulty || 'beginner',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const data = await response.json();
      setCurrentScenario(data.scenario);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate scenario');
      // Fallback to a static scenario for demo purposes
      setCurrentScenario({
        id: generateId('scenario'),
        type: 'email',
        isPhishing: true,
        difficulty: 'beginner',
        content: {
          from: 'IT Security Team',
          fromEmail: 'security@company-support.net',
          to: 'you@company.com',
          subject: 'URGENT: Your Password Expires in 24 Hours',
          body: `Dear Employee,

Your network password will expire in 24 hours. To avoid losing access to your account, please click the link below to verify your credentials immediately:

https://company-secure-login.net/verify

This is an automated message. Please do not reply.

Best regards,
IT Security Department`,
          timestamp: new Date().toISOString(),
        },
        redFlags: [
          'Urgency tactics ("URGENT", "24 hours")',
          'Suspicious sender domain (company-support.net instead of actual company domain)',
          'Generic greeting ("Dear Employee")',
          'Suspicious link domain (company-secure-login.net)',
          'Pressure to act immediately',
        ],
        explanation: 'This is a classic phishing attempt using urgency and impersonation. The sender domain doesn\'t match the real company, and the link leads to a suspicious external site. Legitimate IT departments typically don\'t ask you to verify credentials via email links.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [module]);

  // Handle starting the training
  const handleStartTraining = () => {
    startSession(moduleId);
    updateModuleStatus(moduleId, 'in-progress');
    setPhase('training');
    generateScenario();
  };

  // Handle user's answer
  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    setShowResult(true);

    if (currentScenario && answer === currentScenario.isPhishing) {
      updateScore(20);
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  // Handle moving to next scenario
  const handleNextScenario = () => {
    if (scenarioIndex + 1 >= totalScenarios) {
      // Training complete
      finishTraining();
    } else {
      setScenarioIndex((prev) => prev + 1);
      generateScenario();
    }
  };

  // Finish training and show results
  const finishTraining = () => {
    const finalScore = Math.round((correctAnswers / totalScenarios) * 100);
    const passed = finalScore >= (module?.requiredScore || 70);

    const feedback: SessionFeedback = {
      overallScore: finalScore,
      maxScore: 100,
      correctActions: correctAnswers,
      totalActions: totalScenarios,
      missedRedFlags: [],
      identifiedRedFlags: [],
      strengths: correctAnswers >= 3 ? [
        'Good eye for suspicious sender addresses',
        'Recognized urgency manipulation tactics',
      ] : [],
      improvements: correctAnswers < 4 ? [
        'Pay closer attention to sender email domains',
        'Be wary of requests for immediate action',
        'Always verify links before clicking',
      ] : [],
      detailedAnalysis: passed
        ? 'Great job! You demonstrated solid phishing detection skills. Continue practicing to maintain your awareness.'
        : 'Keep practicing! Phishing attacks are becoming more sophisticated. Focus on examining sender addresses and link destinations carefully.',
    };

    setSessionFeedback(feedback);
    endSession(feedback);

    // Update progress
    updateModuleProgress(moduleId, finalScore, passed);
    updateModuleScore(moduleId, finalScore);
    addXP(Math.round(finalScore * 1.5));
    updateStreak();

    if (passed) {
      updateModuleStatus(moduleId, 'completed');
    }

    setPhase('results');
  };

  // Handle retry
  const handleRetry = () => {
    setScenarioIndex(0);
    setCorrectAnswers(0);
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
            <div className="cyber-card p-8">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">{module.icon}</span>
                <h1 className="text-3xl font-bold text-cyber-100 mb-2">{module.title}</h1>
                <p className="text-cyber-400 max-w-2xl mx-auto">{module.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-cyber-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyber-200">{totalScenarios}</div>
                  <div className="text-sm text-cyber-500">Scenarios</div>
                </div>
                <div className="bg-cyber-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyber-200">{module.requiredScore}%</div>
                  <div className="text-sm text-cyber-500">Required Score</div>
                </div>
                <div className="bg-cyber-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyber-200 capitalize">{module.difficulty}</div>
                  <div className="text-sm text-cyber-500">Difficulty</div>
                </div>
              </div>

              <div className="bg-cyber-800/30 rounded-lg p-4 mb-8">
                <h3 className="font-medium text-cyber-200 mb-2">What you'll learn:</h3>
                <ul className="space-y-2">
                  {module.skills.map((skill) => (
                    <li key={skill} className="flex items-center space-x-2 text-sm text-cyber-400">
                      <ChevronRight className="h-4 w-4 text-cyber-500" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <button onClick={handleStartTraining} className="cyber-button">
                  Start Training
                </button>
              </div>
            </div>
          )}

          {/* Training Phase */}
          {phase === 'training' && (
            <div>
              {/* Progress Bar */}
              <div className="cyber-card p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyber-400">
                    Scenario {scenarioIndex + 1} of {totalScenarios}
                  </span>
                  <span className="text-sm text-cyber-300">
                    Score: {score}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((scenarioIndex + 1) / totalScenarios) * 100}%` }}
                  />
                </div>
              </div>

              {/* Scenario Content */}
              {isLoading ? (
                <div className="cyber-card p-12 text-center">
                  <Loader2 className="h-8 w-8 text-cyber-400 animate-spin mx-auto mb-4" />
                  <p className="text-cyber-400">Generating scenario...</p>
                </div>
              ) : error ? (
                <div className="cyber-card p-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
                  <p className="text-cyber-300 mb-4">{error}</p>
                  <button
                    onClick={generateScenario}
                    className="cyber-button-outline flex items-center space-x-2 mx-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              ) : currentScenario ? (
                <div className="space-y-6">
                  <PhishingScenario
                    scenario={currentScenario}
                    onAnswer={handleAnswer}
                    showResult={showResult}
                    userAnswer={userAnswer}
                  />

                  {showResult && (
                    <div className="text-center">
                      <button
                        onClick={handleNextScenario}
                        className="cyber-button"
                      >
                        {scenarioIndex + 1 >= totalScenarios ? 'See Results' : 'Next Scenario'}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
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
