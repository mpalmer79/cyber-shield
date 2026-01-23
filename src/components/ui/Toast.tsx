'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: {
    bg: 'bg-green-500/10 border-green-500/50',
    icon: 'text-green-400',
    text: 'text-green-300',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/50',
    icon: 'text-red-400',
    text: 'text-red-300',
  },
  warning: {
    bg: 'bg-yellow-500/10 border-yellow-500/50',
    icon: 'text-yellow-400',
    text: 'text-yellow-300',
  },
  info: {
    bg: 'bg-cyber-500/10 border-cyber-500/50',
    icon: 'text-cyber-400',
    text: 'text-cyber-300',
  },
};

function Toast({ message, type, duration = 5000, onClose, action }: ToastProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const Icon = toastIcons[type];
  const styles = toastStyles[type];

  useEffect(() => {
    if (isHovered) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        onClose();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, onClose, isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative w-full max-w-sm rounded-lg border backdrop-blur-sm shadow-lg overflow-hidden',
        styles.bg
      )}
    >
      <div className="p-4 flex items-start gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
        
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', styles.text)}>{message}</p>
          
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'mt-2 text-sm font-medium hover:underline',
                styles.icon
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-cyber-400" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyber-800/50">
        <motion.div
          className={cn('h-full', styles.icon.replace('text-', 'bg-'))}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

// Toast Container that connects to the UI store
export function ToastContainer() {
  const { toast, hideToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="sync">
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type as 'success' | 'error' | 'warning' | 'info'}
            onClose={hideToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for easy toast usage
export function useToast() {
  const { showToast, hideToast } = useUIStore();

  return {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning' as any),
    info: (message: string) => showToast(message, 'info'),
    dismiss: hideToast,
  };
}

export default Toast;
