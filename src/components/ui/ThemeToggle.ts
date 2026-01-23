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

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
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

  const themes: { value: Theme; label: string; icon: React.ElementType }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[1];
  const Icon = resolvedTheme === 'dark' ? Moon : Sun;

  // Simple icon toggle between light/dark
  if (variant === 'icon') {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-cyber-800/50 hover:bg-cyber-700/50 border border-cyber-700/50 hover:border-cyber-600/50',
          'transition-all duration-300 group',
          className
        )}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-5 w-5 text-cyber-400 group-hover:text-cyber-300 transition-colors" />
          </motion.div>
        </AnimatePresence>
        
        {/* Glow effect */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity',
            resolvedTheme === 'dark' 
              ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' 
              : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
          )}
        />
      </button>
    );
  }

  // Dropdown selector
  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-cyber-800/50 hover:bg-cyber-700/50 border border-cyber-700/50',
            'transition-all duration-200'
          )}
        >
          <currentTheme.icon className="h-4 w-4 text-cyber-400" />
          {showLabel && (
            <span className="text-sm text-cyber-300">{currentTheme.label}</span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute top-full right-0 mt-2 z-50',
                  'w-40 p-1 rounded-lg',
                  'bg-cyber-900 border border-cyber-700/50',
                  'shadow-xl shadow-black/20'
                )}
              >
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                      'text-sm transition-colors',
                      theme === t.value
                        ? 'bg-cyber-700/50 text-cyber-200'
                        : 'text-cyber-400 hover:text-cyber-200 hover:bg-cyber-800/50'
                    )}
                  >
                    <t.icon className="h-4 w-4" />
                    <span>{t.label}</span>
                    {theme === t.value && (
                      <Sparkles className="h-3 w-3 ml-auto text-cyber-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Switch style toggle
  if (variant === 'switch') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Sun className={cn(
          'h-4 w-4 transition-colors',
          resolvedTheme === 'light' ? 'text-yellow-400' : 'text-cyber-600'
        )} />
        
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'relative w-14 h-7 rounded-full',
            'bg-cyber-800 border border-cyber-700/50',
            'transition-colors duration-300',
            resolvedTheme === 'dark' && 'bg-cyber-700'
          )}
        >
          <motion.div
            className={cn(
              'absolute top-1 w-5 h-5 rounded-full',
              'bg-gradient-to-br shadow-lg',
              resolvedTheme === 'dark'
                ? 'from-indigo-400 to-purple-500 shadow-indigo-500/30'
                : 'from-yellow-400 to-orange-500 shadow-yellow-500/30'
            )}
            animate={{
              left: resolvedTheme === 'dark' ? '32px' : '4px',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>

        <Moon className={cn(
          'h-4 w-4 transition-colors',
          resolvedTheme === 'dark' ? 'text-indigo-400' : 'text-cyber-600'
        )} />

        {showLabel && (
          <span className="text-sm text-cyber-400 ml-2">
            {currentTheme.label}
          </span>
        )}
      </div>
    );
  }

  return null;
}
