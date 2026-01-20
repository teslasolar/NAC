/**
 * Audit Workpapers Generator
 *
 * Standardized audit documentation per GAGAS
 * Per §1720 Audit & Settlement authority
 */

class AuditWorkpapers {
  constructor(auditInfo) {
    this.audit = {
      id: auditInfo.id || this.generateAuditId(),
      entity: auditInfo.entity,
      period: auditInfo.period,
      auditor: auditInfo.auditor,
      startDate: auditInfo.startDate || new Date().toISOString(),
      status: 'PLANNING',
    };
    this.workpapers = [];
    this.findings = [];
    this.testResults = [];
  }

  generateAuditId() {
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `NAC-${year}-${rand}`;
  }

  // Add a workpaper
  addWorkpaper(wp) {
    const workpaper = {
      ref: `WP-${(this.workpapers.length + 1).toString().padStart(3, '0')}`,
      title: wp.title,
      objective: wp.objective,
      procedure: wp.procedure,
      source: wp.source,
      preparedBy: wp.preparedBy || this.audit.auditor,
      preparedDate: new Date().toISOString(),
      reviewedBy: null,
      reviewedDate: null,
      conclusion: wp.conclusion || null,
      attachments: wp.attachments || [],
    };
    this.workpapers.push(workpaper);
    return workpaper.ref;
  }

  // Record test result
  addTestResult(test) {
    const result = {
      ref: `TR-${(this.testResults.length + 1).toString().padStart(3, '0')}`,
      workpaperRef: test.workpaperRef,
      description: test.description,
      sampleSize: test.sampleSize,
      exceptionsFound: test.exceptionsFound || 0,
      exceptionRate: test.sampleSize > 0 ? test.exceptionsFound / test.sampleSize : 0,
      conclusion: test.conclusion,
      details: test.details || [],
    };
    this.testResults.push(result);
    return result.ref;
  }

  // Record finding
  addFinding(finding) {
    const f = {
      ref: `F-${(this.findings.length + 1).toString().padStart(3, '0')}`,
      condition: finding.condition,
      criteria: finding.criteria,
      cause: finding.cause,
      effect: finding.effect,
      recommendation: finding.recommendation,
      managementResponse: null,
      severity: finding.severity || 'MODERATE', // LOW, MODERATE, HIGH, CRITICAL
      status: 'OPEN',
      workpaperRefs: finding.workpaperRefs || [],
    };
    this.findings.push(f);
    return f.ref;
  }

  // Standard row officer audit procedures
  static getRowOfficerProcedures(officerType) {
    const procedures = {
      treasurer: [
        { title: 'Cash Receipts Testing', objective: 'Verify all receipts are properly recorded and deposited' },
        { title: 'Investment Review', objective: 'Confirm investments comply with county policy and state law' },
        { title: 'Bank Reconciliations', objective: 'Test monthly reconciliations for accuracy' },
        { title: 'Tax Collection Audit', objective: 'Verify property tax collections and remittances' },
      ],
      sheriff: [
        { title: 'Sheriff Sale Proceeds', objective: 'Trace sale proceeds from collection to distribution' },
        { title: 'Civil Process Fees', objective: 'Test fee collection and recording' },
        { title: 'Prisoner Transport Costs', objective: 'Review transport billing and reimbursements' },
      ],
      registerOfWills: [
        { title: 'Estate Fee Review', objective: 'Test probate fee calculations' },
        { title: 'Inheritance Tax Remittances', objective: 'Verify timely remittance to state' },
        { title: 'Marriage License Fees', objective: 'Test license fee collection' },
      ],
      recorderOfDeeds: [
        { title: 'Recording Fee Testing', objective: 'Verify proper fee collection per fee schedule' },
        { title: 'Transfer Tax Review', objective: 'Test realty transfer tax calculations and remittances' },
        { title: 'UCC Filing Fees', objective: 'Audit UCC filing fee collection' },
      ],
      prothonotary: [
        { title: 'Civil Filing Fees', objective: 'Test court filing fee collection' },
        { title: 'Escrow Account Review', objective: 'Reconcile escrow accounts' },
        { title: 'Judgment Lien Fees', objective: 'Verify lien recording fees' },
      ],
      clerkOfCourts: [
        { title: 'Criminal Fines & Costs', objective: 'Test collection and distribution of fines' },
        { title: 'Bail Fund Review', objective: 'Reconcile bail fund accounts' },
        { title: 'Restitution Tracking', objective: 'Verify restitution collection and disbursement' },
      ],
      coroner: [
        { title: 'Autopsy Fee Review', objective: 'Test fee collection and third-party billing' },
        { title: 'Investigation Costs', objective: 'Review investigation expense documentation' },
      ],
      districtAttorney: [
        { title: 'Forfeiture Fund Audit', objective: 'Verify proper use of forfeiture funds' },
        { title: 'Grant Compliance', objective: 'Test grant expenditures against award terms' },
        { title: 'ARD Fee Collection', objective: 'Audit ARD program fee collection' },
      ],
    };
    return procedures[officerType] || [];
  }

  // Generate audit index
  generateIndex() {
    return {
      auditId: this.audit.id,
      entity: this.audit.entity,
      period: this.audit.period,
      status: this.audit.status,
      workpaperCount: this.workpapers.length,
      findingsCount: this.findings.length,
      testResultsCount: this.testResults.length,
      findingsBySeverity: {
        critical: this.findings.filter(f => f.severity === 'CRITICAL').length,
        high: this.findings.filter(f => f.severity === 'HIGH').length,
        moderate: this.findings.filter(f => f.severity === 'MODERATE').length,
        low: this.findings.filter(f => f.severity === 'LOW').length,
      },
      workpapers: this.workpapers.map(wp => ({
        ref: wp.ref,
        title: wp.title,
        status: wp.reviewedBy ? 'REVIEWED' : 'PENDING REVIEW',
      })),
    };
  }

  // Export to JSON
  toJSON() {
    return {
      audit: this.audit,
      workpapers: this.workpapers,
      findings: this.findings,
      testResults: this.testResults,
      index: this.generateIndex(),
    };
  }
}

module.exports = { AuditWorkpapers };
