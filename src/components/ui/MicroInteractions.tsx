'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store';

// ============================================
// Sound Effects Manager
// ============================================

type SoundEffect = 
  | 'click' 
  | 'success' 
  | 'error' 
  | 'notification' 
  | 'levelUp' 
  | 'badge'
  | 'hover'
  | 'toggle';

// Audio context and buffers (lazy loaded)
let audioContext: AudioContext | null = null;

const soundConfigs: Record<SoundEffect, { frequency: number; duration: number; type: OscillatorType; volume: number }> = {
  click: { frequency: 800, duration: 0.05, type: 'sine', volume: 0.1 },
  success: { frequency: 880, duration: 0.15, type: 'sine', volume: 0.15 },
  error: { frequency: 200, duration: 0.2, type: 'sawtooth', volume: 0.1 },
  notification: { frequency: 660, duration: 0.1, type: 'sine', volume: 0.12 },
  levelUp: { frequency: 523.25, duration: 0.3, type: 'sine', volume: 0.15 },
  badge: { frequency: 1046.5, duration: 0.2, type: 'sine', volume: 0.12 },
  hover: { frequency: 1200, duration: 0.02, type: 'sine', volume: 0.05 },
  toggle: { frequency: 600, duration: 0.03, type: 'sine', volume: 0.08 },
};

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playSound(effect: SoundEffect) {
  try {
    const ctx = getAudioContext();
    const config = soundConfigs[effect];
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
    
    // For level up, create an ascending tone
    if (effect === 'levelUp') {
      oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + config.duration);
    }
    
    gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);
  } catch (e) {
    // Audio not supported or blocked
    console.debug('Sound effect not played:', e);
  }
}

// Hook to use sound effects with settings awareness
export function useSoundEffect() {
  const { settings } = useSettingsStore();
  
  return useCallback((effect: SoundEffect) => {
    if (settings.soundEffects) {
      playSound(effect);
    }
  }, [settings.soundEffects]);
}

// ============================================
// Haptic Feedback (Visual simulation)
// ============================================

export function useHapticFeedback() {
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    // Try native haptic if available (mobile devices)
    if ('vibrate' in navigator) {
      const patterns: Record<string, number[]> = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30],
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  return { triggerHaptic };
}

// ============================================
// Interactive Button with Sound & Animation
// ============================================

interface InteractiveButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  soundOnClick?: SoundEffect;
  soundOnHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function InteractiveButton({
  variant = 'primary',
  size = 'md',
  soundOnClick = 'click',
  soundOnHover = false,
  children,
  className,
  onClick,
  disabled,
  type = 'button',
}: InteractiveButtonProps) {
  const playEffect = useSoundEffect();
  const { triggerHaptic } = useHapticFeedback();
  const controls = useAnimation();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    playEffect(soundOnClick);
    triggerHaptic('light');
    
    // Ripple effect animation
    await controls.start({
      scale: [1, 0.97, 1],
      transition: { duration: 0.15 },
    });
    
    onClick?.(e);
  };

  const handleHover = () => {
    if (soundOnHover && !disabled) {
      playEffect('hover');
    }
  };

  const variants = {
    primary: 'bg-cyber-600 hover:bg-cyber-500 text-white shadow-lg shadow-cyber-600/20 hover:shadow-cyber-500/30',
    secondary: 'bg-cyber-800/50 hover:bg-cyber-700/50 text-cyber-300 border border-cyber-700/50',
    ghost: 'hover:bg-cyber-800/50 text-cyber-400 hover:text-cyber-300',
    danger: 'bg-red-600/80 hover:bg-red-500 text-white shadow-lg shadow-red-600/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      type={type}
      animate={controls}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onHoverStart={handleHover}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative rounded-lg font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-cyber-500/50 focus:ring-offset-2 focus:ring-offset-cyber-950',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}

// ============================================
// Animated Counter
// ============================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  className,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const playEffect = useSoundEffect();

  useEffect(() => {
    const startValue = displayValue;
    const diff = value - startValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.round(startValue + diff * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (diff > 0) {
        playEffect('success');
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      key={displayValue}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

// ============================================
// Progress Bar with Animation
// ============================================

interface AnimatedProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyber' | 'green' | 'yellow' | 'red';
  animate?: boolean;
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'cyber',
  animate = true,
  className,
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const playEffect = useSoundEffect();
  const [prevPercentage, setPrevPercentage] = useState(0);

  useEffect(() => {
    if (percentage >= 100 && prevPercentage < 100) {
      playEffect('success');
    }
    setPrevPercentage(percentage);
  }, [percentage]);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    cyber: 'from-cyber-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    yellow: 'from-yellow-500 to-orange-400',
    red: 'from-red-500 to-rose-400',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-cyber-400 mb-1">
          <span>Progress</span>
          <AnimatedCounter value={Math.round(percentage)} suffix="%" />
        </div>
      )}
      <div className={cn('w-full bg-cyber-800/50 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', colors[color])}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ============================================
// Pulse Effect Wrapper
// ============================================

interface PulseWrapperProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  className?: string;
}

export function PulseWrapper({
  children,
  active = true,
  color = 'cyber',
  className,
}: PulseWrapperProps) {
  if (!active) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      <motion.div
        className={cn(
          'absolute inset-0 rounded-lg',
          color === 'cyber' && 'bg-cyber-500/20',
          color === 'green' && 'bg-green-500/20',
          color === 'red' && 'bg-red-500/20',
          color === 'yellow' && 'bg-yellow-500/20'
        )}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {children}
    </div>
  );
}

// ============================================
// Shake Animation Wrapper
// ============================================

interface ShakeWrapperProps {
  children: React.ReactNode;
  trigger?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function ShakeWrapper({
  children,
  trigger = false,
  intensity = 'medium',
}: ShakeWrapperProps) {
  const playEffect = useSoundEffect();
  const controls = useAnimation();

  const intensities = {
    light: { x: [-2, 2, -2, 2, 0], duration: 0.3 },
    medium: { x: [-4, 4, -4, 4, 0], duration: 0.4 },
    heavy: { x: [-8, 8, -8, 8, -4, 4, 0], duration: 0.5 },
  };

  useEffect(() => {
    if (trigger) {
      playEffect('error');
      controls.start({
        x: intensities[intensity].x,
        transition: { duration: intensities[intensity].duration },
      });
    }
  }, [trigger, intensity, controls]);

  return (
    <motion.div animate={controls}>
      {children}
    </motion.div>
  );
}

// ============================================
// Confetti Effect (for celebrations)
// ============================================

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
  }>>([]);
  const [screenHeight, setScreenHeight] = useState(800);
  const playEffect = useSoundEffect();

  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (active) {
      playEffect('levelUp');
      
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#14b8a6', '#22c55e', '#eab308', '#f97316', '#ec4899'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5,
      }));
      
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: screenHeight + 20,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: particle.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
