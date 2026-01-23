'use client';

import Image from 'next/image';
import { Lock, CheckCircle, Clock, Target, ChevronRight, Play, Star } from 'lucide-react';
import { cn, getDifficultyColor, formatDuration } from '@/lib/utils';
import type { TrainingModule } from '@/types';

interface ModuleCardProps {
  module: TrainingModule;
  onClick: (module: TrainingModule) => void;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ModuleCard({ module, onClick, variant = 'default' }: ModuleCardProps) {
  const isLocked = module.status === 'locked';
  const isCompleted = module.status === 'completed';
  const isInProgress = module.status === 'in-progress';

  const progressPercentage = module.totalScenarios > 0
    ? Math.round((module.completedScenarios / module.totalScenarios) * 100)
    : 0;

  // Featured variant - large hero card
  if (variant === 'featured') {
    return (
      <button
        onClick={() => !isLocked && onClick(module)}
        disabled={isLocked}
        className={cn(
          'group relative w-full h-80 rounded-2xl overflow-hidden transition-all duration-500',
          isLocked && 'opacity-70 cursor-not-allowed',
          !isLocked && 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyber-500/20'
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {module.image ? (
            <Image
              src={module.image}
              alt={module.title}
              fill
              className={cn(
                'object-cover transition-transform duration-700',
                !isLocked && 'group-hover:scale-110'
              )}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyber-800 to-cyber-900" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className={cn(
          'absolute inset-0 transition-opacity duration-500',
          isLocked
            ? 'bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-gray-900/40'
            : 'bg-gradient-to-t from-cyber-950/95 via-cyber-950/60 to-transparent group-hover:from-cyber-950/98'
        )} />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {isLocked && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700">
              <Lock className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Locked</span>
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/50">
              <CheckCircle className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-medium text-green-400">Completed</span>
            </div>
          )}
          {isInProgress && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-cyber-500/20 backdrop-blur-sm rounded-full border border-cyber-500/50">
              <Play className="h-3.5 w-3.5 text-cyber-400" />
              <span className="text-xs font-medium text-cyber-400">In Progress</span>
            </div>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className={cn(
            'px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border',
            module.difficulty === 'beginner' && 'border-green-500/50',
            module.difficulty === 'intermediate' && 'border-yellow-500/50',
            module.difficulty === 'advanced' && 'border-orange-500/50',
            module.difficulty === 'expert' && 'border-red-500/50'
          )}>
            <span className={cn(
              'text-xs font-medium capitalize',
              getDifficultyColor(module.difficulty)
            )}>
              {module.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-10">
          <h3 className={cn(
            'text-2xl font-bold mb-2 transition-colors',
            isLocked ? 'text-gray-300' : 'text-white'
          )}>
            {module.title}
          </h3>
          
          <p className={cn(
            'text-sm mb-4 line-clamp-2',
            isLocked ? 'text-gray-500' : 'text-cyber-200'
          )}>
            {module.description}
          </p>

          {/* Stats Row */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1.5 text-cyber-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatDuration(module.estimatedMinutes)}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-cyber-400">
              <Target className="h-4 w-4" />
              <span className="text-sm">{module.totalScenarios} scenarios</span>
            </div>
            {module.bestScore !== undefined && (
              <div className="flex items-center space-x-1.5 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm">{module.bestScore}%</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {(isInProgress || isCompleted) && (
            <div className="mb-4">
              <div className="h-1.5 bg-cyber-800/80 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-cyber-500 to-cyan-400'
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA Button */}
          {!isLocked && (
            <div className={cn(
              'flex items-center space-x-2 text-sm font-medium transition-all duration-300',
              'text-cyber-400 group-hover:text-cyber-300'
            )}>
              <span>{isCompleted ? 'Review Module' : isInProgress ? 'Continue' : 'Start Training'}</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        {!isLocked && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-500/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-500 via-cyan-400 to-cyber-500" />
          </div>
        )}
      </button>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <button
        onClick={() => !isLocked && onClick(module)}
        disabled={isLocked}
        className={cn(
          'group relative flex items-center w-full p-4 rounded-xl overflow-hidden transition-all duration-300',
          'bg-cyber-900/50 border border-cyber-800/50',
          isLocked && 'opacity-60 cursor-not-allowed',
          !isLocked && 'cursor-pointer hover:bg-cyber-800/50 hover:border-cyber-700/50'
        )}
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {module.image ? (
            <Image
              src={module.image}
              alt={module.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-cyber-800 flex items-center justify-center text-2xl">
              {module.icon}
            </div>
          )}
          {isLocked && (
            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 ml-4 text-left">
          <h4 className={cn(
            'font-medium text-sm',
            isLocked ? 'text-gray-400' : 'text-cyber-100'
          )}>
            {module.title}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className={cn('text-xs capitalize', getDifficultyColor(module.difficulty))}>
              {module.difficulty}
            </span>
            <span className="text-cyber-600">•</span>
            <span className="text-xs text-cyber-500">{formatDuration(module.estimatedMinutes)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0 ml-2">
          {isCompleted && <CheckCircle className="h-5 w-5 text-green-400" />}
          {isInProgress && (
            <div className="w-10 h-10 rounded-full border-2 border-cyber-500/50 flex items-center justify-center">
              <span className="text-xs font-bold text-cyber-400">{progressPercentage}%</span>
            </div>
          )}
          {!isLocked && !isCompleted && !isInProgress && (
            <ChevronRight className="h-5 w-5 text-cyber-500 transition-transform group-hover:translate-x-1" />
          )}
        </div>
      </button>
    );
  }

  // Default variant - card with image
  return (
    <button
      onClick={() => !isLocked && onClick(module)}
      disabled={isLocked}
      className={cn(
        'group relative w-full rounded-xl overflow-hidden transition-all duration-500 text-left',
        'bg-cyber-900/80 border border-cyber-800/50',
        isLocked && 'opacity-60 cursor-not-allowed',
        !isLocked && 'cursor-pointer hover:border-cyber-600/50 hover:shadow-xl hover:shadow-cyber-500/10',
        isCompleted && 'border-green-500/30'
      )}
    >
      {/* Image Header */}
      <div className="relative h-40 overflow-hidden">
        {module.image ? (
          <Image
            src={module.image}
            alt={module.title}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              !isLocked && 'group-hover:scale-110'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyber-700 to-cyber-900 flex items-center justify-center">
            <span className="text-5xl opacity-50">{module.icon}</span>
          </div>
        )}
        
        {/* Image Overlay */}
        <div className={cn(
          'absolute inset-0 transition-opacity duration-500',
          isLocked
            ? 'bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent'
            : 'bg-gradient-to-t from-cyber-950 via-cyber-950/30 to-transparent'
        )} />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isLocked && (
            <div className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
          {isCompleted && (
            <div className="p-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/50">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          )}
          {isInProgress && (
            <div className="p-2 bg-cyber-500/20 backdrop-blur-sm rounded-full border border-cyber-500/50">
              <Play className="h-4 w-4 text-cyber-400" />
            </div>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm capitalize',
            module.difficulty === 'beginner' && 'bg-green-500/20 text-green-400 border border-green-500/30',
            module.difficulty === 'intermediate' && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            module.difficulty === 'advanced' && 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
            module.difficulty === 'expert' && 'bg-red-500/20 text-red-400 border border-red-500/30'
          )}>
            {module.difficulty}
          </span>
        </div>

        {/* Hover Play Button */}
        {!isLocked && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-cyber-500/90 backdrop-blur-sm flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className={cn(
          'font-semibold text-lg mb-2 line-clamp-1',
          isLocked ? 'text-gray-400' : 'text-cyber-100'
        )}>
          {module.title}
        </h3>

        <p className={cn(
          'text-sm mb-4 line-clamp-2 min-h-[2.5rem]',
          isLocked ? 'text-gray-500' : 'text-cyber-400'
        )}>
          {module.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center space-x-3 text-xs mb-4">
          <div className="flex items-center space-x-1 text-cyber-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDuration(module.estimatedMinutes)}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-cyber-700" />
          <div className="flex items-center space-x-1 text-cyber-500">
            <Target className="h-3.5 w-3.5" />
            <span>{module.totalScenarios} scenarios</span>
          </div>
          {module.bestScore !== undefined && (
            <>
              <div className="w-1 h-1 rounded-full bg-cyber-700" />
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{module.bestScore}%</span>
              </div>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {(isInProgress || isCompleted) && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-cyber-500">Progress</span>
              <span className={isCompleted ? 'text-green-400' : 'text-cyber-400'}>
                {progressPercentage}%
              </span>
            </div>
            <div className="h-1.5 bg-cyber-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                    : 'bg-gradient-to-r from-cyber-500 to-cyan-400'
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Skills Tags */}
        {!isLocked && module.skills && module.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {module.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-xs bg-cyber-800/80 text-cyber-400 rounded border border-cyber-700/50"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Locked Prerequisites */}
        {isLocked && module.prerequisites && module.prerequisites.length > 0 && (
          <div className="pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500 flex items-center space-x-1">
              <Lock className="h-3 w-3" />
              <span>Complete required modules to unlock</span>
            </p>
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      {!isLocked && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </button>
  );
}
