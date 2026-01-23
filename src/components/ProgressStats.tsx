'use client';

import { cn, getLevelTitle, calculatePercentage } from '@/lib/utils';
import { useProgressStore } from '@/store';

interface ProgressStatsProps {
  compact?: boolean;
}

const statImages = {
  totalScore: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&h=100&fit=crop',
  dayStreak: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop',
  badges: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=100&h=100&fit=crop',
  completed: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop',
  level: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
  streak: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=200&h=200&fit=crop',
};

export default function ProgressStats({ compact = false }: ProgressStatsProps) {
  const { progress } = useProgressStore();

  const xpPercentage = calculatePercentage(progress.xp, progress.xpToNextLevel);

  if (compact) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img src={statImages.level} alt="Level" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-cyber-200">Level {progress.level}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img src={statImages.dayStreak} alt="Streak" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-cyber-300">{progress.streak} day streak</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      image: statImages.totalScore,
      label: 'Total Score',
      value: progress.totalScore.toLocaleString(),
      bgGradient: 'from-yellow-500/20 to-amber-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      image: statImages.dayStreak,
      label: 'Day Streak',
      value: progress.streak,
      bgGradient: 'from-orange-500/20 to-red-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      image: statImages.badges,
      label: 'Badges',
      value: progress.badges.length,
      bgGradient: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      image: statImages.completed,
      label: 'Completed',
      value: Object.values(progress.moduleProgress).filter(
        (m) => m.status === 'completed'
      ).length,
      bgGradient: 'from-green-500/20 to-emerald-500/10',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="cyber-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={statImages.level} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-900 via-cyber-900/90 to-cyber-900/80" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-cyber-600">
                  <img src={statImages.level} alt="Level" className="w-full h-full object-cover" />
                </div>
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

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={cn(
              'cyber-card p-4 relative overflow-hidden',
              `bg-gradient-to-br ${stat.bgGradient}`,
              stat.borderColor
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-cyber-600/50 shadow-lg flex-shrink-0">
                <img 
                  src={stat.image} 
                  alt={stat.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs text-cyber-500">{stat.label}</div>
                <div className="text-xl font-bold text-cyber-200">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {progress.badges.length > 0 && (
        <div className="cyber-card p-4">
          <h4 className="text-sm font-medium text-cyber-300 mb-3 flex items-center space-x-2">
            <div className="w-5 h-5 rounded overflow-hidden">
              <img src={statImages.badges} alt="Badges" className="w-full h-full object-cover" />
            </div>
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

      {progress.streak > 0 && (
        <div className="cyber-card p-4 relative overflow-hidden border-orange-500/30">
          <div className="absolute inset-0 opacity-10">
            <img 
              src={statImages.streak} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-orange-500/30">
                <img src={statImages.dayStreak} alt="Streak" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold text-orange-300">
                  {progress.streak} Day Streak!
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
