// ============================================
// Password Security Scenarios
// ============================================

import type { TrainingScenario } from './types';
import { scenarioImages } from './images';

export const passwordSecurityScenarios: TrainingScenario[] = [
  {
    id: 'pwd-001',
    moduleType: 'password-security',
    type: 'password-evaluation',
    title: 'Evaluate Password Strength',
    difficulty: 'beginner',
    content: {
      instruction: 'Which of these passwords is the STRONGEST?',
      passwords: [
        { id: 'a', password: 'password123', strength: 'weak' },
        { id: 'b', password: 'J@hn$m!th2024', strength: 'medium' },
        { id: 'c', password: 'Purple-Elephant-Dancing-42!', strength: 'strong' },
        { id: 'd', password: 'qwerty!@#', strength: 'weak' },
      ],
      correctAnswer: 'c',
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'The passphrase "Purple-Elephant-Dancing-42!" is strongest because it\'s long (26+ characters), uses random words, includes numbers and symbols, and is easy to remember but hard to crack. Length matters more than complexity alone.',
    learningPoints: [
      'Longer passwords are exponentially harder to crack',
      'Passphrases (random words) are both secure and memorable',
      'Common substitutions (@ for a) are easily cracked',
      'Personal information makes passwords guessable',
    ],
    image: scenarioImages.lock,
  },
  {
    id: 'pwd-002',
    moduleType: 'password-security',
    type: 'scenario',
    title: 'Password Manager Decision',
    difficulty: 'beginner',
    content: {
      scenario: 'Your company is rolling out a password manager. Your colleague says they prefer to keep passwords in a spreadsheet on their desktop because it\'s more convenient.',
      question: 'What\'s the best advice for your colleague?',
      options: [
        { id: 'a', text: 'A spreadsheet is fine as long as it\'s password protected', isCorrect: false },
        { id: 'b', text: 'Using a password manager is more secure because it encrypts passwords and can generate strong unique passwords', isCorrect: true },
        { id: 'c', text: 'Either method is equally secure', isCorrect: false },
        { id: 'd', text: 'Writing passwords in a notebook is safer than any digital method', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Password managers are specifically designed for secure credential storage. They use strong encryption, generate unique passwords for each site, auto-fill credentials safely, and alert you to breaches. Spreadsheets lack these security features.',
    learningPoints: [
      'Password managers use encryption designed for credential security',
      'They generate unique, strong passwords for each account',
      'Auto-fill prevents keystroke logging attacks',
      'Many detect if your credentials appear in data breaches',
    ],
    image: scenarioImages.lock,
  },
  {
    id: 'pwd-003',
    moduleType: 'password-security',
    type: 'scenario',
    title: 'Multi-Factor Authentication',
    difficulty: 'beginner',
    content: {
      scenario: 'You\'re setting up two-factor authentication (2FA) for your work accounts. Which method should you choose?',
      question: 'Rank these 2FA methods from most secure to least secure:',
      options: [
        { id: 'a', text: 'SMS text message codes', isCorrect: false },
        { id: 'b', text: 'Authenticator app (Google Authenticator, Microsoft Authenticator)', isCorrect: false },
        { id: 'c', text: 'Hardware security key (YubiKey)', isCorrect: true },
        { id: 'd', text: 'Email verification codes', isCorrect: false },
      ],
      correctRanking: ['c', 'b', 'a', 'd'],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Hardware security keys are most secure (phishing-resistant). Authenticator apps are next (not vulnerable to SIM swapping). SMS codes can be intercepted via SIM swapping. Email codes are weakest as email itself may be compromised.',
    learningPoints: [
      'Hardware keys are phishing-resistant and most secure',
      'Authenticator apps are excellent and widely supported',
      'SMS can be compromised through SIM swapping attacks',
      'Any 2FA is better than no 2FA',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'pwd-004',
    moduleType: 'password-security',
    type: 'scenario',
    title: 'Password Sharing Request',
    difficulty: 'intermediate',
    content: {
      scenario: 'Your manager asks you to share your login credentials so they can access a report while you\'re on vacation.',
      question: 'What\'s the best response?',
      options: [
        { id: 'a', text: 'Share your password - your manager has authority over you', isCorrect: false },
        { id: 'b', text: 'Share it verbally but not in writing', isCorrect: false },
        { id: 'c', text: 'Suggest alternatives: delegate access, export the report, or have IT set up temporary access', isCorrect: true },
        { id: 'd', text: 'Create a temporary password just for this purpose', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Never share passwords, even with managers. Most systems have legitimate ways to delegate access or share specific files. Sharing credentials violates security policies, creates accountability issues, and may expose you to blame if something goes wrong.',
    learningPoints: [
      'Never share passwords regardless of who asks',
      'Use delegation features built into systems',
      'Export reports or data as an alternative',
      'IT can set up temporary or delegated access properly',
    ],
    image: scenarioImages.office,
  },
  {
    id: 'pwd-005',
    moduleType: 'password-security',
    type: 'scenario',
    title: 'Data Breach Notification',
    difficulty: 'intermediate',
    content: {
      scenario: 'You receive a legitimate notification that a website you use has been breached and your password may have been exposed.',
      question: 'What actions should you take? (Select the MOST complete answer)',
      options: [
        { id: 'a', text: 'Change your password on that site', isCorrect: false },
        { id: 'b', text: 'Change the password and enable 2FA on that site', isCorrect: false },
        { id: 'c', text: 'Change passwords on that site AND any other sites where you used the same or similar password, then enable 2FA', isCorrect: true },
        { id: 'd', text: 'Wait to see if there\'s any suspicious activity before acting', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Password reuse is dangerous because one breach can compromise multiple accounts. When a site is breached, change passwords everywhere you used that same password, enable 2FA where available, and monitor for suspicious activity.',
    learningPoints: [
      'Password reuse means one breach = multiple compromises',
      'Use unique passwords for every site',
      'Enable 2FA whenever possible',
      'Check haveibeenpwned.com to see if you\'re in breaches',
    ],
    image: scenarioImages.warning,
  },
];
