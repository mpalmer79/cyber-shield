/**
 * Cyber Shield Enterprise Career Progression System
 * Complete User Journey from Novice to Senior Cybersecurity Analyst
 */

import { CareerPath, CareerTier, DifficultyLevel, ClearanceLevel } from "@prisma/client";

// ============================================
// CAREER TIER DEFINITIONS
// ============================================

export interface CareerTierDefinition {
  tier: CareerTier;
  title: string;
  description: string;
  minXP: number;
  maxXP: number;
  level: number;
  icon: string;
  color: string;
  benefits: string[];
  requirements: {
    modulesCompleted: number;
    certificationsRequired: string[];
    minAverageScore: number;
    labHoursRequired: number;
    exercisesCompleted: number;
  };
  unlocks: string[];
}

export const CAREER_TIERS: CareerTierDefinition[] = [
  {
    tier: CareerTier.NOVICE,
    title: "Security Novice",
    description: "Beginning your cybersecurity journey with fundamental concepts",
    minXP: 0,
    maxXP: 2499,
    level: 1,
    icon: "🛡️",
    color: "#94a3b8",
    benefits: [
      "Access to beginner training modules",
      "Basic lab environments",
      "Community forums access",
      "Progress tracking",
    ],
    requirements: {
      modulesCompleted: 0,
      certificationsRequired: [],
      minAverageScore: 0,
      labHoursRequired: 0,
      exercisesCompleted: 0,
    },
    unlocks: [
      "Beginner training modules",
      "Basic phishing detection labs",
      "Password security fundamentals",
      "Security awareness content",
    ],
  },
  {
    tier: CareerTier.APPRENTICE,
    title: "Security Apprentice",
    description: "Building foundational skills in threat identification and basic defense",
    minXP: 2500,
    maxXP: 7499,
    level: 2,
    icon: "⚔️",
    color: "#22c55e",
    benefits: [
      "Access to intermediate modules",
      "Intermediate lab environments",
      "Mentorship matching",
      "Peer collaboration features",
      "Weekly security briefings",
    ],
    requirements: {
      modulesCompleted: 5,
      certificationsRequired: [],
      minAverageScore: 70,
      labHoursRequired: 10,
      exercisesCompleted: 0,
    },
    unlocks: [
      "Intermediate training modules",
      "Social engineering simulations",
      "Network security basics",
      "Incident reporting tools",
    ],
  },
  {
    tier: CareerTier.PRACTITIONER,
    title: "Security Practitioner",
    description: "Applying security knowledge to real-world scenarios and incidents",
    minXP: 7500,
    maxXP: 17499,
    level: 3,
    icon: "🔍",
    color: "#3b82f6",
    benefits: [
      "Access to advanced modules",
      "Advanced lab environments",
      "Become a mentor",
      "Incident response participation",
      "Threat intelligence feeds",
      "Blue team exercise access",
    ],
    requirements: {
      modulesCompleted: 12,
      certificationsRequired: ["cs-foundations"],
      minAverageScore: 75,
      labHoursRequired: 30,
      exercisesCompleted: 2,
    },
    unlocks: [
      "Advanced training modules",
      "Incident response simulations",
      "Malware analysis basics",
      "SIEM training environments",
      "CTF challenges",
    ],
  },
  {
    tier: CareerTier.PROFESSIONAL,
    title: "Security Professional",
    description: "Mastering advanced techniques and leading security initiatives",
    minXP: 17500,
    maxXP: 34999,
    level: 4,
    icon: "🎯",
    color: "#a855f7",
    benefits: [
      "Access to expert modules",
      "Expert lab environments",
      "Red team exercise participation",
      "Create custom scenarios",
      "Advanced threat hunting",
      "Security tool development",
    ],
    requirements: {
      modulesCompleted: 20,
      certificationsRequired: ["cs-foundations", "cs-analyst"],
      minAverageScore: 80,
      labHoursRequired: 60,
      exercisesCompleted: 5,
    },
    unlocks: [
      "Expert training modules",
      "Red team participation",
      "Threat hunting labs",
      "Forensics environments",
      "Reverse engineering basics",
    ],
  },
  {
    tier: CareerTier.EXPERT,
    title: "Security Expert",
    description: "Industry-recognized expertise in specialized security domains",
    minXP: 35000,
    maxXP: 64999,
    level: 5,
    icon: "🏆",
    color: "#f59e0b",
    benefits: [
      "Access to master-level content",
      "Custom lab environments",
      "Lead exercises",
      "Content creation",
      "Assessment authoring",
      "Organization-wide analytics",
    ],
    requirements: {
      modulesCompleted: 30,
      certificationsRequired: ["cs-foundations", "cs-analyst", "cs-professional"],
      minAverageScore: 85,
      labHoursRequired: 100,
      exercisesCompleted: 10,
    },
    unlocks: [
      "Master-level content",
      "Exercise leadership",
      "Custom lab creation",
      "Scenario authoring",
      "Advanced forensics",
    ],
  },
  {
    tier: CareerTier.MASTER,
    title: "Security Master",
    description: "Thought leader shaping security practices and mentoring others",
    minXP: 65000,
    maxXP: 99999,
    level: 6,
    icon: "👑",
    color: "#ef4444",
    benefits: [
      "All platform features",
      "Advisory board access",
      "Exclusive briefings",
      "Conference speaker opportunities",
      "Research collaboration",
      "Policy development input",
    ],
    requirements: {
      modulesCompleted: 40,
      certificationsRequired: ["cs-foundations", "cs-analyst", "cs-professional", "cs-expert"],
      minAverageScore: 90,
      labHoursRequired: 150,
      exercisesCompleted: 15,
    },
    unlocks: [
      "Advisory board membership",
      "Research collaboration",
      "Policy development",
      "Industry networking",
      "Classified briefings",
    ],
  },
  {
    tier: CareerTier.PRINCIPAL,
    title: "Principal Security Architect",
    description: "Elite security professional defining organizational security strategy",
    minXP: 100000,
    maxXP: Infinity,
    level: 7,
    icon: "⭐",
    color: "#dc2626",
    benefits: [
      "Everything included",
      "Strategic planning access",
      "Executive briefings",
      "Cross-organization collaboration",
      "Government liaison opportunities",
      "Research grant eligibility",
    ],
    requirements: {
      modulesCompleted: 50,
      certificationsRequired: ["cs-foundations", "cs-analyst", "cs-professional", "cs-expert", "cs-master"],
      minAverageScore: 95,
      labHoursRequired: 200,
      exercisesCompleted: 25,
    },
    unlocks: [
      "Strategic planning",
      "Executive access",
      "Government liaison",
      "Research grants",
      "All clearance content",
    ],
  },
];

// ============================================
// CAREER PATH DEFINITIONS
// ============================================

export interface CareerPathDefinition {
  path: CareerPath;
  title: string;
  description: string;
  icon: string;
  color: string;
  requiredClearance: ClearanceLevel;
  keySkills: string[];
  certifications: string[];
  phases: CareerPhase[];
  jobTitles: {
    tier: CareerTier;
    titles: string[];
  }[];
  salaryRange: {
    tier: CareerTier;
    min: number;
    max: number;
    currency: string;
  }[];
}

export interface CareerPhase {
  name: string;
  tier: CareerTier;
  duration: string;
  objectives: string[];
  modules: string[];
  skills: string[];
  milestones: string[];
}

export const CAREER_PATHS: CareerPathDefinition[] = [
  {
    path: CareerPath.SOC_ANALYST,
    title: "SOC Analyst Track",
    description: "Master security operations, monitoring, and incident triage to become a Security Operations Center specialist",
    icon: "🖥️",
    color: "#3b82f6",
    requiredClearance: ClearanceLevel.CONFIDENTIAL,
    keySkills: [
      "SIEM Operation",
      "Log Analysis",
      "Alert Triage",
      "Incident Response",
      "Threat Detection",
      "Network Monitoring",
      "Endpoint Security",
      "Ticketing Systems",
    ],
    certifications: [
      "cs-soc-foundations",
      "cs-soc-analyst",
      "cs-soc-lead",
    ],
    phases: [
      {
        name: "SOC Fundamentals",
        tier: CareerTier.NOVICE,
        duration: "4-6 weeks",
        objectives: [
          "Understand SOC operations and workflows",
          "Learn basic log analysis techniques",
          "Master security alert triage",
          "Understand common attack patterns",
        ],
        modules: [
          "security-awareness-101",
          "phishing-detection-lab",
          "password-security",
          "soc-operations-intro",
          "log-analysis-basics",
        ],
        skills: [
          "Log Reading",
          "Alert Categorization",
          "Basic Triage",
          "Documentation",
        ],
        milestones: [
          "Complete security awareness training",
          "Triage first 100 alerts in simulation",
          "Pass SOC fundamentals assessment",
        ],
      },
      {
        name: "Alert Analysis",
        tier: CareerTier.APPRENTICE,
        duration: "6-8 weeks",
        objectives: [
          "Master SIEM query languages",
          "Analyze complex security events",
          "Correlate multiple data sources",
          "Identify true positives efficiently",
        ],
        modules: [
          "siem-splunk-fundamentals",
          "siem-elastic-fundamentals",
          "network-traffic-analysis",
          "endpoint-detection-basics",
          "alert-correlation-techniques",
        ],
        skills: [
          "SPL/KQL Queries",
          "Event Correlation",
          "Network Analysis",
          "Endpoint Investigation",
        ],
        milestones: [
          "Write 50 custom SIEM queries",
          "Achieve 90% triage accuracy",
          "Complete network analysis lab",
        ],
      },
      {
        name: "Incident Handling",
        tier: CareerTier.PRACTITIONER,
        duration: "8-12 weeks",
        objectives: [
          "Lead incident response activities",
          "Coordinate with multiple teams",
          "Document and report incidents",
          "Implement containment strategies",
        ],
        modules: [
          "incident-response-fundamentals",
          "incident-handling-procedures",
          "malware-triage",
          "forensics-basics",
          "communication-escalation",
        ],
        skills: [
          "Incident Coordination",
          "Containment",
          "Eradication",
          "Recovery",
          "Reporting",
        ],
        milestones: [
          "Lead 10 simulated incidents",
          "Complete incident response certification",
          "Achieve SOC Analyst certification",
        ],
      },
      {
        name: "Advanced Operations",
        tier: CareerTier.PROFESSIONAL,
        duration: "12-16 weeks",
        objectives: [
          "Design detection rules",
          "Tune SIEM alerts",
          "Mentor junior analysts",
          "Optimize SOC processes",
        ],
        modules: [
          "detection-engineering",
          "threat-hunting-intro",
          "automation-soar-basics",
          "soc-metrics-reporting",
          "mentorship-skills",
        ],
        skills: [
          "Detection Engineering",
          "Threat Hunting",
          "SOAR Implementation",
          "Mentorship",
        ],
        milestones: [
          "Create 25 detection rules",
          "Reduce false positive rate by 30%",
          "Mentor 3 junior analysts",
        ],
      },
      {
        name: "SOC Leadership",
        tier: CareerTier.EXPERT,
        duration: "Ongoing",
        objectives: [
          "Lead SOC team",
          "Define operational procedures",
          "Interface with leadership",
          "Drive continuous improvement",
        ],
        modules: [
          "soc-management",
          "security-metrics",
          "executive-reporting",
          "team-leadership",
          "strategic-planning",
        ],
        skills: [
          "Team Management",
          "Strategic Planning",
          "Executive Communication",
          "Budget Management",
        ],
        milestones: [
          "Lead SOC team of 5+",
          "Achieve SOC Lead certification",
          "Present to executive leadership",
        ],
      },
    ],
    jobTitles: [
      { tier: CareerTier.NOVICE, titles: ["SOC Trainee", "Security Intern"] },
      { tier: CareerTier.APPRENTICE, titles: ["Junior SOC Analyst", "Tier 1 Analyst"] },
      { tier: CareerTier.PRACTITIONER, titles: ["SOC Analyst", "Tier 2 Analyst"] },
      { tier: CareerTier.PROFESSIONAL, titles: ["Senior SOC Analyst", "Tier 3 Analyst"] },
      { tier: CareerTier.EXPERT, titles: ["SOC Team Lead", "Principal Analyst"] },
      { tier: CareerTier.MASTER, titles: ["SOC Manager", "Director of Security Operations"] },
      { tier: CareerTier.PRINCIPAL, titles: ["VP Security Operations", "CISO"] },
    ],
    salaryRange: [
      { tier: CareerTier.NOVICE, min: 45000, max: 55000, currency: "USD" },
      { tier: CareerTier.APPRENTICE, min: 55000, max: 70000, currency: "USD" },
      { tier: CareerTier.PRACTITIONER, min: 70000, max: 90000, currency: "USD" },
      { tier: CareerTier.PROFESSIONAL, min: 90000, max: 120000, currency: "USD" },
      { tier: CareerTier.EXPERT, min: 120000, max: 150000, currency: "USD" },
      { tier: CareerTier.MASTER, min: 150000, max: 200000, currency: "USD" },
      { tier: CareerTier.PRINCIPAL, min: 200000, max: 350000, currency: "USD" },
    ],
  },
  {
    path: CareerPath.THREAT_HUNTER,
    title: "Threat Hunter Track",
    description: "Proactively search for hidden threats and adversaries within networks",
    icon: "🎯",
    color: "#ef4444",
    requiredClearance: ClearanceLevel.SECRET,
    keySkills: [
      "Hypothesis Development",
      "Advanced Log Analysis",
      "Behavioral Analytics",
      "MITRE ATT&CK",
      "Network Forensics",
      "Threat Intelligence",
      "Scripting/Automation",
      "Data Science",
    ],
    certifications: [
      "cs-threat-hunting-foundations",
      "cs-threat-hunter",
      "cs-advanced-threat-hunter",
    ],
    phases: [
      {
        name: "Hunting Foundations",
        tier: CareerTier.PRACTITIONER,
        duration: "8-10 weeks",
        objectives: [
          "Understand threat hunting methodology",
          "Learn MITRE ATT&CK framework",
          "Master hypothesis-driven hunting",
          "Develop baseline knowledge",
        ],
        modules: [
          "threat-hunting-fundamentals",
          "mitre-attack-framework",
          "hypothesis-hunting",
          "baseline-development",
          "hunting-tools-intro",
        ],
        skills: [
          "Hypothesis Development",
          "ATT&CK Mapping",
          "Baseline Analysis",
          "Tool Proficiency",
        ],
        milestones: [
          "Complete 10 hunting exercises",
          "Map 50 techniques to ATT&CK",
          "Develop hunting playbook",
        ],
      },
      {
        name: "Advanced Hunting",
        tier: CareerTier.PROFESSIONAL,
        duration: "12-16 weeks",
        objectives: [
          "Hunt for APT activity",
          "Develop custom detection",
          "Perform memory forensics",
          "Automate hunting workflows",
        ],
        modules: [
          "apt-hunting",
          "memory-forensics",
          "network-forensics",
          "hunting-automation",
          "threat-intel-integration",
        ],
        skills: [
          "APT Detection",
          "Memory Analysis",
          "Automation",
          "Intel Integration",
        ],
        milestones: [
          "Discover simulated APT",
          "Automate 5 hunting workflows",
          "Complete threat hunting certification",
        ],
      },
      {
        name: "Expert Hunting",
        tier: CareerTier.EXPERT,
        duration: "Ongoing",
        objectives: [
          "Lead hunting operations",
          "Develop hunting program",
          "Train hunting teams",
          "Research new techniques",
        ],
        modules: [
          "hunting-program-development",
          "hunting-team-leadership",
          "research-methodology",
          "advanced-adversary-simulation",
        ],
        skills: [
          "Program Development",
          "Team Leadership",
          "Research",
          "Adversary Simulation",
        ],
        milestones: [
          "Lead hunting team",
          "Publish hunting research",
          "Develop organization hunting program",
        ],
      },
    ],
    jobTitles: [
      { tier: CareerTier.PRACTITIONER, titles: ["Junior Threat Hunter", "Threat Analyst"] },
      { tier: CareerTier.PROFESSIONAL, titles: ["Threat Hunter", "Cyber Threat Hunter"] },
      { tier: CareerTier.EXPERT, titles: ["Senior Threat Hunter", "Lead Threat Hunter"] },
      { tier: CareerTier.MASTER, titles: ["Principal Threat Hunter", "Threat Hunting Manager"] },
      { tier: CareerTier.PRINCIPAL, titles: ["Director of Threat Hunting", "Chief Threat Hunter"] },
    ],
    salaryRange: [
      { tier: CareerTier.PRACTITIONER, min: 80000, max: 100000, currency: "USD" },
      { tier: CareerTier.PROFESSIONAL, min: 100000, max: 130000, currency: "USD" },
      { tier: CareerTier.EXPERT, min: 130000, max: 170000, currency: "USD" },
      { tier: CareerTier.MASTER, min: 170000, max: 220000, currency: "USD" },
      { tier: CareerTier.PRINCIPAL, min: 220000, max: 300000, currency: "USD" },
    ],
  },
  {
    path: CareerPath.INCIDENT_RESPONDER,
    title: "Incident Responder Track",
    description: "Lead critical incident response operations and digital forensics investigations",
    icon: "🚨",
    color: "#f59e0b",
    requiredClearance: ClearanceLevel.SECRET,
    keySkills: [
      "Incident Management",
      "Digital Forensics",
      "Malware Analysis",
      "Network Forensics",
      "Memory Forensics",
      "Chain of Custody",
      "Legal Compliance",
      "Crisis Communication",
    ],
    certifications: [
      "cs-ir-foundations",
      "cs-incident-handler",
      "cs-forensics-analyst",
    ],
    phases: [
      {
        name: "IR Fundamentals",
        tier: CareerTier.APPRENTICE,
        duration: "6-8 weeks",
        objectives: [
          "Understand IR lifecycle",
          "Learn evidence handling",
          "Master initial triage",
          "Document incidents properly",
        ],
        modules: [
          "ir-lifecycle",
          "evidence-handling",
          "initial-triage",
          "incident-documentation",
          "ir-communication",
        ],
        skills: [
          "IR Lifecycle",
          "Evidence Handling",
          "Triage",
          "Documentation",
        ],
        milestones: [
          "Complete 5 simulated incidents",
          "Pass evidence handling assessment",
          "Achieve IR foundations cert",
        ],
      },
      {
        name: "Incident Handling",
        tier: CareerTier.PRACTITIONER,
        duration: "10-14 weeks",
        objectives: [
          "Lead incident investigations",
          "Perform containment actions",
          "Coordinate response teams",
          "Conduct root cause analysis",
        ],
        modules: [
          "incident-leadership",
          "containment-strategies",
          "eradication-recovery",
          "root-cause-analysis",
          "ir-automation",
        ],
        skills: [
          "Incident Leadership",
          "Containment",
          "Root Cause Analysis",
          "Team Coordination",
        ],
        milestones: [
          "Lead 20 incident investigations",
          "Achieve incident handler cert",
          "Reduce MTTR by 25%",
        ],
      },
      {
        name: "Digital Forensics",
        tier: CareerTier.PROFESSIONAL,
        duration: "12-16 weeks",
        objectives: [
          "Conduct forensic investigations",
          "Analyze malware samples",
          "Perform network forensics",
          "Prepare legal reports",
        ],
        modules: [
          "disk-forensics",
          "memory-forensics-advanced",
          "network-forensics-advanced",
          "malware-analysis",
          "legal-reporting",
        ],
        skills: [
          "Disk Forensics",
          "Memory Forensics",
          "Malware Analysis",
          "Legal Reporting",
        ],
        milestones: [
          "Complete 10 forensic investigations",
          "Analyze 25 malware samples",
          "Achieve forensics certification",
        ],
      },
      {
        name: "IR Leadership",
        tier: CareerTier.EXPERT,
        duration: "Ongoing",
        objectives: [
          "Build IR program",
          "Manage IR team",
          "Develop playbooks",
          "Interface with legal/executives",
        ],
        modules: [
          "ir-program-development",
          "ir-team-management",
          "playbook-development",
          "executive-communication",
        ],
        skills: [
          "Program Development",
          "Team Management",
          "Playbook Creation",
          "Executive Briefings",
        ],
        milestones: [
          "Build IR program",
          "Manage team of 5+",
          "Create 20 IR playbooks",
        ],
      },
    ],
    jobTitles: [
      { tier: CareerTier.APPRENTICE, titles: ["Junior IR Analyst", "IR Trainee"] },
      { tier: CareerTier.PRACTITIONER, titles: ["Incident Responder", "IR Analyst"] },
      { tier: CareerTier.PROFESSIONAL, titles: ["Senior Incident Responder", "Forensics Analyst"] },
      { tier: CareerTier.EXPERT, titles: ["IR Team Lead", "Senior Forensics Analyst"] },
      { tier: CareerTier.MASTER, titles: ["IR Manager", "Director of Incident Response"] },
      { tier: CareerTier.PRINCIPAL, titles: ["VP Incident Response", "Chief Security Officer"] },
    ],
    salaryRange: [
      { tier: CareerTier.APPRENTICE, min: 60000, max: 75000, currency: "USD" },
      { tier: CareerTier.PRACTITIONER, min: 75000, max: 95000, currency: "USD" },
      { tier: CareerTier.PROFESSIONAL, min: 95000, max: 125000, currency: "USD" },
      { tier: CareerTier.EXPERT, min: 125000, max: 160000, currency: "USD" },
      { tier: CareerTier.MASTER, min: 160000, max: 210000, currency: "USD" },
      { tier: CareerTier.PRINCIPAL, min: 210000, max: 300000, currency: "USD" },
    ],
  },
  {
    path: CareerPath.PENETRATION_TESTER,
    title: "Penetration Tester Track",
    description: "Master offensive security techniques to identify vulnerabilities before attackers do",
    icon: "💀",
    color: "#dc2626",
    requiredClearance: ClearanceLevel.TOP_SECRET,
    keySkills: [
      "Vulnerability Assessment",
      "Exploitation",
      "Web Application Testing",
      "Network Penetration",
      "Social Engineering",
      "Report Writing",
      "Red Team Operations",
      "Evasion Techniques",
    ],
    certifications: [
      "cs-pentest-foundations",
      "cs-penetration-tester",
      "cs-red-team-operator",
    ],
    phases: [
      {
        name: "Pentest Fundamentals",
        tier: CareerTier.PRACTITIONER,
        duration: "10-12 weeks",
        objectives: [
          "Understand pentest methodology",
          "Learn reconnaissance techniques",
          "Master vulnerability scanning",
          "Practice ethical hacking",
        ],
        modules: [
          "pentest-methodology",
          "reconnaissance-osint",
          "vulnerability-scanning",
          "network-attacks-basics",
          "ethical-hacking-lab",
        ],
        skills: [
          "Reconnaissance",
          "Scanning",
          "Enumeration",
          "Basic Exploitation",
        ],
        milestones: [
          "Complete CTF challenges",
          "Perform 5 practice pentests",
          "Pass pentest foundations exam",
        ],
      },
      {
        name: "Advanced Exploitation",
        tier: CareerTier.PROFESSIONAL,
        duration: "14-18 weeks",
        objectives: [
          "Master exploitation frameworks",
          "Develop custom exploits",
          "Perform privilege escalation",
          "Conduct web app pentests",
        ],
        modules: [
          "exploitation-frameworks",
          "custom-exploit-development",
          "privilege-escalation",
          "web-app-pentesting",
          "post-exploitation",
        ],
        skills: [
          "Exploitation",
          "Privilege Escalation",
          "Web App Testing",
          "Post-Exploitation",
        ],
        milestones: [
          "Develop 5 custom exploits",
          "Complete advanced CTF",
          "Achieve penetration tester cert",
        ],
      },
      {
        name: "Red Team Operations",
        tier: CareerTier.EXPERT,
        duration: "Ongoing",
        objectives: [
          "Conduct red team engagements",
          "Develop adversary emulation",
          "Bypass security controls",
          "Lead offensive operations",
        ],
        modules: [
          "red-team-operations",
          "adversary-emulation",
          "evasion-techniques",
          "c2-infrastructure",
          "physical-security",
        ],
        skills: [
          "Adversary Emulation",
          "Evasion",
          "C2 Operations",
          "Team Leadership",
        ],
        milestones: [
          "Lead 5 red team engagements",
          "Develop adversary profiles",
          "Achieve red team operator cert",
        ],
      },
    ],
    jobTitles: [
      { tier: CareerTier.PRACTITIONER, titles: ["Junior Penetration Tester", "Security Tester"] },
      { tier: CareerTier.PROFESSIONAL, titles: ["Penetration Tester", "Ethical Hacker"] },
      { tier: CareerTier.EXPERT, titles: ["Senior Penetration Tester", "Red Team Operator"] },
      { tier: CareerTier.MASTER, titles: ["Red Team Lead", "Principal Consultant"] },
      { tier: CareerTier.PRINCIPAL, titles: ["Director of Offensive Security", "Red Team Director"] },
    ],
    salaryRange: [
      { tier: CareerTier.PRACTITIONER, min: 85000, max: 105000, currency: "USD" },
      { tier: CareerTier.PROFESSIONAL, min: 105000, max: 140000, currency: "USD" },
      { tier: CareerTier.EXPERT, min: 140000, max: 180000, currency: "USD" },
      { tier: CareerTier.MASTER, min: 180000, max: 240000, currency: "USD" },
      { tier: CareerTier.PRINCIPAL, min: 240000, max: 350000, currency: "USD" },
    ],
  },
  {
    path: CareerPath.MALWARE_ANALYST,
    title: "Malware Analyst Track",
    description: "Reverse engineer and analyze malicious software to understand adversary capabilities",
    icon: "🔬",
    color: "#8b5cf6",
    requiredClearance: ClearanceLevel.TOP_SECRET,
    keySkills: [
      "Static Analysis",
      "Dynamic Analysis",
      "Reverse Engineering",
      "Assembly Language",
      "Debugging",
      "Sandboxing",
      "YARA Rules",
      "Malware Families",
    ],
    certifications: [
      "cs-malware-foundations",
      "cs-malware-analyst",
      "cs-reverse-engineer",
    ],
    phases: [
      {
        name: "Malware Basics",
        tier: CareerTier.PRACTITIONER,
        duration: "8-10 weeks",
        objectives: [
          "Understand malware types",
          "Set up analysis environment",
          "Perform basic static analysis",
          "Use sandboxing tools",
        ],
        modules: [
          "malware-types-overview",
          "analysis-environment-setup",
          "static-analysis-basics",
          "dynamic-analysis-basics",
          "sandbox-analysis",
        ],
        skills: [
          "Malware Classification",
          "Environment Setup",
          "Basic Static Analysis",
          "Sandboxing",
        ],
        milestones: [
          "Analyze 25 malware samples",
          "Create analysis reports",
          "Pass malware basics exam",
        ],
      },
      {
        name: "Advanced Analysis",
        tier: CareerTier.PROFESSIONAL,
        duration: "14-18 weeks",
        objectives: [
          "Master reverse engineering",
          "Analyze packed malware",
          "Understand anti-analysis",
          "Create detection signatures",
        ],
        modules: [
          "assembly-fundamentals",
          "reverse-engineering-tools",
          "packer-unpacking",
          "anti-analysis-techniques",
          "signature-development",
        ],
        skills: [
          "Assembly",
          "Reverse Engineering",
          "Unpacking",
          "Signature Writing",
        ],
        milestones: [
          "Reverse engineer 10 samples",
          "Create 20 YARA rules",
          "Achieve malware analyst cert",
        ],
      },
      {
        name: "Expert Analysis",
        tier: CareerTier.EXPERT,
        duration: "Ongoing",
        objectives: [
          "Analyze APT malware",
          "Attribute threat actors",
          "Publish research",
          "Train analysts",
        ],
        modules: [
          "apt-malware-analysis",
          "threat-attribution",
          "research-publication",
          "malware-team-leadership",
        ],
        skills: [
          "APT Analysis",
          "Attribution",
          "Research",
          "Leadership",
        ],
        milestones: [
          "Analyze APT malware",
          "Publish research report",
          "Train 5 analysts",
        ],
      },
    ],
    jobTitles: [
      { tier: CareerTier.PRACTITIONER, titles: ["Junior Malware Analyst", "Malware Researcher"] },
      { tier: CareerTier.PROFESSIONAL, titles: ["Malware Analyst", "Reverse Engineer"] },
      { tier: CareerTier.EXPERT, titles: ["Senior Malware Analyst", "Principal Reverse Engineer"] },
      { tier: CareerTier.MASTER, titles: ["Malware Research Lead", "Threat Research Manager"] },
      { tier: CareerTier.PRINCIPAL, titles: ["Director of Malware Research", "Chief Research Officer"] },
    ],
    salaryRange: [
      { tier: CareerTier.PRACTITIONER, min: 90000, max: 110000, currency: "USD" },
      { tier: CareerTier.PROFESSIONAL, min: 110000, max: 145000, currency: "USD" },
      { tier: CareerTier.EXPERT, min: 145000, max: 190000, currency: "USD" },
      { tier: CareerTier.MASTER, min: 190000, max: 250000, currency: "USD" },
      { tier: CareerTier.PRINCIPAL, min: 250000, max: 350000, currency: "USD" },
    ],
  },
  {
    path: CareerPath.SECURITY_ARCHITECT,
    title: "Security Architect Track",
    description: "Design and implement enterprise security architectures that protect critical assets",
    icon: "🏗️",
    color: "#0ea5e9",
    requiredClearance: ClearanceLevel.SECRET,
    keySkills: [
      "Security Architecture",
      "Risk Assessment",
      "Cloud Security",
      "Zero Trust",
      "Identity Management",
      "Network Design",
      "Compliance Frameworks",
      "Strategic Planning",
    ],
    certifications: [
      "cs-security-architecture-foundations",
      "cs-security-architect",
      "cs-enterprise-architect",
    ],
    phases: [
      {
        name: "Architecture Fundamentals",
        tier: CareerTier.PROFESSIONAL,
        duration: "10-12 weeks",
        objectives: [
          "Understand security frameworks",
          "Learn architecture principles",
          "Master risk assessment",
          "Design basic architectures",
        ],
        modules: [
          "security-frameworks-overview",
          "architecture-principles",
          "risk-assessment-methodology",
          "network-architecture-security",
          "identity-management-basics",
        ],
        skills: [
          "Frameworks",
          "Design Principles",
          "Risk Assessment",
          "Documentation",
        ],
        milestones: [
          "Complete architecture assessment",
          "Design 3 security architectures",
          "Pass architecture foundations exam",
        ],
      },
      {
        name: "Enterprise Architecture",
        tier: CareerTier.EXPERT,
        duration: "14-18 weeks",
        objectives: [
          "Design enterprise solutions",
          "Implement zero trust",
          "Architect cloud security",
          "Lead security transformations",
        ],
        modules: [
          "enterprise-security-design",
          "zero-trust-architecture",
          "cloud-security-architecture",
          "security-transformation",
          "vendor-evaluation",
        ],
        skills: [
          "Enterprise Design",
          "Zero Trust",
          "Cloud Security",
          "Transformation",
        ],
        milestones: [
          "Design enterprise architecture",
          "Implement zero trust pilot",
          "Achieve security architect cert",
        ],
      },
      {
        name: "Strategic Architecture",
        tier: CareerTier.MASTER,
        duration: "Ongoing",
        objectives: [
          "Define security strategy",
          "Lead architecture team",
          "Advise executive leadership",
          "Drive industry standards",
        ],
        modules: [
          "security-strategy-development",
          "architecture-team-leadership",
          "executive-advisory",
          "industry-standards",
        ],
        skills: [
          "Strategy",
          "Leadership",
          "Executive Communication",
          "Standards",
        ],
        milestones: [
          "Define security strategy",
          "Lead architecture team",
          "Present to board",
        ],
      },
    ],
    jobTitles: [
      { tier: CareerTier.PROFESSIONAL, titles: ["Security Engineer", "Security Designer"] },
      { tier: CareerTier.EXPERT, titles: ["Security Architect", "Senior Security Engineer"] },
      { tier: CareerTier.MASTER, titles: ["Principal Security Architect", "Enterprise Architect"] },
      { tier: CareerTier.PRINCIPAL, titles: ["Chief Security Architect", "VP Security Architecture"] },
    ],
    salaryRange: [
      { tier: CareerTier.PROFESSIONAL, min: 120000, max: 150000, currency: "USD" },
      { tier: CareerTier.EXPERT, min: 150000, max: 200000, currency: "USD" },
      { tier: CareerTier.MASTER, min: 200000, max: 280000, currency: "USD" },
      { tier: CareerTier.PRINCIPAL, min: 280000, max: 400000, currency: "USD" },
    ],
  },
];

// ============================================
// XP CALCULATION SYSTEM
// ============================================

export interface XPReward {
  action: string;
  baseXP: number;
  multipliers: {
    difficulty: Record<DifficultyLevel, number>;
    streak: (streak: number) => number;
    firstTime: number;
    perfectScore: number;
  };
}

export const XP_REWARDS: Record<string, XPReward> = {
  SCENARIO_COMPLETE: {
    action: "Complete Scenario",
    baseXP: 50,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1.5,
        ADVANCED: 2,
        EXPERT: 3,
        MASTER: 4,
      },
      streak: (streak: number) => Math.min(1 + streak * 0.1, 2),
      firstTime: 1.5,
      perfectScore: 1.25,
    },
  },
  MODULE_COMPLETE: {
    action: "Complete Module",
    baseXP: 500,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1.5,
        ADVANCED: 2,
        EXPERT: 3,
        MASTER: 4,
      },
      streak: (streak: number) => Math.min(1 + streak * 0.1, 2),
      firstTime: 1.5,
      perfectScore: 1.25,
    },
  },
  CERTIFICATION_EARNED: {
    action: "Earn Certification",
    baseXP: 2000,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1.5,
        ADVANCED: 2,
        EXPERT: 3,
        MASTER: 4,
      },
      streak: () => 1,
      firstTime: 1,
      perfectScore: 1.5,
    },
  },
  LAB_COMPLETE: {
    action: "Complete Lab",
    baseXP: 300,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1.5,
        ADVANCED: 2,
        EXPERT: 3,
        MASTER: 4,
      },
      streak: (streak: number) => Math.min(1 + streak * 0.05, 1.5),
      firstTime: 1.5,
      perfectScore: 1.25,
    },
  },
  EXERCISE_PARTICIPATE: {
    action: "Exercise Participation",
    baseXP: 750,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1.5,
        ADVANCED: 2,
        EXPERT: 3,
        MASTER: 4,
      },
      streak: () => 1,
      firstTime: 1.25,
      perfectScore: 1.5,
    },
  },
  DAILY_LOGIN: {
    action: "Daily Login",
    baseXP: 25,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1,
        ADVANCED: 1,
        EXPERT: 1,
        MASTER: 1,
      },
      streak: (streak: number) => Math.min(1 + streak * 0.1, 3),
      firstTime: 1,
      perfectScore: 1,
    },
  },
  MENTORSHIP_SESSION: {
    action: "Mentorship Session",
    baseXP: 100,
    multipliers: {
      difficulty: {
        BEGINNER: 1,
        INTERMEDIATE: 1,
        ADVANCED: 1,
        EXPERT: 1,
        MASTER: 1,
      },
      streak: () => 1,
      firstTime: 1.5,
      perfectScore: 1,
    },
  },
};

export function calculateXP(
  action: keyof typeof XP_REWARDS,
  options: {
    difficulty?: DifficultyLevel;
    streak?: number;
    isFirstTime?: boolean;
    isPerfect?: boolean;
    customMultiplier?: number;
  } = {}
): number {
  const reward = XP_REWARDS[action];
  if (!reward) return 0;

  const { difficulty = DifficultyLevel.BEGINNER, streak = 0, isFirstTime = false, isPerfect = false, customMultiplier = 1 } = options;

  let xp = reward.baseXP;

  // Apply difficulty multiplier
  xp *= reward.multipliers.difficulty[difficulty];

  // Apply streak multiplier
  xp *= reward.multipliers.streak(streak);

  // Apply first time bonus
  if (isFirstTime) {
    xp *= reward.multipliers.firstTime;
  }

  // Apply perfect score bonus
  if (isPerfect) {
    xp *= reward.multipliers.perfectScore;
  }

  // Apply custom multiplier
  xp *= customMultiplier;

  return Math.round(xp);
}

export function getTierFromXP(xp: number): CareerTierDefinition {
  for (let i = CAREER_TIERS.length - 1; i >= 0; i--) {
    if (xp >= CAREER_TIERS[i].minXP) {
      return CAREER_TIERS[i];
    }
  }
  return CAREER_TIERS[0];
}

export function getXPToNextTier(currentXP: number): {
  currentTier: CareerTierDefinition;
  nextTier: CareerTierDefinition | null;
  xpNeeded: number;
  progress: number;
} {
  const currentTier = getTierFromXP(currentXP);
  const currentIndex = CAREER_TIERS.findIndex((t) => t.tier === currentTier.tier);
  const nextTier = currentIndex < CAREER_TIERS.length - 1 ? CAREER_TIERS[currentIndex + 1] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      xpNeeded: 0,
      progress: 100,
    };
  }

  const xpNeeded = nextTier.minXP - currentXP;
  const tierRange = nextTier.minXP - currentTier.minXP;
  const progress = ((currentXP - currentTier.minXP) / tierRange) * 100;

  return {
    currentTier,
    nextTier,
    xpNeeded,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

// ============================================
// SKILL FRAMEWORK (NICE ALIGNMENT)
// ============================================

export interface SkillFramework {
  category: string;
  skills: {
    id: string;
    name: string;
    description: string;
    niceKsaId?: string;
    levels: {
      level: 1 | 2 | 3 | 4 | 5;
      description: string;
      requirements: string[];
    }[];
  }[];
}

export const SKILL_FRAMEWORKS: SkillFramework[] = [
  {
    category: "Threat Analysis",
    skills: [
      {
        id: "threat-modeling",
        name: "Threat Modeling",
        description: "Ability to identify and analyze potential threats to systems and data",
        niceKsaId: "K0005",
        levels: [
          {
            level: 1,
            description: "Basic understanding of threat concepts",
            requirements: ["Identify common threat types", "Understand basic attack vectors"],
          },
          {
            level: 2,
            description: "Apply threat modeling frameworks",
            requirements: ["Use STRIDE methodology", "Create basic threat models"],
          },
          {
            level: 3,
            description: "Develop comprehensive threat models",
            requirements: ["Lead threat modeling sessions", "Identify complex attack chains"],
          },
          {
            level: 4,
            description: "Expert threat analysis and prediction",
            requirements: ["Predict emerging threats", "Develop organizational threat frameworks"],
          },
          {
            level: 5,
            description: "Industry thought leader in threat analysis",
            requirements: ["Publish threat research", "Advise on national security threats"],
          },
        ],
      },
      {
        id: "malware-analysis",
        name: "Malware Analysis",
        description: "Analyze malicious software to understand functionality and attribution",
        niceKsaId: "K0259",
        levels: [
          {
            level: 1,
            description: "Basic malware identification",
            requirements: ["Identify malware types", "Use automated analysis tools"],
          },
          {
            level: 2,
            description: "Static and dynamic analysis basics",
            requirements: ["Perform basic static analysis", "Use sandboxing effectively"],
          },
          {
            level: 3,
            description: "Advanced reverse engineering",
            requirements: ["Reverse engineer binaries", "Unpack protected malware"],
          },
          {
            level: 4,
            description: "Expert-level analysis and attribution",
            requirements: ["Attribute malware to threat actors", "Develop detection signatures"],
          },
          {
            level: 5,
            description: "World-class malware researcher",
            requirements: ["Discover zero-day malware", "Lead malware research teams"],
          },
        ],
      },
    ],
  },
  {
    category: "Incident Response",
    skills: [
      {
        id: "incident-handling",
        name: "Incident Handling",
        description: "Manage security incidents from detection through resolution",
        niceKsaId: "K0042",
        levels: [
          {
            level: 1,
            description: "Basic incident awareness",
            requirements: ["Recognize security incidents", "Follow basic IR procedures"],
          },
          {
            level: 2,
            description: "Incident triage and escalation",
            requirements: ["Triage incidents effectively", "Proper escalation procedures"],
          },
          {
            level: 3,
            description: "Lead incident investigations",
            requirements: ["Lead incident response", "Coordinate response teams"],
          },
          {
            level: 4,
            description: "Complex incident management",
            requirements: ["Handle APT incidents", "Manage crisis situations"],
          },
          {
            level: 5,
            description: "Strategic IR leadership",
            requirements: ["Build IR programs", "Advise on national incidents"],
          },
        ],
      },
      {
        id: "digital-forensics",
        name: "Digital Forensics",
        description: "Collect, preserve, and analyze digital evidence",
        niceKsaId: "K0060",
        levels: [
          {
            level: 1,
            description: "Basic evidence handling",
            requirements: ["Understand chain of custody", "Basic evidence collection"],
          },
          {
            level: 2,
            description: "Forensic tool proficiency",
            requirements: ["Use forensic tools", "Disk imaging and analysis"],
          },
          {
            level: 3,
            description: "Advanced forensic investigation",
            requirements: ["Memory forensics", "Network forensics"],
          },
          {
            level: 4,
            description: "Expert forensic analyst",
            requirements: ["Mobile forensics", "Cloud forensics"],
          },
          {
            level: 5,
            description: "Forensic expert witness",
            requirements: ["Legal testimony", "Forensic research"],
          },
        ],
      },
    ],
  },
  {
    category: "Security Operations",
    skills: [
      {
        id: "siem-operations",
        name: "SIEM Operations",
        description: "Operate and optimize security information and event management systems",
        niceKsaId: "K0046",
        levels: [
          {
            level: 1,
            description: "Basic SIEM navigation",
            requirements: ["Navigate SIEM interface", "Basic searches"],
          },
          {
            level: 2,
            description: "Alert analysis and triage",
            requirements: ["Analyze security alerts", "Write basic queries"],
          },
          {
            level: 3,
            description: "Advanced query and correlation",
            requirements: ["Complex queries", "Correlation rules"],
          },
          {
            level: 4,
            description: "SIEM architecture and tuning",
            requirements: ["SIEM optimization", "Custom parsers"],
          },
          {
            level: 5,
            description: "SIEM strategy and design",
            requirements: ["SIEM architecture", "Multi-platform integration"],
          },
        ],
      },
    ],
  },
];

// ============================================
// PROGRESSION UTILITIES
// ============================================

export function getCareerPathByType(path: CareerPath): CareerPathDefinition | undefined {
  return CAREER_PATHS.find((p) => p.path === path);
}

export function getRecommendedPath(
  skills: Record<string, number>,
  interests: string[]
): CareerPathDefinition[] {
  // Score each path based on skill alignment and interests
  const scoredPaths = CAREER_PATHS.map((path) => {
    let score = 0;

    // Match key skills
    path.keySkills.forEach((skill) => {
      const skillKey = skill.toLowerCase().replace(/\s+/g, "-");
      if (skills[skillKey]) {
        score += skills[skillKey] * 10;
      }
    });

    // Match interests
    interests.forEach((interest) => {
      if (
        path.keySkills.some((s) =>
          s.toLowerCase().includes(interest.toLowerCase())
        ) ||
        path.title.toLowerCase().includes(interest.toLowerCase())
      ) {
        score += 20;
      }
    });

    return { path, score };
  });

  // Sort by score and return top 3
  return scoredPaths
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((sp) => sp.path);
}

export function checkTierRequirements(
  tier: CareerTier,
  userProgress: {
    modulesCompleted: number;
    certifications: string[];
    averageScore: number;
    labHours: number;
    exercisesCompleted: number;
  }
): {
  met: boolean;
  unmet: string[];
  progress: Record<string, { current: number; required: number; percentage: number }>;
} {
  const tierDef = CAREER_TIERS.find((t) => t.tier === tier);
  if (!tierDef) {
    return { met: false, unmet: ["Invalid tier"], progress: {} };
  }

  const requirements = tierDef.requirements;
  const unmet: string[] = [];
  const progress: Record<string, { current: number; required: number; percentage: number }> = {};

  // Check modules completed
  progress.modulesCompleted = {
    current: userProgress.modulesCompleted,
    required: requirements.modulesCompleted,
    percentage: Math.min(100, (userProgress.modulesCompleted / requirements.modulesCompleted) * 100),
  };
  if (userProgress.modulesCompleted < requirements.modulesCompleted) {
    unmet.push(`Complete ${requirements.modulesCompleted - userProgress.modulesCompleted} more modules`);
  }

  // Check certifications
  const missingCerts = requirements.certificationsRequired.filter(
    (cert) => !userProgress.certifications.includes(cert)
  );
  progress.certifications = {
    current: requirements.certificationsRequired.length - missingCerts.length,
    required: requirements.certificationsRequired.length,
    percentage:
      requirements.certificationsRequired.length === 0
        ? 100
        : ((requirements.certificationsRequired.length - missingCerts.length) /
            requirements.certificationsRequired.length) *
          100,
  };
  if (missingCerts.length > 0) {
    unmet.push(`Earn certifications: ${missingCerts.join(", ")}`);
  }

  // Check average score
  progress.averageScore = {
    current: userProgress.averageScore,
    required: requirements.minAverageScore,
    percentage: Math.min(100, (userProgress.averageScore / requirements.minAverageScore) * 100),
  };
  if (userProgress.averageScore < requirements.minAverageScore) {
    unmet.push(`Achieve ${requirements.minAverageScore}% average score (currently ${userProgress.averageScore}%)`);
  }

  // Check lab hours
  progress.labHours = {
    current: userProgress.labHours,
    required: requirements.labHoursRequired,
    percentage:
      requirements.labHoursRequired === 0
        ? 100
        : Math.min(100, (userProgress.labHours / requirements.labHoursRequired) * 100),
  };
  if (userProgress.labHours < requirements.labHoursRequired) {
    unmet.push(`Complete ${requirements.labHoursRequired - userProgress.labHours} more lab hours`);
  }

  // Check exercises
  progress.exercisesCompleted = {
    current: userProgress.exercisesCompleted,
    required: requirements.exercisesCompleted,
    percentage:
      requirements.exercisesCompleted === 0
        ? 100
        : Math.min(100, (userProgress.exercisesCompleted / requirements.exercisesCompleted) * 100),
  };
  if (userProgress.exercisesCompleted < requirements.exercisesCompleted) {
    unmet.push(`Complete ${requirements.exercisesCompleted - userProgress.exercisesCompleted} more exercises`);
  }

  return {
    met: unmet.length === 0,
    unmet,
    progress,
  };
}
