'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
  stats?: { label: string; value: string }[];
}

export default function FeatureCard({
  title,
  description,
  image,
  href,
  badge,
  stats,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyber-500/20"
    >
      {/* Background Image */}
      <div className="relative h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/70 to-cyber-950/20 group-hover:via-cyber-950/60 transition-all duration-500" />
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl border border-cyber-700/30 group-hover:border-cyber-500/50 transition-colors duration-500" />
        
        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyber-500/20 to-transparent transform rotate-45 translate-x-16 -translate-y-16 group-hover:from-cyber-500/30 transition-colors duration-500" />
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-xs font-semibold bg-cyber-500/90 text-white rounded-full backdrop-blur-sm">
              {badge}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-300 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-sm text-cyber-300/80 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex items-center space-x-4 mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-cyber-400">{stat.value}</div>
                  <div className="text-xs text-cyber-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center space-x-2 text-sm font-medium text-cyber-400 group-hover:text-cyber-300 transition-colors">
            <span>Learn More</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}

// Hero Feature Card - larger variant for homepage hero
export function HeroFeatureCard({
  title,
  description,
  image,
  href,
  icon,
}: FeatureCardProps & { icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative block rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyber-500/30 h-full"
    >
      {/* Background Image */}
      <div className="relative h-full min-h-[400px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-950/80 to-transparent" />
        
        {/* Animated Mesh Pattern */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Glowing Orb Effect */}
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyber-500/20 rounded-full blur-3xl group-hover:bg-cyber-500/30 transition-colors duration-700" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
          {icon && (
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          
          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-cyber-300 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-base text-cyber-200/90 mb-6 max-w-md">
            {description}
          </p>

          {/* CTA Button */}
          <div className="flex items-center space-x-3">
            <span className="px-6 py-3 bg-cyber-500/90 hover:bg-cyber-400 text-white font-semibold rounded-xl transition-colors duration-300 backdrop-blur-sm">
              Get Started
            </span>
            <span className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors duration-300 backdrop-blur-sm border border-white/20">
              Learn More
            </span>
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-cyber-500/0 group-hover:border-cyber-500/30 transition-colors duration-500" />
      </div>
    </Link>
  );
}

// Stats Card with Image Background
export function StatsFeatureCard({
  title,
  value,
  subtitle,
  image,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  image: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-950/95 via-cyber-950/80 to-cyber-950/60" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="text-xs text-cyber-400 uppercase tracking-wider mb-1">{title}</div>
          <div className="text-3xl font-bold text-white mb-1">{value}</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-cyber-400">{subtitle}</span>
            {trend && (
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                trend.positive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              )}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
