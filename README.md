# CyberShield 🛡️

[![LinkedIn](https://img.shields.io/badge/Connect_with_me-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mpalmer1234/)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Version](https://img.shields.io/badge/Version-2.2.0-00d4ff?style=for-the-badge)](https://github.com/mpalmer79/cyber-shield)

Enterprise-grade cybersecurity training platform powered by Claude AI. CyberShield combines an **Adaptive Difficulty Engine**, **real-time AI Coaching Chat**, and **vulnerability profiling** to deliver personalized security awareness training that evolves with each user. Built as a production-ready SaaS application with 14,800+ lines of TypeScript across 8 training modules and 60+ scenarios.

![CyberShield Hero](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80)

## 🏗️ Engineering Highlights  

This project demonstrates principal-level software engineering across several disciplines:

**Architecture & State Management** — Seven persisted Zustand stores managing independent domains (modules, sessions, progress, settings, vulnerability profiles, daily challenges, coaching history) with zero prop-drilling and clean separation of concerns.

**AI Systems Design** — Two distinct AI integration patterns: a Socratic coaching engine with structured JSON response contracts, fuzzy red-flag matching, and depth-based scoring; plus a scenario generation pipeline with system prompt engineering and server-side API proxying with rate limiting.

**Adaptive Learning Algorithm** — A custom machine learning–inspired engine that classifies red flags into 10 canonical threat categories using keyword-weighted matching, builds per-user vulnerability profiles through calibration phases, and dynamically weights scenario selection toward identified weaknesses (60/40 weakness-to-random split).

**Data Visualization** — Hand-built SVG radar chart (no chart library dependency) with Framer Motion animations, color-coded vertices, hover tooltips, and responsive scaling. The skill tree uses computed SVG path connections between tier nodes with unlock-state tracking.

**Testing & Quality** — 1,600+ lines of test coverage across Jest + React Testing Library, covering stores, API routes, components, and utility functions. Type-safe throughout with 30+ TypeScript interfaces and strict type definitions.

## ✨ Feature Set

### Core Platform
- **🧠 Adaptive Difficulty Engine** — Tracks which threat types you miss and dynamically weights future scenarios toward your weak spots
- **💬 Real-Time AI Coaching Chat** — Socratic dialogue during scenarios where the AI guides you to discover red flags yourself, with depth-based scoring and grade breakdowns *(v2.2)*
- **📊 Vulnerability Radar** — Interactive SVG radar chart showing detection rates across 10 threat categories with color-coded vertices and expandable breakdown panels
- **🎯 Security IQ Score** — Weighted composite score (0–100) reflecting overall threat detection ability across all tested categories

### Training & Gamification
- **📚 8 Training Modules** — Phishing, social engineering, incident response, password security, data protection, malware awareness, secure browsing, threat hunting
- **🔥 Daily Challenge** — Duolingo-style daily scenarios with streak tracking, 60-second time pressure, and "Daily Defender" badges *(v2.1)*
- **🌳 Skill Tree** — Visual progression system with tiered module unlocks, SVG path connections, and bonus challenge nodes *(v2.1)*
- **🎮 Gamification System** — XP, levels, 12+ badges, and streaks with confetti celebrations on milestones
- **🏆 Leaderboard** — Competitive rankings with filtering and team stats

### Enterprise Features
- **🔐 Admin Dashboard** — Login-protected admin panel with user analytics, module completion rates, and activity feeds
- **⚙️ Settings Panel** — Dark/light themes, sound effects, difficulty preferences, coaching toggle, accessibility options
- **📈 Progress Analytics** — Per-module completion tracking, time-spent metrics, historical performance trends

## 🧠 Adaptive Difficulty Engine

The core intelligence that makes CyberShield a personalized training platform rather than a static quiz.

### How It Works

```
Session 1-2 (Calibrating)          Session 3+ (Adaptive)
┌──────────────────────┐          ┌──────────────────────────┐
│  Random scenarios     │          │  60% weakness-targeted   │
│  Every answer tracked │   ──►    │  40% random for variety  │
│  Building profile     │          │  Avoids recent repeats   │
└──────────────────────┘          └──────────────────────────┘
```

1. **Red Flag Taxonomy** — Every scenario's red flags are classified into 10 canonical vulnerability categories using keyword-weighted matching
2. **Vulnerability Profiling** — Each answer records whether you caught or missed threats in each category, building a per-category detection rate
3. **Calibration Phase** — The first 3 sessions collect baseline data with random scenarios while silently profiling your weaknesses
4. **Adaptive Selection** — After calibration, 60% of scenarios are weighted toward your weakest categories while 40% stay random for coverage
5. **Security IQ** — A weighted composite score (0–100) reflecting detection ability across all tested categories

### 10 Threat Categories Tracked

| Category | What It Measures |
|----------|-----------------|
| 🌐 **Domain Spoofing** | Spotting fake sender domains and URL structures |
| ⏰ **Urgency & Pressure** | Recognizing artificial deadlines and fear tactics |
| 👔 **Authority Impersonation** | Detecting fake CEOs, IT staff, and officials |
| 🔗 **Suspicious Links** | Identifying deceptive URLs and redirects |
| 📎 **Attachment Threats** | Catching dangerous files, double extensions, malware |
| 📝 **Generic Communication** | Recognizing impersonal greetings and vague content |
| 🔑 **Credential Harvesting** | Detecting password and personal data theft attempts |
| 🎭 **Emotional Manipulation** | Spotting fear, greed, and curiosity exploitation |
| 🚧 **Process Bypass** | Catching requests to skip procedures or maintain secrecy |
| 🏷️ **Brand Impersonation** | Detecting professional-looking but fake brand mimicry |

## 💬 AI Coaching Chat (v2.2)

Replaces passive multiple-choice with active critical thinking. During any scenario, the AI coach engages in Socratic dialogue:

```
┌─ Scenario Panel ──────────┐  ┌─ Coaching Chat ──────────────┐
│                            │  │ 🛡️ CyberShield Coach  🟢     │
│  [Phishing email renders   │  │ ▓▓▓▓▓▓░░░░ 3/5 flags found  │
│   with full headers,       │  │                              │
│   sender info, body,       │  │ Coach: What catches your     │
│   and suspicious links]    │  │ eye first about this email?  │
│                            │  │                              │
│                            │  │ You: The domain doesn't      │
│                            │  │ match — it says microsoft    │
│                            │  │ but the actual domain is     │
│                            │  │ microsoft365-alerts.com      │
│                            │  │                              │
│                            │  │ ✅ +1 red flag identified!   │
│                            │  │                              │
│                            │  │ Coach: Sharp catch! That's   │
│                            │  │ a subdomain trick. What else │
│                            │  │ seems off?                   │
│                            │  │                              │
│                            │  │ [Type your observation...]   │
│                            │  │ [🎯 Submit Verdict]          │
└────────────────────────────┘  └──────────────────────────────┘
```

### Scoring Breakdown

| Component | Max Points | How It's Earned |
|-----------|-----------|-----------------|
| Flags You Found | 50 | Red flags identified independently through conversation |
| Flags (with hints) | 20 | Red flags found after coach nudges |
| Analysis Depth | 20 | Message count, reasoning quality, detail level |
| Speed Bonus | 10 | Identifying 60%+ of flags within 2 minutes |

Grades range from **S** (90+ with correct verdict) through **F**, with each session recorded to the coaching history store for longitudinal tracking.

### Architecture

```
src/lib/coaching/
├── engine.ts               # Socratic prompt builder, fuzzy flag matching, scoring
└── index.ts                # Barrel exports

src/lib/adaptive/
├── red-flag-taxonomy.ts    # 10 categories + keyword classifier
├── engine.ts               # Vulnerability profiling + adaptive selection
└── index.ts                # Barrel exports

src/components/
├── CoachingChat.tsx         # Chat UI, typing indicator, verdict flow, score breakdown
├── CoachingSettings.tsx     # Toggle panel with persistent preferences
├── VulnerabilityRadar.tsx   # SVG radar chart + insights panel
└── SkillTree.tsx            # Tiered progression with SVG connections

src/store/
├── index.ts                 # 6 persisted Zustand stores
└── coaching-store.ts        # Coaching session history (last 100)

src/app/api/coaching/
└── route.ts                 # Server-side Claude proxy with rate limiting
```

## 🎯 Training Modules

| Module | Difficulty | Duration | Description |
|--------|------------|----------|-------------|
| **Phishing Detection Lab** | Beginner | 15 min | Identify malicious emails, texts, and suspicious links |
| **Social Engineering Defense** | Beginner | 20 min | Recognize manipulation tactics and protect sensitive info |
| **Password & Authentication** | Beginner | 12 min | Master password best practices and MFA |
| **Secure Browsing Practices** | Beginner | 15 min | Navigate the web safely |
| **Incident Response Simulator** | Intermediate | 30 min | Handle simulated security incidents |
| **Data Protection Fundamentals** | Intermediate | 25 min | Classify, handle, and protect sensitive data |
| **Malware Awareness** | Intermediate | 20 min | Understand malware types and prevention |
| **Threat Hunting Basics** | Advanced | 45 min | Analyze logs and identify security threats |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/mpalmer79/cyber-shield.git
cd cyber-shield

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
cyber-shield/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── admin/                  # Admin dashboard (login-protected)
│   │   ├── api/                    # API routes
│   │   │   ├── ai/                 # Claude AI integration
│   │   │   ├── coaching/           # Coaching chat proxy + rate limiting
│   │   │   └── scenarios/          # Training scenarios
│   │   ├── daily/                  # Daily challenge (streak + timer)
│   │   ├── leaderboard/            # Leaderboard page
│   │   ├── progress/               # Progress + vulnerability radar
│   │   ├── settings/               # User settings
│   │   └── training/               # Training modules
│   │       └── [id]/               # Dynamic module pages (adaptive)
│   ├── components/                 # 13 React components
│   │   ├── ui/                     # 6 reusable UI components
│   │   ├── CoachingChat.tsx        # AI coaching chat interface
│   │   ├── CoachingSettings.tsx    # Coaching preference toggles
│   │   ├── SkillTree.tsx           # Visual progression tree
│   │   ├── VulnerabilityRadar.tsx  # SVG radar chart + insights
│   │   └── ...
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Core business logic
│   │   ├── adaptive/               # Adaptive Difficulty Engine
│   │   ├── coaching/               # Coaching engine + scoring
│   │   ├── scenarios/              # 60+ training scenarios (8 modules)
│   │   └── utils.ts                # Shared utilities
│   ├── store/                      # Zustand state management (7 stores)
│   └── types/                      # TypeScript definitions (30+ interfaces)
├── __tests__/                      # 1,600+ lines of test coverage
└── ...config files
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict) |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand (7 persisted stores) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **AI Integration** | Anthropic Claude API (server-side proxy) |
| **Testing** | Jest + React Testing Library |
| **Utilities** | clsx + tailwind-merge |

## 📊 Data Persistence

All user data is stored locally via Zustand's persist middleware with localStorage:

| Store | Key | What It Stores |
|-------|-----|----------------|
| Progress | `cybershield-progress` | Module completion, XP, level, badges, streaks |
| Settings | `cybershield-settings` | Dark mode, sound, difficulty, accessibility |
| Vulnerability | `cybershield-vulnerability` | Adaptive profile, category stats, session history (last 200 results) |
| Coaching | `cybershield-coaching` | Coaching session history, average scores, best grades (last 100 sessions) |
| Daily Challenge | `cybershield-daily` | Streak counter, daily completion status, challenge history |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## 🎮 How It Works

1. **Select a Module** — Choose from 8 training modules or tackle the Daily Challenge
2. **Adaptive Scenarios** — The engine selects scenarios targeting your weakest threat categories (after 3 calibration sessions)
3. **Analyze with AI Coach** — Chat in real-time with the coaching AI to discuss what you notice, get Socratic hints, and build deeper threat awareness
4. **Make Decisions** — Identify threats, respond to incidents, or spot social engineering
5. **Get Scored** — Receive a grade breakdown (S–F) based on flags found, analysis depth, and speed
6. **Build Your Profile** — Every answer updates your vulnerability profile across 10 threat categories
7. **Track Your Radar** — Watch your detection rates improve on the interactive vulnerability radar chart
8. **Progress Through the Skill Tree** — Unlock advanced modules as you demonstrate mastery
9. **Earn Rewards** — Gain XP, unlock badges, maintain streaks, and climb the leaderboard

## 📋 Version History

| Version | Release | What Shipped |
|---------|---------|--------------|
| **2.2.0** | Current | Real-Time AI Coaching Chat — Socratic dialogue engine, fuzzy red-flag matching, depth-based scoring (S–F grades), coaching history store, server-side Claude proxy with rate limiting, coaching settings panel |
| **2.1.0** | — | Daily Challenge system, Skill Tree component, Onboarding flow, MicroInteractions library, ThreatTerminal animated hero, UI component library (EmptyState, Skeleton, Toast, ThemeToggle) |
| **2.0.0** | — | Adaptive Difficulty Engine — red-flag taxonomy (10 categories), vulnerability profiling, calibration phases, adaptive scenario selection, Vulnerability Radar SVG chart, Security IQ composite scoring |
| **1.0.0** | — | Initial platform — 8 training modules, 60+ scenarios, gamification (XP/badges/streaks), leaderboard, admin dashboard, Claude AI scenario generation, dark/light themes |

## 🔒 Security Note

This platform is designed for **educational purposes only**. All phishing emails, social engineering tactics, and attack scenarios are simulated for training. No actual malicious content is generated or distributed.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <a href="https://www.linkedin.com/in/mpalmer1234/">
    <img src="https://img.shields.io/badge/Built_by_Michael_Palmer-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn - Michael Palmer" />
  </a>
</p>

<p align="center">
  <strong>⭐ Star this repo if you find it useful! ⭐</strong>
</p>
