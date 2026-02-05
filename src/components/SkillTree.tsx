'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react';
import { cn, getDifficultyColor, formatDuration } from '@/lib/utils';
import type { TrainingModule } from '@/types';

// ============================================
// Skill Tree Layout Data
// ============================================

interface TreeNode {
  moduleId: string;
  x: number;
  y: number;
  tier: number;
}

interface TreeConnection {
  from: string;
  to: string;
}

// Bonus challenge node between main modules
interface BonusNode {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  tier: number;
  requiresCompleted: string[];   // main module IDs that must be completed
  rewardsXP: number;
  linkedModuleId: string;        // which module type it links to
}

// Node positions (percentages)
const TREE_NODES: TreeNode[] = [
  // Tier 1 - Foundation (y = 10%)
  { moduleId: 'phishing-101',               x: 12.5,  y: 10, tier: 1 },
  { moduleId: 'social-engineering-basics',   x: 37.5,  y: 10, tier: 1 },
  { moduleId: 'password-security',           x: 62.5,  y: 10, tier: 1 },
  { moduleId: 'secure-browsing',             x: 87.5,  y: 10, tier: 1 },
  // Tier 2 - Intermediate (y = 50%)
  { moduleId: 'incident-response-101',       x: 18,    y: 50, tier: 2 },
  { moduleId: 'malware-awareness',           x: 43,    y: 50, tier: 2 },
  { moduleId: 'data-protection-fundamentals',x: 68,    y: 50, tier: 2 },
  // Tier 3 - Advanced (y = 88%)
  { moduleId: 'threat-hunting-basics',       x: 43,    y: 88, tier: 3 },
];

const TREE_CONNECTIONS: TreeConnection[] = [
  { from: 'phishing-101', to: 'incident-response-101' },
  { from: 'phishing-101', to: 'malware-awareness' },
  { from: 'password-security', to: 'data-protection-fundamentals' },
  { from: 'incident-response-101', to: 'threat-hunting-basics' },
  { from: 'data-protection-fundamentals', to: 'threat-hunting-basics' },
];

// Bonus challenge nodes positioned along connection paths
const BONUS_NODES: BonusNode[] = [
  {
    id: 'bonus-rapid-phish',
    label: 'Rapid Fire',
    description: 'Speed round: 5 phishing emails in 60 seconds',
    icon: <Flame className="h-3 w-3" />,
    x: 15,
    y: 30,
    tier: 1,
    requiresCompleted: ['phishing-101'],
    rewardsXP: 50,
    linkedModuleId: 'phishing-101',
  },
  {
    id: 'bonus-attachment-gauntlet',
    label: 'Attachment Gauntlet',
    description: 'Identify dangerous file attachments and downloads',
    icon: <Shield className="h-3 w-3" />,
    x: 30,
    y: 30,
    tier: 1,
    requiresCompleted: ['phishing-101'],
    rewardsXP: 50,
    linkedModuleId: 'malware-awareness',
  },
  {
    id: 'bonus-credential-crisis',
    label: 'Credential Crisis',
    description: 'Protect accounts under a simulated breach',
    icon: <Zap className="h-3 w-3" />,
    x: 65,
    y: 30,
    tier: 1,
    requiresCompleted: ['password-security'],
    rewardsXP: 50,
    linkedModuleId: 'password-security',
  },
  {
    id: 'bonus-advanced-recon',
    label: 'Advanced Recon',
    description: 'Combined threat analysis challenge',
    icon: <Target className="h-3 w-3" />,
    x: 43,
    y: 70,
    tier: 2,
    requiresCompleted: ['incident-response-101', 'data-protection-fundamentals'],
    rewardsXP: 100,
    linkedModuleId: 'threat-hunting-basics',
  },
];

// Mobile layout
const MOBILE_NODES: TreeNode[] = [
  { moduleId: 'phishing-101',               x: 25, y: 4,  tier: 1 },
  { moduleId: 'social-engineering-basics',   x: 75, y: 4,  tier: 1 },
  { moduleId: 'password-security',           x: 25, y: 17, tier: 1 },
  { moduleId: 'secure-browsing',             x: 75, y: 17, tier: 1 },
  { moduleId: 'incident-response-101',       x: 20, y: 40, tier: 2 },
  { moduleId: 'malware-awareness',           x: 50, y: 40, tier: 2 },
  { moduleId: 'data-protection-fundamentals',x: 80, y: 40, tier: 2 },
  { moduleId: 'threat-hunting-basics',       x: 50, y: 62, tier: 3 },
];

const MOBILE_BONUS_NODES: BonusNode[] = [
  { ...BONUS_NODES[0], x: 22, y: 28 },
  { ...BONUS_NODES[1], x: 50, y: 28 },
  { ...BONUS_NODES[2], x: 78, y: 28 },
  { ...BONUS_NODES[3], x: 50, y: 52 },
];

const TIER_LABELS = [
  { tier: 1, label: 'Foundation', color: 'text-green-400', y: 2 },
  { tier: 2, label: 'Intermediate', color: 'text-yellow-400', y: 40 },
  { tier: 3, label: 'Advanced', color: 'text-orange-400', y: 78 },
];

const MOBILE_TIER_LABELS = [
  { tier: 1, label: 'Foundation', color: 'text-green-400', y: 0 },
  { tier: 2, label: 'Intermediate', color: 'text-yellow-400', y: 32 },
  { tier: 3, label: 'Advanced', color: 'text-orange-400', y: 54 },
];

// ============================================
// Unlock Burst Effect
// ============================================

function UnlockBurst({ x, y }: { x: number; y: number }) {
  let particles = Array.from({ length: 8 }, (_, i) => {
    let angle = (i / 8) * Math.PI * 2;
    let dist = 30 + Math.random() * 20;
    return {
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * dist,
      delay: i * 0.04,
      size: 3 + Math.random() * 3,
    };
  });

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyber-400"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.endX, y: p.endY, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.7, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
      {/* Center flash */}
      <motion.div
        className="absolute rounded-full bg-cyber-300"
        style={{ width: 12, height: 12, left: -6, top: -6 }}
        initial={{ opacity: 1, scale: 0.5 }}
        animate={{ opacity: 0, scale: 3 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

// ============================================
// Bonus Challenge Diamond Node
// ============================================

interface BonusDiamondProps {
  bonus: BonusNode;
  isUnlocked: boolean;
  isCompleted: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

function BonusDiamond({ bonus, isUnlocked, isCompleted, isHovered, onHover, onClick }: BonusDiamondProps) {
  return (
    <div
      className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${bonus.x}%`, top: `${bonus.y}%` }}
    >
      <button
        onClick={isUnlocked ? onClick : undefined}
        onMouseEnter={() => onHover(bonus.id)}
        onMouseLeave={() => onHover(null)}
        disabled={!isUnlocked}
        className={cn(
          "relative w-10 h-10 rotate-45 rounded-sm transition-all duration-300",
          "border-2 backdrop-blur-sm",
          isCompleted && "bg-green-500/20 border-green-500/60 shadow-lg shadow-green-500/20",
          isUnlocked && !isCompleted && "bg-cyber-800/60 border-cyber-500/50 hover:border-cyber-400/80 shadow-lg shadow-cyber-500/15 cursor-pointer skill-tree-available-pulse",
          !isUnlocked && "bg-gray-900/40 border-gray-700/30 opacity-40 cursor-not-allowed",
        )}
      >
        <div className="-rotate-45 flex items-center justify-center h-full">
          {!isUnlocked ? (
            <Lock className="h-3 w-3 text-gray-600" />
          ) : isCompleted ? (
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <span className="text-cyber-300">{bonus.icon}</span>
          )}
        </div>
      </button>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-44 z-50"
          >
            <div className="bg-cyber-900/95 border border-cyber-600/50 rounded-lg p-3 backdrop-blur-md shadow-xl">
              <div className="flex items-center space-x-1.5 mb-1">
                <Sparkles className="h-3 w-3 text-yellow-400" />
                <span className="text-xs font-bold text-cyber-200">Bonus Challenge</span>
              </div>
              <p className="text-[10px] font-semibold text-cyber-300 mb-1">{bonus.label}</p>
              <p className="text-[10px] text-cyber-500 leading-tight">{bonus.description}</p>
              <div className="flex items-center space-x-1 mt-2">
                <Trophy className="h-3 w-3 text-yellow-400" />
                <span className="text-[10px] text-yellow-400 font-medium">+{bonus.rewardsXP} XP</span>
              </div>
              {!isUnlocked && (
                <p className="text-[10px] text-red-400/70 mt-1">Complete prerequisites to unlock</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SkillTree Component
// ============================================

interface SkillTreeProps {
  modules: TrainingModule[];
  onModuleClick: (module: TrainingModule) => void;
  completedBonuses?: Set<string>;
  onBonusClick?: (bonus: BonusNode) => void;
}

export default function SkillTree({ modules, onModuleClick, completedBonuses, onBonusClick }: SkillTreeProps) {
  let [hoveredNode, setHoveredNode] = useState<string | null>(null);
  let [hoveredBonus, setHoveredBonus] = useState<string | null>(null);
  let [isMobile, setIsMobile] = useState(false);
  let [recentlyUnlocked, setRecentlyUnlocked] = useState<Set<string>>(new Set());

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

  // Track unlock transitions for burst effects
  let prevStatuses = useMemo(() => {
    let map = new Map<string, string>();
    for (let m of modules) {
      map.set(m.id, m.status);
    }
    return map;
  }, []); // intentionally empty — captures initial render

  useEffect(() => {
    let newUnlocks = new Set<string>();
    for (let m of modules) {
      let prev = prevStatuses.get(m.id);
      if (prev === 'locked' && (m.status === 'available' || m.status === 'in-progress')) {
        newUnlocks.add(m.id);
      }
    }
    if (newUnlocks.size > 0) {
      setRecentlyUnlocked(newUnlocks);
      let timer = setTimeout(() => setRecentlyUnlocked(new Set()), 1500);
      return () => clearTimeout(timer);
    }
  }, [modules, prevStatuses]);

  let nodes = isMobile ? MOBILE_NODES : TREE_NODES;
  let bonusNodes = isMobile ? MOBILE_BONUS_NODES : BONUS_NODES;
  let tierLabels = isMobile ? MOBILE_TIER_LABELS : TIER_LABELS;

  let nodeW = isMobile ? 140 : 180;
  let nodeH = isMobile ? 120 : 160;

  // Check if a bonus node is unlocked
  let isBonusUnlocked = useCallback((bonus: BonusNode) => {
    return bonus.requiresCompleted.every(id => {
      let mod = moduleMap.get(id);
      return mod?.status === 'completed';
    });
  }, [moduleMap]);

  let bonusCompletedSet = completedBonuses || new Set<string>();

  return (
    <div className="relative w-full" style={{ minHeight: isMobile ? '750px' : '700px' }}>
      {/* Background glow effects — enhanced with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-green-500/5 rounded-full blur-3xl skill-tree-bg-pulse" />
        <div className="absolute top-[45%] left-[30%] w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl skill-tree-bg-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[80%] left-[40%] w-56 h-56 bg-orange-500/5 rounded-full blur-3xl skill-tree-bg-pulse" style={{ animationDelay: '4s' }} />
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

      {/* SVG Connection Lines — with animated flow */}
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
          {/* Energy flow gradient (animated) */}
          <linearGradient id="energy-flow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
            <stop offset="40%" stopColor="rgb(52, 211, 153)" stopOpacity="1" />
            <stop offset="60%" stopColor="rgb(34, 197, 94)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="conn-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Stronger glow for completed */}
          <filter id="conn-glow-strong">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {TREE_CONNECTIONS.map((conn, connIdx) => {
          let fromNode = nodes.find(n => n.moduleId === conn.from);
          let toNode = nodes.find(n => n.moduleId === conn.to);
          if (!fromNode || !toNode) return null;

          let fromModule = moduleMap.get(conn.from);
          let toModule = moduleMap.get(conn.to);

          let fromCompleted = fromModule?.status === 'completed';
          let toAvailable = toModule?.status === 'available' || toModule?.status === 'in-progress' || toModule?.status === 'completed';
          let toCompleted = toModule?.status === 'completed';
          let bothCompleted = fromCompleted && toCompleted;

          let strokeId = toCompleted ? 'url(#conn-complete)' : toAvailable ? 'url(#conn-available)' : 'url(#conn-locked)';
          let strokeWidth = toCompleted ? 3 : toAvailable ? 2.5 : 1.5;
          let isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

          let yOffset = isMobile ? 8 : 12;
          let midY = ((fromNode.y + yOffset) + (toNode.y - 2)) / 2;

          let pathD = `M ${fromNode.x}%,${fromNode.y + yOffset}% C ${fromNode.x}%,${midY}% ${toNode.x}%,${midY}% ${toNode.x}%,${toNode.y - 2}%`;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Base path */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeId}
                strokeWidth={isHighlighted ? strokeWidth + 1.5 : strokeWidth}
                strokeDasharray={toAvailable ? 'none' : '8 4'}
                filter={isHighlighted && toAvailable ? 'url(#conn-glow)' : undefined}
                className="transition-all duration-500"
              />

              {/* Animated energy flow overlay for completed connections */}
              {bothCompleted && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#energy-flow)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="skill-tree-energy-flow"
                  filter="url(#conn-glow-strong)"
                  style={{ animationDelay: `${connIdx * 0.8}s` }}
                />
              )}

              {/* Flowing dots on available (not yet completed) connections */}
              {fromCompleted && toAvailable && !toCompleted && (
                <circle r="3" fill="rgb(20, 184, 166)" opacity="0.7">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${fromNode.x} ${fromNode.y + yOffset} C ${fromNode.x} ${midY} ${toNode.x} ${midY} ${toNode.x} ${toNode.y - 2}`}
                  />
                </circle>
              )}

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

      {/* Unlock Burst Effects */}
      {Array.from(recentlyUnlocked).map(id => {
        let node = nodes.find(n => n.moduleId === id);
        if (!node) return null;
        return <UnlockBurst key={`burst-${id}`} x={node.x} y={node.y} />;
      })}

      {/* Bonus Challenge Diamond Nodes */}
      {bonusNodes.map((bonus) => {
        let unlocked = isBonusUnlocked(bonus);
        let completed = bonusCompletedSet.has(bonus.id);
        return (
          <BonusDiamond
            key={bonus.id}
            bonus={bonus}
            isUnlocked={unlocked}
            isCompleted={completed}
            isHovered={hoveredBonus === bonus.id}
            onHover={setHoveredBonus}
            onClick={() => onBonusClick?.(bonus)}
          />
        );
      })}

      {/* Module Nodes */}
      {nodes.map((node) => {
        let module = moduleMap.get(node.moduleId);
        if (!module) return null;

        let isLocked = module.status === 'locked';
        let isCompleted = module.status === 'completed';
        let isInProgress = module.status === 'in-progress';
        let isAvailable = module.status === 'available';
        let isHovered = hoveredNode === node.moduleId;
        let justUnlocked = recentlyUnlocked.has(node.moduleId);

        let progressPct = module.totalScenarios > 0
          ? Math.round((module.completedScenarios / module.totalScenarios) * 100)
          : 0;

        return (
          <motion.div
            key={node.moduleId}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: nodeW,
            }}
            initial={justUnlocked ? { scale: 0.8, opacity: 0 } : false}
            animate={justUnlocked ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
                isAvailable && "bg-cyber-900/60 border-cyber-600/40 hover:border-cyber-500/60 shadow-lg shadow-cyber-500/10 hover:shadow-cyber-500/20 skill-tree-available-pulse",
                isLocked && "bg-gray-900/40 border-gray-700/30 opacity-55 cursor-not-allowed",
                isHovered && !isLocked && "scale-105",
              )}
            >
              {/* Glow ring for available nodes */}
              {isAvailable && (
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-cyber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Completed shimmer — animated sweep */}
              {isCompleted && (
                <>
                  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-green-400/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="skill-tree-shimmer absolute inset-0" />
                  </div>
                </>
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
          </motion.div>
        );
      })}

      {/* Legend — updated with bonus indicator */}
      <div className="absolute bottom-0 right-0 flex items-center flex-wrap gap-x-4 gap-y-1 text-[10px] z-10">
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
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rotate-45 rounded-sm bg-cyber-500/20 border border-cyber-500/40" />
          <span className="text-cyber-500">Bonus Challenge</span>
        </div>
      </div>
    </div>
  );
}

// Re-export the BonusNode type for consumers
export type { BonusNode };
