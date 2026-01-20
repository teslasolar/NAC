/**
 * ISA-80085 Transaction Verifier
 * Cryptographic verification for government transactions
 *
 * Implements:
 * - Multi-signature approval workflows
 * - Threshold signing (M of N)
 * - Digital signature verification
 * - Transaction validation rules
 */

const crypto = require('crypto');

// Verification status codes
const VerificationStatus = {
  VALID: 'valid',
  INVALID_SIGNATURE: 'invalid_signature',
  INSUFFICIENT_SIGNATURES: 'insufficient_signatures',
  EXPIRED: 'expired',
  INVALID_FORMAT: 'invalid_format',
  RULE_VIOLATION: 'rule_violation',
  DUPLICATE: 'duplicate',
  UNAUTHORIZED: 'unauthorized',
};

// Signature requirements per transaction type
const SignatureRequirements = {
  // Financial transactions - require controller + department head
  claim_approved: { threshold: 2, roles: ['controller', 'department_head'] },
  payment_issued: { threshold: 2, roles: ['controller', 'treasurer'] },

  // High-value transactions - require 3 signatures
  budget_adopted: { threshold: 3, roles: ['controller', 'commissioner', 'commissioner'] },
  budget_amended: { threshold: 3, roles: ['controller', 'commissioner', 'commissioner'] },

  // Standard transactions - single authority
  claim_submitted: { threshold: 1, roles: ['any'] },
  receipt_recorded: { threshold: 1, roles: ['treasurer'] },
  audit_started: { threshold: 1, roles: ['controller'] },
  audit_completed: { threshold: 1, roles: ['controller'] },

  // Governance - board vote
  board_vote: { threshold: 1, roles: ['board_member'] },
  resolution_passed: { threshold: 1, roles: ['board_chair'] },
};

class Signer {
  constructor(id, name, role, privateKey, publicKey) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.created = new Date().toISOString();
  }

  sign(data) {
    const signer = crypto.createSign('SHA256');
    signer.update(typeof data === 'string' ? data : JSON.stringify(data));
    return {
      signerId: this.id,
      signerName: this.name,
      signerRole: this.role,
      signature: signer.sign(this.privateKey, 'hex'),
      timestamp: new Date().toISOString(),
    };
  }

  static verify(data, signature, publicKey) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(typeof data === 'string' ? data : JSON.stringify(data));
    return verifier.verify(publicKey, signature, 'hex');
  }

  static generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
  }
}

class TransactionVerifier {
  constructor() {
    this.signers = new Map();
    this.processedHashes = new Set(); // For duplicate detection
    this.validationRules = [];
  }

  registerSigner(signer) {
    this.signers.set(signer.id, signer);
    return this;
  }

  addValidationRule(rule) {
    this.validationRules.push(rule);
    return this;
  }

  // Verify a transaction with its signatures
  verify(transaction, signatures) {
    const result = {
      transactionId: transaction.id,
      transactionType: transaction.type,
      timestamp: new Date().toISOString(),
      status: VerificationStatus.VALID,
      checks: [],
    };

    // 1. Check for duplicates
    if (this.processedHashes.has(transaction.hash)) {
      result.status = VerificationStatus.DUPLICATE;
      result.checks.push({ check: 'duplicate', passed: false });
      return result;
    }
    result.checks.push({ check: 'duplicate', passed: true });

    // 2. Verify transaction format
    if (!this.validateFormat(transaction)) {
      result.status = VerificationStatus.INVALID_FORMAT;
      result.checks.push({ check: 'format', passed: false });
      return result;
    }
    result.checks.push({ check: 'format', passed: true });

    // 3. Check signature requirements
    const requirements = SignatureRequirements[transaction.type] || { threshold: 1, roles: ['any'] };
    const validSignatures = [];

    for (const sig of signatures) {
      const signer = this.signers.get(sig.signerId);
      if (!signer) continue;

      // Verify signature cryptographically
      const isValid = Signer.verify(transaction, sig.signature, signer.publicKey);
      if (!isValid) continue;

      // Check role authorization
      if (requirements.roles.includes('any') || requirements.roles.includes(signer.role)) {
        validSignatures.push(sig);
      }
    }

    result.checks.push({
      check: 'signatures',
      required: requirements.threshold,
      valid: validSignatures.length,
      passed: validSignatures.length >= requirements.threshold,
    });

    if (validSignatures.length < requirements.threshold) {
      result.status = VerificationStatus.INSUFFICIENT_SIGNATURES;
      return result;
    }

    // 4. Run custom validation rules
    for (const rule of this.validationRules) {
      const ruleResult = rule(transaction);
      result.checks.push({
        check: rule.name || 'custom_rule',
        passed: ruleResult.passed,
        message: ruleResult.message,
      });

      if (!ruleResult.passed) {
        result.status = VerificationStatus.RULE_VIOLATION;
        return result;
      }
    }

    // All checks passed
    this.processedHashes.add(transaction.hash);
    return result;
  }

  validateFormat(transaction) {
    return (
      transaction.id &&
      transaction.type &&
      transaction.timestamp &&
      transaction.hash
    );
  }

  // Create a multi-signature request
  createSignatureRequest(transaction, requiredRoles) {
    return {
      requestId: crypto.randomUUID(),
      transaction,
      requiredRoles,
      signatures: [],
      status: 'pending',
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
  }

  // Add signature to request
  addSignatureToRequest(request, signer) {
    if (new Date() > new Date(request.expires)) {
      return { success: false, error: 'Request expired' };
    }

    const sig = signer.sign(request.transaction);
    request.signatures.push(sig);

    // Check if we have enough signatures
    const requirements = SignatureRequirements[request.transaction.type];
    if (request.signatures.length >= requirements.threshold) {
      request.status = 'ready';
    }

    return { success: true, signaturesCollected: request.signatures.length };
  }

  // Verify and finalize a signature request
  finalizeRequest(request) {
    if (request.status !== 'ready') {
      return { success: false, error: 'Request not ready' };
    }

    const verification = this.verify(request.transaction, request.signatures);
    if (verification.status === VerificationStatus.VALID) {
      request.status = 'completed';
      request.verification = verification;
      return { success: true, verification };
    }

    return { success: false, verification };
  }
}

// County-specific validation rules
const CountyValidationRules = {
  budgetLimit: (limit) => {
    const rule = (tx) => {
      if (tx.type === 'claim_approved' && tx.data.amount > limit) {
        return { passed: false, message: `Amount exceeds limit of $${limit}` };
      }
      return { passed: true };
    };
    rule.name = 'budget_limit';
    return rule;
  },

  fiscalYearCheck: () => {
    const rule = (tx) => {
      const currentFY = new Date().getFullYear();
      if (tx.data.fiscalYear && tx.data.fiscalYear !== currentFY) {
        return { passed: false, message: `Wrong fiscal year: ${tx.data.fiscalYear}` };
      }
      return { passed: true };
    };
    rule.name = 'fiscal_year';
    return rule;
  },

  statuteCompliance: (requiredStatute) => {
    const rule = (tx) => {
      if (tx.data.statute !== requiredStatute) {
        return { passed: false, message: `Missing statute reference: ${requiredStatute}` };
      }
      return { passed: true };
    };
    rule.name = 'statute_compliance';
    return rule;
  },
};

module.exports = {
  VerificationStatus,
  SignatureRequirements,
  Signer,
  TransactionVerifier,
  CountyValidationRules,
};
