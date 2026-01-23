'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider, ToastContainer, Onboarding, useOnboarding } from '@/components/ui';

function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { showOnboarding, completeOnboarding } = useOnboarding();

  return (
    <>
      {showOnboarding && (
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

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <OnboardingWrapper>
        {children}
      </OnboardingWrapper>
      <ToastContainer />
    </ThemeProvider>
  );
}
