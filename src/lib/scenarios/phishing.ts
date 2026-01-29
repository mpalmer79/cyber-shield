// ============================================
// Phishing Detection Scenarios
// ============================================

import type { TrainingScenario } from './types';
import { scenarioImages } from './images';

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
    isCorrectAnswer: true,
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
    isCorrectAnswer: false,
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
    isCorrectAnswer: true,
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
    isCorrectAnswer: true,
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
    isCorrectAnswer: true,
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
    isCorrectAnswer: true,
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
    isCorrectAnswer: false,
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
    isCorrectAnswer: true,
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
    isCorrectAnswer: true,
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
    isCorrectAnswer: true,
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
