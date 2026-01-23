'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp,
  Flame,
  Users,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Header, LeaderboardSkeleton, AnimatedCounter, useSoundEffect, PulseWrapper } from '@/components';
import { useProgressStore } from '@/store';
import { cn, getLevelTitle } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

// Mock leaderboard data (in production, this would come from an API)
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '1', displayName: 'CyberNinja42', totalScore: 15420, level: 12, modulesCompleted: 8, streak: 45 },
  { rank: 2, userId: '2', displayName: 'SecureShield', totalScore: 14200, level: 11, modulesCompleted: 8, streak: 32 },
  { rank: 3, userId: '3', displayName: 'PhishHunter', totalScore: 12800, level: 10, modulesCompleted: 7, streak: 28 },
  { rank: 4, userId: '4', displayName: 'DataGuardian', totalScore: 11500, level: 9, modulesCompleted: 7, streak: 21 },
  { rank: 5, userId: '5', displayName: 'ThreatAnalyst', totalScore: 10200, level: 9, modulesCompleted: 6, streak: 15 },
  { rank: 6, userId: '6', displayName: 'FirewallPro', totalScore: 9800, level: 8, modulesCompleted: 6, streak: 12 },
  { rank: 7, userId: '7', displayName: 'CryptoDefender', totalScore: 8500, level: 8, modulesCompleted: 5, streak: 10 },
  { rank: 8, userId: '8', displayName: 'MalwareSlayer', totalScore: 7200, level: 7, modulesCompleted: 5, streak: 8 },
  { rank: 9, userId: '9', displayName: 'NetSentry', totalScore: 6800, level: 7, modulesCompleted: 4, streak: 5 },
  { rank: 10, userId: '10', displayName: 'CodeShield', totalScore: 5500, level: 6, modulesCompleted: 4, streak: 3 },
];

type TimeFilter = 'all-time' | 'monthly' | 'weekly';

export default function LeaderboardPage() {
  const { progress } = useProgressStore();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [isLoading, setIsLoading] = useState(true);
  const playSound = useSoundEffect();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Add current user to leaderboard for comparison
  const userEntry: LeaderboardEntry = {
    rank: 42, // Placeholder rank
    userId: 'current-user',
    displayName: 'You',
    totalScore: progress.totalScore,
    level: progress.level,
    modulesCompleted: Object.values(progress.moduleProgress).filter(m => m.status === 'completed').length,
    streak: progress.streak,
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-cyber-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30';
      default:
        return 'bg-cyber-800/30 border-cyber-700/30';
    }
  };

  const handleFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
    playSound('click');
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="leaderboard" />

      <main className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-cyber-100 mb-2">Leaderboard</h1>
            <p className="text-cyber-400">
              See how you rank against other security trainees.
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex justify-center mb-8">
            <div className="cyber-card p-1 inline-flex">
              {[
                { value: 'all-time', label: 'All Time' },
                { value: 'monthly', label: 'This Month' },
                { value: 'weekly', label: 'This Week' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleFilterChange(filter.value as TimeFilter)}
                  className={cn(
                    'px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    timeFilter === filter.value
                      ? 'bg-cyber-700 text-cyber-200'
                      : 'text-cyber-400 hover:text-cyber-300'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <>
              {/* Loading State */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={cn("cyber-card p-4 text-center animate-pulse", i !== 1 && "mt-8")}>
                    <div className="w-12 h-12 bg-cyber-800/50 rounded-full mx-auto mb-3" />
                    <div className="h-6 bg-cyber-800/50 rounded w-24 mx-auto mb-2" />
                    <div className="h-4 bg-cyber-800/50 rounded w-16 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="cyber-card p-4 mb-6">
                <LeaderboardSkeleton count={10} />
              </div>
            </>
          ) : (
            <>
              {/* Top 3 Podium */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Second Place */}
                <div className="cyber-card p-4 text-center mt-8 hover:scale-105 transition-transform">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-400/20 rounded-full mb-3">
                    <Medal className="h-6 w-6 text-gray-300" />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">{mockLeaderboard[1].displayName}</div>
                  <div className="text-sm text-cyber-500">Level {mockLeaderboard[1].level}</div>
                  <div className="text-lg font-semibold text-gray-300 mt-2">
                    <AnimatedCounter value={mockLeaderboard[1].totalScore} />
                  </div>
                </div>

                {/* First Place */}
                <PulseWrapper color="yellow" active={true}>
                  <div className="cyber-card p-4 text-center border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent hover:scale-105 transition-transform">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-3 -mt-8 border-4 border-cyber-950">
                      <Crown className="h-8 w-8 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-cyber-100">{mockLeaderboard[0].displayName}</div>
                    <div className="text-sm text-cyber-500">Level {mockLeaderboard[0].level}</div>
                    <div className="text-2xl font-bold text-yellow-400 mt-2">
                      <AnimatedCounter value={mockLeaderboard[0].totalScore} />
                    </div>
                    <div className="flex items-center justify-center space-x-1 mt-2 text-xs text-orange-400">
                      <Flame className="h-3 w-3" />
                      <span>{mockLeaderboard[0].streak} day streak</span>
                    </div>
                  </div>
                </PulseWrapper>

                {/* Third Place */}
                <div className="cyber-card p-4 text-center mt-8 hover:scale-105 transition-transform">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600/20 rounded-full mb-3">
                    <Medal className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">{mockLeaderboard[2].displayName}</div>
                  <div className="text-sm text-cyber-500">Level {mockLeaderboard[2].level}</div>
                  <div className="text-lg font-semibold text-amber-500 mt-2">
                    <AnimatedCounter value={mockLeaderboard[2].totalScore} />
                  </div>
                </div>
              </div>

              {/* Your Rank Card */}
              <div className="cyber-card p-4 mb-6 border-cyber-500/50 bg-cyber-500/5 hover:bg-cyber-500/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-cyber-700 rounded-full">
                      <span className="text-lg font-bold text-cyber-300">#{userEntry.rank}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-cyber-100">{userEntry.displayName}</div>
                      <div className="text-sm text-cyber-500">Level {userEntry.level} • {getLevelTitle(userEntry.level)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-cyber-200">
                      <AnimatedCounter value={userEntry.totalScore} />
                    </div>
                    <div className="text-sm text-cyber-500">points</div>
                  </div>
                </div>
              </div>

              {/* Full Leaderboard */}
              <div className="cyber-card overflow-hidden">
                <div className="p-4 border-b border-cyber-700/50">
                  <h2 className="font-semibold text-cyber-200 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-cyber-400" />
                    <span>Top Performers</span>
                  </h2>
                </div>

                <div className="divide-y divide-cyber-800/50">
                  {mockLeaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={cn(
                        'flex items-center justify-between p-4 transition-all hover:bg-cyber-800/20 hover:translate-x-1',
                        getRankBg(entry.rank)
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 flex justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <div className="font-medium text-cyber-200">{entry.displayName}</div>
                          <div className="text-xs text-cyber-500">
                            Level {entry.level} • {entry.modulesCompleted} modules
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {entry.streak > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-orange-400">
                            <Flame className="h-3 w-3" />
                            <span>{entry.streak}</span>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="font-semibold text-cyber-200">
                            {entry.totalScore.toLocaleString()}
                          </div>
                          <div className="text-xs text-cyber-500">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="cyber-card p-4 text-center hover:bg-cyber-800/50 transition-colors">
                  <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-cyber-200">
                    <AnimatedCounter value={mockLeaderboard.reduce((sum, e) => sum + e.totalScore, 0)} />
                  </div>
                  <div className="text-xs text-cyber-500">Total Points Earned</div>
                </div>
                <div className="cyber-card p-4 text-center hover:bg-cyber-800/50 transition-colors">
                  <Users className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-cyber-200">
                    <AnimatedCounter value={mockLeaderboard.length} />
                  </div>
                  <div className="text-xs text-cyber-500">Active Trainees</div>
                </div>
                <div className="cyber-card p-4 text-center hover:bg-cyber-800/50 transition-colors">
                  <Flame className="h-5 w-5 text-orange-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-cyber-200">
                    <AnimatedCounter value={Math.max(...mockLeaderboard.map(e => e.streak))} />
                  </div>
                  <div className="text-xs text-cyber-500">Longest Streak</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
