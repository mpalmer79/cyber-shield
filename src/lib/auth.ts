/**
 * Cyber Shield Enterprise Authentication System
 * Government-Grade Security with NextAuth.js
 */

import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "./prisma";
import { compare, hash } from "bcryptjs";
import { authenticator } from "otplib";
import crypto from "crypto";
import {
  UserRole,
  UserStatus,
  ClearanceLevel,
  CareerPath,
  CareerTier,
  AuditAction,
  AuditStatus
} from "@prisma/client";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  clearanceLevel: ClearanceLevel;
  careerPath: CareerPath;
  currentTier: CareerTier;
  organizationId: string | null;
  teamId: string | null;
  mfaEnabled: boolean;
  permissions: string[];
}

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }
  interface User extends UserSession {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserSession {}
}

// ============================================
// ROLE-BASED PERMISSIONS
// ============================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  TRAINEE: [
    "training:view",
    "training:start",
    "progress:view:own",
    "profile:view:own",
    "profile:edit:own",
    "leaderboard:view",
    "certification:view",
    "lab:access:basic",
  ],
  ANALYST: [
    ...["training:view", "training:start", "progress:view:own", "profile:view:own", "profile:edit:own", "leaderboard:view", "certification:view", "lab:access:basic"],
    "training:advanced",
    "threat-intel:view",
    "reports:create",
    "reports:view:own",
    "lab:access:intermediate",
  ],
  SENIOR_ANALYST: [
    ...["training:view", "training:start", "progress:view:own", "profile:view:own", "profile:edit:own", "leaderboard:view", "certification:view", "lab:access:basic"],
    "training:advanced",
    "threat-intel:view",
    "reports:create",
    "reports:view:own",
    "lab:access:intermediate",
    "threat-intel:create",
    "exercise:participate",
    "mentorship:mentor",
    "lab:access:advanced",
  ],
  TEAM_LEAD: [
    ...["training:view", "training:start", "progress:view:own", "profile:view:own", "profile:edit:own", "leaderboard:view", "certification:view", "lab:access:basic"],
    "training:advanced",
    "threat-intel:view",
    "reports:create",
    "reports:view:own",
    "lab:access:intermediate",
    "threat-intel:create",
    "exercise:participate",
    "mentorship:mentor",
    "lab:access:advanced",
    "team:view",
    "team:manage",
    "progress:view:team",
    "exercise:lead",
    "reports:view:team",
  ],
  MANAGER: [
    ...["training:view", "training:start", "progress:view:own", "profile:view:own", "profile:edit:own", "leaderboard:view", "certification:view", "lab:access:basic"],
    "training:advanced",
    "threat-intel:view",
    "reports:create",
    "reports:view:own",
    "lab:access:intermediate",
    "threat-intel:create",
    "exercise:participate",
    "mentorship:mentor",
    "lab:access:advanced",
    "team:view",
    "team:manage",
    "progress:view:team",
    "exercise:lead",
    "reports:view:team",
    "department:view",
    "department:manage",
    "progress:view:department",
    "analytics:view:department",
    "compliance:view",
  ],
  INSTRUCTOR: [
    ...["training:view", "training:start", "progress:view:own", "profile:view:own", "profile:edit:own", "leaderboard:view", "certification:view", "lab:access:basic"],
    "training:advanced",
    "threat-intel:view",
    "reports:create",
    "reports:view:own",
    "lab:access:intermediate",
    "threat-intel:create",
    "exercise:participate",
    "mentorship:mentor",
    "lab:access:advanced",
    "training:create",
    "training:edit",
    "scenario:create",
    "scenario:edit",
    "certification:proctor",
    "exercise:create",
    "exercise:manage",
    "lab:create",
    "lab:manage",
  ],
  ADMIN: [
    ...["training:view", "training:start", "progress:view:own", "profile:view:own", "profile:edit:own", "leaderboard:view", "certification:view", "lab:access:basic"],
    "training:advanced",
    "threat-intel:view",
    "reports:create",
    "reports:view:own",
    "lab:access:intermediate",
    "threat-intel:create",
    "exercise:participate",
    "mentorship:mentor",
    "lab:access:advanced",
    "team:view",
    "team:manage",
    "progress:view:team",
    "exercise:lead",
    "reports:view:team",
    "department:view",
    "department:manage",
    "progress:view:department",
    "analytics:view:department",
    "compliance:view",
    "training:create",
    "training:edit",
    "scenario:create",
    "scenario:edit",
    "certification:proctor",
    "exercise:create",
    "exercise:manage",
    "lab:create",
    "lab:manage",
    "users:view:org",
    "users:manage:org",
    "org:view",
    "org:manage",
    "analytics:view:org",
    "compliance:manage",
    "audit:view:org",
  ],
  SUPER_ADMIN: [
    "*", // All permissions
  ],
};

// ============================================
// SECURITY UTILITIES
// ============================================

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateMfaSecret(): string {
  return authenticator.generateSecret();
}

export function generateMfaQRCode(email: string, secret: string): string {
  return authenticator.keyuri(email, "CyberShield Enterprise", secret);
}

export function verifyMfaToken(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

export function generateBackupCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ============================================
// AUDIT LOGGING
// ============================================

export async function logAuditEvent(
  action: AuditAction,
  entityType: string,
  entityId: string | null,
  description: string,
  userId?: string,
  organizationId?: string,
  metadata?: Record<string, unknown>,
  status: AuditStatus = AuditStatus.SUCCESS,
  errorMessage?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        description,
        userId,
        organizationId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        status,
        errorMessage,
        ipAddress,
        userAgent,
        requestId: crypto.randomUUID(),
      },
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}

// ============================================
// PASSWORD POLICY
// ============================================

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong" | "excellent";
  score: number;
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Minimum length
  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  } else {
    score += 20;
  }

  // Uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score += 15;
  }

  // Lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score += 15;
  }

  // Numbers
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score += 15;
  }

  // Special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    score += 15;
  }

  // Length bonus
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;

  // Determine strength
  let strength: PasswordValidationResult["strength"];
  if (score < 30) strength = "weak";
  else if (score < 50) strength = "fair";
  else if (score < 70) strength = "good";
  else if (score < 90) strength = "strong";
  else strength = "excellent";

  return {
    valid: errors.length === 0,
    errors,
    strength,
    score: Math.min(100, score),
  };
}

// ============================================
// ACCOUNT LOCKOUT
// ============================================

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export async function checkAccountLockout(
  email: string
): Promise<{ locked: boolean; remainingTime?: number }> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lockedUntil: true, failedLoginAttempts: true },
  });

  if (!user) {
    return { locked: false };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingTime = user.lockedUntil.getTime() - Date.now();
    return { locked: true, remainingTime };
  }

  return { locked: false };
}

export async function recordFailedLogin(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true },
  });

  if (!user) return;

  const newAttempts = user.failedLoginAttempts + 1;
  const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

  await prisma.user.update({
    where: { email },
    data: {
      failedLoginAttempts: newAttempts,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCKOUT_DURATION)
        : undefined,
    },
  });

  if (shouldLock) {
    await logAuditEvent(
      AuditAction.LOGIN,
      "User",
      user.id,
      `Account locked after ${MAX_LOGIN_ATTEMPTS} failed login attempts`,
      user.id,
      undefined,
      { attempts: newAttempts },
      AuditStatus.FAILURE
    );
  }
}

export async function resetFailedLogins(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

// ============================================
// NEXTAUTH CONFIGURATION
// ============================================

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password, mfaToken } = credentials;

        // Check account lockout
        const lockoutStatus = await checkAccountLockout(email);
        if (lockoutStatus.locked) {
          const minutes = Math.ceil((lockoutStatus.remainingTime || 0) / 60000);
          throw new Error(
            `Account is locked. Try again in ${minutes} minutes.`
          );
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            organization: true,
          },
        });

        if (!user || !user.passwordHash) {
          await recordFailedLogin(email);
          throw new Error("Invalid email or password");
        }

        // Check user status
        if (user.status === UserStatus.SUSPENDED) {
          throw new Error("Account is suspended. Contact administrator.");
        }

        if (user.status === UserStatus.DEACTIVATED) {
          throw new Error("Account is deactivated. Contact administrator.");
        }

        if (user.status === UserStatus.PENDING_VERIFICATION) {
          throw new Error("Please verify your email before signing in.");
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.passwordHash);

        if (!isValidPassword) {
          await recordFailedLogin(email);
          throw new Error("Invalid email or password");
        }

        // Check MFA
        if (user.mfaEnabled && user.mfaSecret) {
          if (!mfaToken) {
            throw new Error("MFA_REQUIRED");
          }

          const isValidToken = verifyMfaToken(mfaToken, user.mfaSecret);
          if (!isValidToken) {
            // Check backup codes
            if (user.backupCodes.includes(mfaToken.toUpperCase())) {
              // Remove used backup code
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  backupCodes: user.backupCodes.filter(
                    (code) => code !== mfaToken.toUpperCase()
                  ),
                },
              });
            } else {
              await recordFailedLogin(email);
              throw new Error("Invalid MFA token");
            }
          }
        }

        // Reset failed login attempts
        await resetFailedLogins(email);

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // Log successful login
        await logAuditEvent(
          AuditAction.LOGIN,
          "User",
          user.id,
          `User ${user.email} logged in successfully`,
          user.id,
          user.organizationId || undefined,
          {
            method: "credentials",
            ipAddress: req?.headers?.["x-forwarded-for"] || "unknown",
          }
        );

        // Get permissions
        const permissions =
          user.role === UserRole.SUPER_ADMIN
            ? ["*"]
            : ROLE_PERMISSIONS[user.role] || [];

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          role: user.role,
          status: user.status,
          clearanceLevel: user.clearanceLevel,
          careerPath: user.careerPath,
          currentTier: user.currentTier,
          organizationId: user.organizationId,
          teamId: user.teamId,
          mfaEnabled: user.mfaEnabled,
          permissions,
        };
      },
    }),
    // Google OAuth (for organizations using Google Workspace)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    // Azure AD (for government/enterprise SSO)
    ...(process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, check if user exists or create
      if (account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user for OAuth sign-in
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: (profile as { given_name?: string })?.given_name || "",
              lastName: (profile as { family_name?: string })?.family_name || "",
              displayName: user.name,
              avatar: user.image,
              status: UserStatus.ACTIVE,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.displayName = user.displayName;
        token.avatar = user.avatar;
        token.role = user.role;
        token.status = user.status;
        token.clearanceLevel = user.clearanceLevel;
        token.careerPath = user.careerPath;
        token.currentTier = user.currentTier;
        token.organizationId = user.organizationId;
        token.teamId = user.teamId;
        token.mfaEnabled = user.mfaEnabled;
        token.permissions = user.permissions;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        Object.assign(token, session);
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email!,
        firstName: token.firstName,
        lastName: token.lastName,
        displayName: token.displayName,
        avatar: token.avatar,
        role: token.role,
        status: token.status,
        clearanceLevel: token.clearanceLevel,
        careerPath: token.careerPath,
        currentTier: token.currentTier,
        organizationId: token.organizationId,
        teamId: token.teamId,
        mfaEnabled: token.mfaEnabled,
        permissions: token.permissions,
      };

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await logAuditEvent(
          AuditAction.LOGOUT,
          "User",
          token.id,
          `User ${token.email} logged out`,
          token.id,
          token.organizationId || undefined
        );
      }
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  if (userPermissions.includes("*")) return true;
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (userPermissions.includes("*")) return true;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (userPermissions.includes("*")) return true;
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

export function canAccessClearanceLevel(
  userClearance: ClearanceLevel,
  requiredClearance: ClearanceLevel
): boolean {
  const levels: ClearanceLevel[] = [
    ClearanceLevel.UNCLASSIFIED,
    ClearanceLevel.CONFIDENTIAL,
    ClearanceLevel.SECRET,
    ClearanceLevel.TOP_SECRET,
    ClearanceLevel.TOP_SECRET_SCI,
  ];

  const userLevel = levels.indexOf(userClearance);
  const requiredLevel = levels.indexOf(requiredClearance);

  return userLevel >= requiredLevel;
}
