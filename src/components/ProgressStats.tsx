'use client';

import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  TrendingUp,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { cn, getLevelTitle, calculatePercentage } from '@/lib/utils';
import { useProgressStore } from '@/store';

interface ProgressStatsProps {
  compact?: boolean;
}

export default function ProgressStats({ compact = false }: ProgressStatsProps) {
  const { progress } = useProgressStore();

  const xpPercentage = calculatePercentage(progress.xp, progress.xpToNextLevel);

  if (compact) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-cyber-400" />
          <span className="text-sm font-medium text-cyber-200">Level {progress.level}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm text-cyber-300">{progress.streak} day streak</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Trophy,
      label: 'Total Score',
      value: progress.totalScore.toLocaleString(),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: progress.streak,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
    {
      icon: Award,
      label: 'Badges',
      value: progress.badges.length,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: BookOpen,
      label: 'Completed',
      value: Object.values(progress.moduleProgress).filter(
        (m) => m.status === 'completed'
      ).length,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <div className="cyber-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-5 w-5 text-cyber-400" />
                <span className="text-cyber-500 text-sm">Current Level</span>
              </div>
              <div className="text-4xl font-bold text-cyber-100">{progress.level}</div>
              <div className="text-cyber-400 text-sm">{getLevelTitle(progress.level)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-cyber-500 mb-1">XP Progress</div>
              <div className="text-lg font-semibold text-cyber-300">
                {progress.xp} / {progress.xpToNextLevel}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="progress-bar h-3">
              <div
                className="progress-bar-fill"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-cyber-500 mt-1">
              <span>Level {progress.level}</span>
              <span>{progress.xpToNextLevel - progress.xp} XP to Level {progress.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="cyber-card p-4">
            <div className="flex items-center space-x-3">
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <div>
                <div className="text-xs text-cyber-500">{stat.label}</div>
                <div className="text-xl font-bold text-cyber-200">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Badges */}
      {progress.badges.length > 0 && (
        <div className="cyber-card p-4">
          <h4 className="text-sm font-medium text-cyber-300 mb-3 flex items-center space-x-2">
            <Award className="h-4 w-4 text-cyber-400" />
            <span>Recent Badges</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {progress.badges.slice(-4).map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs',
                  badge.rarity === 'legendary' && 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
                  badge.rarity === 'epic' && 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                  badge.rarity === 'rare' && 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                  badge.rarity === 'common' && 'bg-cyber-700/50 text-cyber-300 border border-cyber-600/30'
                )}
                title={badge.description}
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Motivator */}
      {progress.streak > 0 && (
        <div className="cyber-card p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame className="h-8 w-8 text-orange-400" />
              <div>
                <div className="font-semibold text-orange-300">
                  {progress.streak} Day Streak! 🔥
                </div>
                <div className="text-xs text-orange-400/70">
                  Keep it going! Train tomorrow to continue your streak.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
