'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cybershield-theme') as Theme;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(systemDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (resolvedTheme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    }
  }, [resolvedTheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('cybershield-theme', newTheme);
  };

  // Always provide context, even when not mounted
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Return safe defaults during SSR instead of throwing
  if (context === undefined) {
    return {
      theme: 'dark' as Theme,
      resolvedTheme: 'dark' as 'light' | 'dark',
      setTheme: () => {},
    };
  }
  return context;
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'icon' | 'dropdown' | 'switch';
}

export default function ThemeToggle({ 
  className, 
  showLabel = false,
  variant = 'icon',
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  if (variant === 'switch') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <Sun className="h-4 w-4 text-cyber-500" />
        <button
          onClick={toggleTheme}
          className={cn(
            'relative w-14 h-7 rounded-full transition-colors duration-300',
            resolvedTheme === 'dark' 
              ? 'bg-cyber-700' 
              : 'bg-cyber-300'
          )}
          aria-label="Toggle theme"
        >
          <motion.div
            className={cn(
              'absolute top-1 w-5 h-5 rounded-full shadow-md',
              resolvedTheme === 'dark'
                ? 'bg-cyber-400'
                : 'bg-white'
            )}
            animate={{ left: resolvedTheme === 'dark' ? '32px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
          <Sparkles 
            className={cn(
              'absolute top-1.5 right-1.5 h-4 w-4 transition-opacity',
              resolvedTheme === 'dark' ? 'opacity-100 text-yellow-300' : 'opacity-0'
            )} 
          />
        </button>
        <Moon className="h-4 w-4 text-cyber-500" />
        {showLabel && (
          <span className="text-sm text-cyber-400 ml-2 capitalize">
            {resolvedTheme} mode
          </span>
        )}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
            'bg-cyber-800/50 hover:bg-cyber-700/50 border border-cyber-700/50'
          )}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-4 w-4 text-cyber-400" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-400" />
          )}
          {showLabel && (
            <span className="text-sm text-cyber-300 capitalize">{theme}</span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'absolute top-full right-0 mt-2 py-1 rounded-lg shadow-xl z-50',
                'bg-cyber-800 border border-cyber-700'
              )}
            >
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors',
                    theme === value
                      ? 'bg-cyber-700/50 text-cyber-200'
                      : 'text-cyber-400 hover:bg-cyber-700/30 hover:text-cyber-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default: icon variant
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'bg-cyber-800/50 hover:bg-cyber-700/50 border border-cyber-700/50',
        'hover:shadow-lg hover:shadow-cyber-500/10',
        className
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-cyber-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
