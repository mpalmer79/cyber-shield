/**
 * Cyber Shield Enterprise Database Seed
 * Initial data for government-grade training platform
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // SEED BADGES
  // ============================================
  console.log("Creating badges...");

  const badges = [
    // Achievement Badges
    {
      slug: "first-steps",
      name: "First Steps",
      description: "Complete your first training module",
      icon: "footprints",
      rarity: "COMMON",
      category: "ACHIEVEMENT",
      requirements: { modulesCompleted: 1 },
      xpReward: 100,
    },
    {
      slug: "quick-learner",
      name: "Quick Learner",
      description: "Complete 5 training modules",
      icon: "brain",
      rarity: "COMMON",
      category: "ACHIEVEMENT",
      requirements: { modulesCompleted: 5 },
      xpReward: 250,
    },
    {
      slug: "dedicated-student",
      name: "Dedicated Student",
      description: "Complete 10 training modules",
      icon: "graduation-cap",
      rarity: "UNCOMMON",
      category: "ACHIEVEMENT",
      requirements: { modulesCompleted: 10 },
      xpReward: 500,
    },
    {
      slug: "security-scholar",
      name: "Security Scholar",
      description: "Complete 25 training modules",
      icon: "book-open",
      rarity: "RARE",
      category: "ACHIEVEMENT",
      requirements: { modulesCompleted: 25 },
      xpReward: 1000,
    },
    {
      slug: "master-defender",
      name: "Master Defender",
      description: "Complete 50 training modules",
      icon: "shield",
      rarity: "EPIC",
      category: "ACHIEVEMENT",
      requirements: { modulesCompleted: 50 },
      xpReward: 2500,
    },
    // Skill Badges
    {
      slug: "phishing-expert",
      name: "Phishing Expert",
      description: "Achieve 95% accuracy in phishing detection",
      icon: "mail-warning",
      rarity: "RARE",
      category: "SKILL",
      requirements: { moduleSlug: "phishing-detection-masterclass", score: 95 },
      xpReward: 500,
    },
    {
      slug: "soc-specialist",
      name: "SOC Specialist",
      description: "Complete all SOC analyst modules",
      icon: "monitor",
      rarity: "EPIC",
      category: "SKILL",
      requirements: { categoryComplete: "SOC_ANALYST" },
      xpReward: 1500,
    },
    {
      slug: "threat-hunter",
      name: "Threat Hunter",
      description: "Complete threat hunting certification",
      icon: "crosshair",
      rarity: "LEGENDARY",
      category: "SKILL",
      requirements: { certificationSlug: "cs-threat-hunter" },
      xpReward: 3000,
    },
    // Streak Badges
    {
      slug: "consistent-learner",
      name: "Consistent Learner",
      description: "Maintain a 7-day learning streak",
      icon: "flame",
      rarity: "COMMON",
      category: "STREAK",
      requirements: { streak: 7 },
      xpReward: 200,
    },
    {
      slug: "dedicated-defender",
      name: "Dedicated Defender",
      description: "Maintain a 30-day learning streak",
      icon: "fire",
      rarity: "RARE",
      category: "STREAK",
      requirements: { streak: 30 },
      xpReward: 1000,
    },
    {
      slug: "unstoppable",
      name: "Unstoppable",
      description: "Maintain a 100-day learning streak",
      icon: "zap",
      rarity: "LEGENDARY",
      category: "STREAK",
      requirements: { streak: 100 },
      xpReward: 5000,
    },
    // Certification Badges
    {
      slug: "certified-foundations",
      name: "Certified: Security Foundations",
      description: "Earned CyberShield Security Foundations certification",
      icon: "award",
      rarity: "UNCOMMON",
      category: "CERTIFICATION",
      requirements: { certificationSlug: "cs-foundations" },
      xpReward: 500,
    },
    {
      slug: "certified-soc-analyst",
      name: "Certified: SOC Analyst",
      description: "Earned CyberShield SOC Analyst certification",
      icon: "badge-check",
      rarity: "RARE",
      category: "CERTIFICATION",
      requirements: { certificationSlug: "cs-soc-analyst" },
      xpReward: 1000,
    },
    {
      slug: "certified-incident-handler",
      name: "Certified: Incident Handler",
      description: "Earned CyberShield Incident Handler certification",
      icon: "shield-check",
      rarity: "EPIC",
      category: "CERTIFICATION",
      requirements: { certificationSlug: "cs-incident-handler" },
      xpReward: 1500,
    },
    // Participation Badges
    {
      slug: "team-player",
      name: "Team Player",
      description: "Participate in your first team exercise",
      icon: "users",
      rarity: "COMMON",
      category: "PARTICIPATION",
      requirements: { exercisesParticipated: 1 },
      xpReward: 250,
    },
    {
      slug: "red-team-warrior",
      name: "Red Team Warrior",
      description: "Complete 5 red team exercises",
      icon: "sword",
      rarity: "RARE",
      category: "PARTICIPATION",
      requirements: { redTeamExercises: 5 },
      xpReward: 1000,
    },
    {
      slug: "blue-team-defender",
      name: "Blue Team Defender",
      description: "Complete 5 blue team exercises",
      icon: "shield",
      rarity: "RARE",
      category: "PARTICIPATION",
      requirements: { blueTeamExercises: 5 },
      xpReward: 1000,
    },
    // Special Badges
    {
      slug: "mentor",
      name: "Mentor",
      description: "Successfully mentor 3 trainees",
      icon: "heart-handshake",
      rarity: "EPIC",
      category: "SPECIAL",
      requirements: { menteesCompleted: 3 },
      xpReward: 2000,
    },
    {
      slug: "pioneer",
      name: "Pioneer",
      description: "Be among the first 100 users to earn a certification",
      icon: "rocket",
      rarity: "LEGENDARY",
      category: "SPECIAL",
      requirements: { specialCondition: "early_adopter" },
      xpReward: 5000,
      isSecret: true,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: {
        slug: badge.slug,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity as "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC",
        category: badge.category as "ACHIEVEMENT" | "SKILL" | "CERTIFICATION" | "PARTICIPATION" | "SPECIAL" | "STREAK",
        requirements: badge.requirements,
        xpReward: badge.xpReward,
        isSecret: badge.isSecret || false,
      },
    });
  }

  console.log(`✅ Created ${badges.length} badges`);

  // ============================================
  // SEED SKILL CATEGORIES
  // ============================================
  console.log("Creating skill categories...");

  const skillCategories = [
    {
      name: "Threat Analysis",
      description: "Skills related to identifying and analyzing threats",
      skills: [
        { name: "Threat Modeling", niceKsaId: "K0005" },
        { name: "Malware Analysis", niceKsaId: "K0259" },
        { name: "Threat Intelligence", niceKsaId: "K0469" },
      ],
    },
    {
      name: "Incident Response",
      description: "Skills for responding to security incidents",
      skills: [
        { name: "Incident Handling", niceKsaId: "K0042" },
        { name: "Digital Forensics", niceKsaId: "K0060" },
        { name: "Evidence Collection", niceKsaId: "K0118" },
      ],
    },
    {
      name: "Security Operations",
      description: "Skills for day-to-day security operations",
      skills: [
        { name: "SIEM Operations", niceKsaId: "K0046" },
        { name: "Log Analysis", niceKsaId: "K0058" },
        { name: "Alert Triage", niceKsaId: "K0177" },
      ],
    },
    {
      name: "Network Security",
      description: "Skills related to network defense",
      skills: [
        { name: "Network Traffic Analysis", niceKsaId: "K0061" },
        { name: "Firewall Management", niceKsaId: "K0049" },
        { name: "IDS/IPS Management", niceKsaId: "K0324" },
      ],
    },
    {
      name: "Offensive Security",
      description: "Skills for authorized security testing",
      skills: [
        { name: "Penetration Testing", niceKsaId: "K0009" },
        { name: "Vulnerability Assessment", niceKsaId: "K0119" },
        { name: "Social Engineering", niceKsaId: "K0206" },
      ],
    },
  ];

  for (const category of skillCategories) {
    const createdCategory = await prisma.skillCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
      },
    });

    for (const skill of category.skills) {
      await prisma.skill.upsert({
        where: {
          name_categoryId: {
            name: skill.name,
            categoryId: createdCategory.id,
          },
        },
        update: {},
        create: {
          name: skill.name,
          categoryId: createdCategory.id,
          niceKsaId: skill.niceKsaId,
        },
      });
    }
  }

  console.log(`✅ Created ${skillCategories.length} skill categories`);

  // ============================================
  // SEED DEMO ORGANIZATION
  // ============================================
  console.log("Creating demo organization...");

  const demoOrg = await prisma.organization.upsert({
    where: { slug: "demo-agency" },
    update: {},
    create: {
      name: "Demo Government Agency",
      slug: "demo-agency",
      description: "Demonstration organization for CyberShield Enterprise",
      industry: "GOVERNMENT",
      size: "LARGE",
      contactEmail: "admin@demo-agency.gov",
      country: "USA",
      subscriptionTier: "GOVERNMENT",
      maxUsers: 10000,
      settings: {
        theme: "government",
        mfaRequired: true,
        passwordPolicy: "strict",
      },
      complianceFrameworks: ["NIST", "CMMC", "NICE"],
    },
  });

  // Create demo department
  const demoDept = await prisma.department.upsert({
    where: { id: "demo-dept-soc" },
    update: {},
    create: {
      id: "demo-dept-soc",
      name: "Security Operations Center",
      description: "24/7 Security Operations Center",
      organizationId: demoOrg.id,
    },
  });

  // Create demo team
  const demoTeam = await prisma.team.upsert({
    where: { id: "demo-team-alpha" },
    update: {},
    create: {
      id: "demo-team-alpha",
      name: "SOC Team Alpha",
      description: "Day shift SOC analysts",
      organizationId: demoOrg.id,
      departmentId: demoDept.id,
      teamType: "SOC",
    },
  });

  console.log("✅ Created demo organization, department, and team");

  // ============================================
  // SEED DEMO USERS
  // ============================================
  console.log("Creating demo users...");

  const passwordHash = await hash("Demo123!@#", 12);

  const demoUsers = [
    {
      email: "admin@cybershield.local",
      firstName: "System",
      lastName: "Administrator",
      role: "SUPER_ADMIN",
      clearanceLevel: "TOP_SECRET_SCI",
      careerPath: "CISO_TRACK",
      currentTier: "PRINCIPAL",
      totalXP: 150000,
      currentLevel: 50,
    },
    {
      email: "instructor@cybershield.local",
      firstName: "Sarah",
      lastName: "Mitchell",
      role: "INSTRUCTOR",
      clearanceLevel: "TOP_SECRET",
      careerPath: "INCIDENT_RESPONDER",
      currentTier: "MASTER",
      totalXP: 85000,
      currentLevel: 35,
      organizationId: demoOrg.id,
    },
    {
      email: "manager@demo-agency.gov",
      firstName: "James",
      lastName: "Wilson",
      role: "MANAGER",
      clearanceLevel: "SECRET",
      careerPath: "SOC_ANALYST",
      currentTier: "EXPERT",
      totalXP: 45000,
      currentLevel: 25,
      organizationId: demoOrg.id,
      departmentId: demoDept.id,
    },
    {
      email: "analyst@demo-agency.gov",
      firstName: "Emily",
      lastName: "Chen",
      role: "SENIOR_ANALYST",
      clearanceLevel: "SECRET",
      careerPath: "SOC_ANALYST",
      currentTier: "PROFESSIONAL",
      totalXP: 22000,
      currentLevel: 15,
      organizationId: demoOrg.id,
      teamId: demoTeam.id,
    },
    {
      email: "trainee@demo-agency.gov",
      firstName: "Alex",
      lastName: "Johnson",
      role: "TRAINEE",
      clearanceLevel: "CONFIDENTIAL",
      careerPath: "GENERAL",
      currentTier: "NOVICE",
      totalXP: 1500,
      currentLevel: 3,
      organizationId: demoOrg.id,
      teamId: demoTeam.id,
    },
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash,
        status: "ACTIVE",
        emailVerified: new Date(),
        role: user.role as "SUPER_ADMIN" | "INSTRUCTOR" | "MANAGER" | "SENIOR_ANALYST" | "TRAINEE",
        clearanceLevel: user.clearanceLevel as "TOP_SECRET_SCI" | "TOP_SECRET" | "SECRET" | "CONFIDENTIAL",
        careerPath: user.careerPath as "CISO_TRACK" | "INCIDENT_RESPONDER" | "SOC_ANALYST" | "GENERAL",
        currentTier: user.currentTier as "PRINCIPAL" | "MASTER" | "EXPERT" | "PROFESSIONAL" | "NOVICE",
        totalXP: user.totalXP,
        currentLevel: user.currentLevel,
        organizationId: user.organizationId,
        departmentId: user.departmentId,
        teamId: user.teamId,
      },
    });
  }

  console.log(`✅ Created ${demoUsers.length} demo users`);

  // ============================================
  // SEED LAB ENVIRONMENTS
  // ============================================
  console.log("Creating lab environments...");

  const labEnvironments = [
    {
      name: "Network Traffic Analysis Lab",
      description: "Analyze network traffic to identify malicious activity",
      environmentType: "NETWORK",
      difficulty: "INTERMEDIATE",
      maxConcurrentUsers: 50,
      sessionTimeout: 180,
    },
    {
      name: "Malware Analysis Sandbox",
      description: "Safely analyze malware samples using static and dynamic techniques",
      environmentType: "MALWARE_ANALYSIS",
      difficulty: "ADVANCED",
      maxConcurrentUsers: 20,
      sessionTimeout: 240,
    },
    {
      name: "Web Application Security Testing Lab",
      description: "Practice finding and exploiting web application vulnerabilities",
      environmentType: "WEB_APPLICATION",
      difficulty: "INTERMEDIATE",
      maxConcurrentUsers: 100,
      sessionTimeout: 180,
    },
    {
      name: "Disk Forensics Investigation Lab",
      description: "Investigate disk images to reconstruct user activity",
      environmentType: "FORENSICS",
      difficulty: "ADVANCED",
      maxConcurrentUsers: 30,
      sessionTimeout: 300,
    },
    {
      name: "Cloud Security Configuration Lab",
      description: "Identify and remediate cloud security misconfigurations",
      environmentType: "CLOUD",
      difficulty: "INTERMEDIATE",
      maxConcurrentUsers: 40,
      sessionTimeout: 180,
    },
  ];

  for (const lab of labEnvironments) {
    await prisma.labEnvironment.upsert({
      where: { id: lab.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: lab.name.toLowerCase().replace(/\s+/g, "-"),
        name: lab.name,
        description: lab.description,
        environmentType: lab.environmentType as "NETWORK" | "MALWARE_ANALYSIS" | "WEB_APPLICATION" | "FORENSICS" | "CLOUD",
        difficulty: lab.difficulty as "INTERMEDIATE" | "ADVANCED",
        maxConcurrentUsers: lab.maxConcurrentUsers,
        sessionTimeout: lab.sessionTimeout,
        status: "ACTIVE",
      },
    });
  }

  console.log(`✅ Created ${labEnvironments.length} lab environments`);

  // ============================================
  // COMPLETE
  // ============================================
  console.log("");
  console.log("🎉 Database seeding completed successfully!");
  console.log("");
  console.log("Demo Credentials:");
  console.log("─────────────────");
  console.log("Super Admin: admin@cybershield.local / Demo123!@#");
  console.log("Instructor: instructor@cybershield.local / Demo123!@#");
  console.log("Manager: manager@demo-agency.gov / Demo123!@#");
  console.log("Analyst: analyst@demo-agency.gov / Demo123!@#");
  console.log("Trainee: trainee@demo-agency.gov / Demo123!@#");
  console.log("");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
