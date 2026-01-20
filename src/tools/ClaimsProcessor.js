/**
 * Claims Processor
 *
 * Pre-audit claims processing workflow
 * Per §1730 Pre-Audit Claims and §1731 Warrant Issuance
 */

class ClaimsProcessor {
  constructor(options = {}) {
    this.approvalThresholds = options.approvalThresholds || {
      auto: 5000,        // Auto-approve under $5K
      supervisor: 25000, // Supervisor review $5K-$25K
      controller: 100000, // Controller review $25K-$100K
      // Over $100K requires board approval
    };
    this.claims = [];
    this.warrants = [];
  }

  // Submit claim for processing
  submitClaim(claim) {
    const c = {
      id: this.generateClaimId(),
      submittedAt: new Date().toISOString(),
      vendor: claim.vendor,
      amount: claim.amount,
      department: claim.department,
      accountCode: claim.accountCode,
      invoiceNumber: claim.invoiceNumber,
      invoiceDate: claim.invoiceDate,
      description: claim.description,
      approvals: [],
      status: 'SUBMITTED',
      checks: [],
    };

    // Run automated checks
    c.checks = this.runChecks(c);

    // Determine approval level needed
    c.approvalLevelRequired = this.determineApprovalLevel(c);

    // Auto-approve if all checks pass and under threshold
    if (c.checks.every(ch => ch.passed) && c.amount <= this.approvalThresholds.auto) {
      c.status = 'AUTO_APPROVED';
      c.approvals.push({
        level: 'SYSTEM',
        approver: 'AUTO',
        timestamp: new Date().toISOString(),
        notes: 'Auto-approved: passed all checks, under threshold',
      });
    } else if (c.checks.some(ch => !ch.passed)) {
      c.status = 'FLAGGED';
    } else {
      c.status = 'PENDING_APPROVAL';
    }

    this.claims.push(c);
    return c;
  }

  generateClaimId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = (this.claims.length + 1).toString().padStart(4, '0');
    return `CLM-${dateStr}-${seq}`;
  }

  // Automated claim checks
  runChecks(claim) {
    const checks = [];

    // Check 1: Valid vendor
    checks.push({
      name: 'VALID_VENDOR',
      passed: claim.vendor && claim.vendor.length > 2,
      message: claim.vendor ? 'Vendor name provided' : 'Missing vendor name',
    });

    // Check 2: Invoice number present
    checks.push({
      name: 'INVOICE_NUMBER',
      passed: !!claim.invoiceNumber,
      message: claim.invoiceNumber ? 'Invoice number provided' : 'Missing invoice number',
    });

    // Check 3: Amount is positive
    checks.push({
      name: 'POSITIVE_AMOUNT',
      passed: claim.amount > 0,
      message: claim.amount > 0 ? 'Valid amount' : 'Invalid amount',
    });

    // Check 4: Account code format
    const accountCodePattern = /^\d{3}-\d{4}-\d{3}$/;
    checks.push({
      name: 'ACCOUNT_CODE_FORMAT',
      passed: accountCodePattern.test(claim.accountCode),
      message: accountCodePattern.test(claim.accountCode)
        ? 'Valid account code format'
        : 'Invalid account code format (expected: XXX-XXXX-XXX)',
    });

    // Check 5: Invoice date not in future
    const invoiceDate = new Date(claim.invoiceDate);
    const isFuture = invoiceDate > new Date();
    checks.push({
      name: 'INVOICE_DATE',
      passed: !isFuture,
      message: isFuture ? 'Invoice date is in the future' : 'Valid invoice date',
    });

    // Check 6: Invoice not too old (>90 days)
    const daysSinceInvoice = (new Date() - invoiceDate) / (1000 * 60 * 60 * 24);
    checks.push({
      name: 'INVOICE_AGE',
      passed: daysSinceInvoice <= 90,
      message: daysSinceInvoice <= 90
        ? 'Invoice within 90-day window'
        : `Invoice is ${Math.round(daysSinceInvoice)} days old - review required`,
    });

    return checks;
  }

  // Determine required approval level
  determineApprovalLevel(claim) {
    if (claim.amount <= this.approvalThresholds.auto) return 'AUTO';
    if (claim.amount <= this.approvalThresholds.supervisor) return 'SUPERVISOR';
    if (claim.amount <= this.approvalThresholds.controller) return 'CONTROLLER';
    return 'BOARD';
  }

  // Process approval
  approve(claimId, approver, notes = '') {
    const claim = this.claims.find(c => c.id === claimId);
    if (!claim) throw new Error(`Claim ${claimId} not found`);

    claim.approvals.push({
      level: claim.approvalLevelRequired,
      approver,
      timestamp: new Date().toISOString(),
      notes,
    });
    claim.status = 'APPROVED';

    return claim;
  }

  // Reject claim
  reject(claimId, rejector, reason) {
    const claim = this.claims.find(c => c.id === claimId);
    if (!claim) throw new Error(`Claim ${claimId} not found`);

    claim.status = 'REJECTED';
    claim.rejectedBy = rejector;
    claim.rejectedAt = new Date().toISOString();
    claim.rejectionReason = reason;

    return claim;
  }

  // Issue warrant for approved claim
  issueWarrant(claimId) {
    const claim = this.claims.find(c => c.id === claimId);
    if (!claim) throw new Error(`Claim ${claimId} not found`);
    if (claim.status !== 'APPROVED') {
      throw new Error(`Claim ${claimId} is not approved (status: ${claim.status})`);
    }

    const warrant = {
      id: `WRT-${Date.now()}`,
      claimId: claim.id,
      vendor: claim.vendor,
      amount: claim.amount,
      issuedAt: new Date().toISOString(),
      status: 'ISSUED',
    };

    claim.warrantId = warrant.id;
    claim.status = 'WARRANT_ISSUED';
    this.warrants.push(warrant);

    return warrant;
  }

  // Get processing summary
  getSummary() {
    const byStatus = {};
    let totalAmount = 0;
    let approvedAmount = 0;

    for (const claim of this.claims) {
      byStatus[claim.status] = (byStatus[claim.status] || 0) + 1;
      totalAmount += claim.amount;
      if (claim.status === 'APPROVED' || claim.status === 'WARRANT_ISSUED') {
        approvedAmount += claim.amount;
      }
    }

    return {
      totalClaims: this.claims.length,
      totalAmount,
      approvedAmount,
      warrantCount: this.warrants.length,
      byStatus,
      flaggedClaims: this.claims.filter(c => c.status === 'FLAGGED'),
      pendingApproval: this.claims.filter(c => c.status === 'PENDING_APPROVAL'),
    };
  }
}

module.exports = { ClaimsProcessor };
