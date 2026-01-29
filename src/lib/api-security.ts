/**
 * Cyber Shield Enterprise API Security
 * Government-Grade API Protection
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "./prisma";
import { AuditAction, AuditStatus } from "@prisma/client";

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string;
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `${config.keyPrefix || "rl"}:${identifier}`;
  const now = Date.now();

  let record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, record);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: record.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.count),
    resetTime: record.resetTime,
  };
}

// Default rate limit configurations
export const RATE_LIMITS = {
  api: { windowMs: 60 * 1000, maxRequests: 100, keyPrefix: "api" }, // 100 req/min
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10, keyPrefix: "auth" }, // 10 req/15min
  ai: { windowMs: 60 * 1000, maxRequests: 20, keyPrefix: "ai" }, // 20 req/min
  export: { windowMs: 60 * 60 * 1000, maxRequests: 5, keyPrefix: "export" }, // 5 req/hour
  upload: { windowMs: 60 * 1000, maxRequests: 10, keyPrefix: "upload" }, // 10 req/min
};

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

export const ValidationSchemas = {
  // Authentication schemas
  signIn: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    mfaToken: z.string().optional(),
  }),

  signUp: z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[a-z]/, "Password must contain lowercase letter")
      .regex(/[0-9]/, "Password must contain number")
      .regex(/[^A-Za-z0-9]/, "Password must contain special character"),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    organizationCode: z.string().optional(),
  }),

  // Training API schemas
  startSession: z.object({
    moduleId: z.string().cuid("Invalid module ID"),
  }),

  submitAnswer: z.object({
    sessionId: z.string().cuid("Invalid session ID"),
    scenarioId: z.string().cuid("Invalid scenario ID"),
    answer: z.unknown(),
    timeSpent: z.number().int().positive().max(36000), // Max 10 hours
  }),

  // AI API schemas
  aiChat: z.object({
    mode: z.enum(["phishing", "socialEngineering", "incidentResponse", "coaching", "general"]),
    messages: z.array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(10000),
      })
    ),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT", "MASTER"]).optional(),
    context: z.string().max(5000).optional(),
  }),

  generateScenario: z.object({
    moduleType: z.string(),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT", "MASTER"]),
    previousScenarioIds: z.array(z.string()).optional(),
    count: z.number().int().min(1).max(10).optional(),
  }),

  // User management schemas
  updateProfile: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    displayName: z.string().max(100).optional(),
    phone: z.string().max(20).optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(12)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
  }),

  // Organization schemas
  createOrganization: z.object({
    name: z.string().min(2).max(200),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
    industry: z.enum([
      "GOVERNMENT",
      "DEFENSE",
      "INTELLIGENCE",
      "FINANCIAL",
      "HEALTHCARE",
      "TECHNOLOGY",
      "ENERGY",
      "TELECOMMUNICATIONS",
      "EDUCATION",
      "OTHER",
    ]),
    contactEmail: z.string().email(),
  }),

  // Certification schemas
  startExam: z.object({
    examId: z.string().cuid(),
    acknowledgeRules: z.boolean().refine((v) => v === true, "Must acknowledge exam rules"),
  }),

  submitExam: z.object({
    attemptId: z.string().cuid(),
    answers: z.record(z.string(), z.unknown()),
  }),

  // Exercise schemas
  createExercise: z.object({
    name: z.string().min(2).max(200),
    description: z.string().max(5000),
    exerciseType: z.enum(["TABLETOP", "LIVE_FIRE", "SIMULATION", "CTF", "PURPLE_TEAM"]),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT", "MASTER"]),
    scheduledStart: z.string().datetime(),
    scheduledEnd: z.string().datetime(),
    objectives: z.array(z.string()).min(1),
    maxParticipants: z.number().int().min(1).max(1000).optional(),
  }),

  // Threat intelligence schemas
  createThreatReport: z.object({
    title: z.string().min(5).max(200),
    summary: z.string().min(50).max(2000),
    content: z.string().min(100).max(50000),
    reportType: z.enum([
      "THREAT_ASSESSMENT",
      "INCIDENT_REPORT",
      "VULNERABILITY_REPORT",
      "INTELLIGENCE_BRIEF",
      "TREND_ANALYSIS",
    ]),
    severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]),
    tlpLevel: z.enum(["RED", "AMBER", "GREEN", "WHITE"]),
    tags: z.array(z.string()).optional(),
    indicators: z.unknown().optional(),
  }),

  // Search/filter schemas
  paginationParams: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),

  searchQuery: z.object({
    q: z.string().max(200).optional(),
    filters: z.record(z.string(), z.unknown()).optional(),
  }),
};

// ============================================
// INPUT SANITIZATION
// ============================================

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string"
            ? sanitizeString(item)
            : typeof item === "object" && item !== null
            ? sanitizeObject(item as Record<string, unknown>)
            : item
        );
      } else {
        sanitized[key] = sanitizeObject(value as Record<string, unknown>);
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

// ============================================
// SECURITY HEADERS
// ============================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com;",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };
}

// ============================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return { success: false, errors: ["Invalid request data"] };
  }
}

// ============================================
// API RESPONSE HELPERS
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(
  data: T,
  meta?: ApiResponse["meta"]
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, meta });
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: string[]
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message, errors }, { status });
}

export function unauthorizedResponse(message: string = "Unauthorized"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbiddenResponse(message: string = "Forbidden"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFoundResponse(message: string = "Not found"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function rateLimitResponse(resetTime: number): NextResponse<ApiResponse> {
  const resetDate = new Date(resetTime);
  return NextResponse.json(
    { success: false, error: "Rate limit exceeded" },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)),
        "X-RateLimit-Reset": resetDate.toISOString(),
      },
    }
  );
}

// ============================================
// API MIDDLEWARE WRAPPER
// ============================================

export interface ApiMiddlewareOptions {
  requireAuth?: boolean;
  requiredPermissions?: string[];
  requiredClearance?: string;
  rateLimit?: RateLimitConfig;
  schema?: z.ZodSchema;
  auditAction?: AuditAction;
}

export function withApiMiddleware<T>(
  handler: (
    req: NextRequest,
    context: {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
        clearanceLevel: string;
        organizationId?: string;
      };
      body?: T;
    }
  ) => Promise<NextResponse>,
  options: ApiMiddlewareOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    // Add security headers to response
    const securityHeaders = getSecurityHeaders();

    try {
      // Get client identifier for rate limiting
      const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "unknown";

      // Check rate limit
      if (options.rateLimit) {
        const rateLimitResult = await rateLimit(clientIp, options.rateLimit);
        if (!rateLimitResult.allowed) {
          await logApiRequest(
            req,
            requestId,
            429,
            Date.now() - startTime,
            "Rate limit exceeded"
          );
          return rateLimitResponse(rateLimitResult.resetTime);
        }
      }

      // Authentication check
      let user: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
        clearanceLevel: string;
        organizationId?: string;
      } | undefined;

      if (options.requireAuth !== false) {
        const token = await getToken({ req });

        if (!token) {
          await logApiRequest(req, requestId, 401, Date.now() - startTime, "Unauthorized");
          return unauthorizedResponse();
        }

        user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          permissions: token.permissions as string[],
          clearanceLevel: token.clearanceLevel as string,
          organizationId: token.organizationId as string | undefined,
        };

        // Permission check
        if (options.requiredPermissions && options.requiredPermissions.length > 0) {
          const hasPermission =
            user.permissions.includes("*") ||
            options.requiredPermissions.some((p) => user!.permissions.includes(p));

          if (!hasPermission) {
            await logApiRequest(
              req,
              requestId,
              403,
              Date.now() - startTime,
              "Insufficient permissions",
              user.id
            );
            return forbiddenResponse("Insufficient permissions");
          }
        }

        // Clearance level check
        if (options.requiredClearance) {
          const clearanceLevels = [
            "UNCLASSIFIED",
            "CONFIDENTIAL",
            "SECRET",
            "TOP_SECRET",
            "TOP_SECRET_SCI",
          ];
          const userLevel = clearanceLevels.indexOf(user.clearanceLevel);
          const requiredLevel = clearanceLevels.indexOf(options.requiredClearance);

          if (userLevel < requiredLevel) {
            await logApiRequest(
              req,
              requestId,
              403,
              Date.now() - startTime,
              "Insufficient clearance level",
              user.id
            );
            return forbiddenResponse("Insufficient clearance level");
          }
        }
      }

      // Parse and validate request body
      let body: T | undefined;
      if (options.schema && req.method !== "GET" && req.method !== "DELETE") {
        try {
          const rawBody = await req.json();
          const sanitizedBody = sanitizeObject(rawBody);
          const validation = validateRequest(options.schema, sanitizedBody);

          if (!validation.success) {
            await logApiRequest(
              req,
              requestId,
              400,
              Date.now() - startTime,
              "Validation failed",
              user?.id
            );
            return errorResponse("Validation failed", 400, validation.errors);
          }

          body = validation.data;
        } catch {
          await logApiRequest(
            req,
            requestId,
            400,
            Date.now() - startTime,
            "Invalid JSON",
            user?.id
          );
          return errorResponse("Invalid JSON body", 400);
        }
      }

      // Execute handler
      const response = await handler(req, { user, body });

      // Log successful request
      const responseStatus = response.status;
      await logApiRequest(
        req,
        requestId,
        responseStatus,
        Date.now() - startTime,
        undefined,
        user?.id,
        options.auditAction
      );

      // Add security headers to response
      for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
      }

      response.headers.set("X-Request-ID", requestId);

      return response;
    } catch (error) {
      console.error("API Error:", error);

      await logApiRequest(
        req,
        requestId,
        500,
        Date.now() - startTime,
        error instanceof Error ? error.message : "Unknown error"
      );

      const response = errorResponse("Internal server error", 500);

      for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
      }

      response.headers.set("X-Request-ID", requestId);

      return response;
    }
  };
}

// ============================================
// API REQUEST LOGGING
// ============================================

async function logApiRequest(
  req: NextRequest,
  requestId: string,
  status: number,
  duration: number,
  errorMessage?: string,
  userId?: string,
  auditAction?: AuditAction
): Promise<void> {
  try {
    const logData = {
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
      status,
      duration,
      errorMessage,
      userId,
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip"),
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", JSON.stringify(logData));
    }

    // Log audit event if specified
    if (auditAction && userId) {
      await prisma.auditLog.create({
        data: {
          action: auditAction,
          entityType: "API",
          entityId: req.nextUrl.pathname,
          description: `${req.method} ${req.nextUrl.pathname}`,
          userId,
          status: status >= 400 ? AuditStatus.FAILURE : AuditStatus.SUCCESS,
          errorMessage,
          ipAddress: logData.ip || undefined,
          userAgent: logData.userAgent || undefined,
          requestId,
          metadata: {
            method: req.method,
            path: req.nextUrl.pathname,
            duration,
          },
        },
      });
    }
  } catch (error) {
    console.error("Failed to log API request:", error);
  }
}

// ============================================
// CSRF PROTECTION
// ============================================

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function verifyCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
}

// ============================================
// API KEY MANAGEMENT
// ============================================

export function generateApiKey(): { key: string; hash: string } {
  const key = `cs_${crypto.randomBytes(32).toString("hex")}`;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return { key, hash };
}

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

// ============================================
// REQUEST SIGNATURE VERIFICATION
// ============================================

export function signRequest(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyRequestSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signRequest(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
