/**
 * Cyber Shield Enterprise Threat Intelligence System
 * Integration with MITRE ATT&CK, STIX/TAXII, and Threat Feeds
 */

import {
  ThreatFeedType,
  IndicatorType,
  ThreatSeverity,
  TLPLevel,
  ReportType,
} from "@prisma/client";

// ============================================
// MITRE ATT&CK FRAMEWORK
// ============================================

export interface AttackTactic {
  id: string;
  name: string;
  shortName: string;
  description: string;
  url: string;
  order: number;
  techniques: AttackTechnique[];
}

export interface AttackTechnique {
  id: string;
  name: string;
  description: string;
  tacticIds: string[];
  platforms: string[];
  dataSources: string[];
  detection: string;
  mitigation: string;
  subTechniques?: AttackSubTechnique[];
  url: string;
  isSubTechnique: boolean;
  parentId?: string;
}

export interface AttackSubTechnique {
  id: string;
  name: string;
  description: string;
  parentId: string;
  platforms: string[];
  detection: string;
  url: string;
}

// ATT&CK Tactics (Enterprise)
export const ATTACK_TACTICS: AttackTactic[] = [
  {
    id: "TA0043",
    name: "Reconnaissance",
    shortName: "recon",
    description: "The adversary is trying to gather information they can use to plan future operations.",
    url: "https://attack.mitre.org/tactics/TA0043/",
    order: 1,
    techniques: [],
  },
  {
    id: "TA0042",
    name: "Resource Development",
    shortName: "resource-dev",
    description: "The adversary is trying to establish resources they can use to support operations.",
    url: "https://attack.mitre.org/tactics/TA0042/",
    order: 2,
    techniques: [],
  },
  {
    id: "TA0001",
    name: "Initial Access",
    shortName: "initial-access",
    description: "The adversary is trying to get into your network.",
    url: "https://attack.mitre.org/tactics/TA0001/",
    order: 3,
    techniques: [],
  },
  {
    id: "TA0002",
    name: "Execution",
    shortName: "execution",
    description: "The adversary is trying to run malicious code.",
    url: "https://attack.mitre.org/tactics/TA0002/",
    order: 4,
    techniques: [],
  },
  {
    id: "TA0003",
    name: "Persistence",
    shortName: "persistence",
    description: "The adversary is trying to maintain their foothold.",
    url: "https://attack.mitre.org/tactics/TA0003/",
    order: 5,
    techniques: [],
  },
  {
    id: "TA0004",
    name: "Privilege Escalation",
    shortName: "priv-esc",
    description: "The adversary is trying to gain higher-level permissions.",
    url: "https://attack.mitre.org/tactics/TA0004/",
    order: 6,
    techniques: [],
  },
  {
    id: "TA0005",
    name: "Defense Evasion",
    shortName: "defense-evasion",
    description: "The adversary is trying to avoid being detected.",
    url: "https://attack.mitre.org/tactics/TA0005/",
    order: 7,
    techniques: [],
  },
  {
    id: "TA0006",
    name: "Credential Access",
    shortName: "cred-access",
    description: "The adversary is trying to steal account names and passwords.",
    url: "https://attack.mitre.org/tactics/TA0006/",
    order: 8,
    techniques: [],
  },
  {
    id: "TA0007",
    name: "Discovery",
    shortName: "discovery",
    description: "The adversary is trying to figure out your environment.",
    url: "https://attack.mitre.org/tactics/TA0007/",
    order: 9,
    techniques: [],
  },
  {
    id: "TA0008",
    name: "Lateral Movement",
    shortName: "lateral-movement",
    description: "The adversary is trying to move through your environment.",
    url: "https://attack.mitre.org/tactics/TA0008/",
    order: 10,
    techniques: [],
  },
  {
    id: "TA0009",
    name: "Collection",
    shortName: "collection",
    description: "The adversary is trying to gather data of interest to their goal.",
    url: "https://attack.mitre.org/tactics/TA0009/",
    order: 11,
    techniques: [],
  },
  {
    id: "TA0011",
    name: "Command and Control",
    shortName: "c2",
    description: "The adversary is trying to communicate with compromised systems to control them.",
    url: "https://attack.mitre.org/tactics/TA0011/",
    order: 12,
    techniques: [],
  },
  {
    id: "TA0010",
    name: "Exfiltration",
    shortName: "exfiltration",
    description: "The adversary is trying to steal data.",
    url: "https://attack.mitre.org/tactics/TA0010/",
    order: 13,
    techniques: [],
  },
  {
    id: "TA0040",
    name: "Impact",
    shortName: "impact",
    description: "The adversary is trying to manipulate, interrupt, or destroy your systems and data.",
    url: "https://attack.mitre.org/tactics/TA0040/",
    order: 14,
    techniques: [],
  },
];

// Common ATT&CK Techniques for Training
export const COMMON_TECHNIQUES: AttackTechnique[] = [
  {
    id: "T1566",
    name: "Phishing",
    description: "Adversaries may send phishing messages to gain access to victim systems.",
    tacticIds: ["TA0001"],
    platforms: ["Windows", "macOS", "Linux", "Office 365", "Google Workspace"],
    dataSources: ["Email", "Network Traffic", "File"],
    detection: "Monitor for suspicious email attachments and links. Analyze email headers for spoofing.",
    mitigation: "User training, email filtering, sandboxing, URL rewriting.",
    subTechniques: [
      {
        id: "T1566.001",
        name: "Spearphishing Attachment",
        description: "Adversaries send attachments with malicious content.",
        parentId: "T1566",
        platforms: ["Windows", "macOS", "Linux"],
        detection: "Monitor for suspicious file execution from email clients.",
        url: "https://attack.mitre.org/techniques/T1566/001/",
      },
      {
        id: "T1566.002",
        name: "Spearphishing Link",
        description: "Adversaries send links to malicious sites.",
        parentId: "T1566",
        platforms: ["Windows", "macOS", "Linux"],
        detection: "Monitor for suspicious URL clicks and browser activity.",
        url: "https://attack.mitre.org/techniques/T1566/002/",
      },
    ],
    url: "https://attack.mitre.org/techniques/T1566/",
    isSubTechnique: false,
  },
  {
    id: "T1059",
    name: "Command and Scripting Interpreter",
    description: "Adversaries may abuse command and script interpreters to execute commands.",
    tacticIds: ["TA0002"],
    platforms: ["Windows", "macOS", "Linux"],
    dataSources: ["Process", "Command", "Script"],
    detection: "Monitor for unusual command-line activity and script execution.",
    mitigation: "Disable or restrict scripting where possible. Monitor script execution.",
    subTechniques: [
      {
        id: "T1059.001",
        name: "PowerShell",
        description: "Adversaries may abuse PowerShell commands and scripts for execution.",
        parentId: "T1059",
        platforms: ["Windows"],
        detection: "Enable PowerShell logging. Monitor for suspicious PowerShell commands.",
        url: "https://attack.mitre.org/techniques/T1059/001/",
      },
    ],
    url: "https://attack.mitre.org/techniques/T1059/",
    isSubTechnique: false,
  },
  {
    id: "T1078",
    name: "Valid Accounts",
    description: "Adversaries may use valid accounts to maintain access to victim systems.",
    tacticIds: ["TA0001", "TA0003", "TA0004", "TA0005"],
    platforms: ["Windows", "macOS", "Linux", "Cloud"],
    dataSources: ["Authentication", "Logon Session", "User Account"],
    detection: "Monitor for anomalous account usage, impossible travel, unusual login times.",
    mitigation: "MFA, credential hygiene, account monitoring, privileged access management.",
    url: "https://attack.mitre.org/techniques/T1078/",
    isSubTechnique: false,
  },
  {
    id: "T1486",
    name: "Data Encrypted for Impact",
    description: "Adversaries may encrypt data on target systems to interrupt availability.",
    tacticIds: ["TA0040"],
    platforms: ["Windows", "macOS", "Linux"],
    dataSources: ["File", "Process", "Command"],
    detection: "Monitor for mass file modification, encryption API usage.",
    mitigation: "Backups, access controls, endpoint protection.",
    url: "https://attack.mitre.org/techniques/T1486/",
    isSubTechnique: false,
  },
  {
    id: "T1021",
    name: "Remote Services",
    description: "Adversaries may use remote services to move laterally.",
    tacticIds: ["TA0008"],
    platforms: ["Windows", "macOS", "Linux"],
    dataSources: ["Network Traffic", "Logon Session", "Process"],
    detection: "Monitor for unusual remote connections, especially from compromised accounts.",
    mitigation: "Network segmentation, MFA, disable unnecessary remote services.",
    url: "https://attack.mitre.org/techniques/T1021/",
    isSubTechnique: false,
  },
];

// ============================================
// THREAT INTELLIGENCE INDICATORS
// ============================================

export interface ThreatIndicator {
  id: string;
  type: IndicatorType;
  value: string;
  threatType?: string;
  confidence: number;
  severity: ThreatSeverity;
  firstSeen: Date;
  lastSeen: Date;
  expiresAt?: Date;
  tags: string[];
  description?: string;
  relatedCampaign?: string;
  source: string;
  tlpLevel: TLPLevel;
}

export interface ThreatFeed {
  id: string;
  name: string;
  description: string;
  feedType: ThreatFeedType;
  sourceUrl?: string;
  isActive: boolean;
  refreshInterval: number; // seconds
  lastRefresh?: Date;
  indicatorCount: number;
}

// Sample Threat Feeds for Training
export const TRAINING_THREAT_FEEDS: ThreatFeed[] = [
  {
    id: "feed-misp-training",
    name: "CyberShield Training MISP",
    description: "Training indicators from MISP instance",
    feedType: ThreatFeedType.INTERNAL,
    isActive: true,
    refreshInterval: 3600,
    indicatorCount: 1500,
  },
  {
    id: "feed-otx-training",
    name: "AlienVault OTX (Training)",
    description: "Open threat exchange indicators for training",
    feedType: ThreatFeedType.OPEN_SOURCE,
    sourceUrl: "https://otx.alienvault.com",
    isActive: true,
    refreshInterval: 7200,
    indicatorCount: 5000,
  },
  {
    id: "feed-cisa-training",
    name: "CISA Known Exploited Vulnerabilities",
    description: "CISA KEV catalog for training",
    feedType: ThreatFeedType.GOVERNMENT,
    sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    isActive: true,
    refreshInterval: 86400,
    indicatorCount: 1000,
  },
  {
    id: "feed-isac-training",
    name: "Sector ISAC Feed (Training)",
    description: "Sector-specific threat intelligence for training",
    feedType: ThreatFeedType.ISAC,
    isActive: true,
    refreshInterval: 3600,
    indicatorCount: 2500,
  },
];

// Sample Indicators for Training Scenarios
export const TRAINING_INDICATORS: ThreatIndicator[] = [
  {
    id: "ioc-1",
    type: IndicatorType.IP_ADDRESS,
    value: "192.168.100.50",
    threatType: "C2 Server",
    confidence: 0.95,
    severity: ThreatSeverity.HIGH,
    firstSeen: new Date("2024-01-15"),
    lastSeen: new Date("2024-01-28"),
    tags: ["apt", "cobalt-strike", "c2"],
    description: "Known Cobalt Strike C2 server",
    relatedCampaign: "APT-Training-Exercise",
    source: "Internal Analysis",
    tlpLevel: TLPLevel.AMBER,
  },
  {
    id: "ioc-2",
    type: IndicatorType.DOMAIN,
    value: "malicious-update.com",
    threatType: "Malware Distribution",
    confidence: 0.90,
    severity: ThreatSeverity.CRITICAL,
    firstSeen: new Date("2024-01-10"),
    lastSeen: new Date("2024-01-28"),
    tags: ["malware", "distribution", "fake-update"],
    description: "Domain distributing fake software updates",
    source: "Threat Intelligence Feed",
    tlpLevel: TLPLevel.GREEN,
  },
  {
    id: "ioc-3",
    type: IndicatorType.FILE_HASH,
    value: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    threatType: "Ransomware",
    confidence: 1.0,
    severity: ThreatSeverity.CRITICAL,
    firstSeen: new Date("2024-01-20"),
    lastSeen: new Date("2024-01-28"),
    tags: ["ransomware", "lockbit", "encryption"],
    description: "LockBit ransomware sample SHA-256 hash",
    relatedCampaign: "LockBit-2024",
    source: "Malware Analysis",
    tlpLevel: TLPLevel.AMBER,
  },
  {
    id: "ioc-4",
    type: IndicatorType.EMAIL,
    value: "support@legitimate-looking-domain.com",
    threatType: "Phishing",
    confidence: 0.85,
    severity: ThreatSeverity.MEDIUM,
    firstSeen: new Date("2024-01-22"),
    lastSeen: new Date("2024-01-28"),
    tags: ["phishing", "bec", "credential-harvesting"],
    description: "Email address used in BEC campaign",
    source: "User Report",
    tlpLevel: TLPLevel.GREEN,
  },
  {
    id: "ioc-5",
    type: IndicatorType.CVE,
    value: "CVE-2024-0001",
    threatType: "Vulnerability",
    confidence: 1.0,
    severity: ThreatSeverity.CRITICAL,
    firstSeen: new Date("2024-01-01"),
    lastSeen: new Date("2024-01-28"),
    tags: ["vulnerability", "rce", "critical"],
    description: "Critical RCE vulnerability in training environment",
    source: "NVD",
    tlpLevel: TLPLevel.WHITE,
  },
];

// ============================================
// THREAT ACTOR PROFILES
// ============================================

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  motivations: string[];
  sophistication: "none" | "minimal" | "intermediate" | "advanced" | "strategic";
  resourceLevel: "individual" | "club" | "organization" | "government";
  primaryGoals: string[];
  targetedSectors: string[];
  targetedCountries: string[];
  ttps: string[]; // ATT&CK technique IDs
  tools: string[];
  associatedCampaigns: string[];
  firstSeen: Date;
  lastSeen: Date;
  isActive: boolean;
  tlpLevel: TLPLevel;
}

// Sample Threat Actors for Training
export const TRAINING_THREAT_ACTORS: ThreatActor[] = [
  {
    id: "ta-training-1",
    name: "TRAINING APT ALPHA",
    aliases: ["Blue Phoenix", "TA-ALPHA"],
    description: "Simulated state-sponsored threat actor for training exercises. Focuses on government and defense sectors.",
    motivations: ["espionage", "intellectual-property-theft"],
    sophistication: "advanced",
    resourceLevel: "government",
    primaryGoals: [
      "Steal classified information",
      "Gain persistent access to government networks",
      "Collect intelligence on defense programs",
    ],
    targetedSectors: ["Government", "Defense", "Aerospace"],
    targetedCountries: ["United States", "United Kingdom", "Australia"],
    ttps: ["T1566.001", "T1059.001", "T1078", "T1021.001", "T1486"],
    tools: ["Cobalt Strike", "Mimikatz", "Custom Malware"],
    associatedCampaigns: ["Operation Blue Sky", "Project Phoenix"],
    firstSeen: new Date("2020-01-01"),
    lastSeen: new Date("2024-01-28"),
    isActive: true,
    tlpLevel: TLPLevel.AMBER,
  },
  {
    id: "ta-training-2",
    name: "TRAINING CRIME SYNDICATE",
    aliases: ["Shadow Brokers", "TA-CRIME"],
    description: "Simulated financially-motivated cybercriminal group for training exercises.",
    motivations: ["financial-gain", "crime-syndicate"],
    sophistication: "intermediate",
    resourceLevel: "organization",
    primaryGoals: [
      "Deploy ransomware for financial gain",
      "Steal and sell credentials",
      "Business email compromise",
    ],
    targetedSectors: ["Healthcare", "Financial", "Retail", "Manufacturing"],
    targetedCountries: ["Global"],
    ttps: ["T1566.002", "T1059.001", "T1486", "T1078"],
    tools: ["LockBit", "Emotet", "Cobalt Strike"],
    associatedCampaigns: ["RansomOps 2024", "BEC Campaign Alpha"],
    firstSeen: new Date("2022-06-01"),
    lastSeen: new Date("2024-01-28"),
    isActive: true,
    tlpLevel: TLPLevel.GREEN,
  },
];

// ============================================
// THREAT REPORTS
// ============================================

export interface ThreatReportTemplate {
  id: string;
  title: string;
  reportType: ReportType;
  sections: ReportSection[];
  requiredFields: string[];
  optionalFields: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  order: number;
}

export const THREAT_REPORT_TEMPLATES: ThreatReportTemplate[] = [
  {
    id: "template-threat-assessment",
    title: "Threat Assessment Report",
    reportType: ReportType.THREAT_ASSESSMENT,
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        description: "High-level overview of the threat assessment",
        required: true,
        order: 1,
      },
      {
        id: "threat-overview",
        title: "Threat Overview",
        description: "Detailed description of the threat",
        required: true,
        order: 2,
      },
      {
        id: "affected-assets",
        title: "Affected Assets",
        description: "Systems and assets potentially impacted",
        required: true,
        order: 3,
      },
      {
        id: "indicators",
        title: "Indicators of Compromise",
        description: "Technical indicators associated with the threat",
        required: true,
        order: 4,
      },
      {
        id: "ttps",
        title: "Tactics, Techniques, and Procedures",
        description: "ATT&CK-mapped adversary behaviors",
        required: true,
        order: 5,
      },
      {
        id: "recommendations",
        title: "Recommendations",
        description: "Defensive recommendations and mitigations",
        required: true,
        order: 6,
      },
      {
        id: "appendix",
        title: "Appendix",
        description: "Supporting information and references",
        required: false,
        order: 7,
      },
    ],
    requiredFields: ["title", "summary", "content", "severity", "tlpLevel"],
    optionalFields: ["indicators", "tags", "affectedSystems"],
  },
  {
    id: "template-incident-report",
    title: "Incident Report",
    reportType: ReportType.INCIDENT_REPORT,
    sections: [
      {
        id: "incident-summary",
        title: "Incident Summary",
        description: "Brief overview of the incident",
        required: true,
        order: 1,
      },
      {
        id: "timeline",
        title: "Incident Timeline",
        description: "Chronological sequence of events",
        required: true,
        order: 2,
      },
      {
        id: "scope",
        title: "Scope and Impact",
        description: "Extent of the incident and business impact",
        required: true,
        order: 3,
      },
      {
        id: "root-cause",
        title: "Root Cause Analysis",
        description: "Underlying cause of the incident",
        required: true,
        order: 4,
      },
      {
        id: "response-actions",
        title: "Response Actions",
        description: "Actions taken to contain and remediate",
        required: true,
        order: 5,
      },
      {
        id: "lessons-learned",
        title: "Lessons Learned",
        description: "Key takeaways and improvements",
        required: true,
        order: 6,
      },
    ],
    requiredFields: ["title", "summary", "content", "severity", "tlpLevel"],
    optionalFields: ["indicators", "tags", "affectedSystems"],
  },
  {
    id: "template-intelligence-brief",
    title: "Intelligence Brief",
    reportType: ReportType.INTELLIGENCE_BRIEF,
    sections: [
      {
        id: "key-findings",
        title: "Key Findings",
        description: "Primary intelligence findings",
        required: true,
        order: 1,
      },
      {
        id: "background",
        title: "Background",
        description: "Context and background information",
        required: true,
        order: 2,
      },
      {
        id: "analysis",
        title: "Analysis",
        description: "Detailed analytical assessment",
        required: true,
        order: 3,
      },
      {
        id: "outlook",
        title: "Outlook",
        description: "Future predictions and trends",
        required: false,
        order: 4,
      },
      {
        id: "recommendations",
        title: "Recommendations",
        description: "Suggested actions",
        required: true,
        order: 5,
      },
    ],
    requiredFields: ["title", "summary", "content", "severity", "tlpLevel"],
    optionalFields: ["indicators", "tags"],
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getTacticById(id: string): AttackTactic | undefined {
  return ATTACK_TACTICS.find((t) => t.id === id);
}

export function getTechniqueById(id: string): AttackTechnique | undefined {
  return COMMON_TECHNIQUES.find((t) => t.id === id || t.subTechniques?.some((st) => st.id === id));
}

export function getTechniquesByTactic(tacticId: string): AttackTechnique[] {
  return COMMON_TECHNIQUES.filter((t) => t.tacticIds.includes(tacticId));
}

export function getIndicatorsBySeverity(severity: ThreatSeverity): ThreatIndicator[] {
  return TRAINING_INDICATORS.filter((i) => i.severity === severity);
}

export function getIndicatorsByType(type: IndicatorType): ThreatIndicator[] {
  return TRAINING_INDICATORS.filter((i) => i.type === type);
}

export function formatTlpLevel(tlp: TLPLevel): { label: string; color: string; description: string } {
  const formats: Record<TLPLevel, { label: string; color: string; description: string }> = {
    RED: {
      label: "TLP:RED",
      color: "#ff0000",
      description: "For named recipients only. No sharing.",
    },
    AMBER: {
      label: "TLP:AMBER",
      color: "#ffc000",
      description: "Limited sharing within organization.",
    },
    GREEN: {
      label: "TLP:GREEN",
      color: "#33ff00",
      description: "Community-wide sharing.",
    },
    WHITE: {
      label: "TLP:WHITE",
      color: "#ffffff",
      description: "Unlimited sharing.",
    },
  };
  return formats[tlp];
}

export function formatSeverity(severity: ThreatSeverity): { label: string; color: string } {
  const formats: Record<ThreatSeverity, { label: string; color: string }> = {
    CRITICAL: { label: "Critical", color: "#dc2626" },
    HIGH: { label: "High", color: "#f97316" },
    MEDIUM: { label: "Medium", color: "#eab308" },
    LOW: { label: "Low", color: "#22c55e" },
    INFORMATIONAL: { label: "Info", color: "#3b82f6" },
  };
  return formats[severity];
}

// ============================================
// STIX/TAXII INTEGRATION HELPERS
// ============================================

export interface StixBundle {
  type: "bundle";
  id: string;
  objects: StixObject[];
}

export interface StixObject {
  type: string;
  id: string;
  created: string;
  modified: string;
  [key: string]: unknown;
}

export function convertIndicatorToStix(indicator: ThreatIndicator): StixObject {
  return {
    type: "indicator",
    id: `indicator--${indicator.id}`,
    created: indicator.firstSeen.toISOString(),
    modified: indicator.lastSeen.toISOString(),
    name: `${indicator.type}: ${indicator.value}`,
    description: indicator.description || "",
    pattern: generateStixPattern(indicator),
    pattern_type: "stix",
    valid_from: indicator.firstSeen.toISOString(),
    valid_until: indicator.expiresAt?.toISOString(),
    labels: indicator.tags,
    confidence: Math.round(indicator.confidence * 100),
  };
}

function generateStixPattern(indicator: ThreatIndicator): string {
  const patterns: Record<IndicatorType, (value: string) => string> = {
    IP_ADDRESS: (v) => `[ipv4-addr:value = '${v}']`,
    DOMAIN: (v) => `[domain-name:value = '${v}']`,
    URL: (v) => `[url:value = '${v}']`,
    FILE_HASH: (v) => `[file:hashes.'SHA-256' = '${v}']`,
    EMAIL: (v) => `[email-addr:value = '${v}']`,
    CVE: (v) => `[vulnerability:name = '${v}']`,
    YARA_RULE: (v) => `[malware-analysis:result = '${v}']`,
    SIGMA_RULE: (v) => `[malware-analysis:result = '${v}']`,
    TTP: (v) => `[attack-pattern:external_references.external_id = '${v}']`,
  };

  return patterns[indicator.type](indicator.value);
}

export function createStixBundle(indicators: ThreatIndicator[]): StixBundle {
  return {
    type: "bundle",
    id: `bundle--${crypto.randomUUID()}`,
    objects: indicators.map(convertIndicatorToStix),
  };
}
