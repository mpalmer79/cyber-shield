'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header, LeaderboardSkeleton, AnimatedCounter, useSoundEffect, PulseWrapper } from '@/components';
import { useProgressStore } from '@/store';
import { cn, getLevelTitle } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

// Professional stock images
const stockImages = {
  trophy: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80',
  goldMedal: 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=400&q=80',
  silverMedal: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
  bronzeMedal: 'https://images.unsplash.com/photo-1587825045005-5d4d1e8f8b47?w=400&q=80',
  fire: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  growth: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  hero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80',
};

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

  const getRankImage = (rank: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };
    
    switch (rank) {
      case 1:
        return (
          <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size])}>
            <Image src={stockImages.goldMedal} alt="1st Place" fill className="object-cover" sizes="64px" />
          </div>
        );
      case 2:
        return (
          <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size])}>
            <Image src={stockImages.silverMedal} alt="2nd Place" fill className="object-cover" sizes="64px" />
          </div>
        );
      case 3:
        return (
          <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size])}>
            <Image src={stockImages.bronzeMedal} alt="3rd Place" fill className="object-cover" sizes="64px" />
          </div>
        );
      default:
        return (
          <div className={cn("flex items-center justify-center bg-cyber-800/80 rounded-full", sizeClasses[size])}>
            <span className="text-sm font-bold text-cyber-400">#{rank}</span>
          </div>
        );
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

      {/* Hero Section with Background */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={stockImages.hero}
            alt="Leaderboard Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-950/90 via-cyber-950/95 to-cyber-950" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/20 border-2 border-yellow-500/30">
              <Image
                src={stockImages.trophy}
                alt="Championship Trophy"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <h1 className="text-4xl font-bold text-cyber-100 mb-3">Leaderboard</h1>
            <p className="text-cyber-400 text-lg">
              See how you rank against other security trainees.
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex justify-center mb-8">
            <div className="cyber-card p-1.5 inline-flex backdrop-blur-sm bg-cyber-900/80">
              {[
                { value: 'all-time', label: 'All Time' },
                { value: 'monthly', label: 'This Month' },
                { value: 'weekly', label: 'This Week' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleFilterChange(filter.value as TimeFilter)}
                  className={cn(
                    'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    timeFilter === filter.value
                      ? 'bg-cyber-700 text-cyber-200 shadow-lg'
                      : 'text-cyber-400 hover:text-cyber-300 hover:bg-cyber-800/50'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="py-8 px-4 -mt-8">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <>
              {/* Loading State */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={cn("cyber-card p-4 text-center animate-pulse", i !== 1 && "mt-8")}>
                    <div className="w-16 h-16 bg-cyber-800/50 rounded-full mx-auto mb-3" />
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
                <div className="cyber-card p-5 text-center mt-8 hover:scale-105 transition-transform group">
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-400/50 shadow-lg group-hover:border-gray-300/70 transition-colors">
                    <Image
                      src={stockImages.silverMedal}
                      alt="Silver Medal"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">{mockLeaderboard[1].displayName}</div>
                  <div className="text-sm text-cyber-500 mb-2">Level {mockLeaderboard[1].level}</div>
                  <div className="text-lg font-semibold text-gray-300">
                    <AnimatedCounter value={mockLeaderboard[1].totalScore} />
                  </div>
                  <div className="text-xs text-cyber-600 mt-1">points</div>
                </div>

                {/* First Place */}
                <PulseWrapper color="yellow" active={true}>
                  <div className="cyber-card p-5 text-center border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent hover:scale-105 transition-transform group">
                    <div className="relative w-20 h-20 mx-auto mb-4 -mt-10 rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-2xl shadow-yellow-500/30 group-hover:border-yellow-400/70 transition-colors">
                      <Image
                        src={stockImages.goldMedal}
                        alt="Gold Medal"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="text-2xl font-bold text-cyber-100">{mockLeaderboard[0].displayName}</div>
                    <div className="text-sm text-cyber-500 mb-2">Level {mockLeaderboard[0].level}</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      <AnimatedCounter value={mockLeaderboard[0].totalScore} />
                    </div>
                    <div className="text-xs text-cyber-600 mt-1">points</div>
                    <div className="flex items-center justify-center space-x-2 mt-3 px-3 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20">
                      <div className="relative w-4 h-4 rounded-full overflow-hidden">
                        <Image src={stockImages.fire} alt="Streak" fill className="object-cover" sizes="16px" />
                      </div>
                      <span className="text-xs font-medium text-orange-400">{mockLeaderboard[0].streak} day streak</span>
                    </div>
                  </div>
                </PulseWrapper>

                {/* Third Place */}
                <div className="cyber-card p-5 text-center mt-8 hover:scale-105 transition-transform group">
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber-600/50 shadow-lg group-hover:border-amber-500/70 transition-colors">
                    <Image
                      src={stockImages.bronzeMedal}
                      alt="Bronze Medal"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">{mockLeaderboard[2].displayName}</div>
                  <div className="text-sm text-cyber-500 mb-2">Level {mockLeaderboard[2].level}</div>
                  <div className="text-lg font-semibold text-amber-500">
                    <AnimatedCounter value={mockLeaderboard[2].totalScore} />
                  </div>
                  <div className="text-xs text-cyber-600 mt-1">points</div>
                </div>
              </div>

              {/* Your Rank Card */}
              <div className="cyber-card p-5 mb-6 border-cyber-500/50 bg-gradient-to-r from-cyber-500/10 to-transparent hover:from-cyber-500/15 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyber-600 to-cyber-800 rounded-full border-2 border-cyber-500/50 shadow-lg">
                      <span className="text-lg font-bold text-cyber-200">#{userEntry.rank}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-cyber-100 text-lg">{userEntry.displayName}</div>
                      <div className="text-sm text-cyber-500">Level {userEntry.level} • {getLevelTitle(userEntry.level)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyber-200">
                      <AnimatedCounter value={userEntry.totalScore} />
                    </div>
                    <div className="text-sm text-cyber-500">points</div>
                  </div>
                </div>
              </div>

              {/* Full Leaderboard */}
              <div className="cyber-card overflow-hidden">
                <div className="p-5 border-b border-cyber-700/50 flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                    <Image src={stockImages.team} alt="Team" fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-cyber-200 text-lg">Top Performers</h2>
                    <p className="text-xs text-cyber-500">Ranked by total score</p>
                  </div>
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
                        <div className="w-12 flex justify-center">
                          {getRankImage(entry.rank, 'md')}
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
                          <div className="flex items-center space-x-1.5 px-2 py-1 bg-orange-500/10 rounded-full">
                            <div className="relative w-4 h-4 rounded-full overflow-hidden">
                              <Image src={stockImages.fire} alt="Streak" fill className="object-cover" sizes="16px" />
                            </div>
                            <span className="text-xs font-medium text-orange-400">{entry.streak}</span>
                          </div>
                        )}
                        <div className="text-right min-w-[80px]">
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
                <div className="cyber-card p-5 text-center hover:bg-cyber-800/50 transition-colors group">
                  <div className="relative w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                    <Image src={stockImages.growth} alt="Growth" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">
                    <AnimatedCounter value={mockLeaderboard.reduce((sum, e) => sum + e.totalScore, 0)} />
                  </div>
                  <div className="text-xs text-cyber-500 mt-1">Total Points Earned</div>
                </div>
                <div className="cyber-card p-5 text-center hover:bg-cyber-800/50 transition-colors group">
                  <div className="relative w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                    <Image src={stockImages.team} alt="Team" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">
                    <AnimatedCounter value={mockLeaderboard.length} />
                  </div>
                  <div className="text-xs text-cyber-500 mt-1">Active Trainees</div>
                </div>
                <div className="cyber-card p-5 text-center hover:bg-cyber-800/50 transition-colors group">
                  <div className="relative w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                    <Image src={stockImages.fire} alt="Streak" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="text-xl font-bold text-cyber-200">
                    <AnimatedCounter value={Math.max(...mockLeaderboard.map(e => e.streak))} />
                  </div>
                  <div className="text-xs text-cyber-500 mt-1">Longest Streak</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
