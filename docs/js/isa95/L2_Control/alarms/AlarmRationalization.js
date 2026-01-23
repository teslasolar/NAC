/**
 * ISA-18.2 Alarm Rationalization
 * Systematic process for determining if an alarm is needed
 *
 * Questions per ISA-18.2:
 * 1. Is there an abnormal situation requiring operator response?
 * 2. Is the alarm unique from other alarms?
 * 3. Is the consequence significant enough to justify an alarm?
 * 4. Can the operator take a specific action?
 * 5. Is there sufficient time to respond?
 */

const RationalizationResult = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_REVIEW: 'needs_review',
  DUPLICATE: 'duplicate',
};

class AlarmRationalization {
  constructor() {
    this.catalog = new Map();
    this.rejectedAlarms = [];
  }

  // ISA-18.2 Rationalization Questions
  rationalize(proposedAlarm) {
    const result = {
      alarmId: proposedAlarm.id,
      timestamp: new Date().toISOString(),
      questions: {},
      decision: null,
      justification: '',
    };

    // Q1: Is there an abnormal situation?
    result.questions.abnormalSituation = {
      question: 'Is there an abnormal situation requiring operator response?',
      answer: proposedAlarm.consequence !== null,
      notes: proposedAlarm.consequenceDescription || '',
    };

    // Q2: Is it unique?
    const existing = this.findSimilar(proposedAlarm);
    result.questions.unique = {
      question: 'Is this alarm unique from other alarms?',
      answer: existing.length === 0,
      notes: existing.length > 0 ? `Similar: ${existing.map(e => e.id).join(', ')}` : '',
    };

    // Q3: Is consequence significant?
    result.questions.significantConsequence = {
      question: 'Is the consequence significant enough to justify an alarm?',
      answer: this.assessSignificance(proposedAlarm),
      notes: `Financial impact: ${proposedAlarm.financialImpact || 'Unknown'}`,
    };

    // Q4: Can operator take action?
    result.questions.actionable = {
      question: 'Can the operator take a specific corrective action?',
      answer: proposedAlarm.correctiveActions && proposedAlarm.correctiveActions.length > 0,
      notes: (proposedAlarm.correctiveActions || []).join('; '),
    };

    // Q5: Is there time to respond?
    result.questions.responseTime = {
      question: 'Is there sufficient time for operator to respond?',
      answer: proposedAlarm.timeToRespond !== 'immediate',
      notes: `Response window: ${proposedAlarm.timeToRespond || 'Not specified'}`,
    };

    // Calculate decision
    const answers = Object.values(result.questions).map(q => q.answer);
    const allYes = answers.every(a => a === true);
    const anyNo = answers.some(a => a === false);
    const duplicateFound = !result.questions.unique.answer;

    if (duplicateFound) {
      result.decision = RationalizationResult.DUPLICATE;
      result.justification = 'Similar alarm already exists in catalog';
    } else if (allYes) {
      result.decision = RationalizationResult.APPROVED;
      result.justification = 'All rationalization criteria met';
      this.addToCatalog(proposedAlarm, result);
    } else if (anyNo) {
      result.decision = RationalizationResult.REJECTED;
      const failed = Object.entries(result.questions)
        .filter(([, v]) => !v.answer)
        .map(([k]) => k);
      result.justification = `Failed criteria: ${failed.join(', ')}`;
      this.rejectedAlarms.push({ alarm: proposedAlarm, result });
    } else {
      result.decision = RationalizationResult.NEEDS_REVIEW;
      result.justification = 'Requires manual review';
    }

    return result;
  }

  findSimilar(alarm) {
    const similar = [];
    this.catalog.forEach((entry, id) => {
      if (entry.alarm.type === alarm.type && entry.alarm.source === alarm.source) {
        similar.push(entry.alarm);
      }
    });
    return similar;
  }

  assessSignificance(alarm) {
    // Significant if:
    // - Financial impact > $1000
    // - Statutory violation
    // - Affects public trust
    if (alarm.financialImpact && alarm.financialImpact > 1000) return true;
    if (alarm.relatedStatute) return true;
    if (alarm.publicTrustImpact) return true;
    return false;
  }

  addToCatalog(alarm, rationalization) {
    this.catalog.set(alarm.id, {
      alarm,
      rationalization,
      addedAt: new Date().toISOString(),
      lastReview: new Date().toISOString(),
      reviewCycle: 365, // days
    });
  }

  getCatalog() {
    return Array.from(this.catalog.values());
  }

  // Periodic review per ISA-18.2
  reviewAlarm(alarmId) {
    const entry = this.catalog.get(alarmId);
    if (!entry) return null;

    entry.lastReview = new Date().toISOString();
    return entry;
  }

  // Master Alarm Database export
  exportMAD() {
    return {
      version: '1.0.0',
      standard: 'ISA-18.2',
      generated: new Date().toISOString(),
      county: 'Northampton',
      alarms: this.getCatalog().map(entry => ({
        id: entry.alarm.id,
        type: entry.alarm.type,
        priority: entry.alarm.priority,
        source: entry.alarm.source,
        setpoint: entry.alarm.setpoint,
        deadband: entry.alarm.deadband,
        delay: entry.alarm.delay,
        correctiveActions: entry.alarm.correctiveActions,
        consequence: entry.alarm.consequence,
        rationalized: entry.addedAt,
        lastReview: entry.lastReview,
      })),
    };
  }
}

// County-specific alarm templates for rationalization
const CountyAlarmTemplates = {
  BUDGET_VARIANCE: {
    type: 'budget_variance',
    source: 'controller',
    consequence: 'Potential budget overspend leading to year-end deficit',
    consequenceDescription: 'Exceeding budget allocation without approval',
    financialImpact: 10000,
    relatedStatute: '16 Pa.C.S. §1705',
    correctiveActions: [
      'Review spending against appropriation',
      'Notify department head',
      'Request budget transfer if needed',
      'Document in monthly report',
    ],
    timeToRespond: '24 hours',
    publicTrustImpact: true,
  },

  UNAUTHORIZED_EXPENDITURE: {
    type: 'unauthorized_expenditure',
    source: 'controller',
    consequence: 'Expenditure without proper approval chain',
    consequenceDescription: 'Payment made without required authorization',
    financialImpact: 5000,
    relatedStatute: '16 Pa.C.S. §1730',
    correctiveActions: [
      'Halt payment processing',
      'Request proper authorization',
      'Document approval chain gap',
      'Report to supervisor',
    ],
    timeToRespond: '4 hours',
    publicTrustImpact: true,
  },

  AUDIT_DEADLINE: {
    type: 'audit_deadline',
    source: 'controller',
    consequence: 'Missing statutory audit deadline',
    consequenceDescription: 'Failure to complete required audit on time',
    financialImpact: 0,
    relatedStatute: '16 Pa.C.S. §1720',
    correctiveActions: [
      'Prioritize audit completion',
      'Request extension if available',
      'Document delay reason',
      'Report to commissioners',
    ],
    timeToRespond: '7 days',
    publicTrustImpact: true,
  },
};

export {
  AlarmRationalization,
  RationalizationResult,
  CountyAlarmTemplates,
};
