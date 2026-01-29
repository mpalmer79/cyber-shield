/**
 * Cyber Shield Enterprise Certification System
 * Government-Grade Professional Certifications
 */

import { CertificationLevel, CareerPath, ClearanceLevel, DifficultyLevel } from "@prisma/client";

// ============================================
// CERTIFICATION DEFINITIONS
// ============================================

export interface CertificationDefinition {
  slug: string;
  name: string;
  acronym: string;
  description: string;
  longDescription: string;
  icon: string;
  badge: string;
  level: CertificationLevel;
  careerPath?: CareerPath;
  clearanceRequired: ClearanceLevel;
  prerequisites: string[];
  requiredModules: string[];
  requiredScore: number;
  validityPeriod: number; // months, 0 = never expires
  renewalRequired: boolean;
  accreditedBy?: string;
  examConfig: ExamConfiguration;
  skills: string[];
  jobRoles: string[];
  niceFrameworkMapping?: string[];
}

export interface ExamConfiguration {
  title: string;
  description: string;
  totalQuestions: number;
  passingScore: number;
  timeLimit: number; // minutes
  maxAttempts: number;
  randomizeQuestions: boolean;
  showResults: boolean;
  proctored: boolean;
  questionTypes: QuestionType[];
  questionPool: QuestionPoolConfig;
  retakeWaitPeriod: number; // days
}

export interface QuestionPoolConfig {
  categories: {
    category: string;
    count: number;
    difficulty: DifficultyLevel;
  }[];
  totalQuestions: number;
}

export type QuestionType =
  | "multiple-choice"
  | "multiple-select"
  | "true-false"
  | "scenario-based"
  | "drag-drop"
  | "fill-blank"
  | "practical-lab";

// ============================================
// EXAM QUESTION DEFINITIONS
// ============================================

export interface ExamQuestion {
  id: string;
  category: string;
  difficulty: DifficultyLevel;
  questionType: QuestionType;
  question: string;
  scenario?: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  timeEstimate: number; // seconds
  references?: string[];
  niceKsaId?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// ============================================
// FOUNDATIONAL CERTIFICATIONS
// ============================================

export const FOUNDATIONAL_CERTIFICATIONS: CertificationDefinition[] = [
  {
    slug: "cs-foundations",
    name: "CyberShield Security Foundations",
    acronym: "CS-SF",
    description: "Validate foundational cybersecurity knowledge and awareness",
    longDescription: `The CyberShield Security Foundations (CS-SF) certification validates that an individual has mastered the fundamental concepts of cybersecurity. This entry-level certification demonstrates understanding of core security principles, common threats, and basic defensive practices.

This certification is ideal for:
- New security team members
- IT professionals transitioning to security
- Non-technical staff requiring security awareness
- Students entering the cybersecurity field

The CS-SF certification provides a strong foundation for more advanced certifications and career progression within the CyberShield training platform.`,
    icon: "shield-check",
    badge: "/badges/cs-foundations.svg",
    level: CertificationLevel.FOUNDATIONAL,
    clearanceRequired: ClearanceLevel.UNCLASSIFIED,
    prerequisites: [],
    requiredModules: [
      "security-awareness-101",
      "phishing-detection-masterclass",
      "password-security-deep-dive",
    ],
    requiredScore: 75,
    validityPeriod: 24, // 2 years
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-SF Certification Exam",
      description: "Comprehensive assessment of foundational security knowledge",
      totalQuestions: 60,
      passingScore: 75,
      timeLimit: 90,
      maxAttempts: 3,
      randomizeQuestions: true,
      showResults: true,
      proctored: false,
      questionTypes: ["multiple-choice", "multiple-select", "true-false", "scenario-based"],
      questionPool: {
        categories: [
          { category: "Security Fundamentals", count: 15, difficulty: DifficultyLevel.BEGINNER },
          { category: "Threat Awareness", count: 15, difficulty: DifficultyLevel.BEGINNER },
          { category: "Phishing Detection", count: 15, difficulty: DifficultyLevel.BEGINNER },
          { category: "Authentication Security", count: 10, difficulty: DifficultyLevel.BEGINNER },
          { category: "Security Best Practices", count: 5, difficulty: DifficultyLevel.INTERMEDIATE },
        ],
        totalQuestions: 60,
      },
      retakeWaitPeriod: 3,
    },
    skills: [
      "Security Awareness",
      "Threat Recognition",
      "Phishing Detection",
      "Password Security",
      "Security Policy Compliance",
    ],
    jobRoles: [
      "Security Awareness Champion",
      "IT Support Specialist",
      "Help Desk Technician",
      "Junior Security Analyst",
    ],
    niceFrameworkMapping: ["K0001", "K0004", "K0005", "K0044"],
  },
];

// ============================================
// SOC ANALYST CERTIFICATIONS
// ============================================

export const SOC_CERTIFICATIONS: CertificationDefinition[] = [
  {
    slug: "cs-soc-analyst",
    name: "CyberShield SOC Analyst",
    acronym: "CS-SOC",
    description: "Validate skills for Security Operations Center analyst roles",
    longDescription: `The CyberShield SOC Analyst (CS-SOC) certification validates the skills required to work effectively in a Security Operations Center. Certified individuals demonstrate proficiency in security monitoring, alert triage, incident detection, and SOC tools.

This certification covers:
- SIEM operation and query writing
- Alert analysis and triage
- Threat detection techniques
- Incident escalation procedures
- Log analysis and correlation
- Network traffic analysis fundamentals

The CS-SOC certification is designed for security professionals seeking to validate their SOC skills or transition into a SOC analyst role.`,
    icon: "monitor",
    badge: "/badges/cs-soc-analyst.svg",
    level: CertificationLevel.ASSOCIATE,
    careerPath: CareerPath.SOC_ANALYST,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["cs-foundations"],
    requiredModules: [
      "soc-operations-fundamentals",
      "siem-splunk-mastery",
      "network-traffic-analysis",
    ],
    requiredScore: 80,
    validityPeriod: 24,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-SOC Certification Exam",
      description: "Comprehensive assessment of SOC analyst skills",
      totalQuestions: 80,
      passingScore: 80,
      timeLimit: 120,
      maxAttempts: 3,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "multiple-select",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "SOC Operations", count: 20, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "SIEM & Log Analysis", count: 20, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Threat Detection", count: 15, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Network Analysis", count: 15, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Practical Scenarios", count: 10, difficulty: DifficultyLevel.ADVANCED },
        ],
        totalQuestions: 80,
      },
      retakeWaitPeriod: 7,
    },
    skills: [
      "SIEM Operation",
      "Log Analysis",
      "Alert Triage",
      "Threat Detection",
      "Network Monitoring",
      "Incident Documentation",
    ],
    jobRoles: [
      "SOC Analyst Tier 1",
      "SOC Analyst Tier 2",
      "Security Analyst",
      "Threat Analyst",
    ],
    niceFrameworkMapping: ["K0046", "K0058", "K0061", "K0177"],
  },
  {
    slug: "cs-soc-lead",
    name: "CyberShield SOC Team Lead",
    acronym: "CS-SOCL",
    description: "Validate leadership skills for SOC team management",
    longDescription: `The CyberShield SOC Team Lead (CS-SOCL) certification validates advanced SOC skills and leadership capabilities. Certified individuals demonstrate expertise in SOC operations, team management, and process optimization.

This advanced certification covers:
- SOC team leadership
- Detection engineering
- SOAR implementation
- Metrics and reporting
- Process optimization
- Mentoring and training
- Stakeholder communication

The CS-SOCL certification is designed for experienced SOC analysts ready to take on leadership responsibilities.`,
    icon: "users",
    badge: "/badges/cs-soc-lead.svg",
    level: CertificationLevel.PROFESSIONAL,
    careerPath: CareerPath.SOC_ANALYST,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["cs-soc-analyst"],
    requiredModules: [
      "soc-operations-fundamentals",
      "siem-splunk-mastery",
      "network-traffic-analysis",
      "threat-hunting-fundamentals",
      "mitre-attack-deep-dive",
    ],
    requiredScore: 85,
    validityPeriod: 36,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-SOCL Certification Exam",
      description: "Advanced assessment of SOC leadership skills",
      totalQuestions: 100,
      passingScore: 85,
      timeLimit: 180,
      maxAttempts: 2,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "multiple-select",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "Advanced SOC Operations", count: 25, difficulty: DifficultyLevel.ADVANCED },
          { category: "Detection Engineering", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Team Leadership", count: 20, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Threat Hunting", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Complex Scenarios", count: 15, difficulty: DifficultyLevel.EXPERT },
        ],
        totalQuestions: 100,
      },
      retakeWaitPeriod: 14,
    },
    skills: [
      "Team Leadership",
      "Detection Engineering",
      "SOAR Implementation",
      "Threat Hunting",
      "Metrics & Reporting",
      "Process Optimization",
    ],
    jobRoles: [
      "SOC Team Lead",
      "Senior SOC Analyst",
      "SOC Manager",
      "Detection Engineer",
    ],
    niceFrameworkMapping: ["K0046", "K0058", "K0101", "K0177", "K0290"],
  },
];

// ============================================
// INCIDENT RESPONSE CERTIFICATIONS
// ============================================

export const IR_CERTIFICATIONS: CertificationDefinition[] = [
  {
    slug: "cs-incident-handler",
    name: "CyberShield Incident Handler",
    acronym: "CS-IH",
    description: "Validate incident response and handling capabilities",
    longDescription: `The CyberShield Incident Handler (CS-IH) certification validates comprehensive incident response skills. Certified individuals demonstrate the ability to detect, analyze, contain, and remediate security incidents effectively.

This certification covers:
- Incident response lifecycle
- Evidence collection and preservation
- Containment strategies
- Root cause analysis
- Incident documentation
- Stakeholder communication
- Post-incident activities

The CS-IH certification is essential for security professionals responsible for responding to security incidents.`,
    icon: "alert-triangle",
    badge: "/badges/cs-incident-handler.svg",
    level: CertificationLevel.PROFESSIONAL,
    careerPath: CareerPath.INCIDENT_RESPONDER,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["cs-soc-analyst"],
    requiredModules: [
      "incident-response-fundamentals",
      "digital-forensics-essentials",
    ],
    requiredScore: 80,
    validityPeriod: 24,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-IH Certification Exam",
      description: "Comprehensive incident response assessment",
      totalQuestions: 90,
      passingScore: 80,
      timeLimit: 150,
      maxAttempts: 3,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "multiple-select",
        "scenario-based",
        "practical-lab",
        "drag-drop",
      ],
      questionPool: {
        categories: [
          { category: "IR Lifecycle", count: 20, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Containment & Eradication", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Forensic Fundamentals", count: 15, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Documentation & Communication", count: 15, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Practical IR Scenarios", count: 20, difficulty: DifficultyLevel.ADVANCED },
        ],
        totalQuestions: 90,
      },
      retakeWaitPeriod: 7,
    },
    skills: [
      "Incident Detection",
      "Containment",
      "Eradication",
      "Recovery",
      "Evidence Handling",
      "Incident Documentation",
    ],
    jobRoles: [
      "Incident Responder",
      "IR Analyst",
      "Security Incident Manager",
      "CSIRT Member",
    ],
    niceFrameworkMapping: ["K0042", "K0060", "K0070", "K0118"],
  },
  {
    slug: "cs-forensics-analyst",
    name: "CyberShield Digital Forensics Analyst",
    acronym: "CS-DFA",
    description: "Validate digital forensics investigation skills",
    longDescription: `The CyberShield Digital Forensics Analyst (CS-DFA) certification validates expertise in collecting, preserving, and analyzing digital evidence. Certified individuals demonstrate proficiency in forensic methodologies and tools.

This certification covers:
- Forensic acquisition methods
- Chain of custody
- File system forensics
- Memory forensics
- Network forensics
- Timeline analysis
- Legal considerations
- Expert reporting

The CS-DFA certification is designed for security professionals conducting forensic investigations.`,
    icon: "microscope",
    badge: "/badges/cs-forensics-analyst.svg",
    level: CertificationLevel.PROFESSIONAL,
    careerPath: CareerPath.FORENSICS_ANALYST,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["cs-incident-handler"],
    requiredModules: [
      "digital-forensics-essentials",
      "incident-response-fundamentals",
    ],
    requiredScore: 85,
    validityPeriod: 36,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-DFA Certification Exam",
      description: "Advanced digital forensics assessment",
      totalQuestions: 100,
      passingScore: 85,
      timeLimit: 180,
      maxAttempts: 2,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "multiple-select",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "Forensic Acquisition", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "File System Analysis", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Memory Forensics", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Network Forensics", count: 15, difficulty: DifficultyLevel.ADVANCED },
          { category: "Legal & Reporting", count: 10, difficulty: DifficultyLevel.INTERMEDIATE },
          { category: "Practical Labs", count: 15, difficulty: DifficultyLevel.EXPERT },
        ],
        totalQuestions: 100,
      },
      retakeWaitPeriod: 14,
    },
    skills: [
      "Forensic Acquisition",
      "Evidence Analysis",
      "Memory Forensics",
      "Network Forensics",
      "Timeline Creation",
      "Legal Reporting",
    ],
    jobRoles: [
      "Digital Forensics Analyst",
      "Forensic Investigator",
      "Computer Forensics Examiner",
      "Incident Responder",
    ],
    niceFrameworkMapping: ["K0060", "K0117", "K0118", "K0122", "K0123"],
  },
];

// ============================================
// THREAT HUNTING CERTIFICATIONS
// ============================================

export const THREAT_HUNTING_CERTIFICATIONS: CertificationDefinition[] = [
  {
    slug: "cs-threat-hunter",
    name: "CyberShield Threat Hunter",
    acronym: "CS-TH",
    description: "Validate proactive threat hunting skills",
    longDescription: `The CyberShield Threat Hunter (CS-TH) certification validates expertise in proactively searching for threats that evade automated security controls. Certified individuals demonstrate mastery of hunting methodologies, ATT&CK framework, and advanced analysis techniques.

This certification covers:
- Hypothesis-driven hunting
- MITRE ATT&CK framework mastery
- Advanced log analysis
- Behavioral analysis
- Threat intelligence integration
- Hunt documentation
- Detection engineering

The CS-TH certification is designed for experienced analysts ready to transition to proactive threat hunting roles.`,
    icon: "crosshair",
    badge: "/badges/cs-threat-hunter.svg",
    level: CertificationLevel.EXPERT,
    careerPath: CareerPath.THREAT_HUNTER,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["cs-soc-analyst", "cs-incident-handler"],
    requiredModules: [
      "threat-hunting-fundamentals",
      "mitre-attack-deep-dive",
    ],
    requiredScore: 85,
    validityPeriod: 24,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-TH Certification Exam",
      description: "Advanced threat hunting assessment",
      totalQuestions: 80,
      passingScore: 85,
      timeLimit: 180,
      maxAttempts: 2,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "Hunting Methodology", count: 15, difficulty: DifficultyLevel.ADVANCED },
          { category: "MITRE ATT&CK", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Advanced Analysis", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Threat Intelligence", count: 10, difficulty: DifficultyLevel.ADVANCED },
          { category: "Practical Hunting", count: 15, difficulty: DifficultyLevel.EXPERT },
        ],
        totalQuestions: 80,
      },
      retakeWaitPeriod: 14,
    },
    skills: [
      "Hypothesis Development",
      "ATT&CK Mapping",
      "Advanced Log Analysis",
      "Behavioral Analysis",
      "Detection Engineering",
      "Hunt Documentation",
    ],
    jobRoles: [
      "Threat Hunter",
      "Cyber Threat Hunter",
      "Senior Security Analyst",
      "Detection Engineer",
    ],
    niceFrameworkMapping: ["K0046", "K0058", "K0177", "K0301", "K0362"],
  },
];

// ============================================
// MALWARE ANALYSIS CERTIFICATIONS
// ============================================

export const MALWARE_CERTIFICATIONS: CertificationDefinition[] = [
  {
    slug: "cs-malware-analyst",
    name: "CyberShield Malware Analyst",
    acronym: "CS-MA",
    description: "Validate malware analysis and reverse engineering skills",
    longDescription: `The CyberShield Malware Analyst (CS-MA) certification validates expertise in analyzing malicious software. Certified individuals demonstrate proficiency in static analysis, dynamic analysis, and basic reverse engineering.

This certification covers:
- Safe analysis environment setup
- Static analysis techniques
- Dynamic/behavioral analysis
- Unpacking techniques
- YARA rule development
- IOC extraction
- Malware reporting

The CS-MA certification is designed for analysts who need to understand malware capabilities for incident response and threat intelligence.`,
    icon: "bug",
    badge: "/badges/cs-malware-analyst.svg",
    level: CertificationLevel.EXPERT,
    careerPath: CareerPath.MALWARE_ANALYST,
    clearanceRequired: ClearanceLevel.TOP_SECRET,
    prerequisites: ["cs-incident-handler"],
    requiredModules: [
      "malware-analysis-fundamentals",
    ],
    requiredScore: 85,
    validityPeriod: 24,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-MA Certification Exam",
      description: "Advanced malware analysis assessment",
      totalQuestions: 70,
      passingScore: 85,
      timeLimit: 180,
      maxAttempts: 2,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "Static Analysis", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Dynamic Analysis", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Unpacking & Anti-Analysis", count: 10, difficulty: DifficultyLevel.EXPERT },
          { category: "IOC & Signature Development", count: 10, difficulty: DifficultyLevel.ADVANCED },
          { category: "Practical Labs", count: 10, difficulty: DifficultyLevel.EXPERT },
        ],
        totalQuestions: 70,
      },
      retakeWaitPeriod: 14,
    },
    skills: [
      "Static Analysis",
      "Dynamic Analysis",
      "Basic Reverse Engineering",
      "YARA Development",
      "IOC Extraction",
      "Malware Reporting",
    ],
    jobRoles: [
      "Malware Analyst",
      "Threat Researcher",
      "Security Researcher",
      "Incident Responder",
    ],
    niceFrameworkMapping: ["K0259", "K0261", "K0262", "K0479"],
  },
  {
    slug: "cs-reverse-engineer",
    name: "CyberShield Reverse Engineer",
    acronym: "CS-RE",
    description: "Validate advanced reverse engineering expertise",
    longDescription: `The CyberShield Reverse Engineer (CS-RE) certification validates expert-level reverse engineering skills. Certified individuals demonstrate mastery of disassembly, debugging, and understanding complex malware at the assembly level.

This advanced certification covers:
- Assembly language mastery
- Advanced disassembly techniques
- Debugger proficiency
- Anti-analysis bypass
- Complex unpacking
- Custom tool development
- Malware attribution

The CS-RE certification is designed for senior malware analysts and researchers requiring deep reverse engineering skills.`,
    icon: "code-2",
    badge: "/badges/cs-reverse-engineer.svg",
    level: CertificationLevel.MASTER,
    careerPath: CareerPath.MALWARE_ANALYST,
    clearanceRequired: ClearanceLevel.TOP_SECRET_SCI,
    prerequisites: ["cs-malware-analyst"],
    requiredModules: [
      "malware-analysis-fundamentals",
      "reverse-engineering-essentials",
    ],
    requiredScore: 90,
    validityPeriod: 36,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-RE Certification Exam",
      description: "Expert reverse engineering assessment",
      totalQuestions: 60,
      passingScore: 90,
      timeLimit: 240,
      maxAttempts: 2,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "Assembly & Architecture", count: 15, difficulty: DifficultyLevel.EXPERT },
          { category: "Advanced Unpacking", count: 15, difficulty: DifficultyLevel.EXPERT },
          { category: "Anti-Analysis Bypass", count: 10, difficulty: DifficultyLevel.EXPERT },
          { category: "Practical Reverse Engineering", count: 20, difficulty: DifficultyLevel.MASTER },
        ],
        totalQuestions: 60,
      },
      retakeWaitPeriod: 30,
    },
    skills: [
      "Assembly Language",
      "Disassembly",
      "Debugging",
      "Anti-Analysis Bypass",
      "Advanced Unpacking",
      "Tool Development",
    ],
    jobRoles: [
      "Senior Reverse Engineer",
      "Principal Malware Analyst",
      "Security Researcher",
      "Vulnerability Researcher",
    ],
    niceFrameworkMapping: ["K0259", "K0261", "K0262", "K0372", "K0479"],
  },
];

// ============================================
// OFFENSIVE SECURITY CERTIFICATIONS
// ============================================

export const OFFENSIVE_CERTIFICATIONS: CertificationDefinition[] = [
  {
    slug: "cs-penetration-tester",
    name: "CyberShield Penetration Tester",
    acronym: "CS-PT",
    description: "Validate offensive security and penetration testing skills",
    longDescription: `The CyberShield Penetration Tester (CS-PT) certification validates offensive security skills used to identify vulnerabilities and improve defenses. This certification emphasizes ethical hacking within authorized contexts.

This certification covers:
- Penetration testing methodology
- Reconnaissance techniques
- Vulnerability assessment
- Exploitation basics
- Post-exploitation
- Report writing
- Rules of engagement

The CS-PT certification is designed for security professionals conducting authorized security assessments.`,
    icon: "skull",
    badge: "/badges/cs-penetration-tester.svg",
    level: CertificationLevel.EXPERT,
    careerPath: CareerPath.PENETRATION_TESTER,
    clearanceRequired: ClearanceLevel.TOP_SECRET,
    prerequisites: ["cs-soc-analyst"],
    requiredModules: [
      "offensive-security-fundamentals",
    ],
    requiredScore: 85,
    validityPeriod: 24,
    renewalRequired: true,
    accreditedBy: "CyberShield Academy",
    examConfig: {
      title: "CS-PT Certification Exam",
      description: "Comprehensive penetration testing assessment",
      totalQuestions: 70,
      passingScore: 85,
      timeLimit: 240,
      maxAttempts: 2,
      randomizeQuestions: true,
      showResults: true,
      proctored: true,
      questionTypes: [
        "multiple-choice",
        "scenario-based",
        "practical-lab",
      ],
      questionPool: {
        categories: [
          { category: "Methodology & Planning", count: 10, difficulty: DifficultyLevel.ADVANCED },
          { category: "Reconnaissance", count: 15, difficulty: DifficultyLevel.ADVANCED },
          { category: "Exploitation", count: 20, difficulty: DifficultyLevel.ADVANCED },
          { category: "Post-Exploitation", count: 10, difficulty: DifficultyLevel.EXPERT },
          { category: "Practical Labs", count: 15, difficulty: DifficultyLevel.EXPERT },
        ],
        totalQuestions: 70,
      },
      retakeWaitPeriod: 14,
    },
    skills: [
      "Reconnaissance",
      "Vulnerability Assessment",
      "Exploitation",
      "Privilege Escalation",
      "Lateral Movement",
      "Report Writing",
    ],
    jobRoles: [
      "Penetration Tester",
      "Ethical Hacker",
      "Security Consultant",
      "Red Team Operator",
    ],
    niceFrameworkMapping: ["K0009", "K0119", "K0206", "K0342"],
  },
];

// ============================================
// ALL CERTIFICATIONS AGGREGATION
// ============================================

export const ALL_CERTIFICATIONS: CertificationDefinition[] = [
  ...FOUNDATIONAL_CERTIFICATIONS,
  ...SOC_CERTIFICATIONS,
  ...IR_CERTIFICATIONS,
  ...THREAT_HUNTING_CERTIFICATIONS,
  ...MALWARE_CERTIFICATIONS,
  ...OFFENSIVE_CERTIFICATIONS,
];

export function getCertificationBySlug(slug: string): CertificationDefinition | undefined {
  return ALL_CERTIFICATIONS.find((c) => c.slug === slug);
}

export function getCertificationsByLevel(level: CertificationLevel): CertificationDefinition[] {
  return ALL_CERTIFICATIONS.filter((c) => c.level === level);
}

export function getCertificationsByCareerPath(path: CareerPath): CertificationDefinition[] {
  return ALL_CERTIFICATIONS.filter((c) => c.careerPath === path);
}

export function getAvailableCertifications(
  completedCertifications: string[],
  completedModules: string[],
  clearance: ClearanceLevel
): CertificationDefinition[] {
  const clearanceLevels: ClearanceLevel[] = [
    ClearanceLevel.UNCLASSIFIED,
    ClearanceLevel.CONFIDENTIAL,
    ClearanceLevel.SECRET,
    ClearanceLevel.TOP_SECRET,
    ClearanceLevel.TOP_SECRET_SCI,
  ];
  const userLevel = clearanceLevels.indexOf(clearance);

  return ALL_CERTIFICATIONS.filter((cert) => {
    // Check clearance level
    const certLevel = clearanceLevels.indexOf(cert.clearanceRequired);
    if (certLevel > userLevel) return false;

    // Check if already earned
    if (completedCertifications.includes(cert.slug)) return false;

    // Check prerequisites
    const hasPrereqs = cert.prerequisites.every((prereq) =>
      completedCertifications.includes(prereq)
    );
    if (!hasPrereqs) return false;

    // Check required modules
    const hasModules = cert.requiredModules.every((module) =>
      completedModules.includes(module)
    );
    if (!hasModules) return false;

    return true;
  });
}

// ============================================
// EXAM QUESTION GENERATOR
// ============================================

export function generateExamQuestions(
  certificationSlug: string,
  _questionPool: ExamQuestion[]
): ExamQuestion[] {
  const cert = getCertificationBySlug(certificationSlug);
  if (!cert) return [];

  const config = cert.examConfig.questionPool;
  const selectedQuestions: ExamQuestion[] = [];

  // For each category, select the required number of questions
  for (const categoryConfig of config.categories) {
    // In a real implementation, this would select from a database
    // For now, this is a placeholder that demonstrates the structure
    const categoryQuestions: ExamQuestion[] = [];

    // Select random questions from pool for this category
    const availableQuestions = _questionPool.filter(
      (q) =>
        q.category === categoryConfig.category &&
        q.difficulty === categoryConfig.difficulty
    );

    // Shuffle and select
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    categoryQuestions.push(...shuffled.slice(0, categoryConfig.count));

    selectedQuestions.push(...categoryQuestions);
  }

  // Shuffle final selection
  return selectedQuestions.sort(() => Math.random() - 0.5);
}

// ============================================
// SCORING UTILITIES
// ============================================

export interface ExamResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  categoryScores: {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  timeSpent: number;
  feedback: string[];
}

export function calculateExamScore(
  answers: Record<string, string | string[]>,
  questions: ExamQuestion[]
): ExamResult {
  let correctAnswers = 0;
  const categoryResults: Record<string, { correct: number; total: number }> = {};
  const feedback: string[] = [];

  for (const question of questions) {
    // Initialize category if not exists
    if (!categoryResults[question.category]) {
      categoryResults[question.category] = { correct: 0, total: 0 };
    }
    categoryResults[question.category].total++;

    const userAnswer = answers[question.id];
    const isCorrect = Array.isArray(question.correctAnswer)
      ? Array.isArray(userAnswer) &&
        userAnswer.length === question.correctAnswer.length &&
        userAnswer.every((a) => question.correctAnswer.includes(a))
      : userAnswer === question.correctAnswer;

    if (isCorrect) {
      correctAnswers++;
      categoryResults[question.category].correct++;
    } else {
      // Add feedback for incorrect answers
      feedback.push(`Review: ${question.category} - ${question.explanation}`);
    }
  }

  const score = Math.round((correctAnswers / questions.length) * 100);

  const categoryScores = Object.entries(categoryResults).map(([category, results]) => ({
    category,
    correct: results.correct,
    total: results.total,
    percentage: Math.round((results.correct / results.total) * 100),
  }));

  return {
    passed: score >= 75, // This would come from cert config
    score,
    totalQuestions: questions.length,
    correctAnswers,
    categoryScores,
    timeSpent: 0, // Would be calculated from actual exam session
    feedback: feedback.slice(0, 10), // Limit feedback items
  };
}
