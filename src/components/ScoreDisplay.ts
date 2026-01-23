'use client';

import { Trophy, Target, Clock, TrendingUp, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn, formatScoreWithGrade, formatDuration } from '@/lib/utils';
import type { SessionFeedback } from '@/types';

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  feedback?: SessionFeedback;
  timeSpentSeconds?: number;
  showDetailed?: boolean;
  onContinue?: () => void;
  onRetry?: () => void;
}

export default function ScoreDisplay({
  score,
  maxScore,
  feedback,
  timeSpentSeconds,
  showDetailed = true,
  onContinue,
  onRetry,
}: ScoreDisplayProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const { grade, color } = formatScoreWithGrade(percentage);
  const passed = percentage >= 70;

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="cyber-card p-8 text-center relative overflow-hidden">
        {/* Background effect */}
        <div 
          className={cn(
            'absolute inset-0 opacity-10',
            passed ? 'bg-gradient-to-br from-green-500 to-cyber-500' : 'bg-gradient-to-br from-orange-500 to-red-500'
          )}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div className={cn(
            'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
            passed ? 'bg-green-500/20' : 'bg-orange-500/20'
          )}>
            {passed ? (
              <Trophy className="h-8 w-8 text-green-400" />
            ) : (
              <Target className="h-8 w-8 text-orange-400" />
            )}
          </div>

          {/* Score Display */}
          <div className="mb-2">
            <span className={cn('text-6xl font-bold', color)}>{percentage}</span>
            <span className="text-2xl text-cyber-500">%</span>
          </div>

          {/* Grade */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-cyber-400">Grade:</span>
            <span className={cn('text-2xl font-bold', color)}>{grade}</span>
          </div>

          {/* Status Badge */}
          <div className={cn(
            'inline-flex items-center space-x-2 px-4 py-2 rounded-full',
            passed
              ? 'bg-green-500/20 border border-green-500/50'
              : 'bg-orange-500/20 border border-orange-500/50'
          )}>
            {passed ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">Module Passed!</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 font-medium">Keep Practicing</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="cyber-card p-4 text-center">
          <Target className="h-5 w-5 text-cyber-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-cyber-200">
            {feedback?.correctActions || 0}/{feedback?.totalActions || 0}
          </div>
          <div className="text-xs text-cyber-500">Correct Actions</div>
        </div>

        <div className="cyber-card p-4 text-center">
          <TrendingUp className="h-5 w-5 text-cyber-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-cyber-200">
            +{Math.round(percentage * 1.5)}
          </div>
          <div className="text-xs text-cyber-500">XP Earned</div>
        </div>

        {timeSpentSeconds && (
          <div className="cyber-card p-4 text-center">
            <Clock className="h-5 w-5 text-cyber-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-cyber-200">
              {formatDuration(Math.round(timeSpentSeconds / 60))}
            </div>
            <div className="text-xs text-cyber-500">Time Spent</div>
          </div>
        )}
      </div>

      {/* Detailed Feedback */}
      {showDetailed && feedback && (
        <div className="space-y-4">
          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="cyber-card p-4">
              <h4 className="flex items-center space-x-2 text-green-400 font-medium mb-3">
                <CheckCircle className="h-4 w-4" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-cyber-300">
                    <span className="text-green-400">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="cyber-card p-4">
              <h4 className="flex items-center space-x-2 text-yellow-400 font-medium mb-3">
                <TrendingUp className="h-4 w-4" />
                <span>Areas for Improvement</span>
              </h4>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-cyber-300">
                    <span className="text-yellow-400">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missed Red Flags */}
          {feedback.missedRedFlags && feedback.missedRedFlags.length > 0 && (
            <div className="cyber-card p-4">
              <h4 className="flex items-center space-x-2 text-red-400 font-medium mb-3">
                <AlertTriangle className="h-4 w-4" />
                <span>Missed Red Flags</span>
              </h4>
              <ul className="space-y-2">
                {feedback.missedRedFlags.map((flag, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-cyber-300">
                    <span className="text-red-400">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Analysis */}
          {feedback.detailedAnalysis && (
            <div className="cyber-card p-4">
              <h4 className="flex items-center space-x-2 text-cyber-400 font-medium mb-3">
                <Award className="h-4 w-4" />
                <span>Analysis</span>
              </h4>
              <p className="text-sm text-cyber-300 leading-relaxed">
                {feedback.detailedAnalysis}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 cyber-button-outline"
          >
            Try Again
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            className="flex-1 cyber-button"
          >
            {passed ? 'Continue' : 'Back to Modules'}
          </button>
        )}
      </div>
    </div>
  );
}
