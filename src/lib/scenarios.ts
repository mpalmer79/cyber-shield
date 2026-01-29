// ============================================
// CyberShield - Pre-built Training Scenarios
// ============================================

import type { PhishingScenario, DifficultyLevel } from '@/types';

// Generic scenario type for all module types
export interface TrainingScenario {
  id: string;
  moduleType: string;
  type: string;
  title: string;
  difficulty: DifficultyLevel;
  content: Record<string, unknown>;
  isCorrectAnswer: boolean; // true = threat/phishing, false = legitimate
  redFlags: string[];
  explanation: string;
  learningPoints: string[];
  image?: string;
}

// Stock images for scenarios
export const scenarioImages = {
  email: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80',
  sms: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80',
  browser: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  lock: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80',
  hacker: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  phone: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
  security: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  warning: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
  success: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
};

// ============================================
// PHISHING DETECTION SCENARIOS
// ============================================

export const phishingScenarios: TrainingScenario[] = [
  {
    id: 'phish-001',
    moduleType: 'phishing',
    type: 'email',
    title: 'IT Password Reset',
    difficulty: 'beginner',
    content: {
      from: 'IT Security Team',
      fromEmail: 'security@company-support.net',
      to: 'you@company.com',
      subject: 'URGENT: Your Password Expires in 24 Hours',
      body: `Dear Employee,

Your network password will expire in 24 hours. To avoid losing access to your account, please click the link below to verify your credentials immediately:

https://company-secure-login.net/verify

This is an automated message. Please do not reply.

Best regards,
IT Security Department`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Urgency tactics ("URGENT", "24 hours")',
      'Suspicious sender domain (company-support.net)',
      'Generic greeting ("Dear Employee")',
      'Suspicious link domain (company-secure-login.net)',
      'Pressure to act immediately',
    ],
    explanation: 'This is a classic phishing attempt using urgency and impersonation. The sender domain doesn\'t match your actual company, and the link leads to a suspicious external site. Legitimate IT departments typically don\'t ask you to verify credentials via email links.',
    learningPoints: [
      'Always verify the sender\'s email domain matches your company',
      'Be suspicious of urgent requests for credentials',
      'Hover over links to check the actual destination',
      'Contact IT directly through known channels when in doubt',
    ],
    image: scenarioImages.email,
  },
  {
    id: 'phish-002',
    moduleType: 'phishing',
    type: 'email',
    title: 'Legitimate Meeting Invite',
    difficulty: 'beginner',
    content: {
      from: 'Sarah Johnson',
      fromEmail: 'sarah.johnson@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Team Sync - Q1 Review Meeting',
      body: `Hi Team,

I'd like to schedule our quarterly review meeting for next Tuesday at 2:00 PM in Conference Room B.

Agenda:
- Q1 Performance Review
- Q2 Goals Discussion
- Team Updates

Please confirm your availability by replying to this email.

Best,
Sarah Johnson
Marketing Director`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: false, // This is LEGITIMATE
    redFlags: [],
    explanation: 'This is a legitimate business email. The sender\'s email matches your company domain, there\'s no urgency or pressure, no suspicious links, and it\'s a normal business request for a meeting.',
    learningPoints: [
      'Legitimate emails typically come from your actual company domain',
      'Normal business communications don\'t pressure you to act immediately',
      'Meeting invites without suspicious links are usually safe',
    ],
    image: scenarioImages.office,
  },
  {
    id: 'phish-003',
    moduleType: 'phishing',
    type: 'email',
    title: 'Package Delivery Notification',
    difficulty: 'beginner',
    content: {
      from: 'UPS Delivery',
      fromEmail: 'delivery-notification@ups-tracking.info',
      to: 'you@email.com',
      subject: 'Your Package Could Not Be Delivered - Action Required',
      body: `Dear Customer,

We attempted to deliver your package today but were unable to complete the delivery. Your package is being held at our facility.

To schedule a new delivery, please click here to update your address:
http://ups-redelivery-schedule.com/track?id=8827361

If no action is taken within 48 hours, your package will be returned to sender.

UPS Delivery Services
Tracking Number: 1Z999AA10123456784`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Suspicious sender domain (ups-tracking.info instead of ups.com)',
      'Pressure with deadline (48 hours)',
      'Suspicious link domain (ups-redelivery-schedule.com)',
      'Generic greeting without your name',
      'Unexpected delivery notification',
    ],
    explanation: 'This is a phishing email impersonating UPS. Real UPS notifications come from @ups.com domain. The link leads to a fake website designed to steal your information. Always track packages directly on the official UPS website.',
    learningPoints: [
      'Major shipping companies use their official domain (.com)',
      'Check for unexpected packages - did you order something?',
      'Go directly to the company\'s official website to track packages',
      'Be wary of threats about returning packages',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'phish-004',
    moduleType: 'phishing',
    type: 'sms',
    title: 'Bank Security Alert',
    difficulty: 'intermediate',
    content: {
      sender: '+1-800-555-0123',
      message: 'CHASE ALERT: Unusual activity detected on your account ending in 4521. If this wasn\'t you, call immediately: 1-888-555-0199 or visit chase-secure-verify.com to verify your identity.',
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Suspicious phone number (not Chase\'s official number)',
      'Suspicious domain (chase-secure-verify.com)',
      'Creates urgency and fear',
      'Requests you call a non-official number',
      'Partial account number could be guessed',
    ],
    explanation: 'This SMS (smishing) attack impersonates Chase Bank. Real banks use official short codes, not random phone numbers. The website domain is fake. Always call the number on the back of your card or visit the official bank website directly.',
    learningPoints: [
      'Banks use official short codes, not regular phone numbers',
      'Never call numbers provided in suspicious texts',
      'Always use the phone number on your actual card',
      'Verify alerts by logging into your official bank app',
    ],
    image: scenarioImages.phone,
  },
  {
    id: 'phish-005',
    moduleType: 'phishing',
    type: 'email',
    title: 'CEO Wire Transfer Request',
    difficulty: 'intermediate',
    content: {
      from: 'John Smith (CEO)',
      fromEmail: 'john.smith.ceo@gmail.com',
      to: 'you@yourcompany.com',
      subject: 'Urgent: Wire Transfer Needed',
      body: `Hi,

I'm in a meeting and can't talk right now, but I need you to process an urgent wire transfer for a confidential acquisition we're closing today.

Amount: $47,500
Account: Wells Fargo
Routing: 121000248
Account Number: 4829105736

Please process this immediately and confirm via email. Do not discuss this with anyone else as it's confidential.

Thanks,
John Smith
CEO

Sent from my iPhone`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing (BEC attack)
    redFlags: [
      'Gmail address instead of company email',
      'CEO requesting wire transfer via email',
      'Urgency and pressure to act immediately',
      'Request for confidentiality/secrecy',
      'Bypassing normal approval processes',
      '"Sent from my iPhone" attempting to explain informal message',
    ],
    explanation: 'This is a Business Email Compromise (BEC) attack. Scammers impersonate executives to trick employees into sending money. Real CEOs use company email and follow proper financial processes. Always verify unusual requests through a separate communication channel.',
    learningPoints: [
      'Executives should always use company email for business',
      'Wire transfer requests require verbal confirmation',
      'Secrecy requests are a major red flag',
      'Always follow established financial approval processes',
      'Call the person directly using a known number to verify',
    ],
    image: scenarioImages.hacker,
  },
  {
    id: 'phish-006',
    moduleType: 'phishing',
    type: 'email',
    title: 'Microsoft 365 Storage Alert',
    difficulty: 'intermediate',
    content: {
      from: 'Microsoft 365',
      fromEmail: 'no-reply@microsoft365-alerts.com',
      to: 'you@company.com',
      subject: 'Your OneDrive storage is almost full',
      body: `Your Microsoft 365 Storage Alert

Your OneDrive storage is 98% full. You won't be able to save new files until you free up space or upgrade your storage plan.

Current Usage: 4.9 GB of 5 GB

[Upgrade Storage Now] - Button links to: http://microsoft365-storage-upgrade.com/plans

If you believe this is an error, please visit your account settings.

This is an automated message from Microsoft 365.
Microsoft Corporation, One Microsoft Way, Redmond, WA 98052`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Suspicious sender domain (microsoft365-alerts.com)',
      'Link to non-Microsoft domain',
      'Generic without your actual name',
      'Creates urgency about losing functionality',
      'Professional-looking but fake branding',
    ],
    explanation: 'This email impersonates Microsoft with a convincing design. However, real Microsoft emails come from @microsoft.com domains. The link goes to a phishing site. Always manage your Microsoft storage through the official microsoft.com website or your Microsoft 365 admin portal.',
    learningPoints: [
      'Microsoft emails come from @microsoft.com only',
      'Check storage issues directly in your OneDrive settings',
      'Hover over buttons to see the actual link destination',
      'Professional appearance doesn\'t mean it\'s legitimate',
    ],
    image: scenarioImages.email,
  },
  {
    id: 'phish-007',
    moduleType: 'phishing',
    type: 'email',
    title: 'Legitimate HR Benefits Update',
    difficulty: 'intermediate',
    content: {
      from: 'HR Benefits Team',
      fromEmail: 'benefits@yourcompany.com',
      to: 'all-employees@yourcompany.com',
      subject: 'Open Enrollment Period - Benefits Selection Reminder',
      body: `Dear Team,

This is a reminder that the annual benefits open enrollment period runs from November 1-15.

During this time, you can:
• Review and update your health insurance selections
• Modify your 401(k) contributions  
• Update beneficiary information
• Enroll in voluntary benefits

To make your selections, please log into the HR portal at hr.yourcompany.com using your company credentials.

If you have questions, please contact the HR team at hr@yourcompany.com or ext. 2100.

Best regards,
Human Resources`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: false, // This is LEGITIMATE
    redFlags: [],
    explanation: 'This is a legitimate HR communication. The email comes from your company domain, references your internal HR portal with a proper company URL, provides a legitimate contact method (internal extension), and describes a normal business process without unusual urgency.',
    learningPoints: [
      'Legitimate emails use your actual company domain',
      'Internal portals should match your company\'s URL pattern',
      'Normal business processes have reasonable timelines',
      'When in doubt, verify with HR directly using known contact info',
    ],
    image: scenarioImages.office,
  },
  {
    id: 'phish-008',
    moduleType: 'phishing',
    type: 'email',
    title: 'Invoice Attachment Scam',
    difficulty: 'advanced',
    content: {
      from: 'Accounts Payable',
      fromEmail: 'ap@vendor-invoices.yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'RE: Invoice #INV-2024-0892 - Payment Overdue',
      body: `Hi,

Following up on our previous conversation, please find attached the updated invoice for the services rendered last month. The payment is now 15 days overdue.

Invoice Amount: $3,247.00
Due Date: Was October 15, 2024

Please process the attached invoice at your earliest convenience to avoid any late fees.

Attachment: Invoice_INV-2024-0892.pdf.exe (247 KB)

Best regards,
Accounts Payable Team`,
      timestamp: new Date().toISOString(),
      attachments: ['Invoice_INV-2024-0892.pdf.exe'],
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Suspicious subdomain (vendor-invoices.yourcompany.com)',
      'Double extension on attachment (.pdf.exe is malware)',
      '"RE:" without prior conversation',
      'Pressure with overdue notice',
      'No specific vendor name mentioned',
      'Generic reference to "services rendered"',
    ],
    explanation: 'This is a malware delivery attack. The attachment has a double extension (.pdf.exe), which is a classic technique to disguise an executable as a PDF. The "RE:" in the subject creates false familiarity. The subdomain looks legitimate but is likely compromised or spoofed.',
    learningPoints: [
      'Never open attachments with double extensions',
      '.exe files are programs, not documents',
      'Be suspicious of "RE:" emails you didn\'t initiate',
      'Verify invoices with known vendor contacts',
      'Check subdomains carefully - they can be spoofed',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'phish-009',
    moduleType: 'phishing',
    type: 'sms',
    title: 'Package Delivery SMS',
    difficulty: 'beginner',
    content: {
      sender: '56789',
      message: 'USPS: Your package has shipped! Track delivery: usps-tracking-update.com/pkg/839201',
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Suspicious domain (usps-tracking-update.com)',
      'Random short code sender',
      'Vague "your package" without details',
      'Unexpected delivery notification',
    ],
    explanation: 'This is a smishing (SMS phishing) attack impersonating USPS. The link leads to a fake website. Real USPS tracking links go to usps.com. Always track packages directly through the official USPS website or app.',
    learningPoints: [
      'USPS tracking links always use usps.com',
      'Be suspicious of unexpected delivery notifications',
      'Type official URLs directly instead of clicking links',
      'Real shipping notifications include specific tracking numbers',
    ],
    image: scenarioImages.phone,
  },
  {
    id: 'phish-010',
    moduleType: 'phishing',
    type: 'email',
    title: 'Password Expiration - Advanced',
    difficulty: 'advanced',
    content: {
      from: 'IT Security',
      fromEmail: 'it-security@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Password Expiration Notice - Action Required by EOD',
      body: `Dear Employee,

According to our security policy, your password is set to expire today at 11:59 PM EST.

To ensure uninterrupted access to company systems, please update your password using our secure portal:

https://yourcompany.com.password-reset.net/update

Current Password Age: 89 days
Required Rotation: Every 90 days

Important: If you do not update your password before expiration, you will be locked out of all company systems including email, VPN, and internal applications.

For assistance, contact the IT Help Desk at helpdesk@yourcompany.com

IT Security Team`,
      timestamp: new Date().toISOString(),
    },
    isCorrectAnswer: true, // This IS phishing
    redFlags: [
      'Suspicious domain structure (yourcompany.com.password-reset.net)',
      'The actual domain is password-reset.net, not yourcompany.com',
      'End of day deadline creates artificial urgency',
      'Threat of being "locked out" of all systems',
      'Professional tone designed to seem legitimate',
    ],
    explanation: 'This is a sophisticated phishing attempt. The URL is crafted to look legitimate at first glance, but "yourcompany.com" is actually a subdomain of "password-reset.net" (the real domain). This technique exploits how people read URLs left-to-right. Always verify the actual domain by looking at what comes just before the .com/.net/.org.',
    learningPoints: [
      'Check the actual domain in URLs (what\'s before the TLD)',
      'Subdomains can be used to make URLs look legitimate',
      'Password resets should go through your known IT portal',
      'When in doubt, navigate to the site directly, don\'t click links',
      'Real IT departments typically give more notice for password changes',
    ],
    image: scenarioImages.security,
  },
];

// ============================================
// SOCIAL ENGINEERING SCENARIOS
// ============================================

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
    isCorrectAnswer: true, // This IS a social engineering attack
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
    isCorrectAnswer: true, // This IS a social engineering attack
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
    isCorrectAnswer: true, // This IS a social engineering attack
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
    isCorrectAnswer: true, // This IS a social engineering attack
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
    isCorrectAnswer: true, // This IS a social engineering attack
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

// ============================================
// PASSWORD SECURITY SCENARIOS
// ============================================

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
    isCorrectAnswer: true, // C is the correct answer
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
    isCorrectAnswer: true, // B is correct
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
    isCorrectAnswer: true, // C (Hardware key) is most secure
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
    isCorrectAnswer: true, // C is correct
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
    isCorrectAnswer: true, // C is the most complete answer
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

// ============================================
// SECURE BROWSING SCENARIOS
// ============================================

export const secureBrowsingScenarios: TrainingScenario[] = [
  {
    id: 'browse-001',
    moduleType: 'secure-browsing',
    type: 'url-evaluation',
    title: 'Identify Safe URLs',
    difficulty: 'beginner',
    content: {
      instruction: 'Which URL is SAFE to visit for online banking with Chase?',
      urls: [
        { id: 'a', url: 'http://chase.com/login', safe: false, reason: 'Uses HTTP instead of HTTPS' },
        { id: 'b', url: 'https://chase.com.secure-login.net/banking', safe: false, reason: 'Domain is secure-login.net, not chase.com' },
        { id: 'c', url: 'https://secure.chase.com/web/auth/login', safe: true, reason: 'Legitimate HTTPS subdomain of chase.com' },
        { id: 'd', url: 'https://www.chase-bank-login.com/', safe: false, reason: 'Lookalike domain, not chase.com' },
      ],
      correctAnswer: 'c',
    },
    isCorrectAnswer: true, // C is correct
    redFlags: [],
    explanation: 'Only option C is safe. It uses HTTPS and the domain is chase.com (secure.chase.com is a valid subdomain). The others use HTTP (insecure), are different domains mimicking Chase, or use deceptive subdomain structures.',
    learningPoints: [
      'Always look for HTTPS (not HTTP) for sensitive sites',
      'Check the actual domain before the first "/" ',
      'Subdomains come BEFORE the main domain',
      'Legitimate banks use their official domain',
    ],
    image: scenarioImages.browser,
  },
  {
    id: 'browse-002',
    moduleType: 'secure-browsing',
    type: 'scenario',
    title: 'Browser Security Warning',
    difficulty: 'beginner',
    content: {
      scenario: 'You\'re trying to access a website and your browser shows a warning: "Your connection is not private. Attackers might be trying to steal your information."',
      question: 'What should you do?',
      options: [
        { id: 'a', text: 'Click "Advanced" and proceed anyway - it\'s probably just a certificate error', isCorrect: false },
        { id: 'b', text: 'Don\'t proceed, especially if you were going to enter personal information', isCorrect: true },
        { id: 'c', text: 'Proceed if the site looks professional and trustworthy', isCorrect: false },
        { id: 'd', text: 'Try a different browser to see if the warning goes away', isCorrect: false },
      ],
    },
    isCorrectAnswer: true, // B is correct
    redFlags: [],
    explanation: 'Browser security warnings exist to protect you. A certificate error could indicate a man-in-the-middle attack where someone is intercepting your connection. Never enter sensitive information on a site showing security warnings.',
    learningPoints: [
      'Browser security warnings are there to protect you',
      'Certificate errors can indicate active attacks',
      'Never enter personal info on sites with warnings',
      'If the site is important, contact them directly to report the issue',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'browse-003',
    moduleType: 'secure-browsing',
    type: 'scenario',
    title: 'Pop-up Warning',
    difficulty: 'beginner',
    content: {
      scenario: 'While browsing, a pop-up appears saying "Your computer is infected! Call Microsoft Support immediately: 1-888-555-0123 to fix this issue!"',
      question: 'What should you do?',
      options: [
        { id: 'a', text: 'Call the number to get help - Microsoft detected a problem', isCorrect: false },
        { id: 'b', text: 'Close the browser tab/window and run your legitimate antivirus software', isCorrect: true },
        { id: 'c', text: 'Click the X on the pop-up to close it', isCorrect: false },
        { id: 'd', text: 'Download the suggested security software from the pop-up', isCorrect: false },
      ],
    },
    isCorrectAnswer: true, // B is correct
    redFlags: [],
    explanation: 'This is a tech support scam. Microsoft doesn\'t show pop-ups with phone numbers. Clicking anything on the pop-up (even X) might trigger more pop-ups or downloads. Close the entire browser, run your real antivirus, and never call numbers from pop-ups.',
    learningPoints: [
      'Legitimate companies don\'t show infection pop-ups with phone numbers',
      'Close the browser entirely, don\'t interact with scam pop-ups',
      'Use your actual antivirus software for security scans',
      'Never call numbers from pop-ups or download their software',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'browse-004',
    moduleType: 'secure-browsing',
    type: 'scenario',
    title: 'Public WiFi Safety',
    difficulty: 'intermediate',
    content: {
      scenario: 'You\'re at a coffee shop and need to check your bank account. The shop has free WiFi called "CoffeeShop_Free_WiFi".',
      question: 'What\'s the safest approach?',
      options: [
        { id: 'a', text: 'Connect and check your account - it\'s a known coffee shop', isCorrect: false },
        { id: 'b', text: 'Use your phone\'s mobile data (cellular) instead of WiFi for banking', isCorrect: true },
        { id: 'c', text: 'Connect and use the bank\'s app since apps are secure', isCorrect: false },
        { id: 'd', text: 'Ask the staff for the WiFi password to ensure it\'s legitimate', isCorrect: false },
      ],
    },
    isCorrectAnswer: true, // B is correct
    redFlags: [],
    explanation: 'Public WiFi, even legitimate networks, can be monitored or spoofed. For sensitive activities like banking, use your mobile data (cellular connection) which is encrypted between your phone and the cell tower. If you must use public WiFi, use a VPN.',
    learningPoints: [
      'Public WiFi can be monitored by attackers',
      'Use mobile data for sensitive activities',
      'VPNs add encryption on public networks',
      'Even legitimate WiFi can have malicious users on the same network',
    ],
    image: scenarioImages.browser,
  },
  {
    id: 'browse-005',
    moduleType: 'secure-browsing',
    type: 'scenario',
    title: 'Browser Extension Safety',
    difficulty: 'intermediate',
    content: {
      scenario: 'You find a browser extension that claims to save you money by automatically finding coupon codes. It requests permissions to "Read and change all your data on all websites."',
      question: 'Should you install this extension?',
      options: [
        { id: 'a', text: 'Yes, if it has good reviews and many downloads', isCorrect: false },
        { id: 'b', text: 'No, the permissions are too broad for its stated purpose', isCorrect: true },
        { id: 'c', text: 'Yes, you can always uninstall it later if there\'s a problem', isCorrect: false },
        { id: 'd', text: 'Yes, browser extensions are safe because they\'re in the official store', isCorrect: false },
      ],
    },
    isCorrectAnswer: true, // B is correct
    redFlags: [],
    explanation: 'The permission to "read and change all your data on all websites" is extremely powerful. A coupon finder shouldn\'t need access to your banking site, email, or social media. Malicious extensions with broad permissions can steal passwords, track browsing, and inject ads.',
    learningPoints: [
      'Always review extension permissions before installing',
      'Permissions should match the extension\'s purpose',
      '"Read all data on all websites" is a dangerous permission',
      'Even popular extensions can be compromised or sold to malicious actors',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'browse-006',
    moduleType: 'secure-browsing',
    type: 'scenario',
    title: 'Download Source Verification',
    difficulty: 'intermediate',
    content: {
      scenario: 'You need to download a popular PDF reader. A Google search shows several download sites. Which should you use?',
      question: 'Select the safest download source:',
      options: [
        { id: 'a', text: 'free-pdf-reader-download.com - appears first in search results', isCorrect: false },
        { id: 'b', text: 'softpedia.com - a known software download site', isCorrect: false },
        { id: 'c', text: 'adobe.com/acrobat - the official Adobe website', isCorrect: true },
        { id: 'd', text: 'download.cnet.com - CNET is a trusted tech news site', isCorrect: false },
      ],
    },
    isCorrectAnswer: true, // C is correct
    redFlags: [],
    explanation: 'Always download software from the official vendor\'s website. Third-party download sites, even well-known ones, may bundle unwanted software (PUPs), have outdated versions, or in worst cases, distribute malware-infected copies.',
    learningPoints: [
      'Download software only from official vendor websites',
      'Third-party sites may bundle unwanted programs',
      'Search results can include ads for fake download sites',
      'Verify the URL matches the official vendor domain',
    ],
    image: scenarioImages.browser,
  },
];

// ============================================
// INCIDENT RESPONSE SCENARIOS
// ============================================

export const incidentResponseScenarios: TrainingScenario[] = [
  {
    id: 'ir-001',
    moduleType: 'incident-response',
    type: 'scenario',
    title: 'Ransomware Alert',
    difficulty: 'intermediate',
    content: {
      scenario: 'It\'s Monday morning and multiple employees report they cannot access their files. Their screens display a message demanding Bitcoin payment to unlock their data. The IT help desk is flooded with calls.',
      alertDetails: {
        time: '8:47 AM',
        affectedSystems: '23 workstations',
        ransom: '5 Bitcoin ($150,000)',
        deadline: '48 hours',
      },
      question: 'What should be your FIRST action as the incident responder?',
      options: [
        { id: 'a', text: 'Pay the ransom to restore operations quickly', isCorrect: false },
        { id: 'b', text: 'Immediately disconnect affected systems from the network to contain spread', isCorrect: true },
        { id: 'c', text: 'Try to decrypt the files using online tools', isCorrect: false },
        { id: 'd', text: 'Send a company-wide email warning everyone about the attack', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Ransomware spreads laterally through networks',
      'Time pressure from ransom deadline',
      'Multiple systems affected simultaneously',
      'Payment doesn\'t guarantee data recovery',
    ],
    explanation: 'Containment is the critical first step. Disconnecting affected systems prevents the ransomware from spreading to other machines. Never pay ransoms as it funds criminals and doesn\'t guarantee recovery. After containment, escalate to leadership, preserve evidence, and begin recovery from backups.',
    learningPoints: [
      'Containment first - isolate affected systems immediately',
      'Never pay ransoms - no guarantee of recovery',
      'Preserve evidence for forensic investigation',
      'Restore from known-good backups after containment',
      'Report to law enforcement (FBI IC3)',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'ir-002',
    moduleType: 'incident-response',
    type: 'scenario',
    title: 'Suspicious Login Activity',
    difficulty: 'intermediate',
    content: {
      scenario: 'Your SIEM alerts you to unusual login activity. The CFO\'s account logged in from Russia at 2:00 AM local time, then accessed financial reports and attempted to initiate a wire transfer. The CFO is currently on vacation in Hawaii.',
      alertDetails: {
        account: 'CFO - Sarah Mitchell',
        location: 'Moscow, Russia',
        time: '2:00 AM EST',
        actions: 'Accessed Q4 financials, attempted wire transfer',
      },
      question: 'What is the most appropriate immediate response?',
      options: [
        { id: 'a', text: 'Wait to see if the wire transfer goes through before acting', isCorrect: false },
        { id: 'b', text: 'Disable the account immediately and contact the CFO through a verified channel', isCorrect: true },
        { id: 'c', text: 'Email the CFO to ask if they\'re traveling internationally', isCorrect: false },
        { id: 'd', text: 'Reset the password and send new credentials to the CFO\'s email', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Impossible travel - Hawaii to Russia in hours',
      'Off-hours access (2 AM)',
      'High-value target (CFO account)',
      'Sensitive actions (financial access, wire transfer)',
    ],
    explanation: 'This shows classic signs of account compromise. Disable the account immediately to prevent further damage. Contact the real user through verified means (phone call to known number) - never email which may also be compromised. Cancel any pending transactions.',
    learningPoints: [
      'Impossible travel is a key indicator of compromise',
      'Disable compromised accounts immediately',
      'Verify through out-of-band communication (phone)',
      'Don\'t email potentially compromised users',
      'Cancel/freeze pending financial transactions',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'ir-003',
    moduleType: 'incident-response',
    type: 'scenario',
    title: 'Data Exfiltration Detection',
    difficulty: 'advanced',
    content: {
      scenario: 'Network monitoring shows an employee\'s workstation transmitted 50GB of data to an external IP address over the past week during after-hours. The destination appears to be a file-sharing service in a foreign country. The employee works in R&D.',
      alertDetails: {
        dataVolume: '50GB over 7 days',
        timing: 'After business hours (10 PM - 2 AM)',
        destination: 'External file sharing service',
        employee: 'R&D Engineer',
      },
      question: 'How should you handle this potential data breach?',
      options: [
        { id: 'a', text: 'Immediately confront the employee about the transfers', isCorrect: false },
        { id: 'b', text: 'Block the external IP and close the case', isCorrect: false },
        { id: 'c', text: 'Preserve evidence, involve HR/Legal, and conduct a discrete investigation', isCorrect: true },
        { id: 'd', text: 'Delete the employee\'s account and all their files', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Large data volume transferred externally',
      'After-hours timing suggests concealment',
      'R&D employee = access to sensitive IP',
      'Foreign destination raises concerns',
    ],
    explanation: 'This could be insider threat or compromised credentials. Preserve evidence before taking action - image the workstation, preserve logs. Involve HR and Legal before any employee interaction. Conduct discrete investigation to determine if it\'s malicious or legitimate (some employees work remotely).',
    learningPoints: [
      'Preserve evidence before taking disruptive action',
      'Involve HR and Legal for potential insider threats',
      'Don\'t alert the subject before investigation',
      'Consider legitimate explanations (remote work, large projects)',
      'Document everything for potential legal proceedings',
    ],
    image: scenarioImages.hacker,
  },
  {
    id: 'ir-004',
    moduleType: 'incident-response',
    type: 'scenario',
    title: 'Phishing Campaign Success',
    difficulty: 'intermediate',
    content: {
      scenario: 'Your email security system reports that a phishing email got through and was clicked by 47 employees. The link led to a fake Microsoft login page. You don\'t know yet who entered credentials.',
      alertDetails: {
        emailsDelivered: '1,247',
        linksClicked: '47 employees',
        fakeLoginPage: 'Microsoft 365 credential harvester',
        timeSinceAttack: '2 hours',
      },
      question: 'What is the priority response to this situation?',
      options: [
        { id: 'a', text: 'Send a company-wide email explaining phishing dangers', isCorrect: false },
        { id: 'b', text: 'Force password reset for all 47 employees who clicked and enable MFA', isCorrect: true },
        { id: 'c', text: 'Block the phishing domain and consider the incident resolved', isCorrect: false },
        { id: 'd', text: 'Identify and discipline the employees who clicked the link', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      '47 potential credential compromises',
      'Credential harvester page - passwords likely stolen',
      '2 hours elapsed - attackers may already be using credentials',
      'Microsoft 365 = access to email, files, Teams',
    ],
    explanation: 'Assume all 47 employees who clicked may have entered credentials. Force immediate password resets and enable MFA if not already active. Check for suspicious activity on those accounts. Block the domain, but prioritize credential protection first.',
    learningPoints: [
      'Assume credentials compromised if users visited fake login',
      'Force password resets immediately for affected users',
      'Enable MFA as secondary protection',
      'Check accounts for unauthorized access before/after reset',
      'Blocking the domain alone doesn\'t fix credential theft',
    ],
    image: scenarioImages.email,
  },
  {
    id: 'ir-005',
    moduleType: 'incident-response',
    type: 'scenario',
    title: 'DDoS Attack in Progress',
    difficulty: 'intermediate',
    content: {
      scenario: 'Your company\'s e-commerce website is experiencing severe slowdowns. Monitoring shows traffic has spiked to 100x normal levels, mostly from IP addresses in multiple countries. Legitimate customers are unable to make purchases.',
      alertDetails: {
        trafficIncrease: '100x normal (10 Gbps)',
        sourceIPs: 'Distributed globally',
        affectedService: 'E-commerce platform',
        businessImpact: '$50,000/hour in lost sales',
      },
      question: 'What\'s the most effective immediate response?',
      options: [
        { id: 'a', text: 'Block all traffic from foreign countries', isCorrect: false },
        { id: 'b', text: 'Activate DDoS mitigation service and enable rate limiting', isCorrect: true },
        { id: 'c', text: 'Shut down the website until the attack stops', isCorrect: false },
        { id: 'd', text: 'Upgrade server capacity to handle the traffic', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Sudden 100x traffic spike',
      'Globally distributed sources = botnet',
      'Legitimate users impacted',
      'Significant financial impact',
    ],
    explanation: 'Contact your DDoS mitigation provider (Cloudflare, Akamai, AWS Shield) to absorb/filter malicious traffic. Implement rate limiting to slow down attack traffic while allowing some legitimate users through. Don\'t shut down completely - that\'s the attacker\'s goal.',
    learningPoints: [
      'Have DDoS mitigation services in place before attacks',
      'Rate limiting can help reduce impact',
      'Don\'t shut down - you\'re doing the attacker\'s job',
      'Document everything for post-incident review',
      'Consider law enforcement notification for major attacks',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'ir-006',
    moduleType: 'incident-response',
    type: 'scenario',
    title: 'Lost Company Laptop',
    difficulty: 'beginner',
    content: {
      scenario: 'A sales representative reports their company laptop was stolen from their car overnight. The laptop contains customer contact information, sales proposals, and has saved credentials for Salesforce and company email.',
      alertDetails: {
        device: 'Dell Latitude laptop',
        data: 'Customer contacts, proposals, saved credentials',
        encryption: 'BitLocker enabled',
        lastSeen: 'Last night, 10 PM',
      },
      question: 'What steps should be taken to respond to this incident?',
      options: [
        { id: 'a', text: 'Wait to see if the laptop is recovered before taking action', isCorrect: false },
        { id: 'b', text: 'File a police report only since BitLocker is enabled', isCorrect: false },
        { id: 'c', text: 'Remote wipe the device, force password resets, revoke sessions, and file police report', isCorrect: true },
        { id: 'd', text: 'Order a replacement laptop for the employee', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Saved credentials = immediate account risk',
      'Customer data = potential breach notification requirements',
      'Physical theft = data potentially accessible',
      'BitLocker helps but isn\'t foolproof',
    ],
    explanation: 'Even with encryption, treat this as a potential breach. Remote wipe the device immediately. Force password resets for all accounts the user accessed. Revoke active sessions. File a police report for insurance and documentation. Assess if breach notification is required for customer data.',
    learningPoints: [
      'Remote wipe capability should be enabled on all devices',
      'Force password resets for all accounts on lost devices',
      'Revoke active sessions to log out stolen devices',
      'Encryption helps but assume data at risk',
      'Assess breach notification requirements for customer data',
    ],
    image: scenarioImages.warning,
  },
];

// ============================================
// DATA PROTECTION SCENARIOS
// ============================================

export const dataProtectionScenarios: TrainingScenario[] = [
  {
    id: 'dp-001',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'Data Classification',
    difficulty: 'beginner',
    content: {
      scenario: 'You need to classify different types of company data. Match each data type to its appropriate classification level.',
      question: 'Which classification is correct for CUSTOMER CREDIT CARD NUMBERS?',
      options: [
        { id: 'a', text: 'Public - Can be shared freely', isCorrect: false },
        { id: 'b', text: 'Internal - For employees only', isCorrect: false },
        { id: 'c', text: 'Confidential - Need-to-know basis', isCorrect: false },
        { id: 'd', text: 'Restricted/PCI - Highest protection, regulatory compliance required', isCorrect: true },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Credit card data falls under PCI-DSS regulations and requires the highest level of protection. It must be encrypted, access must be logged, and only personnel who need it for their job should have access. Mishandling can result in massive fines.',
    learningPoints: [
      'Payment card data is regulated by PCI-DSS',
      'Higher classification = more protection controls',
      'Regulatory data often requires specific handling procedures',
      'When in doubt, classify higher rather than lower',
    ],
    image: scenarioImages.lock,
  },
  {
    id: 'dp-002',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'Secure File Sharing',
    difficulty: 'beginner',
    content: {
      scenario: 'A client requests that you send them a document containing their account details and social security number for verification purposes.',
      question: 'What is the most secure way to send this sensitive information?',
      options: [
        { id: 'a', text: 'Attach it to a regular email', isCorrect: false },
        { id: 'b', text: 'Send via encrypted email or secure file sharing portal with access controls', isCorrect: true },
        { id: 'c', text: 'Fax the document to them', isCorrect: false },
        { id: 'd', text: 'Upload to Google Drive and share the link', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Sensitive PII like SSN requires encryption in transit. Use encrypted email (S/MIME, PGP) or a secure file sharing portal with access controls, expiration dates, and download tracking. Regular email, fax, and public cloud links don\'t provide adequate protection.',
    learningPoints: [
      'PII requires encryption when transmitted',
      'Use company-approved secure sharing methods',
      'Set expiration dates on shared files',
      'Verify recipient identity before sending sensitive data',
    ],
    image: scenarioImages.email,
  },
  {
    id: 'dp-003',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'Data Retention',
    difficulty: 'intermediate',
    content: {
      scenario: 'You\'re cleaning up old project files and find customer contracts from 7 years ago. The project is complete and the client relationship ended 5 years ago.',
      question: 'How should you handle these old contracts?',
      options: [
        { id: 'a', text: 'Delete them immediately to reduce data storage', isCorrect: false },
        { id: 'b', text: 'Check the data retention policy - contracts may have legal hold requirements', isCorrect: true },
        { id: 'c', text: 'Keep them forever in case they\'re needed', isCorrect: false },
        { id: 'd', text: 'Move them to your personal backup drive', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Data retention policies exist for legal, regulatory, and business reasons. Contracts often must be retained for specific periods (commonly 7+ years). Deleting too early can cause legal issues; keeping too long increases breach risk. Always check the retention policy.',
    learningPoints: [
      'Follow company data retention policies',
      'Different data types have different retention requirements',
      'Legal holds may prevent deletion of certain records',
      'When retention period expires, securely delete data',
    ],
    image: scenarioImages.office,
  },
  {
    id: 'dp-004',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'Working Remotely',
    difficulty: 'intermediate',
    content: {
      scenario: 'You\'re working from a coffee shop and need to review a spreadsheet containing employee salaries and performance reviews for an upcoming meeting.',
      question: 'What precautions should you take?',
      options: [
        { id: 'a', text: 'Position your screen away from others and use a privacy filter', isCorrect: false },
        { id: 'b', text: 'Wait until you\'re in a private location to view sensitive HR data', isCorrect: true },
        { id: 'c', text: 'Use the coffee shop WiFi but make sure the file is password protected', isCorrect: false },
        { id: 'd', text: 'It\'s fine since you\'re using your company laptop', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Highly sensitive data like salaries and performance reviews should not be viewed in public spaces. Even with privacy screens, shoulder surfing is possible, and public WiFi poses risks. This type of data should only be accessed in private, secure locations.',
    learningPoints: [
      'Some data is too sensitive for public viewing',
      'Privacy screens help but don\'t eliminate risk',
      'Public WiFi is not secure for sensitive work',
      'Consider the environment before accessing sensitive data',
    ],
    image: scenarioImages.office,
  },
  {
    id: 'dp-005',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'Disposing of Old Equipment',
    difficulty: 'intermediate',
    content: {
      scenario: 'Your department is upgrading computers. The old machines need to be disposed of. They previously contained customer data and financial records.',
      question: 'What\'s the correct way to dispose of these computers?',
      options: [
        { id: 'a', text: 'Delete all files and donate them to charity', isCorrect: false },
        { id: 'b', text: 'Format the hard drives and sell them', isCorrect: false },
        { id: 'c', text: 'Use certified data destruction (wiping or physical destruction) with documentation', isCorrect: true },
        { id: 'd', text: 'Remove the hard drives and throw them in the trash', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Simple deletion or formatting doesn\'t remove data - it can be recovered. Equipment that held sensitive data requires certified data destruction: either DoD-standard wiping (multiple overwrites) or physical destruction (shredding). Always get a certificate of destruction.',
    learningPoints: [
      'Deleted files can be recovered with forensic tools',
      'Formatting doesn\'t securely erase data',
      'Use certified data destruction services',
      'Obtain certificates of destruction for compliance',
      'Physical destruction is most secure for highly sensitive data',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'dp-006',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'GDPR Data Request',
    difficulty: 'advanced',
    content: {
      scenario: 'A customer from Germany emails requesting a copy of all personal data your company holds about them, plus deletion of their account. Your company does business in the EU.',
      question: 'How should you respond to this request?',
      options: [
        { id: 'a', text: 'Ignore it - they can\'t make demands like that', isCorrect: false },
        { id: 'b', text: 'Forward to your Data Protection Officer/Privacy team for proper handling', isCorrect: true },
        { id: 'c', text: 'Delete their account immediately as requested', isCorrect: false },
        { id: 'd', text: 'Tell them to contact their government for their data', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'This is a GDPR Subject Access Request (SAR) and Right to Erasure request. Under GDPR, EU citizens have legal rights to their data. These requests must be handled by trained personnel within specific timeframes (usually 30 days). Forward to your Privacy/DPO team immediately.',
    learningPoints: [
      'GDPR gives EU citizens rights over their data',
      'Subject Access Requests must be fulfilled within 30 days',
      'Forward privacy requests to designated personnel',
      'Don\'t delete data yourself - there are specific procedures',
      'Some data may need to be retained for legal reasons',
    ],
    image: scenarioImages.email,
  },
  {
    id: 'dp-007',
    moduleType: 'data-protection',
    type: 'scenario',
    title: 'Encryption Requirements',
    difficulty: 'intermediate',
    content: {
      scenario: 'You need to send a file containing customer health records to a partner organization for a joint research project.',
      question: 'What encryption requirements apply to this data?',
      options: [
        { id: 'a', text: 'No encryption needed if the partner is trustworthy', isCorrect: false },
        { id: 'b', text: 'Password protect the ZIP file before emailing', isCorrect: false },
        { id: 'c', text: 'Health data requires HIPAA-compliant encryption both in transit and at rest', isCorrect: true },
        { id: 'd', text: 'Regular HTTPS is sufficient for health data', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Health records are Protected Health Information (PHI) under HIPAA. They require encryption both when stored (at rest) and when transmitted (in transit). Additionally, you need a Business Associate Agreement with the partner. ZIP passwords are not HIPAA-compliant encryption.',
    learningPoints: [
      'Health data is protected by HIPAA',
      'PHI requires encryption at rest AND in transit',
      'Business Associate Agreements required for sharing PHI',
      'Use HIPAA-compliant tools (not regular email/ZIP)',
      'Document all PHI transfers',
    ],
    image: scenarioImages.lock,
  },
];

// ============================================
// MALWARE AWARENESS SCENARIOS
// ============================================

export const malwareAwarenessScenarios: TrainingScenario[] = [
  {
    id: 'mal-001',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Identify the Malware Type',
    difficulty: 'beginner',
    content: {
      scenario: 'Your computer suddenly displays a message saying all your files have been encrypted and demands $500 in Bitcoin to get them back. A countdown timer shows 72 hours remaining.',
      question: 'What type of malware is this?',
      options: [
        { id: 'a', text: 'Spyware - it\'s monitoring your activities', isCorrect: false },
        { id: 'b', text: 'Ransomware - it encrypts files and demands payment', isCorrect: true },
        { id: 'c', text: 'Adware - it\'s trying to get you to buy something', isCorrect: false },
        { id: 'd', text: 'Worm - it\'s spreading to other computers', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Files encrypted without permission',
      'Payment demanded in cryptocurrency',
      'Countdown timer creates urgency',
      'Threatens permanent data loss',
    ],
    explanation: 'Ransomware encrypts your files and demands payment (ransom) for the decryption key. Never pay - it funds criminals and doesn\'t guarantee recovery. Disconnect from the network immediately and report to IT. Restore from backups after the malware is removed.',
    learningPoints: [
      'Ransomware encrypts files and demands payment',
      'Never pay ransoms - no guarantee of recovery',
      'Regular backups are your best defense',
      'Disconnect immediately to prevent spread',
      'Report to IT and law enforcement',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'mal-002',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Suspicious Email Attachment',
    difficulty: 'beginner',
    content: {
      scenario: 'You receive an email from "HR Department" with an attachment called "Salary_Increase_2024.pdf.exe". The email says to open it immediately to see your new salary.',
      question: 'What should you do with this attachment?',
      options: [
        { id: 'a', text: 'Open it - salary information is important', isCorrect: false },
        { id: 'b', text: 'Save it to your desktop first, then open it', isCorrect: false },
        { id: 'c', text: 'Delete the email - .pdf.exe is a malicious file disguise', isCorrect: true },
        { id: 'd', text: 'Forward it to colleagues so they can see their raises too', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Double extension (.pdf.exe) hides true file type',
      '.exe files are programs, not documents',
      'Urgency tactic ("open immediately")',
      'Impersonating HR department',
    ],
    explanation: 'The ".pdf.exe" double extension is a classic malware trick. Windows hides the .exe by default, making it look like a PDF. The .exe means it\'s an executable program - likely malware. Real salary documents are never .exe files. Report this phishing attempt to IT.',
    learningPoints: [
      'Double extensions (.pdf.exe) are always suspicious',
      '.exe files are programs that run code on your computer',
      'HR doesn\'t send salary info as executable files',
      'Enable "show file extensions" in Windows',
      'When in doubt, contact the sender through known channels',
    ],
    image: scenarioImages.email,
  },
  {
    id: 'mal-003',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'USB Drive Found',
    difficulty: 'intermediate',
    content: {
      scenario: 'You find a USB drive in the parking lot labeled "Employee Bonuses Q4". You\'re curious what\'s on it.',
      question: 'What should you do with this USB drive?',
      options: [
        { id: 'a', text: 'Plug it into your computer to see who it belongs to', isCorrect: false },
        { id: 'b', text: 'Give it to IT security - never plug in unknown USB drives', isCorrect: true },
        { id: 'c', text: 'Plug it into a non-networked computer to be safe', isCorrect: false },
        { id: 'd', text: 'Take it home and check it on your personal computer', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Unknown USB drives can contain malware',
      'Enticing label designed to make you plug it in',
      'USB attacks (USB drop) are real threat vectors',
      'Malware can execute automatically when plugged in',
    ],
    explanation: 'This is a classic "USB drop" attack. Attackers leave infected USB drives where employees will find them. Curiosity leads people to plug them in, and malware can execute automatically. Some advanced USB attacks can even damage computers physically. Always give found devices to IT.',
    learningPoints: [
      'Never plug in USB drives you find',
      'USB drops are a real social engineering tactic',
      'Malware can auto-execute when USB is inserted',
      'Even "safe" computers can be compromised',
      'Turn found devices over to IT security',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'mal-004',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Slow Computer Behavior',
    difficulty: 'intermediate',
    content: {
      scenario: 'Your computer has become very slow, the fan runs constantly, and Task Manager shows high CPU usage even when you\'re not doing anything. Your browser also has new toolbars you didn\'t install.',
      question: 'What is the most likely cause of these symptoms?',
      options: [
        { id: 'a', text: 'Your computer is just old and needs replacement', isCorrect: false },
        { id: 'b', text: 'Malware infection - possibly cryptomining malware or adware', isCorrect: true },
        { id: 'c', text: 'Windows is updating in the background', isCorrect: false },
        { id: 'd', text: 'Too many files on your hard drive', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Unexplained high CPU/resource usage',
      'Computer running hot and slow',
      'Unwanted browser changes',
      'Programs you didn\'t install appearing',
    ],
    explanation: 'These are classic malware symptoms. High CPU usage could be cryptomining malware using your computer to mine cryptocurrency. Unwanted browser toolbars are adware. Run a full antivirus scan, check installed programs, and reset browser settings. Report to IT.',
    learningPoints: [
      'Unexplained resource usage may indicate malware',
      'Cryptominers use your CPU to mine cryptocurrency',
      'Unwanted browser changes often indicate adware',
      'Run antivirus scans if you notice unusual behavior',
      'Report suspicious activity to IT immediately',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'mal-005',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Software Download Source',
    difficulty: 'beginner',
    content: {
      scenario: 'You need to install 7-Zip (a free file compression tool) for work. You search Google and find several download sites offering it.',
      question: 'Where should you download the software from?',
      options: [
        { id: 'a', text: 'free-software-download.com - it\'s the first result', isCorrect: false },
        { id: 'b', text: 'download.cnet.com - CNET is a known tech site', isCorrect: false },
        { id: 'c', text: '7-zip.org - the official 7-Zip website', isCorrect: true },
        { id: 'd', text: 'A torrent site for faster download', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [],
    explanation: 'Always download software from the official vendor\'s website. Third-party download sites, even well-known ones, often bundle unwanted software (PUPs) or may host infected versions. Torrent sites are high-risk for malware. Official sites ensure you get clean, current versions.',
    learningPoints: [
      'Only download from official vendor websites',
      'Third-party sites often bundle unwanted programs',
      'Torrent/piracy sites are high-risk for malware',
      'Search for "[software name] official site"',
      'Verify the URL before downloading',
    ],
    image: scenarioImages.browser,
  },
  {
    id: 'mal-006',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Macro-Enabled Documents',
    difficulty: 'intermediate',
    content: {
      scenario: 'You receive an invoice document from a vendor. When you open it, Word shows a banner saying "Macros have been disabled. Click Enable Content to view this document properly."',
      question: 'Should you enable macros?',
      options: [
        { id: 'a', text: 'Yes - you need to see the invoice', isCorrect: false },
        { id: 'b', text: 'No - verify with the vendor first; macros are a common malware vector', isCorrect: true },
        { id: 'c', text: 'Yes - macros are safe in Microsoft Office', isCorrect: false },
        { id: 'd', text: 'Enable them but only for this document', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Request to enable macros/content',
      'Legitimate invoices don\'t need macros',
      'Macros can run malicious code',
      'Unexpected attachment from vendor',
    ],
    explanation: 'Macro-enabled documents are a top malware delivery method. Legitimate invoices rarely need macros. When macros are enabled, they can run code that downloads and installs malware. Always verify unexpected documents with the sender through known contact methods.',
    learningPoints: [
      'Macros can execute malicious code',
      'Never enable macros in unexpected documents',
      'Legitimate documents rarely require macros',
      'Verify with sender before enabling content',
      'Consider opening suspicious docs in Protected View only',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'mal-007',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Fake Antivirus Warning',
    difficulty: 'beginner',
    content: {
      scenario: 'While browsing, a popup appears saying "Your computer is infected with 47 viruses! Download CleanPC Pro immediately to remove them!" with scary red warnings and a large download button.',
      question: 'What should you do?',
      options: [
        { id: 'a', text: 'Download the antivirus - your computer might really be infected', isCorrect: false },
        { id: 'b', text: 'Close the browser entirely without clicking anything on the popup', isCorrect: true },
        { id: 'c', text: 'Click the X on the popup to close it', isCorrect: false },
        { id: 'd', text: 'Call the phone number shown on the screen', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Scary warnings designed to create panic',
      'Pop-up claiming to detect viruses',
      'Unknown "antivirus" software name',
      'Phone numbers in security popups',
    ],
    explanation: 'This is "scareware" - fake security alerts designed to trick you into downloading malware or calling scam support lines. Real antivirus doesn\'t show browser popups. Close the entire browser (use Task Manager if needed). Run your actual antivirus. Never call numbers from popups.',
    learningPoints: [
      'Real antivirus doesn\'t use browser popups',
      'Scareware uses fear to make you act quickly',
      'Close the browser entirely, don\'t click popup buttons',
      'Never call phone numbers from security popups',
      'Run your actual antivirus if concerned',
    ],
    image: scenarioImages.warning,
  },
  {
    id: 'mal-008',
    moduleType: 'malware-awareness',
    type: 'scenario',
    title: 'Software Update Prompt',
    difficulty: 'intermediate',
    content: {
      scenario: 'While visiting a website, a popup says "Your Flash Player is out of date. Click here to install the latest version." It looks like an Adobe update.',
      question: 'How should you handle this update prompt?',
      options: [
        { id: 'a', text: 'Click to update - keeping software updated is important', isCorrect: false },
        { id: 'b', text: 'Close it - Flash Player was discontinued, and updates come through official channels', isCorrect: true },
        { id: 'c', text: 'Update only if the website looks trustworthy', isCorrect: false },
        { id: 'd', text: 'Download but scan with antivirus before installing', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Flash Player was discontinued in 2020',
      'Updates from websites instead of software itself',
      'Popup prompts for software installation',
      'Impersonating trusted company (Adobe)',
    ],
    explanation: 'Flash Player was discontinued by Adobe in 2020 - any "Flash update" is malware. More generally, legitimate software updates come through the software itself or vendor website, never through third-party website popups. These fake update prompts are a common malware delivery method.',
    learningPoints: [
      'Flash Player was discontinued - all Flash prompts are fake',
      'Updates should come from software itself or vendor sites',
      'Never install software prompted by random websites',
      'Enable auto-updates in legitimate software',
      'When in doubt, go directly to the vendor\'s website',
    ],
    image: scenarioImages.browser,
  },
];

// ============================================
// THREAT HUNTING SCENARIOS
// ============================================

export const threatHuntingScenarios: TrainingScenario[] = [
  {
    id: 'th-001',
    moduleType: 'threat-hunting',
    type: 'scenario',
    title: 'Analyze Suspicious PowerShell',
    difficulty: 'advanced',
    content: {
      scenario: 'Your SIEM flagged this PowerShell command executed on a workstation:\n\npowershell -encodedCommand JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0AA==\n\nThe encoded portion decodes to: "$client = New-Object System.Net.WebClient"',
      alertDetails: {
        user: 'jsmith',
        workstation: 'DESKTOP-A1B2C3',
        time: '2:34 AM',
        process: 'powershell.exe',
      },
      question: 'What does this activity most likely indicate?',
      options: [
        { id: 'a', text: 'Normal IT maintenance activity', isCorrect: false },
        { id: 'b', text: 'User running a legitimate script for work', isCorrect: false },
        { id: 'c', text: 'Potential malware using encoded commands to evade detection', isCorrect: true },
        { id: 'd', text: 'Windows Update process', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Encoded PowerShell commands (Base64)',
      'Execution at 2:34 AM (off-hours)',
      'WebClient object = downloading content',
      'PowerShell execution policy bypass attempts',
    ],
    explanation: 'Attackers use encoded PowerShell to evade basic detection. The WebClient object downloads files from the internet - likely second-stage malware. The 2 AM execution time is suspicious. This pattern (encoded PowerShell + WebClient + off-hours) is a strong indicator of compromise.',
    learningPoints: [
      'Encoded commands are used to evade detection',
      'WebClient in PowerShell often downloads malware',
      'Off-hours execution is suspicious',
      'Look for PowerShell execution with -encodedCommand',
      'Correlate with other events on the same host',
    ],
    image: scenarioImages.hacker,
  },
  {
    id: 'th-002',
    moduleType: 'threat-hunting',
    type: 'scenario',
    title: 'DNS Anomaly Detection',
    difficulty: 'advanced',
    content: {
      scenario: 'Network monitoring shows a single workstation making 500+ DNS queries per minute to subdomains of "x7k9p2m.com" like "a1b2c3.x7k9p2m.com", "d4e5f6.x7k9p2m.com", etc. The domain was registered yesterday.',
      alertDetails: {
        queriesPerMinute: '500+',
        domain: 'x7k9p2m.com',
        domainAge: '1 day',
        subdomains: 'Random alphanumeric patterns',
      },
      question: 'What type of attack does this pattern suggest?',
      options: [
        { id: 'a', text: 'DDoS attack targeting a DNS server', isCorrect: false },
        { id: 'b', text: 'DNS tunneling/exfiltration - data hidden in DNS queries', isCorrect: true },
        { id: 'c', text: 'Normal CDN traffic with many subdomains', isCorrect: false },
        { id: 'd', text: 'DNS cache poisoning attempt', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Extremely high DNS query volume',
      'Newly registered domain (1 day old)',
      'Random alphanumeric subdomain patterns',
      'Data encoded in subdomain names',
    ],
    explanation: 'DNS tunneling encodes data in DNS queries to exfiltrate information or establish command-and-control channels. The random subdomains likely contain encoded stolen data. Newly registered domains with high query volumes are strong indicators of malicious C2 infrastructure.',
    learningPoints: [
      'DNS tunneling hides data in DNS queries',
      'High volumes of queries to one domain is suspicious',
      'Newly registered domains are higher risk',
      'Random subdomain patterns suggest encoded data',
      'Monitor for unusual DNS patterns in your environment',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'th-003',
    moduleType: 'threat-hunting',
    type: 'scenario',
    title: 'Lateral Movement Detection',
    difficulty: 'advanced',
    content: {
      scenario: 'Authentication logs show user "admin_backup" successfully logged into 47 different servers within 10 minutes using RDP. This account normally only accesses 3 specific backup servers.',
      alertDetails: {
        account: 'admin_backup',
        serversAccessed: '47',
        timeWindow: '10 minutes',
        normalBaseline: '3 servers',
        protocol: 'RDP',
      },
      question: 'What threat behavior does this pattern indicate?',
      options: [
        { id: 'a', text: 'Routine backup operations', isCorrect: false },
        { id: 'b', text: 'Lateral movement - attacker using stolen credentials to spread', isCorrect: true },
        { id: 'c', text: 'IT performing emergency maintenance', isCorrect: false },
        { id: 'd', text: 'Account synchronization process', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Massive deviation from normal behavior (3 → 47 servers)',
      'Rapid access pattern (47 servers in 10 minutes)',
      'Service account used interactively',
      'Privileged account (admin_backup)',
    ],
    explanation: 'This is classic lateral movement behavior. An attacker compromised credentials and is rapidly spreading through the network. Service accounts accessing many more systems than baseline, especially quickly, strongly indicates attacker activity. Disable the account and investigate immediately.',
    learningPoints: [
      'Baseline normal behavior to detect anomalies',
      'Lateral movement shows rapid multi-system access',
      'Service accounts shouldn\'t have interactive logins',
      'Privileged accounts are high-value targets',
      'Speed of access is a key indicator',
    ],
    image: scenarioImages.hacker,
  },
  {
    id: 'th-004',
    moduleType: 'threat-hunting',
    type: 'scenario',
    title: 'Persistence Mechanism',
    difficulty: 'advanced',
    content: {
      scenario: 'During routine threat hunting, you find this registry key was created:\n\nHKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\nName: "WindowsUpdate"\nValue: "C:\\Users\\Public\\svchost.exe -hidden"\n\nThe file svchost.exe in the Public folder is 47KB.',
      alertDetails: {
        registryPath: 'HKCU\\...\\Run',
        valueName: 'WindowsUpdate (fake name)',
        executable: 'C:\\Users\\Public\\svchost.exe',
        fileSize: '47KB (real svchost is ~50KB in System32)',
      },
      question: 'What has the attacker accomplished here?',
      options: [
        { id: 'a', text: 'Installed a Windows Update helper', isCorrect: false },
        { id: 'b', text: 'Established persistence - malware will start automatically', isCorrect: true },
        { id: 'c', text: 'Optimized system startup', isCorrect: false },
        { id: 'd', text: 'Created a backup of svchost', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Run key = starts on user login (persistence)',
      'Fake "WindowsUpdate" name to blend in',
      'svchost.exe in wrong location (should be System32)',
      '"-hidden" parameter is suspicious',
      'Users\\Public is writable by anyone',
    ],
    explanation: 'This is a persistence mechanism. The Run registry key ensures the malware starts every time the user logs in. The attacker named it "WindowsUpdate" and "svchost.exe" to look legitimate. Real svchost.exe lives in System32, not Users\\Public. This survives reboots.',
    learningPoints: [
      'Run keys are common persistence locations',
      'Attackers use legitimate-sounding names',
      'svchost.exe should only be in System32',
      'Check for executables in unusual locations',
      'Persistence = malware survives reboots',
    ],
    image: scenarioImages.security,
  },
  {
    id: 'th-005',
    moduleType: 'threat-hunting',
    type: 'scenario',
    title: 'Beaconing Detection',
    difficulty: 'advanced',
    content: {
      scenario: 'Network analysis reveals a workstation making HTTPS connections to an external IP every exactly 3600 seconds (1 hour), 24/7, for the past 2 weeks. The data transferred is small (< 1KB each time).',
      alertDetails: {
        interval: 'Exactly 3600 seconds',
        duration: '2 weeks, 24/7',
        dataSize: '<1KB per connection',
        destination: 'External IP, no reverse DNS',
      },
      question: 'What does this perfectly regular pattern indicate?',
      options: [
        { id: 'a', text: 'Normal software checking for updates', isCorrect: false },
        { id: 'b', text: 'Command-and-control beaconing from malware', isCorrect: true },
        { id: 'c', text: 'Time synchronization service', isCorrect: false },
        { id: 'd', text: 'Cloud backup service', isCorrect: false },
      ],
    },
    isCorrectAnswer: true,
    redFlags: [
      'Perfectly regular intervals (exactly 3600s)',
      'Continuous 24/7 operation including nights/weekends',
      'Small data size (checking in, not large transfers)',
      'External IP with no reverse DNS',
      '2 weeks of persistent communication',
    ],
    explanation: 'This is C2 beaconing. Malware "phones home" at regular intervals to check for commands. The perfect timing, continuous operation, small data sizes, and unknown destination are classic indicators. Legitimate software has more variable timing. Investigate the workstation immediately.',
    learningPoints: [
      'C2 beaconing shows regular, predictable patterns',
      'Perfect intervals are more suspicious than variable',
      'Small, regular data transfers = check-ins',
      'Continuous 24/7 activity (even nights) is abnormal',
      'Investigate unknown external destinations',
    ],
    image: scenarioImages.hacker,
  },
];

// ============================================
// SCENARIO GETTER FUNCTIONS
// ============================================

export function getScenariosForModule(moduleType: string): TrainingScenario[] {
  switch (moduleType) {
    case 'phishing':
      return phishingScenarios;
    case 'social-engineering':
      return socialEngineeringScenarios;
    case 'password-security':
      return passwordSecurityScenarios;
    case 'secure-browsing':
      return secureBrowsingScenarios;
    case 'incident-response':
      return incidentResponseScenarios;
    case 'data-protection':
      return dataProtectionScenarios;
    case 'malware-awareness':
      return malwareAwarenessScenarios;
    case 'threat-hunting':
      return threatHuntingScenarios;
    default:
      return phishingScenarios;
  }
}

export function getRandomScenarios(moduleType: string, count: number): TrainingScenario[] {
  const scenarios = getScenariosForModule(moduleType);
  const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, scenarios.length));
}

export function getScenarioById(id: string): TrainingScenario | undefined {
  const allScenarios = [
    ...phishingScenarios,
    ...socialEngineeringScenarios,
    ...passwordSecurityScenarios,
    ...secureBrowsingScenarios,
  ];
  return allScenarios.find(s => s.id === id);
}
