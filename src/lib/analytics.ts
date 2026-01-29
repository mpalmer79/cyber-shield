/**
 * Cyber Shield Enterprise Analytics System
 * Executive Dashboards and Compliance Reporting
 */

import { ComplianceType, DifficultyLevel, CareerTier, CareerPath } from "@prisma/client";

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
  label: string;
}

export interface MetricValue {
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: "up" | "down" | "stable";
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// ============================================
// ORGANIZATION ANALYTICS
// ============================================

export interface OrganizationAnalytics {
  overview: {
    totalUsers: MetricValue;
    activeUsers: MetricValue;
    completionRate: MetricValue;
    averageScore: MetricValue;
    certificationRate: MetricValue;
    complianceScore: MetricValue;
  };
  userEngagement: {
    dailyActiveUsers: TimeSeriesData[];
    weeklyActiveUsers: TimeSeriesData[];
    monthlyActiveUsers: TimeSeriesData[];
    sessionDuration: TimeSeriesData[];
    loginFrequency: ChartData;
  };
  trainingProgress: {
    moduleCompletions: TimeSeriesData[];
    averageScoreByModule: ChartData;
    completionRateByDifficulty: ChartData;
    popularModules: {
      moduleId: string;
      moduleName: string;
      completions: number;
      averageScore: number;
    }[];
    strugglingAreas: {
      moduleId: string;
      moduleName: string;
      failureRate: number;
      averageScore: number;
    }[];
  };
  certifications: {
    certificationsEarned: TimeSeriesData[];
    certificationsByType: ChartData;
    certificationPassRate: MetricValue;
    upcomingExpirations: {
      certificationId: string;
      certificationName: string;
      expiringCount: number;
      expirationDate: Date;
    }[];
  };
  careerProgression: {
    usersByTier: ChartData;
    usersByCareerPath: ChartData;
    tierProgressions: TimeSeriesData[];
    averageTimeToTier: Record<CareerTier, number>; // days
  };
  compliance: {
    overallComplianceScore: MetricValue;
    complianceByFramework: Record<ComplianceType, number>;
    complianceGaps: {
      framework: ComplianceType;
      requirement: string;
      gap: string;
      priority: "critical" | "high" | "medium" | "low";
    }[];
    complianceTrend: TimeSeriesData[];
  };
  exercises: {
    exercisesCompleted: MetricValue;
    exerciseParticipation: TimeSeriesData[];
    exerciseScores: ChartData;
    redTeamVsBlueTeam: {
      redTeamWins: number;
      blueTeamWins: number;
      draws: number;
    };
  };
}

// ============================================
// TEAM ANALYTICS
// ============================================

export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  memberCount: number;
  overview: {
    averageScore: MetricValue;
    completionRate: MetricValue;
    certificationCount: MetricValue;
    activeStreak: MetricValue;
  };
  memberPerformance: {
    userId: string;
    userName: string;
    avatar?: string;
    tier: CareerTier;
    score: number;
    modulesCompleted: number;
    certifications: number;
    streak: number;
    rank: number;
  }[];
  skillDistribution: ChartData;
  strengthsAndWeaknesses: {
    strengths: {
      skill: string;
      averageScore: number;
      teamAverage: number;
    }[];
    weaknesses: {
      skill: string;
      averageScore: number;
      teamAverage: number;
      recommendedModules: string[];
    }[];
  };
}

// ============================================
// INDIVIDUAL ANALYTICS
// ============================================

export interface UserAnalytics {
  userId: string;
  overview: {
    totalXP: number;
    currentTier: CareerTier;
    careerPath: CareerPath;
    modulesCompleted: number;
    certificationsEarned: number;
    currentStreak: number;
    longestStreak: number;
    rank: number;
    percentile: number;
  };
  progressOverTime: {
    xpGained: TimeSeriesData[];
    modulesCompleted: TimeSeriesData[];
    scoresOverTime: TimeSeriesData[];
  };
  skillProfile: {
    skill: string;
    level: number;
    assessmentDate: Date;
    trend: "improving" | "stable" | "declining";
  }[];
  learningPath: {
    currentPhase: string;
    completedMilestones: string[];
    upcomingMilestones: string[];
    estimatedCompletion: Date;
    progressPercent: number;
  };
  recommendations: {
    type: "module" | "certification" | "lab" | "exercise";
    id: string;
    name: string;
    reason: string;
    priority: number;
  }[];
  achievements: {
    recent: {
      id: string;
      name: string;
      earnedAt: Date;
      xpEarned: number;
    }[];
    upcoming: {
      id: string;
      name: string;
      progress: number;
      requirement: string;
    }[];
  };
}

// ============================================
// COMPLIANCE REPORTS
// ============================================

export interface ComplianceReport {
  id: string;
  organizationId: string;
  framework: ComplianceType;
  period: string;
  generatedAt: Date;
  summary: {
    overallScore: number;
    previousScore?: number;
    trend: "improving" | "stable" | "declining";
    controlsAssessed: number;
    controlsPassing: number;
    controlsFailing: number;
    controlsPartial: number;
  };
  controls: ComplianceControl[];
  gaps: ComplianceGap[];
  recommendations: ComplianceRecommendation[];
  trainingCoverage: {
    requiredModules: string[];
    completedModules: string[];
    coveragePercent: number;
  };
  certificationStatus: {
    requiredCertifications: string[];
    earnedCertifications: string[];
    coveragePercent: number;
  };
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "partial" | "not-applicable";
  score: number;
  evidence: string[];
  relatedModules: string[];
  relatedCertifications: string[];
}

export interface ComplianceGap {
  controlId: string;
  controlName: string;
  gap: string;
  risk: "critical" | "high" | "medium" | "low";
  remediation: string;
  estimatedEffort: string;
}

export interface ComplianceRecommendation {
  id: string;
  priority: number;
  recommendation: string;
  impact: string;
  relatedControls: string[];
  suggestedActions: string[];
}

// ============================================
// COMPLIANCE FRAMEWORK MAPPINGS
// ============================================

export interface FrameworkMapping {
  framework: ComplianceType;
  name: string;
  description: string;
  controls: FrameworkControl[];
  trainingRequirements: {
    moduleId: string;
    controlIds: string[];
    required: boolean;
  }[];
  certificationRequirements: {
    certificationId: string;
    controlIds: string[];
    required: boolean;
  }[];
}

export interface FrameworkControl {
  id: string;
  name: string;
  description: string;
  category: string;
  trainingModules: string[];
  certifications: string[];
  assessmentCriteria: string[];
}

export const COMPLIANCE_FRAMEWORKS: FrameworkMapping[] = [
  {
    framework: ComplianceType.NIST,
    name: "NIST Cybersecurity Framework",
    description: "Framework for improving critical infrastructure cybersecurity",
    controls: [
      {
        id: "NIST-ID.AM",
        name: "Asset Management",
        description: "Data, personnel, devices, systems, and facilities are identified and managed",
        category: "Identify",
        trainingModules: ["security-awareness-101"],
        certifications: ["cs-foundations"],
        assessmentCriteria: ["Asset inventory maintained", "Data classification implemented"],
      },
      {
        id: "NIST-PR.AT",
        name: "Awareness and Training",
        description: "Personnel and partners are provided cybersecurity awareness education",
        category: "Protect",
        trainingModules: ["security-awareness-101", "phishing-detection-masterclass"],
        certifications: ["cs-foundations"],
        assessmentCriteria: [
          "Security awareness training completed",
          "Phishing simulations conducted",
          "Training records maintained",
        ],
      },
      {
        id: "NIST-DE.CM",
        name: "Security Continuous Monitoring",
        description: "Information systems and assets are monitored for cybersecurity events",
        category: "Detect",
        trainingModules: ["soc-operations-fundamentals", "siem-splunk-mastery"],
        certifications: ["cs-soc-analyst"],
        assessmentCriteria: [
          "Continuous monitoring implemented",
          "SIEM operational",
          "Alert response procedures documented",
        ],
      },
      {
        id: "NIST-RS.AN",
        name: "Analysis",
        description: "Analysis is conducted to ensure effective response and support recovery",
        category: "Respond",
        trainingModules: ["incident-response-fundamentals"],
        certifications: ["cs-incident-handler"],
        assessmentCriteria: [
          "Incident analysis procedures",
          "Forensic capabilities",
          "Root cause analysis conducted",
        ],
      },
    ],
    trainingRequirements: [
      { moduleId: "security-awareness-101", controlIds: ["NIST-ID.AM", "NIST-PR.AT"], required: true },
      { moduleId: "phishing-detection-masterclass", controlIds: ["NIST-PR.AT"], required: true },
      { moduleId: "soc-operations-fundamentals", controlIds: ["NIST-DE.CM"], required: false },
      { moduleId: "incident-response-fundamentals", controlIds: ["NIST-RS.AN"], required: false },
    ],
    certificationRequirements: [
      { certificationId: "cs-foundations", controlIds: ["NIST-ID.AM", "NIST-PR.AT"], required: true },
      { certificationId: "cs-soc-analyst", controlIds: ["NIST-DE.CM"], required: false },
      { certificationId: "cs-incident-handler", controlIds: ["NIST-RS.AN"], required: false },
    ],
  },
  {
    framework: ComplianceType.CMMC,
    name: "Cybersecurity Maturity Model Certification",
    description: "DoD contractor cybersecurity certification framework",
    controls: [
      {
        id: "CMMC-AT.2.056",
        name: "Security Awareness Training",
        description: "Ensure that managers, system administrators, and users are aware of security risks",
        category: "Awareness and Training",
        trainingModules: ["security-awareness-101", "phishing-detection-masterclass"],
        certifications: ["cs-foundations"],
        assessmentCriteria: [
          "Annual security awareness training",
          "Role-based training for privileged users",
          "Training records maintained",
        ],
      },
      {
        id: "CMMC-IR.2.092",
        name: "Incident Handling",
        description: "Establish an operational incident-handling capability",
        category: "Incident Response",
        trainingModules: ["incident-response-fundamentals"],
        certifications: ["cs-incident-handler"],
        assessmentCriteria: [
          "Incident response plan documented",
          "IR team trained and available",
          "Regular IR exercises conducted",
        ],
      },
      {
        id: "CMMC-SI.2.216",
        name: "Monitor Organization Systems",
        description: "Monitor organizational systems to detect attacks and indicators of potential attacks",
        category: "System and Information Integrity",
        trainingModules: ["soc-operations-fundamentals", "siem-splunk-mastery"],
        certifications: ["cs-soc-analyst"],
        assessmentCriteria: [
          "Continuous monitoring implemented",
          "Intrusion detection systems operational",
          "Log correlation and analysis",
        ],
      },
    ],
    trainingRequirements: [
      { moduleId: "security-awareness-101", controlIds: ["CMMC-AT.2.056"], required: true },
      { moduleId: "phishing-detection-masterclass", controlIds: ["CMMC-AT.2.056"], required: true },
      { moduleId: "incident-response-fundamentals", controlIds: ["CMMC-IR.2.092"], required: true },
      { moduleId: "soc-operations-fundamentals", controlIds: ["CMMC-SI.2.216"], required: true },
    ],
    certificationRequirements: [
      { certificationId: "cs-foundations", controlIds: ["CMMC-AT.2.056"], required: true },
      { certificationId: "cs-incident-handler", controlIds: ["CMMC-IR.2.092"], required: true },
      { certificationId: "cs-soc-analyst", controlIds: ["CMMC-SI.2.216"], required: true },
    ],
  },
  {
    framework: ComplianceType.NICE,
    name: "NICE Cybersecurity Workforce Framework",
    description: "Framework for describing cybersecurity work and workers",
    controls: [
      {
        id: "NICE-PR",
        name: "Protect and Defend",
        description: "Identifies, analyzes, and mitigates threats to internal IT systems",
        category: "Work Roles",
        trainingModules: [
          "soc-operations-fundamentals",
          "siem-splunk-mastery",
          "incident-response-fundamentals",
        ],
        certifications: ["cs-soc-analyst", "cs-incident-handler"],
        assessmentCriteria: [
          "Defense operations competency",
          "Incident response capability",
          "Vulnerability assessment skills",
        ],
      },
      {
        id: "NICE-AN",
        name: "Analyze",
        description: "Reviews information from multiple sources to identify threats",
        category: "Work Roles",
        trainingModules: ["threat-hunting-fundamentals", "malware-analysis-fundamentals"],
        certifications: ["cs-threat-hunter", "cs-malware-analyst"],
        assessmentCriteria: [
          "Threat analysis competency",
          "Intelligence analysis capability",
          "Malware analysis skills",
        ],
      },
      {
        id: "NICE-IN",
        name: "Investigate",
        description: "Investigates cybersecurity events or crimes",
        category: "Work Roles",
        trainingModules: ["digital-forensics-essentials", "incident-response-fundamentals"],
        certifications: ["cs-forensics-analyst", "cs-incident-handler"],
        assessmentCriteria: [
          "Digital forensics competency",
          "Investigation methodology",
          "Evidence handling skills",
        ],
      },
    ],
    trainingRequirements: [
      {
        moduleId: "soc-operations-fundamentals",
        controlIds: ["NICE-PR"],
        required: true,
      },
      {
        moduleId: "threat-hunting-fundamentals",
        controlIds: ["NICE-AN"],
        required: false,
      },
      {
        moduleId: "digital-forensics-essentials",
        controlIds: ["NICE-IN"],
        required: false,
      },
    ],
    certificationRequirements: [
      { certificationId: "cs-soc-analyst", controlIds: ["NICE-PR"], required: true },
      { certificationId: "cs-threat-hunter", controlIds: ["NICE-AN"], required: false },
      { certificationId: "cs-forensics-analyst", controlIds: ["NICE-IN"], required: false },
    ],
  },
];

// ============================================
// ANALYTICS CALCULATION UTILITIES
// ============================================

export function calculateMetricChange(current: number, previous: number): MetricValue {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

  return {
    value: current,
    previousValue: previous,
    change,
    changePercent: Math.round(changePercent * 100) / 100,
    trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
  };
}

export function calculateComplianceScore(controls: ComplianceControl[]): number {
  if (controls.length === 0) return 0;

  const scores: Record<ComplianceControl["status"], number> = {
    pass: 100,
    partial: 50,
    fail: 0,
    "not-applicable": -1,
  };

  const applicableControls = controls.filter((c) => c.status !== "not-applicable");
  if (applicableControls.length === 0) return 100;

  const totalScore = applicableControls.reduce((sum, control) => sum + scores[control.status], 0);
  return Math.round(totalScore / applicableControls.length);
}

export function getComplianceFramework(type: ComplianceType): FrameworkMapping | undefined {
  return COMPLIANCE_FRAMEWORKS.find((f) => f.framework === type);
}

export function calculateTrainingCoverage(
  framework: ComplianceType,
  completedModules: string[]
): number {
  const mapping = getComplianceFramework(framework);
  if (!mapping) return 0;

  const requiredModules = mapping.trainingRequirements
    .filter((r) => r.required)
    .map((r) => r.moduleId);

  if (requiredModules.length === 0) return 100;

  const completedRequired = requiredModules.filter((m) => completedModules.includes(m));
  return Math.round((completedRequired.length / requiredModules.length) * 100);
}

export function generateTimeRanges(): AnalyticsTimeRange[] {
  const now = new Date();

  return [
    {
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now,
      label: "Last 7 days",
    },
    {
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: now,
      label: "Last 30 days",
    },
    {
      start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      end: now,
      label: "Last 90 days",
    },
    {
      start: new Date(now.getFullYear(), 0, 1),
      end: now,
      label: "Year to date",
    },
    {
      start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      end: now,
      label: "Last 12 months",
    },
  ];
}

// ============================================
// EXECUTIVE REPORT GENERATION
// ============================================

export interface ExecutiveReport {
  id: string;
  title: string;
  generatedAt: Date;
  period: AnalyticsTimeRange;
  executiveSummary: string;
  keyMetrics: {
    name: string;
    value: string;
    trend: "up" | "down" | "stable";
    insight: string;
  }[];
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  charts: {
    title: string;
    type: "line" | "bar" | "pie" | "doughnut";
    data: ChartData;
  }[];
}

export function generateExecutiveSummary(analytics: OrganizationAnalytics): string {
  const { overview, compliance } = analytics;

  const summaryParts: string[] = [];

  // User engagement summary
  if (overview.activeUsers.trend === "up") {
    summaryParts.push(
      `User engagement has increased with ${overview.activeUsers.value} active users, up ${overview.activeUsers.changePercent}% from the previous period.`
    );
  } else if (overview.activeUsers.trend === "down") {
    summaryParts.push(
      `User engagement has decreased with ${overview.activeUsers.value} active users, down ${Math.abs(overview.activeUsers.changePercent || 0)}% from the previous period. Action may be required to improve engagement.`
    );
  }

  // Training completion
  summaryParts.push(
    `The overall training completion rate is ${overview.completionRate.value}% with an average score of ${overview.averageScore.value}%.`
  );

  // Certifications
  summaryParts.push(
    `${overview.certificationRate.value}% of users have earned at least one certification.`
  );

  // Compliance
  if (compliance.overallComplianceScore.value >= 90) {
    summaryParts.push(
      `Compliance posture is strong at ${compliance.overallComplianceScore.value}%.`
    );
  } else if (compliance.overallComplianceScore.value >= 70) {
    summaryParts.push(
      `Compliance score is ${compliance.overallComplianceScore.value}%. There are opportunities for improvement in specific control areas.`
    );
  } else {
    summaryParts.push(
      `Compliance score of ${compliance.overallComplianceScore.value}% indicates significant gaps that require immediate attention.`
    );
  }

  return summaryParts.join(" ");
}

// ============================================
// SKILL GAP ANALYSIS
// ============================================

export interface SkillGapAnalysis {
  userId: string;
  assessedAt: Date;
  currentRole: CareerPath;
  targetRole?: CareerPath;
  gaps: {
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
    priority: "critical" | "high" | "medium" | "low";
    recommendedModules: string[];
    estimatedTimeToClose: string;
  }[];
  strengths: {
    skill: string;
    level: number;
    percentile: number;
  }[];
  developmentPlan: {
    phase: number;
    focus: string;
    activities: string[];
    duration: string;
    milestones: string[];
  }[];
}

export function analyzeSkillGaps(
  currentSkills: Record<string, number>,
  targetRole: CareerPath,
  _requiredSkills: Record<string, number>
): SkillGapAnalysis["gaps"] {
  const gaps: SkillGapAnalysis["gaps"] = [];

  // This would normally use the requiredSkills parameter
  // For now, using a simplified mapping based on career path
  const roleRequirements: Record<CareerPath, Record<string, number>> = {
    SOC_ANALYST: {
      "SIEM Operation": 3,
      "Log Analysis": 3,
      "Alert Triage": 3,
      "Network Monitoring": 2,
    },
    THREAT_HUNTER: {
      "Threat Hunting": 4,
      "ATT&CK Mapping": 4,
      "Advanced Log Analysis": 4,
      "Behavioral Analysis": 3,
    },
    INCIDENT_RESPONDER: {
      "Incident Handling": 4,
      "Digital Forensics": 3,
      "Containment": 4,
      "Root Cause Analysis": 3,
    },
    PENETRATION_TESTER: {
      Reconnaissance: 4,
      Exploitation: 4,
      "Privilege Escalation": 4,
      "Report Writing": 3,
    },
    MALWARE_ANALYST: {
      "Static Analysis": 4,
      "Dynamic Analysis": 4,
      "Reverse Engineering": 4,
      "YARA Development": 3,
    },
    FORENSICS_ANALYST: {
      "Disk Forensics": 4,
      "Memory Forensics": 4,
      "Network Forensics": 3,
      "Legal Reporting": 3,
    },
    SECURITY_ENGINEER: {
      "Security Architecture": 4,
      "Cloud Security": 3,
      "Identity Management": 3,
      "Network Security": 4,
    },
    SECURITY_ARCHITECT: {
      "Security Architecture": 5,
      "Risk Assessment": 4,
      "Zero Trust": 4,
      "Strategic Planning": 4,
    },
    CISO_TRACK: {
      "Security Strategy": 5,
      "Risk Management": 5,
      "Executive Communication": 5,
      "Team Leadership": 5,
    },
    GENERAL: {
      "Security Awareness": 2,
      "Phishing Detection": 2,
      "Password Security": 2,
    },
  };

  const required = roleRequirements[targetRole] || {};

  for (const [skill, requiredLevel] of Object.entries(required)) {
    const currentLevel = currentSkills[skill] || 0;
    const gap = requiredLevel - currentLevel;

    if (gap > 0) {
      gaps.push({
        skill,
        currentLevel,
        requiredLevel,
        gap,
        priority:
          gap >= 3 ? "critical" : gap >= 2 ? "high" : gap >= 1 ? "medium" : "low",
        recommendedModules: [], // Would be populated based on skill-module mapping
        estimatedTimeToClose:
          gap >= 3 ? "3-6 months" : gap >= 2 ? "1-3 months" : "2-4 weeks",
      });
    }
  }

  return gaps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
