'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Settings,
  User,
  Github,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressStore, useDailyChallengeStore } from '@/store';

// LinkedIn SVG Icon Component
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = 'dashboard' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { progress } = useProgressStore();
  const { currentStreak, todayCompleted } = useDailyChallengeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
    { id: 'daily', label: 'Daily', icon: Flame, href: '/daily' },
    { id: 'training', label: 'Training', icon: BookOpen, href: '/training' },
    { id: 'progress', label: 'Progress', icon: BarChart3, href: '/progress' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-700/50 bg-cyber-950/95 backdrop-blur supports-[backdrop-filter]:bg-cyber-950/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Left Section: Logo + Centered GitHub Badge */}
          <div className="hidden md:flex items-center flex-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Shield className="h-8 w-8 text-cyber-400 transition-all duration-300 group-hover:text-cyber-300" />
                <div className="absolute inset-0 blur-sm bg-cyber-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold text-cyber-100">
                Cyber<span className="text-cyber-400">Shield</span>
              </span>
            </Link>
            
            {/* GitHub Badge - Centered in left section */}
            <div className="flex-1 flex justify-center">
              <a
                href="https://github.com/mpalmer79/cyber-shield"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <Github className="h-5 w-5 text-gray-800 group-hover:text-black" />
                <span className="text-sm font-semibold text-gray-800 group-hover:text-black">GitHub</span>
              </a>
            </div>
          </div>

          {/* Mobile Logo */}
          <Link href="/" className="flex md:hidden items-center space-x-2 group">
            <Shield className="h-8 w-8 text-cyber-400" />
            <span className="text-xl font-bold text-cyber-100 hidden sm:block">
              Cyber<span className="text-cyber-400">Shield</span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
                  currentPage === item.id
                    ? 'bg-cyber-800/50 text-cyber-300'
                    : 'text-cyber-400 hover:text-cyber-300 hover:bg-cyber-800/30',
                  item.id === 'daily' && !todayCompleted && mounted && 'text-orange-400 hover:text-orange-300'
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4",
                  item.id === 'daily' && !todayCompleted && mounted && "text-orange-400"
                )} />
                <span>{item.label}</span>
                {/* Streak badge on Daily nav */}
                {item.id === 'daily' && mounted && currentStreak > 0 && (
                  <span className={cn(
                    "flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-bold",
                    currentStreak >= 7
                      ? "bg-orange-500/20 text-orange-400"
                      : currentStreak >= 3
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-cyber-700/50 text-cyber-300"
                  )}>
                    <Flame className="h-3 w-3" />
                    <span>{currentStreak}</span>
                  </span>
                )}
                {/* Pulsing dot for uncompleted daily */}
                {item.id === 'daily' && mounted && !todayCompleted && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section: Centered LinkedIn Badge + Stats */}
          <div className="hidden md:flex items-center flex-1">
            {/* LinkedIn Badge - Centered in right section */}
            <div className="flex-1 flex justify-center">
              <a
                href="https://www.linkedin.com/in/mpalmer1234/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <LinkedInIcon className="h-5 w-5 text-[#0A66C2]" />
                <span className="text-sm font-semibold text-[#0A66C2]">LinkedIn</span>
              </a>
            </div>

            {/* XP Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-cyber-800/50 rounded-full border border-cyber-700/50">
              <span className="text-xs text-cyber-500">LVL</span>
              <span className="text-sm font-bold text-cyber-300">{progress.level}</span>
              <div className="w-px h-4 bg-cyber-700" />
              <span className="text-xs text-cyber-500">XP</span>
              <span className="text-sm font-medium text-cyber-400">{progress.xp}</span>
            </div>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="text-sm text-cyber-500 hover:text-cyber-400 transition-colors ml-3"
            >
              Admin Login
            </Link>

            {/* Profile Button */}
            <button className="flex items-center justify-center h-9 w-9 rounded-full bg-cyber-800 border border-cyber-700 hover:border-cyber-500 transition-colors ml-3">
              <User className="h-4 w-4 text-cyber-400" />
            </button>
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center space-x-3 ml-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-cyber-800/50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-cyber-400" />
              ) : (
                <Menu className="h-5 w-5 text-cyber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-cyber-800">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    currentPage === item.id
                      ? 'bg-cyber-800/50 text-cyber-300'
                      : 'text-cyber-400 hover:text-cyber-300 hover:bg-cyber-800/30'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {/* Mobile streak badge */}
                  {item.id === 'daily' && mounted && currentStreak > 0 && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 ml-auto">
                      <Flame className="h-3 w-3" />
                      <span>{currentStreak}</span>
                    </span>
                  )}
                  {item.id === 'daily' && mounted && !todayCompleted && (
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-auto" />
                  )}
                </Link>
              ))}
              
              {/* Mobile: GitHub Link */}
              <a
                href="https://github.com/mpalmer79/cyber-shield"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-cyber-400 hover:text-cyber-300 hover:bg-cyber-800/30 transition-all duration-200"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              
              {/* Mobile: LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/mpalmer1234/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[#0A66C2] hover:text-[#3b82f6] hover:bg-cyber-800/30 transition-all duration-200"
              >
                <LinkedInIcon className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-cyber-500 hover:text-cyber-400 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Admin Login</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
