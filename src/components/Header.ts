'use client';

import { useState } from 'react';
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
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/store';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = 'dashboard' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { progress } = useProgressStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/' },
    { id: 'training', label: 'Training', icon: BookOpen, href: '/training' },
    { id: 'progress', label: 'Progress', icon: BarChart3, href: '/progress' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-700/50 bg-cyber-950/95 backdrop-blur supports-[backdrop-filter]:bg-cyber-950/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-cyber-400 transition-all duration-300 group-hover:text-cyber-300" />
              <div className="absolute inset-0 blur-sm bg-cyber-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold text-cyber-100 hidden sm:block">
              Cyber<span className="text-cyber-400">Shield</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  currentPage === item.id
                    ? 'bg-cyber-800/50 text-cyber-300'
                    : 'text-cyber-400 hover:text-cyber-300 hover:bg-cyber-800/30'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Stats & Profile */}
          <div className="flex items-center space-x-4">
            {/* XP Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-cyber-800/50 rounded-full border border-cyber-700/50">
              <span className="text-xs text-cyber-500">LVL</span>
              <span className="text-sm font-bold text-cyber-300">{progress.level}</span>
              <div className="w-px h-4 bg-cyber-700" />
              <span className="text-xs text-cyber-500">XP</span>
              <span className="text-sm font-medium text-cyber-400">{progress.xp}</span>
            </div>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="text-sm text-cyber-500 hover:text-cyber-400 transition-colors hidden sm:block"
            >
              Admin Login
            </Link>

            {/* Profile Button */}
            <button className="flex items-center justify-center h-9 w-9 rounded-full bg-cyber-800 border border-cyber-700 hover:border-cyber-500 transition-colors">
              <User className="h-4 w-4 text-cyber-400" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-cyber-800/50 transition-colors"
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
                </Link>
              ))}
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
