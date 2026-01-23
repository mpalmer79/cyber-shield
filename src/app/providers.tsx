'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider, ToastContainer, Onboarding, useOnboarding } from '@/components/ui';

function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && showOnboarding && (
        <Onboarding 
          onComplete={completeOnboarding} 
          onSkip={completeOnboarding} 
        />
      )}
      {children}
    </>
  );
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider>
      <OnboardingWrapper>
        {children}
      </OnboardingWrapper>
      {mounted && <ToastContainer />}
    </ThemeProvider>
  );
}
