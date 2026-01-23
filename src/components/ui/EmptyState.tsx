'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  MessageSquare,
  FolderOpen,
  AlertCircle,
  Wifi,
  RefreshCw,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

type EmptyStateType = 
  | 'no-results' 
  | 'no-modules' 
  | 'no-progress' 
  | 'no-leaderboard' 
  | 'no-messages'
  | 'no-badges'
  | 'error'
  | 'offline';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const presets: Record<EmptyStateType, { icon: React.ElementType; title: string; description: string }> = {
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  'no-modules': {
    icon: BookOpen,
    title: 'No modules available',
    description: 'Check back soon for new training modules, or contact your administrator.',
  },
  'no-progress': {
    icon: BarChart3,
    title: 'No progress yet',
    description: 'Start your first training module to begin tracking your progress.',
  },
  'no-leaderboard': {
    icon: Trophy,
    title: 'Leaderboard is empty',
    description: 'Be the first to complete a module and claim the top spot!',
  },
  'no-messages': {
    icon: MessageSquare,
    title: 'No messages yet',
    description: 'Start a conversation to begin your training session.',
  },
  'no-badges': {
    icon: FolderOpen,
    title: 'No badges earned yet',
    description: 'Complete training modules and challenges to earn badges.',
  },
  'error': {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'An error occurred while loading this content. Please try again.',
  },
  'offline': {
    icon: Wifi,
    title: 'You\'re offline',
    description: 'Please check your internet connection and try again.',
  },
};

export default function EmptyState({
  type = 'no-results',
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const preset = presets[type];
  const Icon = preset.icon;
  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative mb-6"
      >
        {/* Background circles */}
        <div className="absolute inset-0 -m-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-cyber-500/20"
          />
        </div>
        
        {/* Icon container */}
        <div className="relative w-20 h-20 rounded-full bg-cyber-900/80 border border-cyber-700/50 flex items-center justify-center">
          <Icon className="h-10 w-10 text-cyber-500" />
        </div>

        {/* Decorative dots */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3"
        >
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-cyber-600" />
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-cyber-600" />
          <div className="absolute left-0 top-1/2 w-1.5 h-1.5 rounded-full bg-cyber-600" />
          <div className="absolute right-0 top-1/2 w-1.5 h-1.5 rounded-full bg-cyber-600" />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-cyber-200 mb-2"
      >
        {displayTitle}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-cyber-400 max-w-md mb-8"
      >
        {displayDescription}
      </motion.p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {action && (
            <button
              onClick={action.onClick}
              className="flex items-center gap-2 px-6 py-3 bg-cyber-600 hover:bg-cyber-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyber-600/20 hover:shadow-cyber-500/30"
            >
              {action.icon ? (
                <action.icon className="h-5 w-5" />
              ) : type === 'error' || type === 'offline' ? (
                <RefreshCw className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-6 py-3 text-cyber-400 hover:text-cyber-300 font-medium transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Specialized empty states for common use cases
export function NoSearchResults({ 
  query, 
  onClear 
}: { 
  query?: string; 
  onClear?: () => void;
}) {
  return (
    <EmptyState
      type="no-results"
      title={query ? `No results for "${query}"` : 'No results found'}
      description="Try different keywords or check the spelling of your search term."
      action={onClear ? { label: 'Clear search', onClick: onClear, icon: Search } : undefined}
    />
  );
}

export function NoProgressData({ onStartTraining }: { onStartTraining?: () => void }) {
  return (
    <EmptyState
      type="no-progress"
      title="Your journey begins here"
      description="Complete your first training module to start building your cybersecurity skills and tracking progress."
      action={onStartTraining ? { label: 'Start training', onClick: onStartTraining, icon: BookOpen } : undefined}
    />
  );
}

export function NoBadgesEarned({ onViewModules }: { onViewModules?: () => void }) {
  return (
    <EmptyState
      type="no-badges"
      title="Earn your first badge"
      description="Badges are awarded for completing modules, achieving high scores, and maintaining learning streaks."
      action={onViewModules ? { label: 'View modules', onClick: onViewModules, icon: BookOpen } : undefined}
    />
  );
}

export function ConnectionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      type="error"
      title="Connection error"
      description="Unable to load content. Please check your connection and try again."
      action={onRetry ? { label: 'Retry', onClick: onRetry, icon: RefreshCw } : undefined}
    />
  );
}
