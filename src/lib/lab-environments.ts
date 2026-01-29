/**
 * Cyber Shield Enterprise Lab Environment System
 * Hands-On Cybersecurity Training Labs
 */

import { LabType, DifficultyLevel, ClearanceLevel } from "@prisma/client";

// ============================================
// LAB ENVIRONMENT DEFINITIONS
// ============================================

export interface LabEnvironmentDefinition {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  labType: LabType;
  difficulty: DifficultyLevel;
  clearanceRequired: ClearanceLevel;
  prerequisites: string[];
  estimatedDuration: number; // minutes
  maxConcurrentUsers: number;
  sessionTimeout: number; // minutes
  objectives: LabObjective[];
  tools: LabTool[];
  resources: LabResource[];
  flags?: CtfFlag[];
  hints: string[];
  architecture: LabArchitecture;
  skills: string[];
  tags: string[];
}

export interface LabObjective {
  id: string;
  title: string;
  description: string;
  points: number;
  required: boolean;
  validationMethod: "flag" | "file" | "command" | "network" | "manual";
  validationCriteria: string;
  hints: string[];
}

export interface LabTool {
  name: string;
  description: string;
  category: string;
  preInstalled: boolean;
  documentation?: string;
}

export interface LabResource {
  type: "vm" | "container" | "network" | "service";
  name: string;
  description: string;
  image?: string;
  ports?: number[];
  credentials?: {
    username: string;
    password: string;
    note?: string;
  };
}

export interface CtfFlag {
  id: string;
  objectiveId: string;
  format: string;
  value: string;
  points: number;
  hint?: string;
}

export interface LabArchitecture {
  diagram?: string;
  networks: {
    name: string;
    subnet: string;
    description: string;
  }[];
  hosts: {
    name: string;
    ip: string;
    os: string;
    role: string;
    services: string[];
  }[];
}

// ============================================
// NETWORK SECURITY LABS
// ============================================

export const NETWORK_SECURITY_LABS: LabEnvironmentDefinition[] = [
  {
    id: "lab-network-traffic-analysis",
    name: "Network Traffic Analysis Lab",
    description: "Analyze network traffic to identify malicious activity and threats",
    longDescription: `This comprehensive lab environment provides hands-on experience with network traffic analysis. You will work with real packet captures to identify various types of malicious activity including malware C2 communications, data exfiltration, and network attacks.

The lab includes:
- Pre-configured Wireshark workstation
- Multiple packet capture files with hidden threats
- Network forensics tools
- Simulated enterprise network traffic

By completing this lab, you will develop skills in:
- Packet capture analysis
- Protocol analysis
- C2 detection
- Data exfiltration identification
- Network forensics`,
    icon: "network",
    labType: LabType.NETWORK,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["network-traffic-analysis"],
    estimatedDuration: 120,
    maxConcurrentUsers: 50,
    sessionTimeout: 180,
    objectives: [
      {
        id: "obj-1",
        title: "Identify C2 Traffic",
        description: "Locate and document command and control communications in the network capture",
        points: 200,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Submit the C2 server IP address",
        hints: [
          "Look for beaconing behavior",
          "Check for unusual DNS queries",
          "Analyze HTTP/HTTPS traffic patterns",
        ],
      },
      {
        id: "obj-2",
        title: "Extract Exfiltrated Data",
        description: "Identify and extract data being exfiltrated from the network",
        points: 250,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Submit the exfiltrated file hash",
        hints: [
          "Look for large outbound transfers",
          "Check DNS tunneling",
          "Analyze base64 encoded data",
        ],
      },
      {
        id: "obj-3",
        title: "Document Attack Timeline",
        description: "Create a complete timeline of the attack from initial access to exfiltration",
        points: 300,
        required: false,
        validationMethod: "manual",
        validationCriteria: "Submit timeline document",
        hints: [
          "Start with the first suspicious connection",
          "Map all involved hosts",
          "Note timestamps for each stage",
        ],
      },
    ],
    tools: [
      {
        name: "Wireshark",
        description: "Network protocol analyzer",
        category: "Analysis",
        preInstalled: true,
        documentation: "https://www.wireshark.org/docs/",
      },
      {
        name: "tshark",
        description: "Command-line Wireshark",
        category: "Analysis",
        preInstalled: true,
      },
      {
        name: "NetworkMiner",
        description: "Network forensic analysis tool",
        category: "Forensics",
        preInstalled: true,
      },
      {
        name: "Zeek",
        description: "Network analysis framework",
        category: "Analysis",
        preInstalled: true,
      },
    ],
    resources: [
      {
        type: "vm",
        name: "analyst-workstation",
        description: "Your analysis workstation with all tools pre-installed",
        image: "cybershield/analyst:latest",
        credentials: {
          username: "analyst",
          password: "ChangeMe123!",
          note: "Change password on first login",
        },
      },
    ],
    flags: [
      {
        id: "flag-1",
        objectiveId: "obj-1",
        format: "IP Address",
        value: "192.168.100.50",
        points: 200,
        hint: "The C2 server is external to the internal network",
      },
      {
        id: "flag-2",
        objectiveId: "obj-2",
        format: "MD5 Hash",
        value: "d41d8cd98f00b204e9800998ecf8427e",
        points: 250,
      },
    ],
    hints: [
      "Start by getting an overview of the traffic with protocol statistics",
      "Look for anomalous ports and protocols",
      "Filter on specific hosts showing suspicious activity",
    ],
    architecture: {
      networks: [
        {
          name: "Corporate LAN",
          subnet: "10.10.0.0/16",
          description: "Internal corporate network",
        },
        {
          name: "DMZ",
          subnet: "172.16.0.0/24",
          description: "Demilitarized zone",
        },
        {
          name: "External",
          subnet: "0.0.0.0/0",
          description: "Internet",
        },
      ],
      hosts: [
        {
          name: "workstation-01",
          ip: "10.10.1.100",
          os: "Windows 10",
          role: "User Workstation",
          services: ["HTTP", "RDP"],
        },
        {
          name: "dc-01",
          ip: "10.10.0.10",
          os: "Windows Server 2019",
          role: "Domain Controller",
          services: ["LDAP", "Kerberos", "DNS"],
        },
        {
          name: "file-server",
          ip: "10.10.0.50",
          os: "Windows Server 2019",
          role: "File Server",
          services: ["SMB", "HTTP"],
        },
      ],
    },
    skills: [
      "Packet Analysis",
      "Protocol Analysis",
      "C2 Detection",
      "Network Forensics",
    ],
    tags: ["network", "traffic-analysis", "wireshark", "forensics"],
  },
];

// ============================================
// MALWARE ANALYSIS LABS
// ============================================

export const MALWARE_ANALYSIS_LABS: LabEnvironmentDefinition[] = [
  {
    id: "lab-malware-analysis-sandbox",
    name: "Malware Analysis Sandbox",
    description: "Safely analyze malware samples using static and dynamic techniques",
    longDescription: `This isolated lab environment provides a safe space to analyze malware samples. The lab includes multiple analysis workstations, a sandboxed victim VM, and all the tools needed for both static and dynamic malware analysis.

Key features:
- Isolated network environment
- Pre-configured analysis tools
- Multiple malware samples of varying complexity
- Snapshot and restore capabilities
- Network traffic capture

You will learn to:
- Set up safe analysis environments
- Perform static analysis
- Conduct dynamic/behavioral analysis
- Extract indicators of compromise
- Write analysis reports`,
    icon: "bug",
    labType: LabType.MALWARE_ANALYSIS,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["malware-analysis-fundamentals"],
    estimatedDuration: 180,
    maxConcurrentUsers: 20,
    sessionTimeout: 240,
    objectives: [
      {
        id: "obj-ma-1",
        title: "Static Analysis",
        description: "Perform static analysis on the provided malware sample",
        points: 200,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Identify the malware family",
        hints: [
          "Check strings for identifying information",
          "Analyze PE headers",
          "Look for packer signatures",
        ],
      },
      {
        id: "obj-ma-2",
        title: "Dynamic Analysis",
        description: "Execute the malware in a sandbox and document behavior",
        points: 300,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Identify the C2 domain",
        hints: [
          "Monitor network connections",
          "Track file system changes",
          "Observe registry modifications",
        ],
      },
      {
        id: "obj-ma-3",
        title: "IOC Extraction",
        description: "Extract all indicators of compromise from the sample",
        points: 250,
        required: true,
        validationMethod: "file",
        validationCriteria: "Submit IOC report in STIX format",
        hints: [
          "Include file hashes (MD5, SHA256)",
          "Extract network indicators",
          "Document persistence mechanisms",
        ],
      },
      {
        id: "obj-ma-4",
        title: "YARA Rule Creation",
        description: "Create a YARA rule to detect this malware family",
        points: 200,
        required: false,
        validationMethod: "file",
        validationCriteria: "Submit YARA rule that detects the sample",
        hints: [
          "Focus on unique strings",
          "Consider byte patterns",
          "Test against clean files",
        ],
      },
    ],
    tools: [
      {
        name: "IDA Free",
        description: "Interactive disassembler",
        category: "Disassembly",
        preInstalled: true,
      },
      {
        name: "Ghidra",
        description: "NSA reverse engineering tool",
        category: "Disassembly",
        preInstalled: true,
      },
      {
        name: "x64dbg",
        description: "Open-source debugger",
        category: "Debugging",
        preInstalled: true,
      },
      {
        name: "Process Monitor",
        description: "System monitoring tool",
        category: "Monitoring",
        preInstalled: true,
      },
      {
        name: "Regshot",
        description: "Registry comparison tool",
        category: "Monitoring",
        preInstalled: true,
      },
      {
        name: "PE-bear",
        description: "PE file analyzer",
        category: "Analysis",
        preInstalled: true,
      },
      {
        name: "YARA",
        description: "Malware identification tool",
        category: "Detection",
        preInstalled: true,
      },
    ],
    resources: [
      {
        type: "vm",
        name: "analysis-workstation",
        description: "Primary analysis workstation",
        image: "cybershield/malware-analysis:latest",
        credentials: {
          username: "analyst",
          password: "AnalystPass123!",
        },
      },
      {
        type: "vm",
        name: "victim-sandbox",
        description: "Isolated victim machine for dynamic analysis",
        image: "cybershield/victim-win10:latest",
        credentials: {
          username: "victim",
          password: "VictimPass123!",
          note: "Snapshot before each analysis",
        },
      },
      {
        type: "service",
        name: "inetsim",
        description: "Internet services simulator",
        ports: [80, 443, 53, 25],
      },
    ],
    hints: [
      "Always take a snapshot before executing malware",
      "Start with static analysis before dynamic",
      "Document everything you observe",
    ],
    architecture: {
      networks: [
        {
          name: "Analysis Network",
          subnet: "192.168.100.0/24",
          description: "Isolated analysis network",
        },
      ],
      hosts: [
        {
          name: "analysis-workstation",
          ip: "192.168.100.10",
          os: "Windows 10",
          role: "Analysis Workstation",
          services: [],
        },
        {
          name: "victim-sandbox",
          ip: "192.168.100.50",
          os: "Windows 10",
          role: "Victim Machine",
          services: [],
        },
        {
          name: "inetsim",
          ip: "192.168.100.1",
          os: "Linux",
          role: "Internet Simulator",
          services: ["HTTP", "HTTPS", "DNS", "SMTP"],
        },
      ],
    },
    skills: [
      "Static Analysis",
      "Dynamic Analysis",
      "Reverse Engineering",
      "IOC Extraction",
      "YARA Development",
    ],
    tags: ["malware", "analysis", "reverse-engineering", "sandbox"],
  },
];

// ============================================
// WEB APPLICATION SECURITY LABS
// ============================================

export const WEB_APPLICATION_LABS: LabEnvironmentDefinition[] = [
  {
    id: "lab-web-app-pentesting",
    name: "Web Application Security Testing Lab",
    description: "Practice finding and exploiting web application vulnerabilities",
    longDescription: `This lab provides a realistic web application environment for practicing penetration testing skills. The applications include various vulnerabilities from the OWASP Top 10, including SQL injection, XSS, authentication bypass, and more.

Lab includes:
- Multiple vulnerable web applications
- Burp Suite proxy pre-configured
- Comprehensive wordlists
- Attack cheat sheets

You will practice:
- SQL injection
- Cross-site scripting (XSS)
- Authentication attacks
- IDOR vulnerabilities
- SSRF attacks
- Insecure deserialization`,
    icon: "globe",
    labType: LabType.WEB_APPLICATION,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["security-awareness-101"],
    estimatedDuration: 150,
    maxConcurrentUsers: 100,
    sessionTimeout: 180,
    objectives: [
      {
        id: "obj-web-1",
        title: "SQL Injection",
        description: "Exploit SQL injection to extract database contents",
        points: 150,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Extract the admin password hash",
        hints: [
          "Test login forms for injection points",
          "Use UNION-based injection",
          "Try sqlmap for automation",
        ],
      },
      {
        id: "obj-web-2",
        title: "Cross-Site Scripting",
        description: "Find and exploit XSS vulnerabilities",
        points: 150,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Execute JavaScript in admin context",
        hints: [
          "Test all input fields",
          "Try different encoding methods",
          "Check stored vs reflected XSS",
        ],
      },
      {
        id: "obj-web-3",
        title: "Authentication Bypass",
        description: "Bypass authentication to access admin panel",
        points: 200,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Access admin dashboard without credentials",
        hints: [
          "Test for default credentials",
          "Check session management",
          "Look for JWT vulnerabilities",
        ],
      },
      {
        id: "obj-web-4",
        title: "IDOR Exploitation",
        description: "Exploit insecure direct object references",
        points: 150,
        required: false,
        validationMethod: "flag",
        validationCriteria: "Access another user's private data",
        hints: [
          "Analyze API endpoints",
          "Modify ID parameters",
          "Check authorization on all requests",
        ],
      },
    ],
    tools: [
      {
        name: "Burp Suite Community",
        description: "Web security testing platform",
        category: "Proxy",
        preInstalled: true,
      },
      {
        name: "sqlmap",
        description: "SQL injection automation tool",
        category: "Exploitation",
        preInstalled: true,
      },
      {
        name: "ffuf",
        description: "Fast web fuzzer",
        category: "Fuzzing",
        preInstalled: true,
      },
      {
        name: "Nikto",
        description: "Web server scanner",
        category: "Scanning",
        preInstalled: true,
      },
    ],
    resources: [
      {
        type: "vm",
        name: "attacker-kali",
        description: "Kali Linux attack machine",
        image: "cybershield/kali-web:latest",
        credentials: {
          username: "kali",
          password: "kali",
        },
      },
      {
        type: "container",
        name: "vulnerable-app",
        description: "Target vulnerable web application",
        image: "cybershield/vuln-webapp:latest",
        ports: [80, 443],
      },
      {
        type: "container",
        name: "database",
        description: "Backend database",
        image: "mysql:8.0",
        ports: [3306],
      },
    ],
    hints: [
      "Always start with reconnaissance",
      "Document all findings as you go",
      "Try manual testing before automation",
    ],
    architecture: {
      networks: [
        {
          name: "Lab Network",
          subnet: "10.0.0.0/24",
          description: "Isolated lab network",
        },
      ],
      hosts: [
        {
          name: "attacker",
          ip: "10.0.0.100",
          os: "Kali Linux",
          role: "Attack Machine",
          services: [],
        },
        {
          name: "webapp",
          ip: "10.0.0.10",
          os: "Linux",
          role: "Web Application",
          services: ["HTTP", "HTTPS"],
        },
        {
          name: "database",
          ip: "10.0.0.20",
          os: "Linux",
          role: "Database Server",
          services: ["MySQL"],
        },
      ],
    },
    skills: [
      "SQL Injection",
      "XSS",
      "Authentication Testing",
      "Web Application Security",
    ],
    tags: ["web", "owasp", "pentesting", "sql-injection", "xss"],
  },
];

// ============================================
// FORENSICS LABS
// ============================================

export const FORENSICS_LABS: LabEnvironmentDefinition[] = [
  {
    id: "lab-disk-forensics",
    name: "Disk Forensics Investigation Lab",
    description: "Investigate disk images to reconstruct user activity and recover evidence",
    longDescription: `This lab provides disk images from a simulated incident for forensic investigation. You will use industry-standard forensic tools to analyze file systems, recover deleted files, and reconstruct the timeline of events.

Lab scenario:
An employee is suspected of stealing company intellectual property. You have been given forensic images of their workstation. Your task is to find evidence of data theft and document your findings.

You will practice:
- Forensic imaging verification
- File system analysis
- Deleted file recovery
- Timeline creation
- Artifact analysis
- Report writing`,
    icon: "hard-drive",
    labType: LabType.FORENSICS,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.SECRET,
    prerequisites: ["digital-forensics-essentials"],
    estimatedDuration: 240,
    maxConcurrentUsers: 30,
    sessionTimeout: 300,
    objectives: [
      {
        id: "obj-for-1",
        title: "Image Verification",
        description: "Verify the integrity of the forensic disk image",
        points: 100,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Submit the image MD5 hash",
        hints: [
          "Use md5sum or similar tool",
          "Compare with provided hash",
          "Document chain of custody",
        ],
      },
      {
        id: "obj-for-2",
        title: "Recover Deleted Files",
        description: "Recover deleted files relevant to the investigation",
        points: 200,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Recover the deleted spreadsheet",
        hints: [
          "Check unallocated space",
          "Use file carving tools",
          "Look for file signatures",
        ],
      },
      {
        id: "obj-for-3",
        title: "USB Device Analysis",
        description: "Identify USB devices connected to the system",
        points: 200,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Submit the serial number of suspicious USB device",
        hints: [
          "Check Windows registry",
          "Analyze setupapi.dev.log",
          "Look for USB artifacts",
        ],
      },
      {
        id: "obj-for-4",
        title: "Timeline Reconstruction",
        description: "Create a comprehensive timeline of relevant events",
        points: 300,
        required: true,
        validationMethod: "file",
        validationCriteria: "Submit timeline in CSV format",
        hints: [
          "Use plaso/log2timeline",
          "Include file system timestamps",
          "Add browser history",
        ],
      },
      {
        id: "obj-for-5",
        title: "Evidence Report",
        description: "Write a professional forensic report",
        points: 200,
        required: false,
        validationMethod: "manual",
        validationCriteria: "Submit professional forensic report",
        hints: [
          "Include executive summary",
          "Document methodology",
          "Provide supporting evidence",
        ],
      },
    ],
    tools: [
      {
        name: "Autopsy",
        description: "Digital forensics platform",
        category: "Forensics",
        preInstalled: true,
      },
      {
        name: "FTK Imager",
        description: "Forensic imaging tool",
        category: "Imaging",
        preInstalled: true,
      },
      {
        name: "Plaso/log2timeline",
        description: "Timeline creation tool",
        category: "Timeline",
        preInstalled: true,
      },
      {
        name: "RegRipper",
        description: "Registry analysis tool",
        category: "Registry",
        preInstalled: true,
      },
      {
        name: "Volatility",
        description: "Memory forensics framework",
        category: "Memory",
        preInstalled: true,
      },
    ],
    resources: [
      {
        type: "vm",
        name: "forensics-workstation",
        description: "SIFT forensics workstation",
        image: "cybershield/sift-workstation:latest",
        credentials: {
          username: "sansforensics",
          password: "forensics",
        },
      },
    ],
    hints: [
      "Always work on copies, never the original",
      "Document your methodology thoroughly",
      "Verify hashes at every step",
    ],
    architecture: {
      networks: [
        {
          name: "Forensics Lab",
          subnet: "192.168.200.0/24",
          description: "Isolated forensics network",
        },
      ],
      hosts: [
        {
          name: "forensics-workstation",
          ip: "192.168.200.10",
          os: "Ubuntu (SIFT)",
          role: "Analysis Workstation",
          services: [],
        },
      ],
    },
    skills: [
      "Disk Forensics",
      "File Recovery",
      "Timeline Analysis",
      "Registry Analysis",
      "Report Writing",
    ],
    tags: ["forensics", "disk", "investigation", "evidence"],
  },
];

// ============================================
// CLOUD SECURITY LABS
// ============================================

export const CLOUD_SECURITY_LABS: LabEnvironmentDefinition[] = [
  {
    id: "lab-cloud-security-audit",
    name: "Cloud Security Configuration Lab",
    description: "Identify and remediate cloud security misconfigurations",
    longDescription: `This lab simulates a real AWS/Azure environment with intentional security misconfigurations. Your task is to audit the environment, identify security issues, and implement proper security controls.

Common misconfigurations covered:
- Public S3 buckets
- Overly permissive IAM policies
- Unencrypted storage
- Open security groups
- Missing logging
- Exposed secrets

You will learn to:
- Audit cloud configurations
- Use cloud security tools
- Implement security best practices
- Write remediation guidance`,
    icon: "cloud",
    labType: LabType.CLOUD,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    prerequisites: ["cloud-security-fundamentals"],
    estimatedDuration: 120,
    maxConcurrentUsers: 40,
    sessionTimeout: 180,
    objectives: [
      {
        id: "obj-cloud-1",
        title: "S3 Bucket Audit",
        description: "Identify publicly accessible S3 buckets",
        points: 150,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Submit the name of the public bucket containing secrets",
        hints: [
          "Use AWS CLI to list bucket policies",
          "Check ACLs and bucket policies",
          "Look for sensitive data",
        ],
      },
      {
        id: "obj-cloud-2",
        title: "IAM Policy Review",
        description: "Find overly permissive IAM policies",
        points: 200,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Identify the role with admin access",
        hints: [
          "Review IAM policies",
          "Check for wildcards",
          "Look for attached managed policies",
        ],
      },
      {
        id: "obj-cloud-3",
        title: "Security Group Analysis",
        description: "Identify insecure security group configurations",
        points: 150,
        required: true,
        validationMethod: "flag",
        validationCriteria: "Find the security group allowing 0.0.0.0/0 on RDP",
        hints: [
          "Review all security groups",
          "Check inbound rules",
          "Look for overly permissive rules",
        ],
      },
      {
        id: "obj-cloud-4",
        title: "Remediation Plan",
        description: "Create a prioritized remediation plan",
        points: 200,
        required: false,
        validationMethod: "file",
        validationCriteria: "Submit remediation plan document",
        hints: [
          "Prioritize by risk",
          "Include specific commands",
          "Consider business impact",
        ],
      },
    ],
    tools: [
      {
        name: "AWS CLI",
        description: "AWS command line interface",
        category: "Cloud",
        preInstalled: true,
      },
      {
        name: "ScoutSuite",
        description: "Multi-cloud security auditing tool",
        category: "Auditing",
        preInstalled: true,
      },
      {
        name: "Prowler",
        description: "AWS security best practices assessment",
        category: "Auditing",
        preInstalled: true,
      },
      {
        name: "CloudSploit",
        description: "Cloud security configuration scanner",
        category: "Scanning",
        preInstalled: true,
      },
    ],
    resources: [
      {
        type: "vm",
        name: "cloud-audit-workstation",
        description: "Workstation with cloud tools",
        image: "cybershield/cloud-auditor:latest",
        credentials: {
          username: "auditor",
          password: "CloudAudit123!",
        },
      },
      {
        type: "service",
        name: "localstack",
        description: "Simulated AWS environment",
        ports: [4566],
      },
    ],
    hints: [
      "Start with automated scanning",
      "Manually verify critical findings",
      "Document all issues with evidence",
    ],
    architecture: {
      networks: [
        {
          name: "Cloud Lab",
          subnet: "10.100.0.0/16",
          description: "Simulated cloud network",
        },
      ],
      hosts: [
        {
          name: "workstation",
          ip: "10.100.0.10",
          os: "Linux",
          role: "Audit Workstation",
          services: [],
        },
        {
          name: "localstack",
          ip: "10.100.0.100",
          os: "Linux",
          role: "AWS Simulator",
          services: ["LocalStack"],
        },
      ],
    },
    skills: [
      "Cloud Security",
      "AWS Security",
      "Configuration Auditing",
      "Security Remediation",
    ],
    tags: ["cloud", "aws", "azure", "configuration", "audit"],
  },
];

// ============================================
// ALL LABS AGGREGATION
// ============================================

export const ALL_LAB_ENVIRONMENTS: LabEnvironmentDefinition[] = [
  ...NETWORK_SECURITY_LABS,
  ...MALWARE_ANALYSIS_LABS,
  ...WEB_APPLICATION_LABS,
  ...FORENSICS_LABS,
  ...CLOUD_SECURITY_LABS,
];

export function getLabById(id: string): LabEnvironmentDefinition | undefined {
  return ALL_LAB_ENVIRONMENTS.find((lab) => lab.id === id);
}

export function getLabsByType(type: LabType): LabEnvironmentDefinition[] {
  return ALL_LAB_ENVIRONMENTS.filter((lab) => lab.labType === type);
}

export function getLabsByDifficulty(difficulty: DifficultyLevel): LabEnvironmentDefinition[] {
  return ALL_LAB_ENVIRONMENTS.filter((lab) => lab.difficulty === difficulty);
}

export function getAvailableLabs(
  clearance: ClearanceLevel,
  completedPrereqs: string[]
): LabEnvironmentDefinition[] {
  const clearanceLevels: ClearanceLevel[] = [
    ClearanceLevel.UNCLASSIFIED,
    ClearanceLevel.CONFIDENTIAL,
    ClearanceLevel.SECRET,
    ClearanceLevel.TOP_SECRET,
    ClearanceLevel.TOP_SECRET_SCI,
  ];
  const userLevel = clearanceLevels.indexOf(clearance);

  return ALL_LAB_ENVIRONMENTS.filter((lab) => {
    const labLevel = clearanceLevels.indexOf(lab.clearanceRequired);
    if (labLevel > userLevel) return false;

    return lab.prerequisites.every((prereq) => completedPrereqs.includes(prereq));
  });
}

export function calculateLabScore(
  completedObjectives: string[],
  lab: LabEnvironmentDefinition
): { score: number; maxScore: number; percentage: number } {
  const maxScore = lab.objectives.reduce((sum, obj) => sum + obj.points, 0);
  const score = lab.objectives
    .filter((obj) => completedObjectives.includes(obj.id))
    .reduce((sum, obj) => sum + obj.points, 0);

  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
  };
}
