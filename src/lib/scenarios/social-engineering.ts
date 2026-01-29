// ============================================
// Social Engineering Scenarios
// ============================================

import type { TrainingScenario } from './types';
import { scenarioImages } from './images';

export const socialEngineeringScenarios: TrainingScenario[] = [
  {
    id: 'se-001',
    moduleType: 'social-engineering',
    type: 'phone-call',
    title: 'IT Support Impersonation',
    difficulty: 'beginner',
    content: {
      scenario: 'You receive a phone call at your desk.',
      callerClaim: 'IT Help Desk',
      callerName: 'Mike from IT',
      conversation: [
        { speaker: 'caller', text: 'Hi, this is Mike from the IT Help Desk. We\'ve detected some unusual activity on your computer and need to verify your account.' },
        { speaker: 'caller', text: 'Can you confirm your username and password so I can check if your account has been compromised?' },
        { speaker: 'caller', text: 'This is urgent - if we don\'t verify now, we may have to disable your account for security reasons.' },
      ],
      options: [
        { id: 'a', text: 'Provide your username and password to help resolve the issue', isCorrect: false },
        { id: 'b', text: 'Ask for Mike\'s employee ID and call the IT Help Desk directly to verify', isCorrect: true },
        { id: 'c', text: 'Give only your username but not password', isCorrect: false },
        { id: 'd', text: 'Hang up immediately without saying anything', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Unsolicited call claiming IT emergency',
      'Requesting password over the phone',
      'Creating urgency with threats',
      'IT staff never ask for passwords',
    ],
    explanation: 'This is a classic pretexting attack where the caller impersonates IT support. Real IT staff NEVER ask for your password. The correct response is to verify the caller\'s identity by calling IT through official channels.',
    learningPoints: [
      'IT support will never ask for your password',
      'Always verify callers through official channels',
      'Don\'t be pressured by urgency tactics',
      'It\'s okay to say "let me verify this" and hang up',
    ],
    image: scenarioImages.phone,
  },
  {
    id: 'se-002',
    moduleType: 'social-engineering',
    type: 'in-person',
    title: 'Tailgating Attempt',
    difficulty: 'beginner',
    content: {
      scenario: 'You\'re entering the secure office building using your badge. A person in business attire approaches.',
      setting: 'Building entrance with badge reader',
      encounter: [
        { speaker: 'stranger', text: 'Oh, thank goodness! I left my badge at my desk and I\'m already late for a meeting with the VP.' },
        { speaker: 'stranger', text: 'Could you just hold the door? I work on the 5th floor in Marketing. I\'m Sarah.' },
        { speaker: 'stranger', text: 'I really appreciate it - I\'ll definitely grab my badge right after the meeting.' },
      ],
      options: [
        { id: 'a', text: 'Hold the door since they seem professional and in a hurry', isCorrect: false },
        { id: 'b', text: 'Politely decline and direct them to security or reception', isCorrect: true },
        { id: 'c', text: 'Ask to see their employee ID before letting them in', isCorrect: false },
        { id: 'd', text: 'Ignore them and let the door close', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Requesting to bypass security controls',
      'Using urgency (late for meeting)',
      'Name-dropping (meeting with VP)',
      'Playing on your desire to be helpful',
    ],
    explanation: 'This is a tailgating attack using social pressure. Even if the person seems legitimate, allowing unauthorized access puts everyone at risk. The polite but firm response is to direct them to proper channels (security/reception).',
    learningPoints: [
      'Never let someone bypass badge access, even if they seem legitimate',
      'Direct people to security or reception politely',
      'Real employees understand the security policy',
      'It\'s not rude to protect your workplace',
    ],
    image: scenarioImages.office,
  },
  {
    id: 'se-003',
    moduleType: 'social-engineering',
    type: 'phone-call',
    title: 'Vendor Verification',
    difficulty: 'intermediate',
    content: {
      scenario: 'You receive a call from someone claiming to be from a vendor your company uses.',
      callerClaim: 'TechSupply Inc - Your IT vendor',
      callerName: 'Jennifer',
      conversation: [
        { speaker: 'caller', text: 'Hi, this is Jennifer from TechSupply. We\'re updating our billing system and need to verify your company\'s payment information.' },
        { speaker: 'caller', text: 'I have most of it, I just need to confirm the routing number and account number for direct payments.' },
        { speaker: 'caller', text: 'This is time-sensitive as we\'re migrating systems tonight and need all clients verified.' },
      ],
      options: [
        { id: 'a', text: 'Provide the information since TechSupply is a known vendor', isCorrect: false },
        { id: 'b', text: 'Tell them you\'ll call TechSupply\'s official number to complete the verification', isCorrect: true },
        { id: 'c', text: 'Ask them to send an email request to your finance department', isCorrect: false },
        { id: 'd', text: 'Provide partial information to seem cooperative', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Unsolicited call requesting financial information',
      'Time pressure (migrating systems tonight)',
      'Requesting sensitive banking details',
      'Initiated by them, not you',
    ],
    explanation: 'Even if you do business with a vendor, you should never provide sensitive financial information based on an incoming call. Legitimate vendors will have your information on file and won\'t need to "verify" full account details over the phone.',
    learningPoints: [
      'Never provide financial info on incoming calls',
      'Always call vendors back using known, official numbers',
      'Legitimate businesses don\'t need full account details for "verification"',
      'Time pressure is a manipulation tactic',
    ],
    image: scenarioImages.phone,
  },
  {
    id: 'se-004',
    moduleType: 'social-engineering',
    type: 'email',
    title: 'Quid Pro Quo Attack',
    difficulty: 'intermediate',
    content: {
      scenario: 'You receive an email offering free software that could help with your work.',
      from: 'ProductivityTools Pro',
      fromEmail: 'deals@prodtools-free.com',
      subject: 'Free Premium Software License - Exclusive Offer',
      body: `Congratulations! You've been selected for a free 1-year license of ProductivityTools Pro (normally $299/year).

To claim your free license:
1. Download the installer: prodtools-free.com/download
2. Run the setup wizard
3. Enter code: FREE2024PRO when prompted

This offer is only valid for 48 hours.

Note: You may need to temporarily disable your antivirus during installation.`,
      options: [
        { id: 'a', text: 'Download the software - free tools are always helpful', isCorrect: false },
        { id: 'b', text: 'Delete the email and report it as suspicious', isCorrect: true },
        { id: 'c', text: 'Forward to IT to check if it\'s legitimate', isCorrect: false },
        { id: 'd', text: 'Download but don\'t disable antivirus', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      '"Disable antivirus" instruction is a huge red flag',
      'Unsolicited "free" expensive software',
      'Time pressure (48 hours)',
      'Unknown sender offering something for nothing',
      'Download from unofficial source',
    ],
    explanation: 'This is a quid pro quo attack - offering something valuable in exchange for compromising your security. The "disable antivirus" instruction reveals malicious intent. No legitimate software requires disabling security.',
    learningPoints: [
      'NEVER disable antivirus to install software',
      'If it sounds too good to be true, it probably is',
      'Only download software from official sources',
      'Free offers from unknown sources often contain malware',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'se-005',
    moduleType: 'social-engineering',
    type: 'phone-call',
    title: 'Vishing - Bank Fraud Department',
    difficulty: 'advanced',
    content: {
      scenario: 'You receive an urgent call from someone claiming to be your bank\'s fraud department.',
      callerClaim: 'Chase Bank Fraud Prevention',
      callerName: 'David Chen',
      conversation: [
        { speaker: 'caller', text: 'This is David Chen from Chase Fraud Prevention. We\'ve detected suspicious activity on your account - someone may be attempting unauthorized transactions right now.' },
        { speaker: 'caller', text: 'To protect your account, I need to verify your identity. Can you confirm the last 4 of your social and your PIN?' },
        { speaker: 'caller', text: 'I understand your concern. Would you feel more comfortable if I read you your current balance to prove I\'m from Chase? It shows $4,238.52.' },
      ],
      options: [
        { id: 'a', text: 'Provide the information since they knew your balance', isCorrect: false },
        { id: 'b', text: 'Ask for their direct callback number at Chase', isCorrect: false },
        { id: 'c', text: 'Hang up and call the number on the back of your Chase card', isCorrect: true },
        { id: 'd', text: 'Give only the last 4 of social, not the PIN', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Requesting PIN (banks never ask for PIN)',
      'Requesting SSN digits',
      'Creating urgency with "right now"',
      'Knowing balance doesn\'t prove legitimacy (could be from data breach)',
      'Unsolicited call about fraud',
    ],
    explanation: 'This is sophisticated vishing (voice phishing). Even knowing your balance doesn\'t prove legitimacy - this info could come from previous data breaches. Banks NEVER ask for your full PIN or SSN over the phone. Always hang up and call your bank directly.',
    learningPoints: [
      'Banks never ask for your PIN over the phone',
      'Scammers may have partial info from data breaches',
      'Always call your bank using the official number',
      'Knowing account details doesn\'t prove identity',
      'Legitimate fraud departments will tell you to call them back',
    ],
    image: scenarioImages.phone,
  },
];
