/**
 * OEE Recommendations - Improvement strategies for each office
 *
 * Provides specific, actionable recommendations to improve OEE scores
 * based on each office's unique challenges and statutory requirements.
 *
 * @module L3_MES/oee/OEERecommendations
 */

/**
 * Recommendation priority levels
 */
export const Priority = {
  CRITICAL: 'critical',    // Immediate action required
  HIGH: 'high',            // Address within 30 days
  MEDIUM: 'medium',        // Address within 90 days
  LOW: 'low'               // Continuous improvement
};

/**
 * Recommendation categories
 */
export const Category = {
  PROCESS: 'process',           // Workflow improvements
  TECHNOLOGY: 'technology',     // System/software upgrades
  STAFFING: 'staffing',         // Personnel changes
  TRAINING: 'training',         // Skill development
  POLICY: 'policy',             // Procedure updates
  INFRASTRUCTURE: 'infrastructure'  // Facilities/equipment
};

/**
 * Office-specific recommendations based on their OEE gaps
 */
export const OfficeRecommendations = {
  /**
   * County Controller - Acting Controller
   * Current: 74.2% | Target: 83% | Gap: -8.8%
   * Main issues: Performance (82% vs 88% target)
   */
  controller: {
    name: 'County Controller',
    currentOEE: 74.2,
    targetOEE: 83,
    gap: -8.8,
    officer: 'Acting Controller',
    summary: 'Audit turnaround and payroll processing efficiency need significant improvement',
    recommendations: [
      {
        id: 'ctrl-1',
        title: 'Implement Continuous Auditing Software',
        category: Category.TECHNOLOGY,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+4-6% OEE',
        description: 'Deploy automated audit software to continuously monitor transactions instead of periodic manual reviews.',
        actions: [
          'Evaluate IDEA, ACL, or TeamMate audit software',
          'Integrate with county financial systems',
          'Set up automated exception reporting',
          'Train staff on continuous auditing methodology'
        ],
        timeline: '60-90 days',
        estimatedCost: '$25,000-50,000',
        paCodeReference: '16 P.S. § 1702 - Audit county accounts'
      },
      {
        id: 'ctrl-2',
        title: 'Streamline Voucher Pre-Audit Process',
        category: Category.PROCESS,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Reduce voucher review time from 15 to 8 minutes through standardized checklists and delegation.',
        actions: [
          'Create standardized voucher review checklist',
          'Implement risk-based sampling (full review high-risk, spot-check low-risk)',
          'Delegate routine vouchers to trained staff',
          'Establish electronic approval workflow'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal (process change)',
        paCodeReference: '16 P.S. § 1705 - Pre-audit all vouchers'
      },
      {
        id: 'ctrl-3',
        title: 'Automate Payroll Processing',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Reduce payroll cycle time by automating time entry validation and tax calculations.',
        actions: [
          'Integrate timekeeping systems with payroll',
          'Automate overtime and leave calculations',
          'Implement direct deposit for remaining paper checks',
          'Create automated payroll audit trails'
        ],
        timeline: '90 days',
        estimatedCost: '$15,000-30,000',
        paCodeReference: '16 P.S. § 1706 - Countersign warrants'
      },
      {
        id: 'ctrl-4',
        title: 'Establish Audit Finding Tracking System',
        category: Category.PROCESS,
        priority: Priority.MEDIUM,
        component: 'quality',
        impact: '+1-2% OEE',
        description: 'Track audit findings from identification through resolution to improve follow-up rates.',
        actions: [
          'Implement finding tracking database',
          'Set up automated follow-up reminders',
          'Create monthly resolution status reports',
          'Establish escalation procedures for overdue findings'
        ],
        timeline: '45 days',
        estimatedCost: '$5,000-10,000',
        paCodeReference: '16 P.S. § 1703 - Examine accounts of officers'
      },
      {
        id: 'ctrl-5',
        title: 'Improve Board Meeting Preparation',
        category: Category.PROCESS,
        priority: Priority.LOW,
        component: 'availability',
        impact: '+1% OEE',
        description: 'Reduce board report preparation time through templates and advance data gathering.',
        actions: [
          'Create standardized board report templates',
          'Automate financial data extraction',
          'Establish reporting calendar with advance deadlines',
          'Cross-train staff on board report preparation'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 1720 - Board memberships'
      }
    ]
  },

  /**
   * Sheriff's Office - Christopher Zieger
   * Current: 77.8% | Target: 78% | Gap: -0.2%
   * Nearly at target, minor availability issues
   */
  sheriff: {
    name: "Sheriff's Office",
    currentOEE: 77.8,
    targetOEE: 78,
    gap: -0.2,
    officer: 'Christopher Zieger',
    summary: 'Close to target; focus on maintaining performance and minor availability gains',
    recommendations: [
      {
        id: 'shr-1',
        title: 'Optimize Deputy Scheduling Algorithm',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'availability',
        impact: '+1-2% OEE',
        description: 'Use scheduling software to optimize coverage and reduce overtime while maintaining 24/7 operations.',
        actions: [
          'Implement scheduling optimization software',
          'Analyze historical call patterns by shift',
          'Create flexible staffing pools for peak periods',
          'Reduce overtime through better scheduling'
        ],
        timeline: '60 days',
        estimatedCost: '$10,000-20,000',
        paCodeReference: '16 P.S. § 4201 - Sheriff duties'
      },
      {
        id: 'shr-2',
        title: 'Mobile Process Service App',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Deploy mobile app for deputies to log service attempts in real-time, reducing paperwork.',
        actions: [
          'Select and deploy mobile app platform',
          'Integrate with case management system',
          'Train all civil division deputies',
          'Eliminate duplicate paper logging'
        ],
        timeline: '90 days',
        estimatedCost: '$15,000-25,000',
        paCodeReference: '16 P.S. § 4211 - Service of process'
      },
      {
        id: 'shr-3',
        title: 'GPS Route Optimization',
        category: Category.TECHNOLOGY,
        priority: Priority.LOW,
        component: 'performance',
        impact: '+1-2% OEE',
        description: 'Optimize daily service routes to reduce drive time and increase papers served per day.',
        actions: [
          'Implement GPS tracking on vehicles',
          'Use route optimization software',
          'Cluster service attempts by geography',
          'Track and analyze service completion rates by area'
        ],
        timeline: '45 days',
        estimatedCost: '$8,000-15,000',
        paCodeReference: '16 P.S. § 4215 - Civil process'
      },
      {
        id: 'shr-4',
        title: 'Cross-Train Court Security Deputies',
        category: Category.TRAINING,
        priority: Priority.LOW,
        component: 'availability',
        impact: '+1% OEE',
        description: 'Cross-train court security to fill civil division gaps during absences.',
        actions: [
          'Develop cross-training curriculum',
          'Certify court deputies in civil process',
          'Create flexible assignment protocols',
          'Track cross-utilization metrics'
        ],
        timeline: '90 days',
        estimatedCost: '$5,000 (training time)',
        paCodeReference: '16 P.S. § 4201 - Sheriff general duties'
      }
    ]
  },

  /**
   * Fiscal Affairs - Revenue - VACANT (Brandon Dunstane acting)
   * Current: 86.4% | Target: 85% | Gap: +1.4%
   * EXCEEDS TARGET - World Class
   */
  'fiscal-affairs-revenue': {
    name: 'Fiscal Affairs - Revenue',
    currentOEE: 86.4,
    targetOEE: 85,
    gap: 1.4,
    officer: 'VACANT (Brandon Dunstane acting)',
    summary: 'Exceeds target - maintain excellence and share best practices',
    recommendations: [
      {
        id: 'trs-1',
        title: 'Document Best Practices for Other Offices',
        category: Category.PROCESS,
        priority: Priority.LOW,
        component: 'quality',
        impact: 'County-wide improvement',
        description: 'Create documentation of successful processes to share with other row officers.',
        actions: [
          'Document cash handling procedures',
          'Create process flowcharts',
          'Develop training materials',
          'Offer cross-office training sessions'
        ],
        timeline: 'Ongoing',
        estimatedCost: 'Staff time only',
        paCodeReference: '16 P.S. § 5301 - Treasurer duties'
      },
      {
        id: 'trs-2',
        title: 'Expand Online Payment Options',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+1-2% OEE',
        description: 'Add additional online payment methods to reduce counter traffic.',
        actions: [
          'Add ACH payment option',
          'Implement payment plan portal',
          'Enable automatic recurring payments',
          'Reduce in-person transaction volume by 20%'
        ],
        timeline: '60 days',
        estimatedCost: '$10,000-20,000',
        paCodeReference: '16 P.S. § 5311 - Tax collection'
      },
      {
        id: 'trs-3',
        title: 'Advanced Investment Analytics',
        category: Category.TECHNOLOGY,
        priority: Priority.LOW,
        component: 'quality',
        impact: 'Better returns',
        description: 'Implement investment analytics to optimize county fund yields.',
        actions: [
          'Deploy investment tracking software',
          'Create automated yield comparisons',
          'Set up benchmark tracking',
          'Generate monthly performance reports'
        ],
        timeline: '90 days',
        estimatedCost: '$15,000-25,000',
        paCodeReference: '16 P.S. § 5321 - Investment of funds'
      }
    ]
  },

  /**
   * District Attorney - Stephen G. Baratta
   * Current: 68.2% | Target: 70% | Gap: -1.8%
   * Main issues: Performance (case complexity)
   */
  'district-attorney': {
    name: 'District Attorney',
    currentOEE: 68.2,
    targetOEE: 70,
    gap: -1.8,
    officer: 'Stephen G. Baratta',
    summary: 'Case processing time and performance need improvement; complex caseload challenges',
    recommendations: [
      {
        id: 'da-1',
        title: 'Implement Case Triage System',
        category: Category.PROCESS,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+3-5% OEE',
        description: 'Create formal case triage process to route cases to appropriate complexity level.',
        actions: [
          'Define case complexity criteria',
          'Create triage decision tree',
          'Assign experienced ADAs as triage officers',
          'Track triage accuracy and adjust criteria'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal (process change)',
        paCodeReference: '16 P.S. § 1402 - DA duties'
      },
      {
        id: 'da-2',
        title: 'Deploy Case Management Software',
        category: Category.TECHNOLOGY,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+2-4% OEE',
        description: 'Replace paper files with comprehensive case management system.',
        actions: [
          'Evaluate Odyssey, Tyler, or JustWare systems',
          'Migrate active cases to new system',
          'Train all attorneys and support staff',
          'Integrate with court filing systems'
        ],
        timeline: '120 days',
        estimatedCost: '$75,000-150,000',
        paCodeReference: '16 P.S. § 1401 - DA powers'
      },
      {
        id: 'da-3',
        title: 'Establish Plea Bargain Guidelines',
        category: Category.POLICY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Create standardized plea guidelines to reduce negotiation time on routine cases.',
        actions: [
          'Analyze historical plea outcomes',
          'Create charge-specific guidelines',
          'Train ADAs on guideline usage',
          'Track deviation rates and outcomes'
        ],
        timeline: '60 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 1405 - Prosecution duties'
      },
      {
        id: 'da-4',
        title: 'Expand Diversion Programs',
        category: Category.POLICY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Expand ARD and diversion to reduce trial caseload on appropriate cases.',
        actions: [
          'Review diversion eligibility criteria',
          'Expand ARD program capacity',
          'Create drug court fast-track',
          'Track recidivism to validate effectiveness'
        ],
        timeline: '90 days',
        estimatedCost: '$20,000-40,000',
        paCodeReference: '16 P.S. § 1409 - Special programs'
      },
      {
        id: 'da-5',
        title: 'Detective Division Efficiency',
        category: Category.PROCESS,
        priority: Priority.MEDIUM,
        component: 'availability',
        impact: '+1-2% OEE',
        description: 'Improve detective case clearance rate through better resource allocation.',
        actions: [
          'Implement case prioritization matrix',
          'Create cold case review process',
          'Improve inter-agency coordination',
          'Track clearance rates by detective'
        ],
        timeline: '45 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 1406 - Investigation'
      }
    ]
  },

  /**
   * Coroner - Zachary Lysek
   * Current: 71.2% | Target: 72% | Gap: -0.8%
   * Main issues: Performance (case complexity variability)
   */
  coroner: {
    name: "Coroner's Office",
    currentOEE: 71.2,
    targetOEE: 72,
    gap: -0.8,
    officer: 'Zachary Lysek',
    summary: 'Close to target; variable case complexity affects performance predictability',
    recommendations: [
      {
        id: 'cor-1',
        title: 'Standardize Death Investigation Protocols',
        category: Category.PROCESS,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Create standardized checklists for different death types to ensure consistent, complete investigations.',
        actions: [
          'Develop death-type-specific checklists',
          'Create digital investigation templates',
          'Implement quality review process',
          'Track completion rates by checklist item'
        ],
        timeline: '45 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 4501 - Coroner duties'
      },
      {
        id: 'cor-2',
        title: 'Implement Digital Evidence Management',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'quality',
        impact: '+1-2% OEE',
        description: 'Deploy digital evidence system for photos, reports, and chain of custody.',
        actions: [
          'Select evidence management software',
          'Digitize existing records',
          'Train staff on digital workflows',
          'Integrate with death certificate system'
        ],
        timeline: '90 days',
        estimatedCost: '$20,000-35,000',
        paCodeReference: '16 P.S. § 4506 - Records'
      },
      {
        id: 'cor-3',
        title: 'On-Call Deputy Rotation Optimization',
        category: Category.STAFFING,
        priority: Priority.MEDIUM,
        component: 'availability',
        impact: '+1-2% OEE',
        description: 'Optimize on-call schedules to reduce response time and deputy fatigue.',
        actions: [
          'Analyze call volume by time/day',
          'Create geographic coverage zones',
          'Implement equitable rotation system',
          'Track response times and adjust'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 4502 - Response requirements'
      },
      {
        id: 'cor-4',
        title: 'Cremation Permit Fast-Track',
        category: Category.PROCESS,
        priority: Priority.LOW,
        component: 'performance',
        impact: '+1% OEE',
        description: 'Create expedited process for routine cremation permits to improve turnaround.',
        actions: [
          'Identify routine vs. complex permits',
          'Create fast-track approval criteria',
          'Implement same-day processing goal',
          'Track turnaround times'
        ],
        timeline: '15 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 4516 - Cremation permits'
      }
    ]
  },

  /**
   * Recorder of Deeds - Dorothy Edelman
   * Current: 82.1% | Target: 82% | Gap: +0.1%
   * MEETS TARGET - Good performance
   */
  'recorder-of-deeds': {
    name: 'Recorder of Deeds',
    currentOEE: 82.1,
    targetOEE: 82,
    gap: 0.1,
    officer: 'Dorothy Edelman',
    summary: 'Meets target; maintain excellence and pursue continuous improvement',
    recommendations: [
      {
        id: 'rod-1',
        title: 'Expand E-Recording Adoption',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Increase e-recording adoption to reduce counter traffic and processing time.',
        actions: [
          'Partner with major title companies',
          'Offer e-recording fee incentives',
          'Provide submitter training',
          'Target 80% e-recording rate'
        ],
        timeline: '60 days',
        estimatedCost: '$5,000-10,000 (marketing)',
        paCodeReference: '16 P.S. § 4901 - Recording duties'
      },
      {
        id: 'rod-2',
        title: 'Automated Indexing Validation',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'quality',
        impact: '+1% OEE',
        description: 'Implement automated validation to catch indexing errors before recording.',
        actions: [
          'Add name/address validation rules',
          'Implement parcel number verification',
          'Create duplicate detection alerts',
          'Track and reduce error rates'
        ],
        timeline: '45 days',
        estimatedCost: '$10,000-20,000',
        paCodeReference: '16 P.S. § 4911 - Indexing requirements'
      },
      {
        id: 'rod-3',
        title: 'Online Document Search Enhancement',
        category: Category.TECHNOLOGY,
        priority: Priority.LOW,
        component: 'performance',
        impact: '+1% OEE',
        description: 'Improve online search to reduce in-person research requests.',
        actions: [
          'Enhance search functionality',
          'Add document preview capability',
          'Implement online copy ordering',
          'Track online vs. in-person searches'
        ],
        timeline: '90 days',
        estimatedCost: '$15,000-25,000',
        paCodeReference: '16 P.S. § 4921 - Public access'
      }
    ]
  },

  /**
   * Register of Wills - Patricia J. Manento
   * Current: 73.5% | Target: 75% | Gap: -1.5%
   * Main issues: Performance (estate complexity)
   */
  'register-of-wills': {
    name: 'Register of Wills',
    currentOEE: 73.5,
    targetOEE: 75,
    gap: -1.5,
    officer: 'Patricia J. Manento',
    summary: 'Below target; estate processing time and complexity management need attention',
    recommendations: [
      {
        id: 'row-1',
        title: 'Implement Estate Complexity Triage',
        category: Category.PROCESS,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Create triage system to route simple estates to fast-track processing.',
        actions: [
          'Define estate complexity criteria',
          'Create fast-track for small estates',
          'Route complex estates to senior staff',
          'Track processing times by complexity'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 5101 - Register duties'
      },
      {
        id: 'row-2',
        title: 'Online Marriage License Application',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+1-2% OEE',
        description: 'Allow couples to complete applications online before office visit.',
        actions: [
          'Create online application portal',
          'Integrate with state systems',
          'Reduce in-person time to 10 minutes',
          'Offer appointment scheduling'
        ],
        timeline: '60 days',
        estimatedCost: '$15,000-25,000',
        paCodeReference: '16 P.S. § 5121 - Marriage licenses'
      },
      {
        id: 'row-3',
        title: 'Inheritance Tax Calculator Tool',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'quality',
        impact: '+1-2% OEE',
        description: 'Provide online calculator to help executors prepare accurate tax returns.',
        actions: [
          'Develop tax calculation tool',
          'Include common deductions',
          'Generate preliminary return drafts',
          'Reduce revision cycles'
        ],
        timeline: '90 days',
        estimatedCost: '$10,000-20,000',
        paCodeReference: '16 P.S. § 5131 - Inheritance tax'
      },
      {
        id: 'row-4',
        title: 'Probate Document Templates',
        category: Category.PROCESS,
        priority: Priority.LOW,
        component: 'performance',
        impact: '+1% OEE',
        description: 'Provide standardized templates to reduce document rejection rates.',
        actions: [
          'Create fillable PDF templates',
          'Include instruction guides',
          'Post templates online',
          'Track rejection rate reduction'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 5106 - Probate procedures'
      }
    ]
  },

  /**
   * Clerk of Courts - Leigh Ann Fisher
   * Current: 74.2% | Target: 76% | Gap: -1.8%
   * Main issues: Availability (court calendar dependency)
   */
  'clerk-of-courts': {
    name: 'Clerk of Courts',
    currentOEE: 74.2,
    targetOEE: 76,
    gap: -1.8,
    officer: 'Leigh Ann Fisher',
    summary: 'Below target; court calendar constraints affect availability and performance',
    recommendations: [
      {
        id: 'coc-1',
        title: 'Electronic Filing Expansion',
        category: Category.TECHNOLOGY,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+3-4% OEE',
        description: 'Expand e-filing to reduce counter traffic and enable 24/7 filing.',
        actions: [
          'Expand e-filing document types',
          'Integrate with attorney case management',
          'Provide e-filing training to bar',
          'Target 70% e-filing rate'
        ],
        timeline: '90 days',
        estimatedCost: '$25,000-40,000',
        paCodeReference: '16 P.S. § 2701 - Clerk duties'
      },
      {
        id: 'coc-2',
        title: 'Automated Docket Entry',
        category: Category.TECHNOLOGY,
        priority: Priority.HIGH,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Automate routine docket entries to reduce manual entry time.',
        actions: [
          'Identify automatable entry types',
          'Create automated entry rules',
          'Integrate with court scheduling',
          'Reduce entry time by 50%'
        ],
        timeline: '60 days',
        estimatedCost: '$15,000-25,000',
        paCodeReference: '16 P.S. § 2711 - Docket maintenance'
      },
      {
        id: 'coc-3',
        title: 'Jury Management System Upgrade',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'availability',
        impact: '+1-2% OEE',
        description: 'Upgrade jury system to improve juror utilization and reduce no-shows.',
        actions: [
          'Implement online juror check-in',
          'Add text message reminders',
          'Create juror portal for scheduling',
          'Track and reduce no-show rate'
        ],
        timeline: '90 days',
        estimatedCost: '$20,000-35,000',
        paCodeReference: '16 P.S. § 2731 - Jury management'
      },
      {
        id: 'coc-4',
        title: 'Court Calendar Coordination',
        category: Category.PROCESS,
        priority: Priority.MEDIUM,
        component: 'availability',
        impact: '+1-2% OEE',
        description: 'Better coordinate with judges to optimize clerk workload distribution.',
        actions: [
          'Meet weekly with court administration',
          'Create advance filing schedules',
          'Batch similar case types',
          'Balance daily workload'
        ],
        timeline: '30 days',
        estimatedCost: 'Minimal',
        paCodeReference: '16 P.S. § 2701 - Court support'
      }
    ]
  },

  /**
   * Prothonotary - Holly Ruggiero
   * Current: 79.5% | Target: 80% | Gap: -0.5%
   * Very close to target
   */
  prothonotary: {
    name: 'Prothonotary',
    currentOEE: 79.5,
    targetOEE: 80,
    gap: -0.5,
    officer: 'Holly Ruggiero',
    summary: 'Very close to target; minor improvements will achieve goal',
    recommendations: [
      {
        id: 'pro-1',
        title: 'Expand Civil E-Filing',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+2-3% OEE',
        description: 'Increase e-filing adoption for civil cases to reduce counter workload.',
        actions: [
          'Expand accepted document types',
          'Partner with legal software vendors',
          'Provide law firm training',
          'Target 60% e-filing rate'
        ],
        timeline: '60 days',
        estimatedCost: '$15,000-25,000',
        paCodeReference: '16 P.S. § 2801 - Prothonotary duties'
      },
      {
        id: 'pro-2',
        title: 'Judgment Lien Automation',
        category: Category.TECHNOLOGY,
        priority: Priority.MEDIUM,
        component: 'performance',
        impact: '+1-2% OEE',
        description: 'Automate judgment lien filing and search processes.',
        actions: [
          'Create online lien search portal',
          'Automate lien satisfaction processing',
          'Integrate with title companies',
          'Reduce search turnaround to 4 hours'
        ],
        timeline: '90 days',
        estimatedCost: '$20,000-30,000',
        paCodeReference: '16 P.S. § 2821 - Judgment records'
      },
      {
        id: 'pro-3',
        title: 'Passport Appointment System',
        category: Category.PROCESS,
        priority: Priority.LOW,
        component: 'availability',
        impact: '+1% OEE',
        description: 'Implement appointment system for passport services to manage demand.',
        actions: [
          'Deploy online appointment booking',
          'Create dedicated passport hours',
          'Reduce wait times to under 15 minutes',
          'Track customer satisfaction'
        ],
        timeline: '30 days',
        estimatedCost: '$5,000-10,000',
        paCodeReference: '16 P.S. § 2841 - Passport services'
      }
    ]
  }
};

/**
 * Get recommendations for an office
 * @param {string} officeId - Office identifier
 * @returns {Object|null} Office recommendations
 */
export function getRecommendations(officeId) {
  return OfficeRecommendations[officeId] || null;
}

/**
 * Get all recommendations sorted by priority
 * @returns {Array} All recommendations across offices
 */
export function getAllRecommendationsByPriority() {
  const all = [];

  for (const [officeId, office] of Object.entries(OfficeRecommendations)) {
    for (const rec of office.recommendations) {
      all.push({
        ...rec,
        officeId,
        officeName: office.name,
        officer: office.officer,
        officeGap: office.gap
      });
    }
  }

  // Sort by priority (critical first) then by impact
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return all.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    // Sort by gap (more negative = worse = higher priority)
    return a.officeGap - b.officeGap;
  });
}

/**
 * Get offices that need improvement (below target)
 * @returns {Array} Offices sorted by gap
 */
export function getOfficesNeedingImprovement() {
  return Object.entries(OfficeRecommendations)
    .filter(([_, office]) => office.gap < 0)
    .map(([id, office]) => ({
      id,
      name: office.name,
      officer: office.officer,
      currentOEE: office.currentOEE,
      targetOEE: office.targetOEE,
      gap: office.gap,
      summary: office.summary,
      topRecommendation: office.recommendations[0]
    }))
    .sort((a, b) => a.gap - b.gap);
}

/**
 * Calculate total potential OEE improvement
 * @returns {Object} Improvement potential summary
 */
export function calculateImprovementPotential() {
  let totalPotential = 0;
  let totalCost = 0;
  const byOffice = {};

  for (const [officeId, office] of Object.entries(OfficeRecommendations)) {
    let officePotential = 0;

    for (const rec of office.recommendations) {
      // Parse impact string (e.g., "+2-3% OEE")
      const match = rec.impact.match(/\+(\d+)-?(\d+)?%/);
      if (match) {
        const minImpact = parseInt(match[1]);
        const maxImpact = match[2] ? parseInt(match[2]) : minImpact;
        officePotential += (minImpact + maxImpact) / 2;
      }
    }

    byOffice[officeId] = {
      name: office.name,
      currentOEE: office.currentOEE,
      potentialGain: officePotential,
      potentialOEE: Math.min(100, office.currentOEE + officePotential)
    };

    totalPotential += officePotential;
  }

  return {
    totalPotentialGain: totalPotential / Object.keys(OfficeRecommendations).length,
    byOffice
  };
}

export default OfficeRecommendations;
