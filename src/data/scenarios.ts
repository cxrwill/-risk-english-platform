import type { Scenario, ScenarioId } from '../types'

export const SCENARIOS: Scenario[] = [
  {
    id: 'compliance',
    title: '卡组织合规质询',
    subtitle: 'Card Network Compliance Inquiry',
    description:
      'Simulate compliance review scenarios from Visa VFMP/VDMP and Mastercard ECP. Practice explaining metric anomalies and presenting remediation plans in English.',
    icon: '🛡️',
    color: '#0ea5e9',
    difficulty: 'Expert',
    expectedKeywords: [
      '3D Secure', 'Liability Shift', 'AVS', 'CVV', 'VFMP', 'VDMP', 'ECP',
      'Remediation Plan', 'chargeback rate', 'threshold', 'card testing',
      'fraud monitoring', 'compliance', 'amendment', 'mitigation', 'TC40',
    ],
    initialMessage:
      "Good morning. I'm calling from Visa's Fraud Monitoring Program team. Your acquisition has exceeded our VFMP threshold of 0.65% chargeback rate for the past two consecutive months. I need you to explain the root causes behind this spike and present a concrete Remediation Plan. How do you intend to bring your metrics back into compliance?",
    systemPrompt:
      'You are a Visa Compliance Officer. Challenge the trainee professionally.',
  },
  {
    id: 'representment',
    title: '拒付抗辩与预仲裁',
    subtitle: 'Representment & Pre-Arbitration',
    description:
      'Simulate the full chargeback representment lifecycle. Practice preparing compelling evidence through Visa VROL and Mastercard Mastercom systems.',
    icon: '⚖️',
    color: '#8b5cf6',
    difficulty: 'Advanced',
    expectedKeywords: [
      'representment', 'chargeback', 'reason code', 'compelling evidence',
      'VROL', 'Mastercom', 'Visa Claims Resolution', 'unauthorized transaction',
      'device fingerprint', 'proof of delivery', 'signature', 'subscription',
      'cancellation policy', 'system logs', 'arbitration', 'pre-arbitration',
      'presenter merchant', 'issuing bank', 'dispute resolution',
    ],
    initialMessage:
      "We've received a four-thousand-two-hundred dollar chargeback claim from our cardholder, coded as Unauthorized Transaction Fraud. The dispute window is closing. You have 20 days to submit compelling evidence through Visa Resolve Online. Walk me through what documentation you need from the merchant and how you'll structure your representment package.",
    systemPrompt:
      'You are an Issuing Bank representative. Challenge the quality of evidence.',
  },
  {
    id: 'rdr',
    title: '高级争议拦截系统推介',
    subtitle: 'Advanced Dispute Prevention — RDR Pitch',
    description:
      'Simulate pitching Visa Rapid Dispute Resolution (RDR) to a merchant executive. Explain auto-refund rules, chargeback rate reduction, and ROI calculations.',
    icon: '🚀',
    color: '#22c55e',
    difficulty: 'Advanced',
    expectedKeywords: [
      'Rapid Dispute Resolution', 'RDR', 'chargeback rate', 'auto-refund',
      'rule engine', 'VAMP', 'Visa Acquirer Monitoring Program', 'ROI',
      'dispute prevention', 'liability', 'threshold', 'fraud dispute',
      'under one hundred dollars', 'instant refund', 'dispute handling fee',
      'cost savings', 'monitoring program',
    ],
    initialMessage:
      "I'm the CTO of a mid-market e-commerce merchant processing fifty million dollars annually. I've heard about Visa's Rapid Dispute Resolution program. Convince me — what exactly is RDR, how does it work, and can you quantify the ROI? I need to understand how it could reduce our chargeback rate and what the cost-benefit analysis looks like.",
    systemPrompt:
      'You are a skeptical merchant CTO evaluating RDR adoption.',
  },
  {
    id: 'mastercom',
    title: 'Mastercard Collaboration 机制详解',
    subtitle: 'Mastercard Collaboration Program',
    description:
      'Simulate explaining the Mastercard Collaboration early-warning program to a merchant. Practice describing risk-sharing mechanisms and non-compliance consequences.',
    icon: '🔔',
    color: '#f59e0b',
    difficulty: 'Intermediate',
    expectedKeywords: [
      'Mastercom', 'Collaboration', 'early warning', 'chargeback monitoring',
      'compliance fine', 'risk sharing', 'presenter', 'acquirer',
      'merchant profiling', 'dispute collaboration', 'pre-dispute',
      'collaboration program', 'fraud detection', 'chargeback ratio',
    ],
    initialMessage:
      "We've received a notification from Mastercard about their Collaboration program. I understand it's mandatory for certain merchants, but I'm unclear on how it works. Explain the mechanism to me — how does early collaboration differ from standard dispute resolution, and what are the consequences of non-participation?",
    systemPrompt:
      'You are a Mastercard representative explaining the Collaboration program.',
  },
  {
    id: 'friendly-fraud',
    title: '善意欺诈调查与应对',
    subtitle: 'Friendly Fraud Investigation',
    description:
      'Simulate investigating friendly fraud — the leading cause of chargebacks at 75%. Practice identifying fraud patterns and building evidence chains.',
    icon: '🔍',
    color: '#ef4444',
    difficulty: 'Intermediate',
    expectedKeywords: [
      'friendly fraud', 'chargeback abuse', 'customer dispute',
      'purchase regression', 'denial of purchase', 'transaction evidence',
      'IP address', 'device ID', 'email confirmation', 'order history',
      'shipping tracking', 'customer communication', 'fraud indicator',
      'pattern analysis', 'recurring transaction', 'subscription trap',
    ],
    initialMessage:
      "We're seeing a spike in what appears to be friendly fraud — customers claiming they didn't authorize transactions they actually made. This now accounts for approximately seventy-five percent of all chargebacks in our portfolio. Walk me through your investigation process: how do you identify friendly fraud patterns, and what evidence do you gather to refute these claims?",
    systemPrompt:
      'You are a senior chargeback analyst investigating friendly fraud.',
  },
]

export const getScenarioById = (id: ScenarioId): Scenario | undefined =>
  SCENARIOS.find((s) => s.id === id)
