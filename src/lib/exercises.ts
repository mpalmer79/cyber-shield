/**
 * Cyber Shield Enterprise Exercise Framework
 * Red Team / Blue Team / Purple Team Training Exercises
 */

import {
  ExerciseType,
  ExerciseStatus,
  ExerciseRole,
  DifficultyLevel,
  ClearanceLevel,
} from "@prisma/client";

// ============================================
// EXERCISE DEFINITIONS
// ============================================

export interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  exerciseType: ExerciseType;
  difficulty: DifficultyLevel;
  clearanceRequired: ClearanceLevel;
  duration: {
    min: number; // hours
    max: number;
    recommended: number;
  };
  participants: {
    min: number;
    max: number;
    recommended: number;
  };
  roles: ExerciseRoleDefinition[];
  phases: ExercisePhase[];
  objectives: ExerciseObjective[];
  injects: InjectTemplate[];
  scoringCriteria: ScoringCriteria[];
  prerequisites: string[];
  resources: string[];
  tags: string[];
}

export interface ExerciseRoleDefinition {
  role: ExerciseRole;
  team: "red" | "blue" | "purple" | "white" | "observer";
  title: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  minCount: number;
  maxCount: number;
}

export interface ExercisePhase {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  objectives: string[];
  activities: {
    redTeam?: string[];
    blueTeam?: string[];
    whiteTeam?: string[];
  };
}

export interface ExerciseObjective {
  id: string;
  name: string;
  description: string;
  team: "red" | "blue" | "both";
  type: "primary" | "secondary" | "bonus";
  points: number;
  criteria: string[];
}

export interface InjectTemplate {
  id: string;
  name: string;
  description: string;
  phase: string;
  triggerType: "time" | "event" | "manual";
  triggerCondition?: string;
  content: string;
  targetTeam: "red" | "blue" | "both" | "all";
  expectedResponse: string;
  hints?: string[];
}

export interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  rubric: {
    points: number;
    criteria: string;
  }[];
}

// ============================================
// RED TEAM EXERCISE TEMPLATES
// ============================================

export const RED_TEAM_EXERCISES: ExerciseTemplate[] = [
  {
    id: "rt-apt-simulation",
    name: "APT Intrusion Simulation",
    description:
      "Simulate an Advanced Persistent Threat intrusion against enterprise infrastructure",
    exerciseType: ExerciseType.LIVE_FIRE,
    difficulty: DifficultyLevel.EXPERT,
    clearanceRequired: ClearanceLevel.TOP_SECRET,
    duration: { min: 24, max: 72, recommended: 48 },
    participants: { min: 8, max: 30, recommended: 15 },
    roles: [
      {
        role: ExerciseRole.TEAM_LEAD,
        team: "red",
        title: "Red Team Lead",
        description: "Lead the red team offensive operations",
        responsibilities: [
          "Develop attack strategy",
          "Coordinate team activities",
          "Ensure rules of engagement compliance",
          "Brief white team on progress",
        ],
        requiredSkills: [
          "Penetration Testing",
          "Team Leadership",
          "Offensive Security",
        ],
        minCount: 1,
        maxCount: 1,
      },
      {
        role: ExerciseRole.PARTICIPANT,
        team: "red",
        title: "Red Team Operator",
        description: "Execute offensive operations against target systems",
        responsibilities: [
          "Conduct reconnaissance",
          "Exploit vulnerabilities",
          "Establish persistence",
          "Move laterally",
          "Achieve objectives",
        ],
        requiredSkills: [
          "Penetration Testing",
          "Exploitation",
          "Post-Exploitation",
        ],
        minCount: 2,
        maxCount: 8,
      },
      {
        role: ExerciseRole.FACILITATOR,
        team: "white",
        title: "Exercise Controller",
        description: "Manage exercise flow and inject scenarios",
        responsibilities: [
          "Control exercise timeline",
          "Inject scenarios",
          "Arbitrate disputes",
          "Track scoring",
        ],
        requiredSkills: ["Exercise Management", "Cybersecurity Knowledge"],
        minCount: 1,
        maxCount: 2,
      },
      {
        role: ExerciseRole.OBSERVER,
        team: "observer",
        title: "Exercise Observer",
        description: "Observe and document exercise activities",
        responsibilities: [
          "Document activities",
          "Take notes for lessons learned",
          "Observe without interfering",
        ],
        requiredSkills: ["Documentation", "Observation"],
        minCount: 0,
        maxCount: 5,
      },
    ],
    phases: [
      {
        id: "recon",
        name: "Reconnaissance",
        description: "Initial intelligence gathering and target profiling",
        durationMinutes: 240,
        objectives: ["Identify attack surface", "Map network topology", "Gather credentials"],
        activities: {
          redTeam: [
            "Conduct OSINT",
            "Perform network scanning",
            "Identify vulnerabilities",
            "Profile targets",
          ],
          whiteTeam: ["Monitor red team progress", "Document activities"],
        },
      },
      {
        id: "initial-access",
        name: "Initial Access",
        description: "Gain initial foothold in target environment",
        durationMinutes: 360,
        objectives: ["Achieve initial access", "Establish C2 communication"],
        activities: {
          redTeam: [
            "Execute initial exploit",
            "Deploy implant",
            "Establish C2 channel",
            "Conduct initial enumeration",
          ],
          whiteTeam: ["Track access attempts", "Document successful breaches"],
        },
      },
      {
        id: "persistence",
        name: "Persistence & Privilege Escalation",
        description: "Establish persistence and escalate privileges",
        durationMinutes: 480,
        objectives: [
          "Establish multiple persistence mechanisms",
          "Escalate to domain admin",
        ],
        activities: {
          redTeam: [
            "Deploy persistence mechanisms",
            "Escalate privileges",
            "Dump credentials",
            "Prepare for lateral movement",
          ],
          whiteTeam: ["Document persistence techniques", "Track privilege escalation"],
        },
      },
      {
        id: "lateral-movement",
        name: "Lateral Movement",
        description: "Move through the network to reach objectives",
        durationMinutes: 480,
        objectives: ["Access critical systems", "Reach target data"],
        activities: {
          redTeam: [
            "Move laterally using gathered credentials",
            "Access target systems",
            "Maintain stealth",
            "Document accessed systems",
          ],
          whiteTeam: ["Track lateral movement", "Document accessed systems"],
        },
      },
      {
        id: "objective-completion",
        name: "Objective Completion",
        description: "Complete primary and secondary objectives",
        durationMinutes: 360,
        objectives: ["Exfiltrate target data", "Demonstrate impact"],
        activities: {
          redTeam: [
            "Access target data",
            "Exfiltrate data (simulated)",
            "Document access",
            "Prepare debrief",
          ],
          whiteTeam: ["Verify objective completion", "Prepare scoring"],
        },
      },
    ],
    objectives: [
      {
        id: "obj-initial-access",
        name: "Achieve Initial Access",
        description: "Successfully gain initial access to the target network",
        team: "red",
        type: "primary",
        points: 500,
        criteria: [
          "Establish foothold without triggering alerts",
          "Deploy functional C2 channel",
          "Maintain access for 30+ minutes",
        ],
      },
      {
        id: "obj-domain-admin",
        name: "Domain Administrator Access",
        description: "Escalate privileges to domain administrator",
        team: "red",
        type: "primary",
        points: 750,
        criteria: [
          "Obtain domain admin credentials",
          "Access domain controller",
          "Demonstrate admin capabilities",
        ],
      },
      {
        id: "obj-data-access",
        name: "Access Sensitive Data",
        description: "Access and exfiltrate target sensitive data",
        team: "red",
        type: "primary",
        points: 1000,
        criteria: [
          "Locate target data",
          "Demonstrate read access",
          "Simulate exfiltration",
        ],
      },
      {
        id: "obj-stealth",
        name: "Maintain Operational Security",
        description: "Complete objectives without detection",
        team: "red",
        type: "secondary",
        points: 500,
        criteria: [
          "Avoid triggering security alerts",
          "Use encrypted communications",
          "Clean up artifacts",
        ],
      },
    ],
    injects: [
      {
        id: "inject-patch-tuesday",
        name: "Emergency Patch Deployment",
        description: "Target organization deploys emergency patches",
        phase: "persistence",
        triggerType: "time",
        triggerCondition: "2 hours into persistence phase",
        content:
          "The target organization has begun deploying emergency patches to critical systems. Some of your access methods may be affected.",
        targetTeam: "red",
        expectedResponse: "Adapt attack strategy, establish backup persistence",
        hints: ["Consider alternative persistence locations", "Focus on unpatched systems"],
      },
      {
        id: "inject-new-intel",
        name: "New Intelligence Available",
        description: "Additional target intelligence becomes available",
        phase: "recon",
        triggerType: "event",
        triggerCondition: "When red team completes initial scanning",
        content:
          "Human intelligence source has provided credentials for a service account: svc_backup (password in separate communication).",
        targetTeam: "red",
        expectedResponse: "Incorporate new intelligence into attack plan",
      },
    ],
    scoringCriteria: [
      {
        id: "score-objectives",
        name: "Objective Completion",
        description: "Points awarded for completing exercise objectives",
        maxPoints: 2750,
        rubric: [
          { points: 500, criteria: "Initial access achieved" },
          { points: 750, criteria: "Domain admin access obtained" },
          { points: 1000, criteria: "Target data accessed" },
          { points: 500, criteria: "Maintained operational security" },
        ],
      },
      {
        id: "score-technique",
        name: "Technical Proficiency",
        description: "Quality of technical execution",
        maxPoints: 500,
        rubric: [
          { points: 100, criteria: "Excellent reconnaissance coverage" },
          { points: 150, criteria: "Creative exploitation techniques" },
          { points: 150, criteria: "Effective lateral movement" },
          { points: 100, criteria: "Clean artifact handling" },
        ],
      },
      {
        id: "score-documentation",
        name: "Documentation Quality",
        description: "Quality of operation documentation",
        maxPoints: 250,
        rubric: [
          { points: 100, criteria: "Complete attack timeline" },
          { points: 100, criteria: "Detailed technique documentation" },
          { points: 50, criteria: "Screenshots and evidence" },
        ],
      },
    ],
    prerequisites: [
      "cs-penetration-tester",
      "offensive-security-fundamentals",
      "advanced-incident-handling",
    ],
    resources: [
      "Kali Linux VMs",
      "C2 Framework (Cobalt Strike/Mythic)",
      "Custom implants",
      "Network access",
    ],
    tags: ["apt", "red-team", "live-fire", "advanced", "offensive"],
  },
];

// ============================================
// BLUE TEAM EXERCISE TEMPLATES
// ============================================

export const BLUE_TEAM_EXERCISES: ExerciseTemplate[] = [
  {
    id: "bt-incident-response",
    name: "Enterprise Incident Response Drill",
    description:
      "Defend against a simulated cyber attack and practice incident response procedures",
    exerciseType: ExerciseType.SIMULATION,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.SECRET,
    duration: { min: 8, max: 24, recommended: 12 },
    participants: { min: 6, max: 20, recommended: 12 },
    roles: [
      {
        role: ExerciseRole.TEAM_LEAD,
        team: "blue",
        title: "Incident Commander",
        description: "Lead the incident response effort",
        responsibilities: [
          "Coordinate response activities",
          "Make containment decisions",
          "Communicate with leadership",
          "Manage resources",
        ],
        requiredSkills: ["Incident Response", "Team Leadership", "Crisis Management"],
        minCount: 1,
        maxCount: 1,
      },
      {
        role: ExerciseRole.PARTICIPANT,
        team: "blue",
        title: "SOC Analyst",
        description: "Monitor and analyze security events",
        responsibilities: [
          "Monitor SIEM alerts",
          "Investigate suspicious activity",
          "Document findings",
          "Escalate incidents",
        ],
        requiredSkills: ["SIEM Operation", "Log Analysis", "Threat Detection"],
        minCount: 2,
        maxCount: 6,
      },
      {
        role: ExerciseRole.PARTICIPANT,
        team: "blue",
        title: "Incident Responder",
        description: "Execute containment and remediation actions",
        responsibilities: [
          "Contain threats",
          "Perform forensic collection",
          "Execute remediation",
          "Support recovery",
        ],
        requiredSkills: ["Incident Response", "Forensics", "System Administration"],
        minCount: 2,
        maxCount: 4,
      },
      {
        role: ExerciseRole.FACILITATOR,
        team: "white",
        title: "Exercise Controller",
        description: "Manage exercise flow and simulate attacker activity",
        responsibilities: [
          "Execute attack simulation",
          "Inject scenarios",
          "Track blue team response",
          "Score activities",
        ],
        requiredSkills: ["Red Team Knowledge", "Exercise Management"],
        minCount: 1,
        maxCount: 2,
      },
    ],
    phases: [
      {
        id: "initial-detection",
        name: "Initial Detection",
        description: "Detect the initial indicators of compromise",
        durationMinutes: 120,
        objectives: ["Identify anomalous activity", "Create initial incident ticket"],
        activities: {
          blueTeam: [
            "Monitor security dashboards",
            "Investigate initial alerts",
            "Correlate events",
            "Document initial findings",
          ],
          whiteTeam: ["Simulate initial attack activity", "Monitor blue team detection"],
        },
      },
      {
        id: "investigation",
        name: "Investigation",
        description: "Investigate the scope and nature of the incident",
        durationMinutes: 180,
        objectives: [
          "Determine attack scope",
          "Identify affected systems",
          "Understand attacker TTPs",
        ],
        activities: {
          blueTeam: [
            "Analyze logs across systems",
            "Perform host forensics",
            "Map attacker activity",
            "Update incident documentation",
          ],
          whiteTeam: ["Continue attack simulation", "Inject additional indicators"],
        },
      },
      {
        id: "containment",
        name: "Containment",
        description: "Contain the threat and prevent further damage",
        durationMinutes: 120,
        objectives: ["Isolate affected systems", "Block attacker access"],
        activities: {
          blueTeam: [
            "Isolate compromised systems",
            "Block malicious IPs/domains",
            "Reset compromised credentials",
            "Deploy emergency patches",
          ],
          whiteTeam: ["Simulate attacker response to containment", "Track containment effectiveness"],
        },
      },
      {
        id: "eradication",
        name: "Eradication",
        description: "Remove all attacker presence from the environment",
        durationMinutes: 120,
        objectives: ["Remove all malware", "Eliminate persistence mechanisms"],
        activities: {
          blueTeam: [
            "Remove malware and implants",
            "Clean persistence mechanisms",
            "Verify eradication",
            "Document remediation",
          ],
          whiteTeam: ["Verify eradication completeness", "Attempt re-access (simulated)"],
        },
      },
      {
        id: "recovery",
        name: "Recovery",
        description: "Restore systems and return to normal operations",
        durationMinutes: 90,
        objectives: ["Restore affected systems", "Verify security posture"],
        activities: {
          blueTeam: [
            "Restore from clean backups",
            "Rebuild compromised systems",
            "Verify system integrity",
            "Resume normal monitoring",
          ],
          whiteTeam: ["Verify recovery completion", "Prepare exercise closeout"],
        },
      },
    ],
    objectives: [
      {
        id: "obj-detect",
        name: "Timely Detection",
        description: "Detect the attack within acceptable timeframe",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: [
          "Initial detection within 30 minutes",
          "Accurate initial classification",
          "Proper escalation procedures",
        ],
      },
      {
        id: "obj-investigate",
        name: "Thorough Investigation",
        description: "Conduct comprehensive investigation",
        team: "blue",
        type: "primary",
        points: 600,
        criteria: [
          "Identify all compromised systems",
          "Map complete attack timeline",
          "Identify all attacker techniques",
        ],
      },
      {
        id: "obj-contain",
        name: "Effective Containment",
        description: "Successfully contain the threat",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: [
          "Stop lateral movement",
          "Prevent data exfiltration",
          "Minimize business impact",
        ],
      },
      {
        id: "obj-eradicate",
        name: "Complete Eradication",
        description: "Remove all attacker presence",
        team: "blue",
        type: "primary",
        points: 400,
        criteria: [
          "Remove all malware",
          "Eliminate all persistence",
          "Verify clean state",
        ],
      },
      {
        id: "obj-communicate",
        name: "Effective Communication",
        description: "Maintain clear communication throughout",
        team: "blue",
        type: "secondary",
        points: 300,
        criteria: [
          "Regular status updates",
          "Clear technical documentation",
          "Appropriate stakeholder communication",
        ],
      },
    ],
    injects: [
      {
        id: "inject-ceo-call",
        name: "Executive Inquiry",
        description: "CEO calls for immediate status update",
        phase: "investigation",
        triggerType: "time",
        triggerCondition: "1 hour into investigation",
        content:
          "The CEO has called an emergency meeting and needs a 5-minute briefing on the incident status in 15 minutes.",
        targetTeam: "blue",
        expectedResponse: "Prepare executive briefing while continuing investigation",
        hints: ["Focus on business impact", "Keep technical details high-level"],
      },
      {
        id: "inject-media-inquiry",
        name: "Media Inquiry",
        description: "Press has learned of potential breach",
        phase: "containment",
        triggerType: "time",
        triggerCondition: "During containment phase",
        content:
          "A reporter has contacted the organization asking about a 'cybersecurity incident'. PR team needs technical guidance for response.",
        targetTeam: "blue",
        expectedResponse: "Coordinate with PR on appropriate response",
      },
      {
        id: "inject-second-vector",
        name: "Second Attack Vector",
        description: "Attacker uses backup access method",
        phase: "containment",
        triggerType: "event",
        triggerCondition: "When blue team blocks primary C2",
        content:
          "New alerts detected: Suspicious PowerShell activity on previously clean systems. Attacker may have alternate access.",
        targetTeam: "blue",
        expectedResponse: "Investigate new activity, expand containment scope",
      },
    ],
    scoringCriteria: [
      {
        id: "score-detection",
        name: "Detection Speed & Accuracy",
        description: "How quickly and accurately the attack was detected",
        maxPoints: 500,
        rubric: [
          { points: 200, criteria: "Detection within 15 minutes" },
          { points: 150, criteria: "Detection within 30 minutes" },
          { points: 100, criteria: "Detection within 60 minutes" },
          { points: 50, criteria: "Detection after 60 minutes" },
        ],
      },
      {
        id: "score-investigation",
        name: "Investigation Quality",
        description: "Thoroughness and accuracy of investigation",
        maxPoints: 600,
        rubric: [
          { points: 200, criteria: "All compromised systems identified" },
          { points: 200, criteria: "Complete attack timeline documented" },
          { points: 200, criteria: "All TTPs correctly identified" },
        ],
      },
      {
        id: "score-containment",
        name: "Containment Effectiveness",
        description: "Success of containment measures",
        maxPoints: 500,
        rubric: [
          { points: 200, criteria: "Lateral movement stopped" },
          { points: 200, criteria: "No data exfiltration after containment" },
          { points: 100, criteria: "Minimal business disruption" },
        ],
      },
      {
        id: "score-communication",
        name: "Communication & Documentation",
        description: "Quality of communication and documentation",
        maxPoints: 400,
        rubric: [
          { points: 150, criteria: "Clear status updates throughout" },
          { points: 150, criteria: "Complete incident documentation" },
          { points: 100, criteria: "Appropriate executive communication" },
        ],
      },
    ],
    prerequisites: ["incident-response-fundamentals", "siem-splunk-mastery"],
    resources: [
      "SIEM access",
      "EDR console",
      "Forensic workstations",
      "Incident management system",
    ],
    tags: ["incident-response", "blue-team", "defense", "simulation"],
  },
];

// ============================================
// PURPLE TEAM EXERCISE TEMPLATES
// ============================================

export const PURPLE_TEAM_EXERCISES: ExerciseTemplate[] = [
  {
    id: "pt-collaborative-defense",
    name: "Purple Team Collaborative Defense",
    description:
      "Red and Blue teams work together to identify gaps and improve defenses in real-time",
    exerciseType: ExerciseType.PURPLE_TEAM,
    difficulty: DifficultyLevel.ADVANCED,
    clearanceRequired: ClearanceLevel.SECRET,
    duration: { min: 8, max: 16, recommended: 12 },
    participants: { min: 8, max: 20, recommended: 12 },
    roles: [
      {
        role: ExerciseRole.TEAM_LEAD,
        team: "purple",
        title: "Purple Team Lead",
        description: "Coordinate red and blue team collaboration",
        responsibilities: [
          "Facilitate collaboration",
          "Guide technique selection",
          "Track detection gaps",
          "Document improvements",
        ],
        requiredSkills: ["Red Team", "Blue Team", "Facilitation"],
        minCount: 1,
        maxCount: 1,
      },
      {
        role: ExerciseRole.PARTICIPANT,
        team: "red",
        title: "Red Team Operator",
        description: "Execute attack techniques for detection validation",
        responsibilities: [
          "Execute ATT&CK techniques",
          "Explain methodology",
          "Suggest evasion variants",
          "Document execution details",
        ],
        requiredSkills: ["Penetration Testing", "ATT&CK Framework"],
        minCount: 2,
        maxCount: 4,
      },
      {
        role: ExerciseRole.PARTICIPANT,
        team: "blue",
        title: "Detection Engineer",
        description: "Develop and tune detection capabilities",
        responsibilities: [
          "Monitor for attack execution",
          "Tune detection rules",
          "Develop new detections",
          "Document detection gaps",
        ],
        requiredSkills: ["Detection Engineering", "SIEM", "Threat Hunting"],
        minCount: 2,
        maxCount: 4,
      },
    ],
    phases: [
      {
        id: "technique-selection",
        name: "Technique Selection",
        description: "Select ATT&CK techniques to validate",
        durationMinutes: 60,
        objectives: ["Select priority techniques", "Review current detection coverage"],
        activities: {
          redTeam: ["Propose technique variants"],
          blueTeam: ["Review current detection rules", "Identify coverage gaps"],
        },
      },
      {
        id: "execution-validation",
        name: "Execution & Validation",
        description: "Execute techniques and validate detection",
        durationMinutes: 360,
        objectives: ["Execute all selected techniques", "Validate detection coverage"],
        activities: {
          redTeam: ["Execute techniques", "Document execution", "Try evasion variants"],
          blueTeam: ["Monitor for detections", "Document detection gaps", "Begin tuning"],
        },
      },
      {
        id: "detection-engineering",
        name: "Detection Engineering",
        description: "Develop and improve detections based on findings",
        durationMinutes: 180,
        objectives: ["Create new detection rules", "Tune existing rules"],
        activities: {
          redTeam: ["Validate new detections", "Test evasion attempts"],
          blueTeam: ["Develop new rules", "Tune existing rules", "Document changes"],
        },
      },
      {
        id: "validation-retest",
        name: "Validation Retest",
        description: "Retest techniques against improved detections",
        durationMinutes: 120,
        objectives: ["Confirm detection improvements", "Identify remaining gaps"],
        activities: {
          redTeam: ["Re-execute techniques", "Attempt evasion"],
          blueTeam: ["Validate new detections", "Document improvements"],
        },
      },
    ],
    objectives: [
      {
        id: "obj-coverage",
        name: "Improve Detection Coverage",
        description: "Improve ATT&CK technique detection coverage",
        team: "both",
        type: "primary",
        points: 1000,
        criteria: [
          "Test minimum 20 techniques",
          "Achieve 80% detection rate",
          "Document all coverage gaps",
        ],
      },
      {
        id: "obj-new-rules",
        name: "Create New Detections",
        description: "Develop new detection rules",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: [
          "Create minimum 5 new rules",
          "All rules validated by red team",
          "Rules documented",
        ],
      },
      {
        id: "obj-evasion",
        name: "Test Evasion Techniques",
        description: "Test detection resilience against evasion",
        team: "red",
        type: "secondary",
        points: 300,
        criteria: [
          "Test evasion variants",
          "Document successful evasions",
          "Provide remediation guidance",
        ],
      },
    ],
    injects: [],
    scoringCriteria: [
      {
        id: "score-coverage",
        name: "Detection Coverage Improvement",
        description: "Improvement in ATT&CK detection coverage",
        maxPoints: 500,
        rubric: [
          { points: 200, criteria: "20%+ coverage improvement" },
          { points: 150, criteria: "15-20% coverage improvement" },
          { points: 100, criteria: "10-15% coverage improvement" },
          { points: 50, criteria: "5-10% coverage improvement" },
        ],
      },
      {
        id: "score-collaboration",
        name: "Team Collaboration",
        description: "Quality of red-blue collaboration",
        maxPoints: 300,
        rubric: [
          { points: 150, criteria: "Excellent knowledge transfer" },
          { points: 100, criteria: "Good collaboration" },
          { points: 50, criteria: "Basic collaboration" },
        ],
      },
    ],
    prerequisites: ["threat-hunting-fundamentals", "mitre-attack-deep-dive"],
    resources: ["ATT&CK Navigator", "SIEM access", "EDR console", "Attack simulation tools"],
    tags: ["purple-team", "detection-engineering", "collaboration", "attack-simulation"],
  },
];

// ============================================
// TABLETOP EXERCISE TEMPLATES
// ============================================

export const TABLETOP_EXERCISES: ExerciseTemplate[] = [
  {
    id: "tt-ransomware-response",
    name: "Ransomware Crisis Tabletop",
    description: "Executive-level tabletop exercise simulating a major ransomware incident",
    exerciseType: ExerciseType.TABLETOP,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    duration: { min: 2, max: 4, recommended: 3 },
    participants: { min: 8, max: 25, recommended: 15 },
    roles: [
      {
        role: ExerciseRole.FACILITATOR,
        team: "white",
        title: "Exercise Facilitator",
        description: "Lead the tabletop discussion",
        responsibilities: [
          "Present scenarios",
          "Guide discussion",
          "Track decisions",
          "Manage time",
        ],
        requiredSkills: ["Facilitation", "Incident Response Knowledge"],
        minCount: 1,
        maxCount: 1,
      },
      {
        role: ExerciseRole.PARTICIPANT,
        team: "blue",
        title: "Crisis Team Member",
        description: "Participate in crisis decision-making",
        responsibilities: [
          "Make decisions for role",
          "Coordinate with other roles",
          "Follow playbooks",
          "Document decisions",
        ],
        requiredSkills: ["Incident Response", "Decision Making"],
        minCount: 6,
        maxCount: 20,
      },
      {
        role: ExerciseRole.OBSERVER,
        team: "observer",
        title: "Exercise Observer",
        description: "Observe and take notes",
        responsibilities: ["Document observations", "Note gaps", "Prepare feedback"],
        requiredSkills: ["Documentation"],
        minCount: 1,
        maxCount: 4,
      },
    ],
    phases: [
      {
        id: "scenario-intro",
        name: "Scenario Introduction",
        description: "Present the initial ransomware scenario",
        durationMinutes: 15,
        objectives: ["Understand scenario context"],
        activities: {
          blueTeam: ["Review scenario", "Ask clarifying questions"],
          whiteTeam: ["Present scenario", "Set expectations"],
        },
      },
      {
        id: "initial-response",
        name: "Initial Response Discussion",
        description: "Discuss initial response actions",
        durationMinutes: 45,
        objectives: ["Determine initial actions", "Identify key decisions"],
        activities: {
          blueTeam: [
            "Discuss detection",
            "Determine initial containment",
            "Plan communication",
          ],
          whiteTeam: ["Guide discussion", "Inject complications"],
        },
      },
      {
        id: "crisis-escalation",
        name: "Crisis Escalation",
        description: "Handle escalating crisis elements",
        durationMinutes: 60,
        objectives: ["Handle escalation", "Make critical decisions"],
        activities: {
          blueTeam: [
            "Address media inquiries",
            "Discuss ransom decision",
            "Plan stakeholder communication",
          ],
          whiteTeam: ["Inject media scenario", "Present ransom demand", "Escalate pressure"],
        },
      },
      {
        id: "recovery-planning",
        name: "Recovery Planning",
        description: "Plan recovery and restoration",
        durationMinutes: 45,
        objectives: ["Plan recovery", "Determine priorities"],
        activities: {
          blueTeam: [
            "Prioritize recovery",
            "Plan communication",
            "Address lessons learned",
          ],
          whiteTeam: ["Guide recovery discussion", "Present restoration challenges"],
        },
      },
      {
        id: "hot-wash",
        name: "Hot Wash",
        description: "Immediate lessons learned discussion",
        durationMinutes: 30,
        objectives: ["Identify gaps", "Document improvements"],
        activities: {
          blueTeam: ["Share observations", "Identify gaps", "Suggest improvements"],
          whiteTeam: ["Facilitate discussion", "Document findings"],
        },
      },
    ],
    objectives: [
      {
        id: "obj-decision",
        name: "Decision-Making Quality",
        description: "Make sound decisions under pressure",
        team: "blue",
        type: "primary",
        points: 400,
        criteria: [
          "Decisions aligned with policy",
          "Appropriate stakeholder involvement",
          "Consider business impact",
        ],
      },
      {
        id: "obj-coordination",
        name: "Team Coordination",
        description: "Demonstrate effective coordination",
        team: "blue",
        type: "primary",
        points: 300,
        criteria: [
          "Clear role understanding",
          "Effective communication",
          "No conflicting actions",
        ],
      },
      {
        id: "obj-gaps",
        name: "Gap Identification",
        description: "Identify process and capability gaps",
        team: "blue",
        type: "secondary",
        points: 300,
        criteria: [
          "Identify policy gaps",
          "Identify capability gaps",
          "Suggest improvements",
        ],
      },
    ],
    injects: [
      {
        id: "inject-ransom",
        name: "Ransom Demand",
        description: "Attackers demand ransom payment",
        phase: "crisis-escalation",
        triggerType: "time",
        triggerCondition: "15 minutes into escalation",
        content:
          "The attackers have demanded $5 million in Bitcoin within 48 hours or they will publish sensitive customer data. The ransom note includes samples of customer records.",
        targetTeam: "blue",
        expectedResponse: "Discuss payment decision, involve legal and leadership",
        hints: [
          "Consider legal implications",
          "Evaluate backup options",
          "Assess data sensitivity",
        ],
      },
      {
        id: "inject-media",
        name: "Media Coverage",
        description: "Major news outlet reports on breach",
        phase: "crisis-escalation",
        triggerType: "time",
        triggerCondition: "30 minutes into escalation",
        content:
          "Breaking News: Major news outlet is reporting that your organization has suffered a significant data breach. Your stock price has dropped 5% in the last hour.",
        targetTeam: "blue",
        expectedResponse: "Coordinate PR response, prepare public statement",
      },
    ],
    scoringCriteria: [
      {
        id: "score-process",
        name: "Process Adherence",
        description: "Following established procedures",
        maxPoints: 300,
        rubric: [
          { points: 150, criteria: "Playbook followed correctly" },
          { points: 100, criteria: "Some deviation with justification" },
          { points: 50, criteria: "Significant deviation" },
        ],
      },
      {
        id: "score-communication",
        name: "Communication Effectiveness",
        description: "Quality of internal and external communication",
        maxPoints: 300,
        rubric: [
          { points: 150, criteria: "Clear, consistent messaging" },
          { points: 100, criteria: "Generally good communication" },
          { points: 50, criteria: "Communication issues identified" },
        ],
      },
    ],
    prerequisites: ["incident-response-fundamentals"],
    resources: [
      "IR playbooks",
      "Communication templates",
      "Decision matrices",
      "Scenario materials",
    ],
    tags: ["tabletop", "ransomware", "crisis-management", "executive"],
  },
];

// ============================================
// CTF EXERCISE TEMPLATES
// ============================================

export const CTF_EXERCISES: ExerciseTemplate[] = [
  {
    id: "ctf-security-challenge",
    name: "Enterprise Security CTF",
    description: "Capture The Flag competition covering various security domains",
    exerciseType: ExerciseType.CTF,
    difficulty: DifficultyLevel.INTERMEDIATE,
    clearanceRequired: ClearanceLevel.CONFIDENTIAL,
    duration: { min: 4, max: 8, recommended: 6 },
    participants: { min: 4, max: 50, recommended: 20 },
    roles: [
      {
        role: ExerciseRole.PARTICIPANT,
        team: "blue",
        title: "CTF Participant",
        description: "Solve challenges to capture flags",
        responsibilities: [
          "Solve challenges",
          "Submit flags",
          "Collaborate with team",
          "Track time",
        ],
        requiredSkills: ["Security Knowledge", "Problem Solving"],
        minCount: 4,
        maxCount: 50,
      },
      {
        role: ExerciseRole.FACILITATOR,
        team: "white",
        title: "CTF Administrator",
        description: "Manage CTF platform and support",
        responsibilities: [
          "Manage platform",
          "Handle technical issues",
          "Release hints",
          "Track scores",
        ],
        requiredSkills: ["CTF Management", "Technical Support"],
        minCount: 1,
        maxCount: 3,
      },
    ],
    phases: [
      {
        id: "ctf-warmup",
        name: "Warmup Round",
        description: "Easy challenges to get started",
        durationMinutes: 60,
        objectives: ["Solve warmup challenges", "Understand CTF format"],
        activities: {
          blueTeam: ["Solve beginner challenges", "Test flag submission"],
          whiteTeam: ["Monitor platform", "Provide support"],
        },
      },
      {
        id: "ctf-main",
        name: "Main Competition",
        description: "Full challenge set available",
        durationMinutes: 300,
        objectives: ["Solve as many challenges as possible", "Maximize points"],
        activities: {
          blueTeam: ["Solve challenges across categories", "Use hints strategically"],
          whiteTeam: ["Release scheduled hints", "Monitor for issues"],
        },
      },
      {
        id: "ctf-final",
        name: "Final Sprint",
        description: "Last push for points",
        durationMinutes: 60,
        objectives: ["Complete remaining challenges"],
        activities: {
          blueTeam: ["Focus on solvable challenges", "Final submissions"],
          whiteTeam: ["Prepare results", "Document winners"],
        },
      },
    ],
    objectives: [
      {
        id: "obj-web",
        name: "Web Security Challenges",
        description: "Complete web application security challenges",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: ["Solve SQL injection", "Solve XSS", "Solve authentication bypass"],
      },
      {
        id: "obj-forensics",
        name: "Forensics Challenges",
        description: "Complete digital forensics challenges",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: ["Analyze disk image", "Recover deleted files", "Analyze memory dump"],
      },
      {
        id: "obj-crypto",
        name: "Cryptography Challenges",
        description: "Complete cryptography challenges",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: ["Break weak encryption", "Analyze hash functions", "Decode messages"],
      },
      {
        id: "obj-network",
        name: "Network Security Challenges",
        description: "Complete network security challenges",
        team: "blue",
        type: "primary",
        points: 500,
        criteria: ["Analyze packet captures", "Identify network attacks", "Extract credentials"],
      },
    ],
    injects: [],
    scoringCriteria: [
      {
        id: "score-flags",
        name: "Flags Captured",
        description: "Points from captured flags",
        maxPoints: 2000,
        rubric: [
          { points: 100, criteria: "Easy challenge (100 pts each)" },
          { points: 200, criteria: "Medium challenge (200 pts each)" },
          { points: 300, criteria: "Hard challenge (300 pts each)" },
          { points: 500, criteria: "Expert challenge (500 pts each)" },
        ],
      },
      {
        id: "score-time",
        name: "First Blood Bonus",
        description: "Bonus for first solve",
        maxPoints: 200,
        rubric: [
          { points: 50, criteria: "First solve bonus per challenge" },
        ],
      },
    ],
    prerequisites: [],
    resources: ["CTF platform", "Challenge VMs", "Scoring system"],
    tags: ["ctf", "competition", "hands-on", "multi-domain"],
  },
];

// ============================================
// ALL EXERCISES AGGREGATION
// ============================================

export const ALL_EXERCISES: ExerciseTemplate[] = [
  ...RED_TEAM_EXERCISES,
  ...BLUE_TEAM_EXERCISES,
  ...PURPLE_TEAM_EXERCISES,
  ...TABLETOP_EXERCISES,
  ...CTF_EXERCISES,
];

export function getExerciseById(id: string): ExerciseTemplate | undefined {
  return ALL_EXERCISES.find((e) => e.id === id);
}

export function getExercisesByType(type: ExerciseType): ExerciseTemplate[] {
  return ALL_EXERCISES.filter((e) => e.exerciseType === type);
}

export function getExercisesByDifficulty(difficulty: DifficultyLevel): ExerciseTemplate[] {
  return ALL_EXERCISES.filter((e) => e.difficulty === difficulty);
}

export function getAvailableExercises(
  clearance: ClearanceLevel,
  completedPrereqs: string[]
): ExerciseTemplate[] {
  const clearanceLevels: ClearanceLevel[] = [
    ClearanceLevel.UNCLASSIFIED,
    ClearanceLevel.CONFIDENTIAL,
    ClearanceLevel.SECRET,
    ClearanceLevel.TOP_SECRET,
    ClearanceLevel.TOP_SECRET_SCI,
  ];
  const userLevel = clearanceLevels.indexOf(clearance);

  return ALL_EXERCISES.filter((exercise) => {
    const exerciseLevel = clearanceLevels.indexOf(exercise.clearanceRequired);
    if (exerciseLevel > userLevel) return false;

    return exercise.prerequisites.every((prereq) => completedPrereqs.includes(prereq));
  });
}
