'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft,
  X,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  image: string;
  title: string;
  description: string;
  highlight?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
    title: 'Welcome to CyberShield',
    description: 'Your AI-powered cybersecurity training platform. Learn to identify and defend against real-world cyber threats through interactive simulations.',
    highlight: 'Train like the pros, defend like a champion',
  },
  {
    id: 'modules',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    title: 'Interactive Training Modules',
    description: 'Choose from various training modules covering phishing detection, social engineering, incident response, and more. Each module features realistic scenarios powered by AI.',
    highlight: '8+ training modules available',
  },
  {
    id: 'practice',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    title: 'Practice Real Scenarios',
    description: 'Engage with AI-generated phishing emails, suspicious calls, and security incidents. Learn to spot red flags and respond appropriately.',
    highlight: 'AI adapts to your skill level',
  },
  {
    id: 'progress',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: 'Track Your Progress',
    description: 'Earn XP, level up, and unlock new modules as you improve. Watch your security awareness grow with detailed progress tracking.',
    highlight: 'Gamified learning experience',
  },
  {
    id: 'compete',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    title: 'Compete & Earn Badges',
    description: 'Challenge yourself on the leaderboard and earn badges for your achievements. Show off your cybersecurity skills!',
    highlight: 'Unlock exclusive achievements',
  },
];

interface OnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-950/95 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative w-full max-w-2xl mx-4">
        <button
          onClick={handleSkip}
          className="absolute -top-12 right-0 flex items-center gap-2 text-sm text-cyber-500 hover:text-cyber-400 transition-colors"
        >
          Skip tutorial
          <X className="h-4 w-4" />
        </button>

        <div className="cyber-card overflow-hidden">
          <div className="flex justify-center gap-2 pt-6 pb-4">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentStep ? 1 : -1);
                  setCurrentStep(index);
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentStep
                    ? 'w-8 bg-cyber-500'
                    : index < currentStep
                    ? 'bg-cyber-600'
                    : 'bg-cyber-800'
                )}
              />
            ))}
          </div>

          <div className="relative h-[420px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={step.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="relative mb-6"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyber-700 shadow-lg shadow-cyber-500/20">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-3 rounded-full border border-dashed border-cyber-700/50"
                  />
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-4"
                >
                  {step.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-cyber-300 max-w-md mb-6 leading-relaxed"
                >
                  {step.description}
                </motion.p>

                {step.highlight && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-500/20 border border-cyber-500/50 rounded-full"
                  >
                    <CheckCircle className="h-4 w-4 text-cyber-400" />
                    <span className="text-sm text-cyber-300 font-medium">{step.highlight}</span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-cyber-800">
            <button
              onClick={prevStep}
              disabled={isFirstStep}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                isFirstStep
                  ? 'text-cyber-700 cursor-not-allowed'
                  : 'text-cyber-400 hover:text-cyber-300 hover:bg-cyber-800/50'
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <span className="text-sm text-cyber-600">
              {currentStep + 1} of {onboardingSteps.length}
            </span>

            <button
              onClick={nextStep}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all',
                isLastStep
                  ? 'bg-cyber-500 hover:bg-cyber-400 text-white'
                  : 'bg-cyber-800 hover:bg-cyber-700 text-cyber-300'
              )}
            >
              {isLastStep ? 'Get Started' : 'Next'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-cyber-600 mt-4">
          Use ← → arrow keys to navigate
        </p>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('cybershield-onboarding-completed');
    if (!seen) {
      setHasSeenOnboarding(false);
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('cybershield-onboarding-completed', 'true');
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('cybershield-onboarding-completed');
    setHasSeenOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasSeenOnboarding,
    completeOnboarding,
    resetOnboarding,
    setShowOnboarding,
  };
}
