/**
 * PackML County Operation Units
 * Applies PackML state model to county government operations
 *
 * Units:
 * - ClaimProcessor: Process claims through pre-audit
 * - AuditExecutor: Execute audit procedures
 * - BudgetCycle: Annual budget process
 * - BoardMeeting: Board/commission meetings
 */

const { PackMLStateMachine, PackMLState, PackMLCommand } = require('./StateMachine');

// Claim Processor Unit
class ClaimProcessorUnit extends PackMLStateMachine {
  constructor(unitId = 'CLAIM-PROC-01') {
    super(unitId);

    this.currentClaim = null;
    this.processedCount = 0;
    this.rejectedCount = 0;
    this.pendingQueue = [];

    // Configure state actions
    this.setStateAction(PackMLState.STARTING, 'enter', (sm) => {
      sm.currentClaim = sm.pendingQueue.shift() || null;
      sm.log('CLAIM_LOADED', { claimId: sm.currentClaim?.id });
    });

    this.setStateAction(PackMLState.EXECUTE, 'enter', (sm) => {
      if (sm.currentClaim) {
        sm.log('CLAIM_PROCESSING', { claimId: sm.currentClaim.id });
        // Actual processing would happen here
      }
    });

    this.setStateAction(PackMLState.COMPLETING, 'enter', (sm) => {
      if (sm.currentClaim) {
        sm.processedCount++;
        sm.log('CLAIM_PROCESSED', {
          claimId: sm.currentClaim.id,
          total: sm.processedCount,
        });
        sm.currentClaim = null;
      }
    });

    this.setStateAction(PackMLState.HOLDING, 'enter', (sm) => {
      sm.log('CLAIM_HELD', {
        claimId: sm.currentClaim?.id,
        reason: 'Awaiting additional documentation',
      });
    });
  }

  queueClaim(claim) {
    this.pendingQueue.push(claim);
    this.log('CLAIM_QUEUED', { claimId: claim.id, queueLength: this.pendingQueue.length });
  }

  rejectCurrent(reason) {
    if (this.currentClaim) {
      this.rejectedCount++;
      this.log('CLAIM_REJECTED', {
        claimId: this.currentClaim.id,
        reason,
        total: this.rejectedCount,
      });
      this.currentClaim = null;
      this.command(PackMLCommand.STOP);
    }
  }

  getStats() {
    return {
      processed: this.processedCount,
      rejected: this.rejectedCount,
      pending: this.pendingQueue.length,
      current: this.currentClaim?.id || null,
    };
  }
}

// Audit Executor Unit
class AuditExecutorUnit extends PackMLStateMachine {
  constructor(unitId = 'AUDIT-EXEC-01') {
    super(unitId);

    this.currentAudit = null;
    this.findings = [];
    this.completedAudits = 0;

    this.setStateAction(PackMLState.STARTING, 'enter', (sm) => {
      sm.log('AUDIT_STARTING', {
        auditId: sm.currentAudit?.id,
        target: sm.currentAudit?.target,
      });
      sm.findings = [];
    });

    this.setStateAction(PackMLState.EXECUTE, 'enter', (sm) => {
      sm.log('AUDIT_EXECUTING', { auditId: sm.currentAudit?.id });
    });

    this.setStateAction(PackMLState.COMPLETING, 'enter', (sm) => {
      sm.completedAudits++;
      sm.log('AUDIT_COMPLETING', {
        auditId: sm.currentAudit?.id,
        findingsCount: sm.findings.length,
        totalCompleted: sm.completedAudits,
      });
    });

    this.setStateAction(PackMLState.SUSPENDING, 'enter', (sm) => {
      sm.log('AUDIT_SUSPENDED', {
        auditId: sm.currentAudit?.id,
        reason: 'Awaiting document response',
      });
    });
  }

  loadAudit(audit) {
    this.currentAudit = audit;
    this.log('AUDIT_LOADED', { auditId: audit.id, target: audit.target });
  }

  addFinding(finding) {
    finding.auditId = this.currentAudit?.id;
    finding.timestamp = new Date().toISOString();
    this.findings.push(finding);
    this.log('FINDING_ADDED', { findingId: finding.id, severity: finding.severity });
  }

  getFindings() {
    return [...this.findings];
  }
}

// Budget Cycle Unit
class BudgetCycleUnit extends PackMLStateMachine {
  constructor(unitId = 'BUDGET-CYCLE-01') {
    super(unitId);

    this.fiscalYear = new Date().getFullYear();
    this.phase = 'planning'; // planning, adoption, execution, closeout
    this.amendments = [];

    this.setStateAction(PackMLState.STARTING, 'enter', (sm) => {
      sm.phase = 'planning';
      sm.log('BUDGET_CYCLE_START', { fiscalYear: sm.fiscalYear, phase: sm.phase });
    });

    this.setStateAction(PackMLState.EXECUTE, 'enter', (sm) => {
      sm.log('BUDGET_PHASE', { fiscalYear: sm.fiscalYear, phase: sm.phase });
    });

    this.setStateAction(PackMLState.COMPLETING, 'enter', (sm) => {
      const phases = ['planning', 'adoption', 'execution', 'closeout'];
      const currentIdx = phases.indexOf(sm.phase);
      if (currentIdx < phases.length - 1) {
        sm.phase = phases[currentIdx + 1];
        sm.log('BUDGET_PHASE_ADVANCE', { fiscalYear: sm.fiscalYear, phase: sm.phase });
      } else {
        sm.log('BUDGET_CYCLE_COMPLETE', { fiscalYear: sm.fiscalYear });
      }
    });
  }

  recordAmendment(amendment) {
    amendment.fiscalYear = this.fiscalYear;
    amendment.timestamp = new Date().toISOString();
    this.amendments.push(amendment);
    this.log('BUDGET_AMENDMENT', amendment);
  }
}

// Board Meeting Unit
class BoardMeetingUnit extends PackMLStateMachine {
  constructor(unitId = 'BOARD-MTG-01') {
    super(unitId);

    this.meeting = null;
    this.agenda = [];
    this.currentItem = 0;
    this.votes = [];
    this.attendees = [];

    this.setStateAction(PackMLState.STARTING, 'enter', (sm) => {
      sm.log('MEETING_CALLED_TO_ORDER', {
        meetingId: sm.meeting?.id,
        board: sm.meeting?.board,
        attendees: sm.attendees.length,
      });
    });

    this.setStateAction(PackMLState.EXECUTE, 'enter', (sm) => {
      const item = sm.agenda[sm.currentItem];
      if (item) {
        sm.log('AGENDA_ITEM', {
          itemNumber: sm.currentItem + 1,
          description: item.description,
        });
      }
    });

    this.setStateAction(PackMLState.HOLDING, 'enter', (sm) => {
      sm.log('MEETING_RECESSED', { meetingId: sm.meeting?.id });
    });

    this.setStateAction(PackMLState.COMPLETING, 'enter', (sm) => {
      sm.log('MEETING_ADJOURNED', {
        meetingId: sm.meeting?.id,
        itemsCompleted: sm.currentItem,
        votesRecorded: sm.votes.length,
      });
    });
  }

  scheduleMeeting(meeting) {
    this.meeting = meeting;
    this.agenda = meeting.agenda || [];
    this.currentItem = 0;
    this.votes = [];
    this.attendees = [];
  }

  addAttendee(person, role) {
    this.attendees.push({ person, role, arrivedAt: new Date().toISOString() });
  }

  nextAgendaItem() {
    if (this.currentItem < this.agenda.length - 1) {
      this.currentItem++;
      this.log('AGENDA_ADVANCE', { itemNumber: this.currentItem + 1 });
    } else {
      this.command(PackMLCommand.SC); // Complete if no more items
    }
  }

  recordVote(motion, yeas, nays, abstain) {
    const vote = {
      motionId: motion.id,
      motion: motion.description,
      agendaItem: this.currentItem,
      yeas,
      nays,
      abstain,
      passed: yeas > nays,
      timestamp: new Date().toISOString(),
    };
    this.votes.push(vote);
    this.log('VOTE_RECORDED', vote);
    return vote;
  }
}

module.exports = {
  ClaimProcessorUnit,
  AuditExecutorUnit,
  BudgetCycleUnit,
  BoardMeetingUnit,
};
