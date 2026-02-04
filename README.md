# CyberShield 🛡️

[![LinkedIn](https://img.shields.io/badge/Connect_with_me-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mpalmer1234/)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

AI-powered cybersecurity training platform with an **Adaptive Difficulty Engine** that learns your weaknesses and personalizes training to close your security gaps. Transforms employees into your strongest line of defense against phishing, social engineering, and cyber attacks.

![CyberShield Hero](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80)

## ✨ Features

- **🧠 Adaptive Difficulty Engine** — Tracks which threat types you miss and dynamically weights future scenarios toward your weak spots
- **📊 Vulnerability Radar** — Interactive SVG radar chart showing detection rates across 10 threat categories
- **🎯 Security IQ Score** — Weighted composite score reflecting your overall threat detection ability
- **🤖 AI-Powered Training** — Claude AI generates dynamic, realistic scenarios that adapt to user skill level
- **📚 8 Training Modules** — Comprehensive coverage from phishing detection to advanced threat hunting
- **🎮 Gamification System** — XP, levels, badges, and streaks to keep users engaged
- **💬 Real-time Feedback** — Instant coaching and explanations during exercises
- **📈 Progress Tracking** — Detailed analytics, completion tracking, and vulnerability profiling
- **🏆 Leaderboard** — Compete with colleagues and track team performance
- **🌗 Dark/Light Themes** — Full theme support with beautiful cyber-themed UI
- **🧪 Comprehensive Test Suite** — Jest + React Testing Library coverage

## 🧠 Adaptive Difficulty Engine (v2.0)

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

### Vulnerability Radar

The progress page features an interactive SVG radar chart that visualizes your detection rates across all 10 categories. Each vertex is color-coded — green (≥70%), yellow (40–69%), red (<40%) — with hover tooltips showing exact stats and an expandable breakdown panel with animated progress bars.

### Architecture

```
src/lib/adaptive/
├── red-flag-taxonomy.ts    # 10 categories + keyword classifier
├── engine.ts               # Core: profiling, scoring, adaptive selection
└── index.ts                # Barrel exports

src/components/
└── VulnerabilityRadar.tsx  # SVG radar chart + insights panel

src/store/index.ts
└── useVulnerabilityStore   # Persisted Zustand store (localStorage)
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
git clone https://github.com/yourusername/cyber-shield.git
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
│   │   ├── admin/                  # Admin dashboard
│   │   ├── api/                    # API routes
│   │   │   ├── ai/                 # Claude AI integration
│   │   │   └── scenarios/          # Training scenarios
│   │   ├── leaderboard/            # Leaderboard page
│   │   ├── progress/               # Progress + vulnerability radar
│   │   ├── settings/               # User settings
│   │   └── training/               # Training modules
│   │       └── [id]/               # Dynamic module pages (adaptive)
│   ├── components/                 # React components
│   │   ├── ui/                     # Reusable UI components
│   │   ├── ChatInterface.tsx       # AI chat component
│   │   ├── ModuleCard.tsx          # Training module cards
│   │   ├── VulnerabilityRadar.tsx  # SVG radar chart + insights
│   │   └── ...
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utility functions
│   │   ├── adaptive/               # Adaptive Difficulty Engine
│   │   │   ├── red-flag-taxonomy.ts
│   │   │   ├── engine.ts
│   │   │   └── index.ts
│   │   ├── scenarios/              # 60+ training scenarios (8 modules)
│   │   └── utils.ts                # Shared utilities
│   ├── store/                      # Zustand state management (6 stores)
│   └── types/                      # TypeScript definitions (30+ interfaces)
├── __tests__/                      # Test files
├── public/                         # Static assets
└── ...config files
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand (6 persisted stores) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **AI Integration** | Anthropic Claude API |
| **Testing** | Jest + React Testing Library |

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

1. **Select a Module** — Choose from 8 training modules based on your skill level
2. **Adaptive Scenarios** — The engine selects scenarios targeting your weakest threat categories (after 3 calibration sessions)
3. **Make Decisions** — Identify threats, respond to incidents, or spot social engineering
4. **Get Feedback** — Receive instant AI-powered coaching and explanations
5. **Build Your Profile** — Every answer updates your vulnerability profile across 10 threat categories
6. **Track Your Radar** — Watch your detection rates improve on the interactive vulnerability radar chart
7. **Earn Rewards** — Gain XP, unlock badges, and climb the leaderboard

## 📊 Data Persistence

All user data is stored locally via Zustand's persist middleware with localStorage:

| Store | Key | What It Stores |
|-------|-----|----------------|
| Progress | `cybershield-progress` | Module completion, XP, level, badges, streaks |
| Settings | `cybershield-settings` | Dark mode, sound, difficulty, accessibility |
| Vulnerability | `cybershield-vulnerability` | Adaptive profile, category stats, session history (last 200 results) |

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
