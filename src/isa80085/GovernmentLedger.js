/**
 * ISA-80085 Government Ledger
 * Complete blockchain implementation for county government
 *
 * Integrates:
 * - BlockchainCore for immutable records
 * - TransactionVerifier for multi-sig workflows
 * - MerkleTree for audit proofs
 * - ISA-95/88/18.2 integration points
 */

const { GovernmentBlockchain, TransactionType, Transaction } = require('./BlockchainCore');
const { TransactionVerifier, Signer, CountyValidationRules } = require('./TransactionVerifier');
const { AuditMerkleTree } = require('./MerkleTree');

class GovernmentLedger {
  constructor(countyName = 'Northampton County') {
    this.countyName = countyName;
    this.blockchain = new GovernmentBlockchain(countyName.toLowerCase().replace(/\s/g, '-'));
    this.verifier = new TransactionVerifier();
    this.auditTree = new AuditMerkleTree();

    // Configure standard validation rules
    this.verifier.addValidationRule(CountyValidationRules.budgetLimit(100000));
    this.verifier.addValidationRule(CountyValidationRules.fiscalYearCheck());

    // System state
    this.pendingApprovals = new Map();
    this.auditLog = [];
  }

  // Register an authorized official
  registerOfficial(id, name, role) {
    const { publicKey, privateKey } = Signer.generateKeyPair();
    const signer = new Signer(id, name, role, privateKey, publicKey);
    this.verifier.registerSigner(signer);
    this.blockchain.registerAuthority(id, name, publicKey);

    this.log('OFFICIAL_REGISTERED', { id, name, role });
    return signer;
  }

  // Submit a claim for pre-audit
  submitClaim(claim, submitter) {
    const tx = this.blockchain.addTransaction(
      TransactionType.CLAIM_SUBMITTED,
      {
        claimId: claim.id,
        vendor: claim.vendor,
        amount: claim.amount,
        description: claim.description,
        fiscalYear: claim.fiscalYear || new Date().getFullYear(),
        statute: '16 Pa.C.S. §1730',
      },
      submitter
    );

    this.log('CLAIM_SUBMITTED', { claimId: claim.id, amount: claim.amount });
    return tx;
  }

  // Approve a claim (requires controller signature)
  approveClaim(claimId, amount, signer) {
    const tx = new Transaction(
      TransactionType.CLAIM_APPROVED,
      {
        claimId,
        amount,
        fiscalYear: new Date().getFullYear(),
        statute: '16 Pa.C.S. §1730',
      },
      signer.id
    );

    const signature = signer.sign(tx);
    const verification = this.verifier.verify(tx, [signature]);

    if (verification.status === 'valid') {
      this.blockchain.addTransaction(tx.type, tx.data, tx.initiator);
      this.log('CLAIM_APPROVED', { claimId, amount, approver: signer.name });
      return { success: true, verification };
    }

    this.log('CLAIM_APPROVAL_FAILED', { claimId, reason: verification.status });
    return { success: false, verification };
  }

  // Record an audit finding
  recordFinding(finding, auditor) {
    const tx = this.blockchain.addTransaction(
      TransactionType.FINDING_RECORDED,
      {
        findingId: finding.id,
        auditId: finding.auditId,
        severity: finding.severity,
        title: finding.title,
        description: finding.description,
        statute: finding.statute || '16 Pa.C.S. §1720',
        recommendation: finding.recommendation,
      },
      auditor
    );

    // Add to audit merkle tree
    this.auditTree.addRecords([{
      id: finding.id,
      type: 'FINDING',
      timestamp: tx.timestamp,
      data: finding,
    }]);

    this.log('FINDING_RECORDED', { findingId: finding.id, severity: finding.severity });
    return tx;
  }

  // Record a board vote
  recordBoardVote(board, motion, yeas, nays, abstain, recorder) {
    const passed = yeas > nays;
    const tx = this.blockchain.addTransaction(
      TransactionType.BOARD_VOTE,
      {
        board,
        motion: motion.description,
        motionId: motion.id,
        yeas,
        nays,
        abstain,
        passed,
        statute: this.getBoardStatute(board),
      },
      recorder
    );

    this.log('BOARD_VOTE', { board, motion: motion.id, passed });
    return tx;
  }

  getBoardStatute(board) {
    const statutes = {
      'salary_board': '16 Pa.C.S. §1501',
      'retirement_board': '16 Pa.C.S. §1902',
      'prison_board': '61 Pa.C.S. §1731',
      'elections_board': '25 P.S. §2641',
      'tax_appeals': '72 P.S. §5020',
    };
    return statutes[board] || 'County Code';
  }

  // Finalize a block (create a new block with pending transactions)
  finalizeBlock(authority) {
    const block = this.blockchain.createBlock(authority);
    if (block) {
      this.log('BLOCK_CREATED', {
        index: block.index,
        transactions: block.transactions.length,
        authority,
      });
    }
    return block;
  }

  // Validate entire ledger integrity
  validate() {
    const chainValidation = this.blockchain.validateChain();
    const treeValidation = this.auditTree.verify();

    return {
      timestamp: new Date().toISOString(),
      blockchain: chainValidation,
      auditTree: {
        valid: treeValidation,
        root: this.auditTree.getRoot(),
        recordCount: this.auditTree.records.length,
      },
      overall: chainValidation.valid && treeValidation,
    };
  }

  // Generate audit proof for a specific record
  getAuditProof(recordId) {
    return this.auditTree.getRecordProof(recordId);
  }

  // Export for external auditors
  exportForAudit(options = {}) {
    return {
      ledger: {
        county: this.countyName,
        standard: 'ISA-80085 v1.0',
        exportedAt: new Date().toISOString(),
      },
      blockchain: this.blockchain.exportForAudit(
        options.startBlock,
        options.endBlock
      ),
      auditCertificate: this.auditTree.generateCertificate(),
      validation: this.validate(),
      auditLog: this.auditLog.slice(-1000), // Last 1000 log entries
    };
  }

  // Query transactions
  query(filter) {
    return this.blockchain.findTransactions(filter);
  }

  // Internal logging
  log(event, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      event,
      ...data,
    };
    this.auditLog.push(entry);
    return entry;
  }

  // Integration with ISA-88 batch records
  recordBatchExecution(batchId, recipe, result, authority) {
    return this.blockchain.addTransaction(
      TransactionType.AUDIT_COMPLETED,
      {
        batchId,
        recipeId: recipe.id,
        statute: recipe.statute,
        result: result.state,
        history: result.history,
      },
      authority
    );
  }

  // Integration with ISA-18.2 alarm events
  recordAlarmEvent(alarm, action, operator) {
    return this.blockchain.addTransaction(
      'alarm_event',
      {
        alarmId: alarm.id,
        alarmType: alarm.type,
        priority: alarm.priority,
        action,
        relatedStatute: alarm.relatedStatute,
      },
      operator
    );
  }
}

module.exports = { GovernmentLedger };
