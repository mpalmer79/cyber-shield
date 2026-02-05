'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Lock,
  CheckCircle,
  Play,
  Clock,
  Target,
  Star,
  ChevronRight,
  Zap,
  Shield,
} from 'lucide-react';
import { cn, getDifficultyColor, formatDuration } from '@/lib/utils';
import type { TrainingModule } from '@/types';

// ============================================
// Skill Tree Layout Data
// ============================================

interface TreeNode {
  moduleId: string;
  x: number; // percentage of container width
  y: number; // percentage of container height
  tier: number;
}

interface TreeConnection {
  from: string;
  to: string;
}

// Node positions (percentages)
// Tier 1 = Foundation (top), Tier 2 = Intermediate, Tier 3 = Advanced (bottom)
const TREE_NODES: TreeNode[] = [
  // Tier 1 - Foundation (y = 10%)
  { moduleId: 'phishing-101',               x: 12.5,  y: 10, tier: 1 },
  { moduleId: 'social-engineering-basics',   x: 37.5,  y: 10, tier: 1 },
  { moduleId: 'password-security',           x: 62.5,  y: 10, tier: 1 },
  { moduleId: 'secure-browsing',             x: 87.5,  y: 10, tier: 1 },
  // Tier 2 - Intermediate (y = 48%)
  { moduleId: 'incident-response-101',       x: 18,    y: 48, tier: 2 },
  { moduleId: 'malware-awareness',           x: 43,    y: 48, tier: 2 },
  { moduleId: 'data-protection-fundamentals',x: 68,    y: 48, tier: 2 },
  // Tier 3 - Advanced (y = 86%)
  { moduleId: 'threat-hunting-basics',       x: 43,    y: 86, tier: 3 },
];

const TREE_CONNECTIONS: TreeConnection[] = [
  { from: 'phishing-101', to: 'incident-response-101' },
  { from: 'phishing-101', to: 'malware-awareness' },
  { from: 'password-security', to: 'data-protection-fundamentals' },
  { from: 'incident-response-101', to: 'threat-hunting-basics' },
  { from: 'data-protection-fundamentals', to: 'threat-hunting-basics' },
];

// Mobile layout - vertical stack
const MOBILE_NODES: TreeNode[] = [
  // Tier 1
  { moduleId: 'phishing-101',               x: 25, y: 4,  tier: 1 },
  { moduleId: 'social-engineering-basics',   x: 75, y: 4,  tier: 1 },
  { moduleId: 'password-security',           x: 25, y: 17, tier: 1 },
  { moduleId: 'secure-browsing',             x: 75, y: 17, tier: 1 },
  // Tier 2
  { moduleId: 'incident-response-101',       x: 20, y: 38, tier: 2 },
  { moduleId: 'malware-awareness',           x: 50, y: 38, tier: 2 },
  { moduleId: 'data-protection-fundamentals',x: 80, y: 38, tier: 2 },
  // Tier 3
  { moduleId: 'threat-hunting-basics',       x: 50, y: 60, tier: 3 },
];

const TIER_LABELS = [
  { tier: 1, label: 'Foundation', color: 'text-green-400', y: 2 },
  { tier: 2, label: 'Intermediate', color: 'text-yellow-400', y: 38 },
  { tier: 3, label: 'Advanced', color: 'text-orange-400', y: 76 },
];

const MOBILE_TIER_LABELS = [
  { tier: 1, label: 'Foundation', color: 'text-green-400', y: 0 },
  { tier: 2, label: 'Intermediate', color: 'text-yellow-400', y: 30 },
  { tier: 3, label: 'Advanced', color: 'text-orange-400', y: 52 },
];

// ============================================
// SkillTree Component
// ============================================

interface SkillTreeProps {
  modules: TrainingModule[];
  onModuleClick: (module: TrainingModule) => void;
}

export default function SkillTree({ modules, onModuleClick }: SkillTreeProps) {
  let [hoveredNode, setHoveredNode] = useState<string | null>(null);
  let [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  let moduleMap = useMemo(() => {
    let map = new Map<string, TrainingModule>();
    for (let m of modules) {
      map.set(m.id, m);
    }
    return map;
  }, [modules]);

  let nodes = isMobile ? MOBILE_NODES : TREE_NODES;
  let tierLabels = isMobile ? MOBILE_TIER_LABELS : TIER_LABELS;

  // Node size constants
  let nodeW = isMobile ? 140 : 180;
  let nodeH = isMobile ? 120 : 160;

  return (
    <div className="relative w-full" style={{ minHeight: isMobile ? '700px' : '650px' }}>
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[45%] left-[30%] w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[80%] left-[40%] w-56 h-56 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Tier Labels */}
      {tierLabels.map((tier) => (
        <div
          key={tier.tier}
          className="absolute left-0 flex items-center space-x-2 z-10"
          style={{ top: `${tier.y}%` }}
        >
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm",
            tier.tier === 1 && "bg-green-500/10 border-green-500/30 text-green-400",
            tier.tier === 2 && "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
            tier.tier === 3 && "bg-orange-500/10 border-orange-500/30 text-orange-400",
          )}>
            {tier.label}
          </div>
        </div>
      ))}

      {/* SVG Connection Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient for completed connections */}
          <linearGradient id="conn-complete" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0.8" />
          </linearGradient>
          {/* Gradient for available connections */}
          <linearGradient id="conn-available" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(20, 184, 166)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0.3" />
          </linearGradient>
          {/* Gradient for locked connections */}
          <linearGradient id="conn-locked" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(75, 85, 99)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(75, 85, 99)" stopOpacity="0.15" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="conn-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {TREE_CONNECTIONS.map((conn) => {
          let fromNode = nodes.find(n => n.moduleId === conn.from);
          let toNode = nodes.find(n => n.moduleId === conn.to);
          if (!fromNode || !toNode) return null;

          let fromModule = moduleMap.get(conn.from);
          let toModule = moduleMap.get(conn.to);

          let fromCompleted = fromModule?.status === 'completed';
          let toAvailable = toModule?.status === 'available' || toModule?.status === 'in-progress' || toModule?.status === 'completed';
          let toCompleted = toModule?.status === 'completed';

          let strokeId = toCompleted ? 'url(#conn-complete)' : toAvailable ? 'url(#conn-available)' : 'url(#conn-locked)';
          let strokeWidth = toCompleted ? 3 : toAvailable ? 2.5 : 1.5;
          let isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

          // Calculate pixel positions from percentages
          let x1 = `${fromNode.x}%`;
          let y1 = `${fromNode.y + (isMobile ? 8 : 12)}%`;
          let x2 = `${toNode.x}%`;
          let y2 = `${toNode.y - (isMobile ? 2 : 2)}%`;

          // Bezier curve control points for smooth paths
          let midY = ((fromNode.y + (isMobile ? 8 : 12)) + (toNode.y - 2)) / 2;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              <path
                d={`M ${fromNode.x}%,${fromNode.y + (isMobile ? 8 : 12)}% C ${fromNode.x}%,${midY}% ${toNode.x}%,${midY}% ${toNode.x}%,${toNode.y - 2}%`}
                fill="none"
                stroke={strokeId}
                strokeWidth={isHighlighted ? strokeWidth + 1.5 : strokeWidth}
                strokeDasharray={toAvailable ? 'none' : '8 4'}
                filter={isHighlighted && toAvailable ? 'url(#conn-glow)' : undefined}
                className="transition-all duration-500"
              />
              {/* Arrow head */}
              {toAvailable && (
                <circle
                  cx={`${toNode.x}%`}
                  cy={`${toNode.y - 1.5}%`}
                  r={toCompleted ? 4 : 3}
                  fill={toCompleted ? 'rgb(34, 197, 94)' : 'rgb(20, 184, 166)'}
                  opacity={isHighlighted ? 1 : 0.7}
                  className="transition-all duration-300"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Module Nodes */}
      {nodes.map((node) => {
        let module = moduleMap.get(node.moduleId);
        if (!module) return null;

        let isLocked = module.status === 'locked';
        let isCompleted = module.status === 'completed';
        let isInProgress = module.status === 'in-progress';
        let isAvailable = module.status === 'available';
        let isHovered = hoveredNode === node.moduleId;

        let progressPct = module.totalScenarios > 0
          ? Math.round((module.completedScenarios / module.totalScenarios) * 100)
          : 0;

        return (
          <div
            key={node.moduleId}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: nodeW,
            }}
          >
            <button
              onClick={() => !isLocked && onModuleClick(module)}
              onMouseEnter={() => setHoveredNode(node.moduleId)}
              onMouseLeave={() => setHoveredNode(null)}
              disabled={isLocked}
              className={cn(
                "relative w-full rounded-xl overflow-hidden transition-all duration-300 text-left group",
                "border backdrop-blur-sm",
                isCompleted && "bg-green-950/40 border-green-500/40 shadow-lg shadow-green-500/10",
                isInProgress && "bg-cyber-900/60 border-cyber-500/50 shadow-lg shadow-cyber-500/15",
                isAvailable && "bg-cyber-900/60 border-cyber-600/40 hover:border-cyber-500/60 shadow-lg shadow-cyber-500/10 hover:shadow-cyber-500/20",
                isLocked && "bg-gray-900/40 border-gray-700/30 opacity-55 cursor-not-allowed",
                isHovered && !isLocked && "scale-105",
              )}
            >
              {/* Glow ring for available nodes */}
              {isAvailable && (
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-cyber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Completed shimmer */}
              {isCompleted && (
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-green-400/20 to-transparent pointer-events-none" />
              )}

              {/* Image */}
              <div className="relative h-16 overflow-hidden">
                {module.image ? (
                  <Image
                    src={module.image}
                    alt={module.title}
                    fill
                    className={cn(
                      "object-cover object-[50%_30%] transition-transform duration-500",
                      !isLocked && "group-hover:scale-110"
                    )}
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyber-700 to-cyber-900" />
                )}
                <div className={cn(
                  "absolute inset-0",
                  isLocked
                    ? "bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40"
                    : "bg-gradient-to-t from-cyber-950/90 via-cyber-950/50 to-transparent"
                )} />

                {/* Status icon overlay */}
                <div className="absolute top-2 right-2">
                  {isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-400" />}
                  {isInProgress && <Play className="h-4 w-4 text-cyber-400" />}
                </div>

                {/* Module icon */}
                <div className="absolute bottom-2 left-2 text-lg">
                  {module.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className={cn(
                  "text-xs font-semibold leading-tight mb-1.5 line-clamp-2",
                  isLocked ? "text-gray-500" : "text-cyber-100"
                )}>
                  {module.title}
                </h4>

                {/* Difficulty + Time */}
                <div className="flex items-center space-x-2 text-[10px] mb-2">
                  <span className={cn(
                    "capitalize font-medium",
                    isLocked ? "text-gray-600" : getDifficultyColor(module.difficulty)
                  )}>
                    {module.difficulty}
                  </span>
                  <span className="text-cyber-700">•</span>
                  <span className={isLocked ? "text-gray-600" : "text-cyber-500"}>
                    {formatDuration(module.estimatedMinutes)}
                  </span>
                </div>

                {/* Progress bar */}
                {(isInProgress || isCompleted) && (
                  <div className="h-1 bg-cyber-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-400"
                          : "bg-gradient-to-r from-cyber-500 to-cyan-400"
                      )}
                      style={{ width: `${isCompleted ? 100 : progressPct}%` }}
                    />
                  </div>
                )}

                {/* Score */}
                {module.bestScore !== undefined && module.bestScore > 0 && (
                  <div className="flex items-center space-x-1 mt-1.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-[10px] text-yellow-400 font-medium">{module.bestScore}%</span>
                  </div>
                )}

                {/* Locked message */}
                {isLocked && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Lock className="h-2.5 w-2.5 text-gray-600" />
                    <span className="text-[10px] text-gray-600">Complete prereqs</span>
                  </div>
                )}
              </div>

              {/* Bottom accent */}
              {!isLocked && (
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300",
                  isCompleted
                    ? "bg-gradient-to-r from-transparent via-green-500/60 to-transparent opacity-100"
                    : "bg-gradient-to-r from-transparent via-cyber-500/50 to-transparent opacity-0 group-hover:opacity-100"
                )} />
              )}
            </button>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-0 right-0 flex items-center space-x-4 text-[10px] z-10">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
          <span className="text-cyber-500">Completed</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-cyber-500/30 border border-cyber-500/50" />
          <span className="text-cyber-500">Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-700/30 border border-gray-700/50 border-dashed" />
          <span className="text-cyber-500">Locked</span>
        </div>
      </div>
    </div>
  );
}
