/**
 * Duplicate Payment Detector
 *
 * AI/ML pattern matching for detecting duplicate or suspicious payments
 * Per §1730 Pre-Audit Claims authority
 */

class DuplicateDetector {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.85; // Similarity threshold
    this.windowDays = options.windowDays || 30; // Look-back window
    this.flaggedPayments = [];
  }

  // Hash payment for quick comparison
  hashPayment(payment) {
    const key = [
      payment.vendor?.toLowerCase().trim(),
      payment.amount?.toFixed(2),
      payment.invoiceNumber?.toLowerCase().trim(),
    ].join('|');
    return this.simpleHash(key);
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // Calculate similarity between two payments
  similarity(a, b) {
    let score = 0;
    let weights = 0;

    // Exact amount match (weight: 3)
    if (a.amount === b.amount) {
      score += 3;
    } else if (Math.abs(a.amount - b.amount) < 0.01) {
      score += 2.5;
    }
    weights += 3;

    // Vendor similarity (weight: 3)
    const vendorSim = this.stringSimilarity(a.vendor, b.vendor);
    score += vendorSim * 3;
    weights += 3;

    // Invoice number similarity (weight: 2)
    if (a.invoiceNumber && b.invoiceNumber) {
      const invSim = this.stringSimilarity(a.invoiceNumber, b.invoiceNumber);
      score += invSim * 2;
      weights += 2;
    }

    // Date proximity (weight: 1)
    const daysDiff = Math.abs(
      (new Date(a.date) - new Date(b.date)) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 1) score += 1;
    else if (daysDiff <= 7) score += 0.5;
    weights += 1;

    return score / weights;
  }

  // Levenshtein-based string similarity
  stringSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    s1 = s1.toLowerCase().trim();
    s2 = s2.toLowerCase().trim();
    if (s1 === s2) return 1;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1;

    const editDistance = this.levenshtein(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshtein(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  // Scan payments for duplicates
  scan(payments) {
    const results = {
      duplicates: [],
      suspicious: [],
      stats: { total: payments.length, flagged: 0, totalFlaggedAmount: 0 }
    };

    const indexed = new Map();

    for (const payment of payments) {
      const hash = this.hashPayment(payment);

      // Check for exact hash match (definite duplicate)
      if (indexed.has(hash)) {
        const original = indexed.get(hash);
        results.duplicates.push({
          type: 'EXACT_DUPLICATE',
          confidence: 1.0,
          original,
          duplicate: payment,
          amount: payment.amount,
        });
        results.stats.flagged++;
        results.stats.totalFlaggedAmount += payment.amount;
        continue;
      }

      // Check similarity against recent payments
      for (const [, existing] of indexed) {
        const sim = this.similarity(payment, existing);
        if (sim >= this.threshold) {
          results.suspicious.push({
            type: sim >= 0.95 ? 'LIKELY_DUPLICATE' : 'POSSIBLE_DUPLICATE',
            confidence: sim,
            original: existing,
            suspect: payment,
            amount: payment.amount,
          });
          results.stats.flagged++;
          results.stats.totalFlaggedAmount += payment.amount;
        }
      }

      indexed.set(hash, payment);
    }

    return results;
  }

  // Generate report
  generateReport(results) {
    const lines = [
      '='.repeat(60),
      'DUPLICATE PAYMENT DETECTION REPORT',
      `Generated: ${new Date().toISOString()}`,
      '='.repeat(60),
      '',
      `Total Payments Scanned: ${results.stats.total}`,
      `Flagged for Review: ${results.stats.flagged}`,
      `Total Flagged Amount: $${results.stats.totalFlaggedAmount.toLocaleString()}`,
      '',
    ];

    if (results.duplicates.length > 0) {
      lines.push('EXACT DUPLICATES:');
      lines.push('-'.repeat(40));
      for (const dup of results.duplicates) {
        lines.push(`  Vendor: ${dup.original.vendor}`);
        lines.push(`  Amount: $${dup.amount.toLocaleString()}`);
        lines.push(`  Original Date: ${dup.original.date}`);
        lines.push(`  Duplicate Date: ${dup.duplicate.date}`);
        lines.push('');
      }
    }

    if (results.suspicious.length > 0) {
      lines.push('SUSPICIOUS PAYMENTS:');
      lines.push('-'.repeat(40));
      for (const sus of results.suspicious) {
        lines.push(`  Type: ${sus.type}`);
        lines.push(`  Confidence: ${(sus.confidence * 100).toFixed(1)}%`);
        lines.push(`  Vendor: ${sus.original.vendor} / ${sus.suspect.vendor}`);
        lines.push(`  Amount: $${sus.amount.toLocaleString()}`);
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}

module.exports = { DuplicateDetector };
