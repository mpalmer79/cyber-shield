/**
 * Cyber Shield Enterprise Training Modules
 * Government-Grade Cybersecurity Training Content
 */

import { ModuleType, ModuleCategory, DifficultyLevel, ClearanceLevel, ScenarioType } from "@prisma/client";

// ============================================
// TRAINING MODULE DEFINITIONS
// ============================================

export interface TrainingModuleDefinition {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  coverImage?: string;
  moduleType: ModuleType;
  category: ModuleCategory;
  difficulty: DifficultyLevel;
  clearanceRequired: ClearanceLevel;
  prerequisites: string[];
  estimatedDuration: number; // minutes
  passingScore: number;
  learningObjectives: string[];
  tags: string[];
  scenarios: ScenarioDefinition[];
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  scenarioType: ScenarioType;
  difficulty: DifficultyLevel;
  maxPoints: number;
  timeLimit?: number; // seconds
  tags: string[];
}

// ============================================
// FOUNDATIONAL MODULES
// ============================================

export const FOUNDATIONAL_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "security-awareness-101",
    title: "Security Awareness Fundamentals",
    description: "Master the essential cybersecurity concepts every professional needs to know",
    longDescription: `This foundational module covers the core principles of cybersecurity that form the basis for all advanced training. You'll learn about the threat landscape, common attack vectors, and fundamental defense strategies used in enterprise environments.

Topics include:
- The CIA Triad (Confidentiality, Integrity, Availability)
- Types of threat actors and their motivations
- Common attack techniques and their indicators
- Basic security hygiene and best practices
- Organizational security policies and procedures

This module is required for all personnel and serves as the gateway to more advanced training tracks.`,
    icon: "shield-check",
    moduleType: ModuleType.COMPLIANCE,
    category: ModuleCategory.AWARENESS,
    difficulty: DifficultyLevel.BEGINNER,
    clearanceRequired: ClearanceLevel.UNCLASSIFIED,
    prerequisites: [],
    estimatedDuration: 120,
    passingScore: 70,
    learningObjectives: [
      "Explain the CIA Triad and its importance in security",
      "Identify different types of threat actors and their motivations",
      "Recognize common security threats and attack vectors",
      "Apply basic security hygiene practices",
      "Understand organizational security policies",
    ],
    tags: ["fundamentals", "awareness", "compliance", "beginner"],
    scenarios: [
      {
        id: "sa-101-quiz-1",
        title: "Security Fundamentals Assessment",
        description: "Test your understanding of core security concepts",
        scenarioType: ScenarioType.DECISION_TREE,
        difficulty: DifficultyLevel.BEGINNER,
        maxPoints: 100,
        timeLimit: 1800,
        tags: ["assessment", "fundamentals"],
      },
    ],
  },
  {
    slug: "phishing-detection-masterclass",
    title: "Phishing Detection Masterclass",
    description: "Develop expert-level skills in identifying and analyzing phishing attempts",
    longDescription: `Phishing remains the primary attack vector for breaching organizations. This comprehensive module transforms you from a novice into a phishing detection expert through progressive scenarios of increasing difficulty.

You'll analyze:
- Sophisticated spear-phishing campaigns
- Business Email Compromise (BEC) attacks
- Credential harvesting techniques
- Social media phishing
- Voice phishing (vishing) scenarios
- SMS phishing (smishing) attacks

Each scenario includes AI-powered feedback that explains the subtle indicators you should look for and provides personalized coaching based on your performance.`,
    icon: "mail-warning",
    moduleType: ModuleType.PHISHING_DETECTION,
    category: ModuleCategory.AWARENESS,
    difficulty: DifficultyLevel.BEGINNER,
    clearanceRequired: ClearanceLevel.UNCLASSIFIED,
    prerequisites: ["security-awareness-101"],
    estimatedDuration: 180,
    passingScore: 75,
    learningObjectives: [
      "Identify phishing emails with 95% accuracy",
      "Analyze email headers for suspicious indicators",
      "Recognize social engineering tactics in phishing",
      "Report suspicious emails using proper procedures",
      "Protect against credential harvesting attacks",
    ],
    tags: ["phishing", "email-security", "social-engineering", "awareness"],
    scenarios: [
      {
        id: "phish-email-basic",
        title: "Basic Email Phishing Detection",
        description: "Identify common phishing indicators in email messages",
        scenarioType: ScenarioType.EMAIL_PHISHING,
        difficulty: DifficultyLevel.BEGINNER,
        maxPoints: 100,
        tags: ["email", "phishing", "beginner"],
      },
      {
        id: "phish-bec-intermediate",
        title: "Business Email Compromise",
        description: "Detect sophisticated BEC attacks targeting executives",
        scenarioType: ScenarioType.EMAIL_PHISHING,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 150,
        tags: ["bec", "executive", "wire-fraud"],
      },
      {
        id: "phish-spear-advanced",
        title: "Advanced Spear Phishing",
        description: "Analyze highly targeted spear-phishing campaigns",
        scenarioType: ScenarioType.EMAIL_PHISHING,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 200,
        tags: ["spear-phishing", "apt", "targeted"],
      },
    ],
  },
  {
    slug: "password-security-deep-dive",
    title: "Password & Authentication Security",
    description: "Master authentication security from passwords to MFA to passwordless",
    longDescription: `Authentication is the first line of defense for any system. This module provides comprehensive training on all aspects of authentication security, from basic password hygiene to implementing enterprise-grade passwordless solutions.

Topics covered:
- Password attack techniques (brute force, dictionary, rainbow tables)
- Password policy best practices
- Multi-factor authentication (MFA) types and bypass techniques
- Single Sign-On (SSO) security
- Passwordless authentication methods
- Credential management and password managers
- Authentication protocol security (OAuth, SAML, FIDO2)`,
    icon: "key",
    moduleType: ModuleType.APPLICATION_SECURITY,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    clearanceRequired: ClearanceLevel.UNCLASSIFIED,
    prerequisites: ["security-awareness-101"],
    estimatedDuration: 150,
    passingScore: 75,
    learningObjectives: [
      "Create and manage strong, unique passwords",
      "Understand MFA types and their security properties",
      "Recognize authentication attacks and their indicators",
      "Implement secure authentication practices",
      "Evaluate authentication solutions for security",
    ],
    tags: ["authentication", "passwords", "mfa", "identity"],
    scenarios: [
      {
        id: "auth-password-strength",
        title: "Password Strength Assessment",
        description: "Evaluate password strength and identify weaknesses",
        scenarioType: ScenarioType.DECISION_TREE,
        difficulty: DifficultyLevel.BEGINNER,
        maxPoints: 100,
        tags: ["passwords", "assessment"],
      },
    ],
  },
];

// ============================================
// SOC ANALYST MODULES
// ============================================

export const SOC_ANALYST_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "soc-operations-fundamentals",
    title: "SOC Operations Fundamentals",
    description: "Learn the essentials of Security Operations Center workflows and procedures",
    longDescription: `This module provides the foundation for working in a Security Operations Center (SOC). You'll learn about SOC structure, roles, and responsibilities, as well as the tools and processes used in modern security operations.

Topics include:
- SOC organizational structure and tiers
- Alert lifecycle management
- Security monitoring best practices
- Incident classification and prioritization
- Shift handover procedures
- SOC metrics and KPIs
- Communication and escalation protocols`,
    icon: "monitor",
    moduleType: ModuleType.GOVERNANCE,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["security-awareness-101", "phishing-detection-masterclass"],
    estimatedDuration: 180,
    passingScore: 75,
    learningObjectives: [
      "Explain SOC structure and tier responsibilities",
      "Follow proper alert handling procedures",
      "Use SOC tools effectively",
      "Communicate security findings clearly",
      "Apply incident prioritization frameworks",
    ],
    tags: ["soc", "operations", "monitoring", "alerts"],
    scenarios: [
      {
        id: "soc-alert-triage",
        title: "Alert Triage Simulation",
        description: "Practice triaging security alerts in a simulated SOC environment",
        scenarioType: ScenarioType.DECISION_TREE,
        difficulty: DifficultyLevel.BEGINNER,
        maxPoints: 150,
        timeLimit: 1800,
        tags: ["triage", "alerts", "simulation"],
      },
    ],
  },
  {
    slug: "siem-splunk-mastery",
    title: "SIEM Mastery: Splunk Edition",
    description: "Master Splunk for security monitoring, threat detection, and incident investigation",
    longDescription: `Splunk is one of the most widely deployed SIEM platforms in enterprise environments. This comprehensive module teaches you to leverage Splunk for security operations, from basic searches to advanced threat hunting.

You'll learn:
- SPL (Search Processing Language) fundamentals
- Building security dashboards
- Creating correlation rules
- Threat hunting with Splunk
- Splunk Enterprise Security (ES) features
- Performance optimization techniques
- Integration with threat intelligence
- Automated alerting and response`,
    icon: "search",
    moduleType: ModuleType.NETWORK_SECURITY,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["soc-operations-fundamentals"],
    estimatedDuration: 360,
    passingScore: 80,
    learningObjectives: [
      "Write efficient SPL queries for security analysis",
      "Build security dashboards and visualizations",
      "Create and tune correlation rules",
      "Investigate security incidents using Splunk",
      "Optimize Splunk performance for security use cases",
    ],
    tags: ["splunk", "siem", "spl", "threat-detection"],
    scenarios: [
      {
        id: "splunk-basic-search",
        title: "Basic SPL Search Exercises",
        description: "Practice fundamental SPL searches for security data",
        scenarioType: ScenarioType.LOG_ANALYSIS,
        difficulty: DifficultyLevel.BEGINNER,
        maxPoints: 100,
        tags: ["spl", "search", "basics"],
      },
      {
        id: "splunk-threat-hunt",
        title: "Threat Hunting with Splunk",
        description: "Hunt for indicators of compromise using Splunk",
        scenarioType: ScenarioType.LOG_ANALYSIS,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 250,
        timeLimit: 3600,
        tags: ["hunting", "ioc", "advanced"],
      },
    ],
  },
  {
    slug: "network-traffic-analysis",
    title: "Network Traffic Analysis",
    description: "Analyze network traffic to detect threats and investigate incidents",
    longDescription: `Network traffic analysis is a critical skill for security analysts. This module teaches you to capture, analyze, and interpret network traffic to identify malicious activity and investigate security incidents.

Topics covered:
- TCP/IP fundamentals for security analysts
- Packet capture techniques
- Wireshark mastery for security analysis
- Network protocol analysis
- Identifying malicious traffic patterns
- C2 (Command & Control) detection
- Data exfiltration identification
- Encrypted traffic analysis techniques`,
    icon: "network",
    moduleType: ModuleType.NETWORK_SECURITY,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["soc-operations-fundamentals"],
    estimatedDuration: 300,
    passingScore: 80,
    learningObjectives: [
      "Capture and filter network traffic effectively",
      "Analyze protocols for security issues",
      "Identify malicious network patterns",
      "Detect C2 communications",
      "Investigate network-based incidents",
    ],
    tags: ["network", "pcap", "wireshark", "traffic-analysis"],
    scenarios: [
      {
        id: "pcap-malware-c2",
        title: "Detecting Malware C2 Traffic",
        description: "Analyze packet captures to identify command and control communications",
        scenarioType: ScenarioType.PACKET_CAPTURE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 200,
        timeLimit: 2400,
        tags: ["c2", "malware", "pcap"],
      },
      {
        id: "pcap-exfil-detection",
        title: "Data Exfiltration Detection",
        description: "Identify signs of data exfiltration in network traffic",
        scenarioType: ScenarioType.PACKET_CAPTURE,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 250,
        timeLimit: 3600,
        tags: ["exfiltration", "dlp", "advanced"],
      },
    ],
  },
];

// ============================================
// INCIDENT RESPONSE MODULES
// ============================================

export const INCIDENT_RESPONSE_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "incident-response-fundamentals",
    title: "Incident Response Fundamentals",
    description: "Master the incident response lifecycle from preparation to lessons learned",
    longDescription: `Effective incident response is critical for minimizing the impact of security breaches. This module covers the complete incident response lifecycle based on NIST SP 800-61 and industry best practices.

You'll learn:
- Incident response preparation
- Detection and analysis techniques
- Containment strategies
- Eradication and recovery procedures
- Post-incident activities
- Incident documentation
- Communication during incidents
- Legal and compliance considerations`,
    icon: "alert-triangle",
    moduleType: ModuleType.INCIDENT_RESPONSE,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["soc-operations-fundamentals", "network-traffic-analysis"],
    estimatedDuration: 300,
    passingScore: 80,
    learningObjectives: [
      "Execute each phase of the IR lifecycle",
      "Develop effective containment strategies",
      "Document incidents properly",
      "Communicate effectively during incidents",
      "Conduct post-incident reviews",
    ],
    tags: ["incident-response", "nist", "containment", "recovery"],
    scenarios: [
      {
        id: "ir-ransomware-sim",
        title: "Ransomware Incident Simulation",
        description: "Respond to a simulated ransomware attack on critical systems",
        scenarioType: ScenarioType.INCIDENT_TIMELINE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 300,
        timeLimit: 3600,
        tags: ["ransomware", "simulation", "critical"],
      },
      {
        id: "ir-data-breach",
        title: "Data Breach Response",
        description: "Handle a data breach incident from detection to notification",
        scenarioType: ScenarioType.INCIDENT_TIMELINE,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 350,
        timeLimit: 4200,
        tags: ["data-breach", "notification", "compliance"],
      },
    ],
  },
  {
    slug: "advanced-incident-handling",
    title: "Advanced Incident Handling",
    description: "Lead complex incident response operations involving APT and nation-state actors",
    longDescription: `When facing sophisticated adversaries, standard incident response procedures may not be enough. This advanced module prepares you to handle incidents involving APT groups, nation-state actors, and other sophisticated threats.

Advanced topics include:
- APT incident indicators and tactics
- Stealthy containment techniques
- Counter-intelligence considerations
- Evidence preservation for legal proceedings
- Coordinating with law enforcement
- Managing extended incident response
- Supply chain compromise response
- Insider threat incidents`,
    icon: "shield-alert",
    moduleType: ModuleType.INCIDENT_RESPONSE,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["incident-response-fundamentals", "threat-hunting-fundamentals"],
    estimatedDuration: 480,
    passingScore: 85,
    learningObjectives: [
      "Recognize APT incident indicators",
      "Apply stealthy containment without alerting adversaries",
      "Coordinate with law enforcement effectively",
      "Manage extended incident response operations",
      "Handle supply chain compromise incidents",
    ],
    tags: ["apt", "advanced-ir", "nation-state", "classified"],
    scenarios: [
      {
        id: "ir-apt-simulation",
        title: "APT Intrusion Response",
        description: "Respond to a simulated APT intrusion with multiple objectives",
        scenarioType: ScenarioType.INCIDENT_TIMELINE,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 500,
        timeLimit: 7200,
        tags: ["apt", "advanced", "classified"],
      },
      {
        id: "ir-supply-chain",
        title: "Supply Chain Compromise",
        description: "Investigate and respond to a supply chain attack",
        scenarioType: ScenarioType.INCIDENT_TIMELINE,
        difficulty: DifficultyLevel.EXPERT,
        maxPoints: 600,
        timeLimit: 7200,
        tags: ["supply-chain", "solarwinds", "expert"],
      },
    ],
  },
  {
    slug: "digital-forensics-essentials",
    title: "Digital Forensics Essentials",
    description: "Collect, preserve, and analyze digital evidence for investigations",
    longDescription: `Digital forensics is essential for understanding what happened during a security incident and potentially supporting legal action. This module covers the fundamentals of forensic investigation.

Topics include:
- Forensic imaging and acquisition
- Chain of custody procedures
- File system analysis
- Registry analysis (Windows)
- Log file forensics
- Timeline analysis
- Anti-forensics awareness
- Report writing for investigations`,
    icon: "microscope",
    moduleType: ModuleType.FORENSICS,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["incident-response-fundamentals"],
    estimatedDuration: 420,
    passingScore: 85,
    learningObjectives: [
      "Perform forensic acquisition properly",
      "Maintain chain of custody",
      "Analyze file systems for evidence",
      "Create forensic timelines",
      "Write professional forensic reports",
    ],
    tags: ["forensics", "evidence", "investigation", "legal"],
    scenarios: [
      {
        id: "forensics-disk-analysis",
        title: "Disk Image Investigation",
        description: "Analyze a forensic disk image to reconstruct attacker activity",
        scenarioType: ScenarioType.FORENSICS_INVESTIGATION,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 300,
        timeLimit: 4800,
        tags: ["disk", "imaging", "analysis"],
      },
      {
        id: "forensics-memory",
        title: "Memory Forensics Challenge",
        description: "Analyze memory dumps to identify malware and attacker artifacts",
        scenarioType: ScenarioType.FORENSICS_INVESTIGATION,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 400,
        timeLimit: 5400,
        tags: ["memory", "volatility", "malware"],
      },
    ],
  },
];

// ============================================
// THREAT HUNTING MODULES
// ============================================

export const THREAT_HUNTING_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "threat-hunting-fundamentals",
    title: "Threat Hunting Fundamentals",
    description: "Proactively search for threats that evade automated detection",
    longDescription: `Threat hunting is the practice of proactively searching through networks and datasets to detect threats that evade existing security solutions. This module teaches the methodology and skills needed to become an effective threat hunter.

Core concepts:
- Hypothesis-driven hunting
- MITRE ATT&CK framework for hunting
- Data sources for threat hunting
- Hunting tools and techniques
- Baselining and anomaly detection
- Threat intelligence integration
- Hunt documentation and reporting`,
    icon: "crosshair",
    moduleType: ModuleType.THREAT_HUNTING,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["siem-splunk-mastery", "network-traffic-analysis", "incident-response-fundamentals"],
    estimatedDuration: 360,
    passingScore: 85,
    learningObjectives: [
      "Develop and test hunting hypotheses",
      "Map hunting activities to MITRE ATT&CK",
      "Identify appropriate data sources",
      "Use hunting tools effectively",
      "Document and communicate hunting findings",
    ],
    tags: ["hunting", "mitre-attack", "proactive", "advanced"],
    scenarios: [
      {
        id: "hunt-lateral-movement",
        title: "Hunting Lateral Movement",
        description: "Hunt for signs of lateral movement in enterprise environment",
        scenarioType: ScenarioType.LOG_ANALYSIS,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 350,
        timeLimit: 5400,
        tags: ["lateral-movement", "pass-the-hash", "hunting"],
      },
      {
        id: "hunt-persistence",
        title: "Persistence Mechanism Hunt",
        description: "Identify hidden persistence mechanisms used by adversaries",
        scenarioType: ScenarioType.LOG_ANALYSIS,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 400,
        timeLimit: 5400,
        tags: ["persistence", "registry", "scheduled-tasks"],
      },
    ],
  },
  {
    slug: "mitre-attack-deep-dive",
    title: "MITRE ATT&CK Deep Dive",
    description: "Master the MITRE ATT&CK framework for threat intelligence and detection",
    longDescription: `The MITRE ATT&CK framework is the gold standard for describing adversary tactics and techniques. This module provides comprehensive training on using ATT&CK for threat intelligence, detection engineering, and security assessment.

You'll learn:
- ATT&CK Matrix structure and navigation
- Tactics, Techniques, and Procedures (TTPs)
- Mapping incidents to ATT&CK
- Creating ATT&CK-based detections
- Using ATT&CK for threat intelligence
- ATT&CK Navigator for visualization
- Sub-techniques and procedure variations
- ATT&CK for different platforms`,
    icon: "target",
    moduleType: ModuleType.THREAT_HUNTING,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["soc-operations-fundamentals"],
    estimatedDuration: 300,
    passingScore: 80,
    learningObjectives: [
      "Navigate the ATT&CK Matrix effectively",
      "Map observed activity to ATT&CK techniques",
      "Create ATT&CK-based detection rules",
      "Use ATT&CK for threat intelligence",
      "Visualize threat coverage with Navigator",
    ],
    tags: ["mitre", "attack", "ttp", "framework"],
    scenarios: [
      {
        id: "attack-mapping-exercise",
        title: "ATT&CK Mapping Exercise",
        description: "Map incident data to appropriate ATT&CK techniques",
        scenarioType: ScenarioType.DECISION_TREE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 200,
        timeLimit: 3600,
        tags: ["mapping", "techniques", "exercise"],
      },
    ],
  },
];

// ============================================
// MALWARE ANALYSIS MODULES
// ============================================

export const MALWARE_ANALYSIS_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "malware-analysis-fundamentals",
    title: "Malware Analysis Fundamentals",
    description: "Learn to safely analyze malicious software using static and dynamic techniques",
    longDescription: `Malware analysis is a critical skill for understanding threats and developing defenses. This module introduces the fundamentals of malware analysis in a safe, controlled environment.

Topics covered:
- Setting up safe analysis environments
- Malware types and families
- Static analysis basics (strings, PE headers)
- Dynamic analysis basics (behavioral analysis)
- Sandboxing and automated analysis
- Basic unpacking techniques
- Indicator extraction
- Writing malware reports`,
    icon: "bug",
    moduleType: ModuleType.MALWARE_ANALYSIS,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["incident-response-fundamentals"],
    estimatedDuration: 420,
    passingScore: 80,
    learningObjectives: [
      "Set up safe analysis environments",
      "Perform basic static analysis",
      "Conduct dynamic/behavioral analysis",
      "Extract indicators of compromise",
      "Write professional malware reports",
    ],
    tags: ["malware", "analysis", "static", "dynamic"],
    scenarios: [
      {
        id: "malware-static-basics",
        title: "Static Analysis Fundamentals",
        description: "Analyze malware samples using static analysis techniques",
        scenarioType: ScenarioType.MALWARE_SAMPLE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 250,
        timeLimit: 3600,
        tags: ["static", "strings", "pe-analysis"],
      },
      {
        id: "malware-sandbox-analysis",
        title: "Sandbox Analysis Lab",
        description: "Use automated sandboxing to analyze malware behavior",
        scenarioType: ScenarioType.MALWARE_SAMPLE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 200,
        timeLimit: 2700,
        tags: ["sandbox", "behavioral", "automated"],
      },
    ],
  },
  {
    slug: "reverse-engineering-essentials",
    title: "Reverse Engineering Essentials",
    description: "Master the art of reverse engineering malware and software",
    longDescription: `Reverse engineering allows analysts to understand exactly how malware works at the code level. This module teaches the essential skills needed to reverse engineer binaries using industry-standard tools.

Advanced topics:
- Assembly language fundamentals
- IDA Pro / Ghidra proficiency
- Debugging with x64dbg
- Function identification
- Control flow analysis
- Anti-analysis bypass techniques
- Unpacking protected malware
- Decrypting communications`,
    icon: "code-2",
    moduleType: ModuleType.REVERSE_ENGINEERING,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.TOP_SECRET,
    prerequisites: ["malware-analysis-fundamentals"],
    estimatedDuration: 600,
    passingScore: 85,
    learningObjectives: [
      "Read and understand assembly code",
      "Use disassemblers effectively",
      "Debug malware safely",
      "Identify and bypass anti-analysis",
      "Unpack protected malware",
    ],
    tags: ["reverse-engineering", "assembly", "ida", "ghidra"],
    scenarios: [
      {
        id: "re-crackme-basic",
        title: "CrackMe Challenge - Basic",
        description: "Reverse engineer a basic crackme to understand program flow",
        scenarioType: ScenarioType.CTF_CHALLENGE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 300,
        timeLimit: 3600,
        tags: ["crackme", "ctf", "debugging"],
      },
      {
        id: "re-malware-unpacking",
        title: "Malware Unpacking Lab",
        description: "Unpack protected malware to reveal its true functionality",
        scenarioType: ScenarioType.MALWARE_SAMPLE,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 450,
        timeLimit: 5400,
        tags: ["unpacking", "packer", "advanced"],
      },
    ],
  },
];

// ============================================
// CLOUD SECURITY MODULES
// ============================================

export const CLOUD_SECURITY_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "cloud-security-fundamentals",
    title: "Cloud Security Fundamentals",
    description: "Secure cloud environments across AWS, Azure, and GCP",
    longDescription: `As organizations migrate to the cloud, security teams must adapt. This module covers cloud security fundamentals across major cloud providers and teaches you to identify and remediate cloud misconfigurations.

Topics include:
- Shared responsibility model
- Identity and Access Management (IAM)
- Network security in the cloud
- Data protection and encryption
- Logging and monitoring
- Compliance in the cloud
- Common misconfigurations
- Cloud-native security tools`,
    icon: "cloud",
    moduleType: ModuleType.CLOUD_SECURITY,
    category: ModuleCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["security-awareness-101", "network-traffic-analysis"],
    estimatedDuration: 360,
    passingScore: 80,
    learningObjectives: [
      "Explain the shared responsibility model",
      "Configure IAM securely",
      "Implement cloud network security",
      "Identify common misconfigurations",
      "Use cloud-native security tools",
    ],
    tags: ["cloud", "aws", "azure", "gcp", "iam"],
    scenarios: [
      {
        id: "cloud-misconfig-hunt",
        title: "Cloud Misconfiguration Hunt",
        description: "Identify security misconfigurations in cloud environments",
        scenarioType: ScenarioType.CONFIGURATION_AUDIT,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 250,
        timeLimit: 3600,
        tags: ["misconfiguration", "audit", "cloud"],
      },
      {
        id: "cloud-incident-response",
        title: "Cloud Incident Response",
        description: "Respond to a security incident in a cloud environment",
        scenarioType: ScenarioType.INCIDENT_TIMELINE,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 350,
        timeLimit: 4200,
        tags: ["incident", "cloud", "aws"],
      },
    ],
  },
];

// ============================================
// RED TEAM / OFFENSIVE SECURITY MODULES
// ============================================

export const RED_TEAM_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "offensive-security-fundamentals",
    title: "Offensive Security Fundamentals",
    description: "Understand attacker mindset and techniques to better defend",
    longDescription: `To defend effectively, you must understand how attackers think and operate. This module introduces offensive security concepts to improve your defensive capabilities.

Note: This content is for defensive purposes only and requires appropriate authorization.

Topics include:
- Attacker methodology overview
- Reconnaissance techniques
- Vulnerability identification
- Exploitation basics
- Post-exploitation concepts
- Privilege escalation
- Lateral movement
- Defense evasion awareness`,
    icon: "skull",
    moduleType: ModuleType.APPLICATION_SECURITY,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.TOP_SECRET,
    prerequisites: ["network-traffic-analysis", "incident-response-fundamentals"],
    estimatedDuration: 480,
    passingScore: 85,
    learningObjectives: [
      "Understand attacker methodologies",
      "Recognize reconnaissance activities",
      "Identify exploitation attempts",
      "Detect post-exploitation behavior",
      "Improve defenses based on attacker TTPs",
    ],
    tags: ["offensive", "red-team", "penetration-testing", "ethical-hacking"],
    scenarios: [
      {
        id: "red-team-recon",
        title: "Reconnaissance Detection",
        description: "Identify reconnaissance activities from attacker perspective",
        scenarioType: ScenarioType.LOG_ANALYSIS,
        difficulty: DifficultyLevel.ADVANCED,
        maxPoints: 300,
        timeLimit: 3600,
        tags: ["recon", "osint", "detection"],
      },
      {
        id: "red-team-ctf",
        title: "Red Team CTF Challenge",
        description: "Complete offensive security challenges in a safe environment",
        scenarioType: ScenarioType.CTF_CHALLENGE,
        difficulty: DifficultyLevel.EXPERT,
        maxPoints: 500,
        timeLimit: 7200,
        tags: ["ctf", "hacking", "challenge"],
      },
    ],
  },
];

// ============================================
// COMPLIANCE & GOVERNANCE MODULES
// ============================================

export const COMPLIANCE_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "security-compliance-frameworks",
    title: "Security Compliance Frameworks",
    description: "Master NIST, ISO 27001, SOC 2, and other compliance frameworks",
    longDescription: `Security compliance is essential for government and enterprise organizations. This module provides comprehensive training on major compliance frameworks and their implementation.

Frameworks covered:
- NIST Cybersecurity Framework (CSF)
- NIST SP 800-53
- ISO 27001/27002
- SOC 2
- FedRAMP
- CMMC (Cybersecurity Maturity Model Certification)
- GDPR security requirements
- PCI DSS`,
    icon: "clipboard-check",
    moduleType: ModuleType.COMPLIANCE,
    category: ModuleCategory.COMPLIANCE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["security-awareness-101"],
    estimatedDuration: 300,
    passingScore: 80,
    learningObjectives: [
      "Understand major compliance frameworks",
      "Map controls across frameworks",
      "Implement compliance requirements",
      "Prepare for compliance audits",
      "Maintain continuous compliance",
    ],
    tags: ["compliance", "nist", "iso", "governance"],
    scenarios: [
      {
        id: "compliance-audit-prep",
        title: "Audit Preparation Exercise",
        description: "Prepare for a compliance audit by reviewing controls",
        scenarioType: ScenarioType.CONFIGURATION_AUDIT,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 200,
        timeLimit: 3600,
        tags: ["audit", "preparation", "controls"],
      },
    ],
  },
];

// ============================================
// OSINT MODULES
// ============================================

export const OSINT_MODULES: TrainingModuleDefinition[] = [
  {
    slug: "osint-fundamentals",
    title: "OSINT Fundamentals",
    description: "Master open source intelligence gathering for security investigations",
    longDescription: `Open Source Intelligence (OSINT) is a critical skill for security professionals. This module teaches you to gather and analyze publicly available information for security purposes.

Topics include:
- OSINT methodology
- Search engine techniques
- Social media intelligence
- Domain and IP research
- Public records research
- Image and metadata analysis
- Dark web awareness
- OSINT tools and automation`,
    icon: "search-code",
    moduleType: ModuleType.OSINT,
    category: ModuleCategory.SPECIALIZED,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["security-awareness-101"],
    estimatedDuration: 240,
    passingScore: 80,
    learningObjectives: [
      "Apply OSINT methodology",
      "Use advanced search techniques",
      "Gather social media intelligence",
      "Research domains and infrastructure",
      "Analyze images and metadata",
    ],
    tags: ["osint", "intelligence", "research", "investigation"],
    scenarios: [
      {
        id: "osint-investigation",
        title: "OSINT Investigation Challenge",
        description: "Gather intelligence on a target using only public sources",
        scenarioType: ScenarioType.CTF_CHALLENGE,
        difficulty: DifficultyLevel.INTERMEDIATE,
        maxPoints: 300,
        timeLimit: 5400,
        tags: ["investigation", "research", "challenge"],
      },
    ],
  },
];

// ============================================
// MODULE AGGREGATION
// ============================================

export const ALL_TRAINING_MODULES: TrainingModuleDefinition[] = [
  ...FOUNDATIONAL_MODULES,
  ...SOC_ANALYST_MODULES,
  ...INCIDENT_RESPONSE_MODULES,
  ...THREAT_HUNTING_MODULES,
  ...MALWARE_ANALYSIS_MODULES,
  ...CLOUD_SECURITY_MODULES,
  ...RED_TEAM_MODULES,
  ...COMPLIANCE_MODULES,
  ...OSINT_MODULES,
];

export function getModuleBySlug(slug: string): TrainingModuleDefinition | undefined {
  return ALL_TRAINING_MODULES.find((m) => m.slug === slug);
}

export function getModulesByCategory(category: ModuleCategory): TrainingModuleDefinition[] {
  return ALL_TRAINING_MODULES.filter((m) => m.category === category);
}

export function getModulesByDifficulty(difficulty: DifficultyLevel): TrainingModuleDefinition[] {
  return ALL_TRAINING_MODULES.filter((m) => m.difficulty === difficulty);
}

export function getModulesByType(type: ModuleType): TrainingModuleDefinition[] {
  return ALL_TRAINING_MODULES.filter((m) => m.moduleType === type);
}

export function getModulesByClearance(clearance: ClearanceLevel): TrainingModuleDefinition[] {
  const clearanceLevels: ClearanceLevel[] = [
    ClearanceLevel.UNCLASSIFIED,
    ClearanceLevel.CONFIDENTIAL,
    ClearanceLevel.SECRET,
    ClearanceLevel.TOP_SECRET,
    ClearanceLevel.TOP_SECRET_SCI,
  ];
  const userLevel = clearanceLevels.indexOf(clearance);

  return ALL_TRAINING_MODULES.filter((m) => {
    const moduleLevel = clearanceLevels.indexOf(m.clearanceRequired);
    return moduleLevel <= userLevel;
  });
}

export function getAvailableModules(
  completedModules: string[],
  clearance: ClearanceLevel
): TrainingModuleDefinition[] {
  const accessibleModules = getModulesByClearance(clearance);

  return accessibleModules.filter((module) => {
    // Check if all prerequisites are completed
    return module.prerequisites.every((prereq) => completedModules.includes(prereq));
  });
}
