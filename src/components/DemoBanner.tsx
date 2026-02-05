// src/components/DemoBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, X, Sparkles } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';

export default function DemoBanner() {
  let { isDemoMode, disableDemo } = useDemoStore();
  let [mounted, setMounted] = useState(false);
  let router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isDemoMode) return null;

  let handleExit = () => {
    disableDemo();
    router.push('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-amber-500/90 backdrop-blur-md border-b border-amber-400/50 shadow-lg shadow-amber-500/20">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Monitor className="h-4 w-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-white">
            Live Demo Mode
          </span>
          <span className="hidden sm:inline text-xs text-white/80">
            — No API key needed. AI coaching is simulated locally.
          </span>
          <Sparkles className="h-3.5 w-3.5 text-yellow-200 hidden sm:block" />
        </div>
        <button
          onClick={handleExit}
          className="flex items-center space-x-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-xs font-medium"
        >
          <span>Exit Demo</span>
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
