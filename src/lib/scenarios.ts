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
