/**
 * Process Controllers - PackML-based county operation units
 *
 * Applies PackML state model to county government processes:
 * - ClaimProcessor: Process claims through pre-audit
 * - AuditExecutor: Execute audit procedures
 * - BudgetCycle: Annual budget process
 * - BoardMeeting: Board/commission meetings
 *
 * @module L2_Control/engine/ProcessControllers
 */

import { PackMLStateMachine, PackMLState } from '../../../isa88/PackML.js';

/**
 * Claim Processor Unit
 * Processes claims through the pre-audit workflow
 */
export class ClaimProcessorUnit extends PackMLStateMachine {
  constructor(unitId = 'CLAIM-PROC-01') {
    super(unitId);

    this.currentClaim = null;
    this.processedCount = 0;
    this.rejectedCount = 0;
    this.pendingQueue = [];

    // Set up state change listeners
    this.addListener((event) => {
      this._handleStateChange(event);
    });
  }

  _handleStateChange(event) {
    switch (event.to) {
      case PackMLState.STARTING:
        this.currentClaim = this.pendingQueue.shift() || null;
        this._log('CLAIM_LOADED', { claimId: this.currentClaim?.id });
        // Auto-complete starting state
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.EXECUTE:
        if (this.currentClaim) {
          this._log('CLAIM_PROCESSING', { claimId: this.currentClaim.id });
        }
        break;

      case PackMLState.COMPLETING:
        if (this.currentClaim) {
          this.processedCount++;
          this._log('CLAIM_PROCESSED', {
            claimId: this.currentClaim.id,
            total: this.processedCount,
          });
          this.currentClaim = null;
        }
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.HOLDING:
        this._log('CLAIM_HELD', {
          claimId: this.currentClaim?.id,
          reason: 'Awaiting additional documentation',
        });
        setTimeout(() => this.completeActingState(), 100);
        break;
    }
  }

  _log(event, data) {
    console.log(`[${this.unitId}] ${event}:`, data);
  }

  queueClaim(claim) {
    this.pendingQueue.push(claim);
    this._log('CLAIM_QUEUED', { claimId: claim.id, queueLength: this.pendingQueue.length });
    return this;
  }

  rejectCurrent(reason) {
    if (this.currentClaim) {
      this.rejectedCount++;
      this._log('CLAIM_REJECTED', {
        claimId: this.currentClaim.id,
        reason,
        total: this.rejectedCount,
      });
      this.currentClaim = null;
      this.stop('Claim rejected');
    }
    return this;
  }

  getStats() {
    return {
      processed: this.processedCount,
      rejected: this.rejectedCount,
      pending: this.pendingQueue.length,
      current: this.currentClaim?.id || null,
      state: this.getState()
    };
  }
}

/**
 * Audit Executor Unit
 * Executes audit procedures with finding collection
 */
export class AuditExecutorUnit extends PackMLStateMachine {
  constructor(unitId = 'AUDIT-EXEC-01') {
    super(unitId);

    this.currentAudit = null;
    this.findings = [];
    this.completedAudits = 0;

    this.addListener((event) => {
      this._handleStateChange(event);
    });
  }

  _handleStateChange(event) {
    switch (event.to) {
      case PackMLState.STARTING:
        this._log('AUDIT_STARTING', {
          auditId: this.currentAudit?.id,
          target: this.currentAudit?.target,
        });
        this.findings = [];
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.EXECUTE:
        this._log('AUDIT_EXECUTING', { auditId: this.currentAudit?.id });
        break;

      case PackMLState.COMPLETING:
        this.completedAudits++;
        this._log('AUDIT_COMPLETING', {
          auditId: this.currentAudit?.id,
          findingsCount: this.findings.length,
          totalCompleted: this.completedAudits,
        });
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.SUSPENDING:
        this._log('AUDIT_SUSPENDED', {
          auditId: this.currentAudit?.id,
          reason: 'Awaiting document response',
        });
        setTimeout(() => this.completeActingState(), 100);
        break;
    }
  }

  _log(event, data) {
    console.log(`[${this.unitId}] ${event}:`, data);
  }

  loadAudit(audit) {
    this.currentAudit = audit;
    this._log('AUDIT_LOADED', { auditId: audit.id, target: audit.target });
    return this;
  }

  addFinding(finding) {
    finding.auditId = this.currentAudit?.id;
    finding.timestamp = new Date().toISOString();
    this.findings.push(finding);
    this._log('FINDING_ADDED', { findingId: finding.id, severity: finding.severity });
    return this;
  }

  getFindings() {
    return [...this.findings];
  }

  getStats() {
    return {
      currentAudit: this.currentAudit?.id || null,
      findingsCount: this.findings.length,
      completedAudits: this.completedAudits,
      state: this.getState()
    };
  }
}

/**
 * Budget Cycle Unit
 * Manages the annual budget cycle phases
 */
export class BudgetCycleUnit extends PackMLStateMachine {
  constructor(unitId = 'BUDGET-CYCLE-01') {
    super(unitId);

    this.fiscalYear = new Date().getFullYear();
    this.phase = 'planning'; // planning, adoption, execution, closeout
    this.phases = ['planning', 'adoption', 'execution', 'closeout'];
    this.amendments = [];

    this.addListener((event) => {
      this._handleStateChange(event);
    });
  }

  _handleStateChange(event) {
    switch (event.to) {
      case PackMLState.STARTING:
        this.phase = 'planning';
        this._log('BUDGET_CYCLE_START', { fiscalYear: this.fiscalYear, phase: this.phase });
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.EXECUTE:
        this._log('BUDGET_PHASE', { fiscalYear: this.fiscalYear, phase: this.phase });
        break;

      case PackMLState.COMPLETING:
        const currentIdx = this.phases.indexOf(this.phase);
        if (currentIdx < this.phases.length - 1) {
          this.phase = this.phases[currentIdx + 1];
          this._log('BUDGET_PHASE_ADVANCE', { fiscalYear: this.fiscalYear, phase: this.phase });
        } else {
          this._log('BUDGET_CYCLE_COMPLETE', { fiscalYear: this.fiscalYear });
        }
        setTimeout(() => this.completeActingState(), 100);
        break;
    }
  }

  _log(event, data) {
    console.log(`[${this.unitId}] ${event}:`, data);
  }

  recordAmendment(amendment) {
    amendment.fiscalYear = this.fiscalYear;
    amendment.timestamp = new Date().toISOString();
    this.amendments.push(amendment);
    this._log('BUDGET_AMENDMENT', amendment);
    return this;
  }

  advancePhase() {
    if (this.getState() === PackMLState.EXECUTE) {
      this.transition(PackMLState.COMPLETING, 'Advancing to next phase');
    }
    return this;
  }

  getStats() {
    return {
      fiscalYear: this.fiscalYear,
      phase: this.phase,
      amendmentCount: this.amendments.length,
      state: this.getState()
    };
  }
}

/**
 * Board Meeting Unit
 * Manages board/commission meeting workflow
 */
export class BoardMeetingUnit extends PackMLStateMachine {
  constructor(unitId = 'BOARD-MTG-01') {
    super(unitId);

    this.meeting = null;
    this.agenda = [];
    this.currentItem = 0;
    this.votes = [];
    this.attendees = [];

    this.addListener((event) => {
      this._handleStateChange(event);
    });
  }

  _handleStateChange(event) {
    switch (event.to) {
      case PackMLState.STARTING:
        this._log('MEETING_CALLED_TO_ORDER', {
          meetingId: this.meeting?.id,
          board: this.meeting?.board,
          attendees: this.attendees.length,
        });
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.EXECUTE:
        const item = this.agenda[this.currentItem];
        if (item) {
          this._log('AGENDA_ITEM', {
            itemNumber: this.currentItem + 1,
            description: item.description,
          });
        }
        break;

      case PackMLState.HOLDING:
        this._log('MEETING_RECESSED', { meetingId: this.meeting?.id });
        setTimeout(() => this.completeActingState(), 100);
        break;

      case PackMLState.COMPLETING:
        this._log('MEETING_ADJOURNED', {
          meetingId: this.meeting?.id,
          itemsCompleted: this.currentItem + 1,
          votesRecorded: this.votes.length,
        });
        setTimeout(() => this.completeActingState(), 100);
        break;
    }
  }

  _log(event, data) {
    console.log(`[${this.unitId}] ${event}:`, data);
  }

  scheduleMeeting(meeting) {
    this.meeting = meeting;
    this.agenda = meeting.agenda || [];
    this.currentItem = 0;
    this.votes = [];
    this.attendees = [];
    return this;
  }

  addAttendee(person, role) {
    this.attendees.push({ person, role, arrivedAt: new Date().toISOString() });
    return this;
  }

  nextAgendaItem() {
    if (this.currentItem < this.agenda.length - 1) {
      this.currentItem++;
      this._log('AGENDA_ADVANCE', { itemNumber: this.currentItem + 1 });
    } else {
      // Complete meeting if no more items
      this.transition(PackMLState.COMPLETING, 'All agenda items completed');
    }
    return this;
  }

  recordVote(motion, yeas, nays, abstain = 0) {
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
    this._log('VOTE_RECORDED', vote);
    return vote;
  }

  getStats() {
    return {
      meetingId: this.meeting?.id || null,
      board: this.meeting?.board || null,
      attendees: this.attendees.length,
      currentItem: this.currentItem + 1,
      totalItems: this.agenda.length,
      votesRecorded: this.votes.length,
      state: this.getState()
    };
  }
}

export default {
  ClaimProcessorUnit,
  AuditExecutorUnit,
  BudgetCycleUnit,
  BoardMeetingUnit
};
