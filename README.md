# CyberShield 🛡️

[![LinkedIn](https://img.shields.io/badge/Connect_with_me-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mpalmer1234/)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

AI-powered cybersecurity training platform that transforms employees into your strongest line of defense against phishing, social engineering, and cyber attacks.

![CyberShield Hero](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80)

## ✨ Features 

- **AI-Powered Training** — Claude AI generates dynamic, realistic scenarios that adapt to user skill level
- **8 Training Modules** — Comprehensive coverage from phishing detection to advanced threat hunting
- **Gamification System** — XP, levels, badges, and streaks to keep users engaged
- **Real-time Feedback** — Instant coaching and explanations during exercises
- **Progress Tracking** — Detailed analytics and completion tracking
- **Leaderboard** — Compete with colleagues and track team performance
- **Dark/Light Themes** — Full theme support with beautiful cyber-themed UI
- **Comprehensive Test Suite** — Jest + React Testing Library coverage

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
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API routes
│   │   │   ├── ai/             # Claude AI integration
│   │   │   └── scenarios/      # Training scenarios
│   │   ├── leaderboard/        # Leaderboard page
│   │   ├── progress/           # User progress page
│   │   ├── settings/           # User settings
│   │   └── training/           # Training modules
│   │       └── [id]/           # Dynamic module pages
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── ChatInterface.tsx   # AI chat component
│   │   ├── ModuleCard.tsx      # Training module cards
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── store/                  # Zustand state management
│   └── types/                  # TypeScript definitions
├── __tests__/                  # Test files
├── public/                     # Static assets
└── ...config files
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
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
2. **Interactive Scenarios** — Engage with AI-generated realistic cybersecurity scenarios
3. **Make Decisions** — Identify threats, respond to incidents, or spot social engineering
4. **Get Feedback** — Receive instant AI-powered coaching and explanations
5. **Earn Rewards** — Gain XP, unlock badges, and climb the leaderboard
6. **Track Progress** — Monitor your improvement across all security domains

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
