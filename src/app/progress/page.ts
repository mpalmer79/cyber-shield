'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Header, ProgressStats, NoProgressData, NoBadgesEarned, ProgressStatsSkeleton, AnimatedCounter, AnimatedProgress, Confetti } from '@/components';
import { useProgressStore, useModulesStore } from '@/store';
import { cn, formatDate, getLevelTitle, getDifficultyColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProgressPage() {
  const { progress } = useProgressStore();
  const { modules } = useModulesStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const completedModules = Object.values(progress.moduleProgress).filter(
    (m) => m.status === 'completed'
  );
  const totalAttempts = Object.values(progress.moduleProgress).reduce(
    (sum, m) => sum + (m.attempts || 0),
    0
  );
  const avgScore = completedModules.length > 0
    ? Math.round(
        completedModules.reduce((sum, m) => sum + m.bestScore, 0) / completedModules.length
      )
    : 0;

  // Get module details
  const getModuleDetails = (moduleId: string) => {
    return modules.find((m) => m.id === moduleId);
  };

  const handleStartTraining = () => {
    router.push('/training');
  };

  // Check for recent completion (for confetti)
  useEffect(() => {
    const recentCompletion = completedModules.some(m => {
      if (!m.lastAttemptDate) return false;
      const attemptDate = new Date(m.lastAttemptDate);
      const now = new Date();
      return (now.getTime() - attemptDate.getTime()) < 60000; // Within last minute
    });
    if (recentCompletion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [completedModules.length]);

  const hasAnyProgress = Object.keys(progress.moduleProgress).length > 0;

  return (
    <div className="min-h-screen">
      <Header currentPage="progress" />
      <Confetti active={showConfetti} />

      <main className="py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyber-100 mb-2">Your Progress</h1>
            <p className="text-cyber-400">
              Track your cybersecurity training journey and achievements.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Progress Stats */}
            <div className="lg:col-span-1">
              {isLoading ? <ProgressStatsSkeleton /> : <ProgressStats />}
            </div>

            {/* Right Column - Detailed Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="cyber-card p-4 text-center">
                  <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-200">
                    <AnimatedCounter value={progress.totalScore} />
                  </div>
                  <div className="text-xs text-cyber-500">Total Points</div>
                </div>
                <div className="cyber-card p-4 text-center">
                  <Target className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-200">
                    <AnimatedCounter value={completedModules.length} />
                  </div>
                  <div className="text-xs text-cyber-500">Modules Completed</div>
                </div>
                <div className="cyber-card p-4 text-center">
                  <BarChart3 className="h-6 w-6 text-cyber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-200">
                    <AnimatedCounter value={avgScore} suffix="%" />
                  </div>
                  <div className="text-xs text-cyber-500">Avg. Score</div>
                </div>
                <div className="cyber-card p-4 text-center">
                  <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyber-200">
                    <AnimatedCounter value={totalAttempts} />
                  </div>
                  <div className="text-xs text-cyber-500">Total Attempts</div>
                </div>
              </div>

              {/* Module Progress List */}
              <div className="cyber-card p-6">
                <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-cyber-400" />
                  <span>Module Progress</span>
                </h2>

                {!hasAnyProgress ? (
                  <NoProgressData onStartTraining={handleStartTraining} />
                ) : (
                  <div className="space-y-4">
                    {Object.entries(progress.moduleProgress).map(([moduleId, moduleProgress]) => {
                      const moduleDetails = getModuleDetails(moduleId);
                      if (!moduleDetails) return null;

                      return (
                        <div
                          key={moduleId}
                          className="bg-cyber-800/30 rounded-lg p-4 border border-cyber-700/30 hover:border-cyber-600/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{moduleDetails.icon}</span>
                              <div>
                                <h3 className="font-medium text-cyber-200">
                                  {moduleDetails.title}
                                </h3>
                                <span className={cn(
                                  'text-xs capitalize',
                                  getDifficultyColor(moduleDetails.difficulty)
                                )}>
                                  {moduleDetails.difficulty}
                                </span>
                              </div>
                            </div>
                            <div className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium',
                              moduleProgress.status === 'completed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            )}>
                              {moduleProgress.status === 'completed' ? 'Completed' : 'In Progress'}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-cyber-500">Best Score</span>
                              <div className="font-semibold text-cyber-200">
                                {moduleProgress.bestScore}%
                              </div>
                            </div>
                            <div>
                              <span className="text-cyber-500">Attempts</span>
                              <div className="font-semibold text-cyber-200">
                                {moduleProgress.attempts}
                              </div>
                            </div>
                            <div>
                              <span className="text-cyber-500">Last Attempt</span>
                              <div className="font-semibold text-cyber-200">
                                {moduleProgress.lastAttemptDate
                                  ? formatDate(moduleProgress.lastAttemptDate)
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>

                          {/* Animated Score Bar */}
                          <div className="mt-3">
                            <AnimatedProgress 
                              value={moduleProgress.bestScore} 
                              max={100}
                              color={moduleProgress.bestScore >= moduleDetails.requiredScore ? 'green' : 'cyber'}
                            />
                            <div className="flex justify-between text-xs text-cyber-500 mt-1">
                              <span>0%</span>
                              <span>Required: {moduleDetails.requiredScore}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="cyber-card p-6">
                <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                  <Award className="h-5 w-5 text-cyber-400" />
                  <span>Badges & Achievements</span>
                </h2>

                {progress.badges.length === 0 ? (
                  <NoBadgesEarned onViewModules={handleStartTraining} />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {progress.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={cn(
                          'p-4 rounded-lg border text-center transition-all hover:scale-105',
                          badge.rarity === 'legendary' && 'bg-yellow-500/10 border-yellow-500/30',
                          badge.rarity === 'epic' && 'bg-purple-500/10 border-purple-500/30',
                          badge.rarity === 'rare' && 'bg-blue-500/10 border-blue-500/30',
                          badge.rarity === 'common' && 'bg-cyber-800/50 border-cyber-700/30'
                        )}
                      >
                        <span className="text-3xl block mb-2">{badge.icon}</span>
                        <h3 className="font-medium text-cyber-200 text-sm">{badge.name}</h3>
                        <p className="text-xs text-cyber-500 mt-1">{badge.description}</p>
                        {badge.earnedAt && (
                          <p className="text-xs text-cyber-600 mt-2">
                            {formatDate(badge.earnedAt)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
