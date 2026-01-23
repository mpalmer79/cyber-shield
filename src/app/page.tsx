'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  ChevronRight, 
  Zap, 
  Target, 
  TrendingUp,
  ArrowRight,
  Play,
  Users,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Header, ModuleCard, FeatureCard, ProgressStats } from '@/components';
import { useModulesStore, useProgressStore } from '@/store';
import { cn } from '@/lib/utils';

// Professional stock images for features
const featureImages = {
  phishing: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  socialEngineering: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  incidentResponse: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  passwordSecurity: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80',
  heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80',
  ctaImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80',
};

export default function HomePage() {
  const { modules } = useModulesStore();
  const { progress } = useProgressStore();
  
  // Get recommended modules (available, not completed)
  const recommendedModules = modules
    .filter((m) => m.status === 'available' || m.status === 'in-progress')
    .slice(0, 3);

  // Stats for hero section
  const completedCount = Object.values(progress.moduleProgress).filter(
    (m) => m.status === 'completed'
  ).length;

  const features = [
    {
      title: 'Phishing Detection',
      description: 'Master the art of identifying malicious emails, texts, and suspicious links before they compromise your security.',
      image: featureImages.phishing,
      href: '/training/phishing-101',
      stats: [
        { label: 'Scenarios', value: '10+' },
        { label: 'Avg Time', value: '15m' },
      ],
    },
    {
      title: 'Social Engineering',
      description: 'Defend against manipulation tactics and learn to protect sensitive information from skilled attackers.',
      image: featureImages.socialEngineering,
      href: '/training/social-engineering-basics',
      stats: [
        { label: 'Scenarios', value: '8+' },
        { label: 'Avg Time', value: '20m' },
      ],
    },
    {
      title: 'Incident Response',
      description: 'Practice handling real-world security incidents with AI-powered simulation and expert guidance.',
      image: featureImages.incidentResponse,
      href: '/training/incident-response-101',
      badge: 'Advanced',
      stats: [
        { label: 'Scenarios', value: '6+' },
        { label: 'Avg Time', value: '30m' },
      ],
    },
    {
      title: 'Authentication',
      description: 'Build unbreakable habits around password security and multi-factor authentication.',
      image: featureImages.passwordSecurity,
      href: '/training/password-security',
      stats: [
        { label: 'Scenarios', value: '8+' },
        { label: 'Avg Time', value: '12m' },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header currentPage="dashboard" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={featureImages.heroImage}
            alt="Cybersecurity Operations Center"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-950 via-cyber-950/90 to-cyber-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-transparent to-cyber-950/50" />
          
          {/* Animated Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Admin Login Link - Top Right */}
            <div className="absolute top-0 right-0">
              <Link
                href="/admin"
                className="text-sm text-cyber-500 hover:text-cyber-400 transition-colors"
              >
                Admin Login
              </Link>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyber-500/10 backdrop-blur-sm rounded-full border border-cyber-500/30 mb-8">
              <div className="w-2 h-2 bg-cyber-400 rounded-full animate-pulse" />
              <span className="text-sm text-cyber-300 font-medium">AI-Powered Security Training</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Train Your Team to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 via-cyan-400 to-cyber-400">
                Defeat Cyber Threats
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-cyber-200/80 mb-10 max-w-2xl leading-relaxed">
              Interactive, AI-driven training that transforms your employees into your strongest 
              line of defense against phishing, social engineering, and cyber attacks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <Link
                href="/training"
                className="group flex items-center space-x-3 px-8 py-4 bg-cyber-500 hover:bg-cyber-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyber-500/30 hover:shadow-cyber-500/50"
              >
                <Play className="h-5 w-5" />
                <span>Start Training</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/progress"
                className="flex items-center space-x-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm"
              >
                <TrendingUp className="h-5 w-5 text-cyber-400" />
                <span>View Progress</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 text-sm text-cyber-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Enterprise Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-cyber-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>10,000+ Users Trained</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-cyber-500 animate-bounce">
          <span className="text-xs mb-2">Scroll to explore</span>
          <ChevronRight className="h-5 w-5 rotate-90" />
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-8 px-4 border-y border-cyber-800/50 bg-cyber-900/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 to-cyan-400">
                {progress.level}
              </div>
              <div className="text-sm text-cyber-500 mt-1">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {progress.totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-cyber-500 mt-1">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {completedCount}
              </div>
              <div className="text-sm text-cyber-500 mt-1">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                {progress.streak}
              </div>
              <div className="text-sm text-cyber-500 mt-1">Day Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Training Modules */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Training Modules
              </h2>
              <p className="text-cyber-400 max-w-xl">
                Master essential cybersecurity skills through interactive, AI-powered scenarios.
              </p>
            </div>
            <Link
              href="/training"
              className="hidden md:flex items-center space-x-2 text-cyber-400 hover:text-cyber-300 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                {...feature}
              />
            ))}
          </div>

          {/* Mobile View All Link */}
          <div className="md:hidden mt-8 text-center">
            <Link
              href="/training"
              className="inline-flex items-center space-x-2 text-cyber-400 hover:text-cyber-300 transition-colors"
            >
              <span>View All Modules</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Continue Learning Section */}
      {recommendedModules.length > 0 && (
        <section className="py-16 px-4 bg-cyber-900/30">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Zap className="h-6 w-6 text-yellow-400" />
                <span>Continue Learning</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onClick={() => window.location.href = `/training/${module.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={featureImages.ctaImage}
            alt="Data Center"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-950/95 via-cyber-950/90 to-cyber-950/80" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-cyber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Strengthen Your Security?
            </h2>
            <p className="text-lg text-cyber-300 mb-8">
              Join thousands of professionals who have transformed their cybersecurity 
              awareness with CyberShield's AI-powered training platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/training"
                className="px-8 py-4 bg-cyber-500 hover:bg-cyber-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-cyber-500/30"
              >
                Start Free Training
              </Link>
              <Link
                href="/leaderboard"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors border border-white/10"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Sidebar (for larger screens) */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Target className="h-6 w-6 text-cyber-400" />
                <span>All Training Modules</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {modules.slice(0, 6).map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    variant="compact"
                    onClick={() => window.location.href = `/training/${module.id}`}
                  />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/training"
                  className="inline-flex items-center space-x-2 text-cyber-400 hover:text-cyber-300 transition-colors"
                >
                  <span>View All {modules.length} Modules</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-cyber-400" />
                <span>Your Progress</span>
              </h2>
              <ProgressStats />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-cyber-800/50 bg-cyber-950">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-cyber-400" />
              <div>
                <span className="text-xl font-bold text-white">CyberShield</span>
                <p className="text-xs text-cyber-500">AI-Powered Security Training</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-8 text-sm">
              <Link href="/training" className="text-cyber-400 hover:text-cyber-300 transition-colors">Training</Link>
              <Link href="/progress" className="text-cyber-400 hover:text-cyber-300 transition-colors">Progress</Link>
              <Link href="/leaderboard" className="text-cyber-400 hover:text-cyber-300 transition-colors">Leaderboard</Link>
              <Link href="/settings" className="text-cyber-400 hover:text-cyber-300 transition-colors">Settings</Link>
            </nav>

            <div className="text-sm text-cyber-600">
              © 2024 CyberShield. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
