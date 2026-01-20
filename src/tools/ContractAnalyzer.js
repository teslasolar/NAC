/**
 * Contract Analyzer
 *
 * Review and analyze county contracts >$100K
 * Per §1730 Pre-Audit Claims authority
 */

class ContractAnalyzer {
  constructor() {
    this.contracts = [];
    this.benchmarks = {
      // Industry benchmarks for common services
      IT: { hourlyRate: { low: 85, mid: 125, high: 175 } },
      legal: { hourlyRate: { low: 150, mid: 250, high: 400 } },
      construction: { sqftCost: { low: 150, mid: 225, high: 350 } },
      janitorial: { sqftAnnual: { low: 1.50, mid: 2.25, high: 3.50 } },
      security: { hourlyRate: { low: 18, mid: 25, high: 35 } },
      consulting: { dailyRate: { low: 800, mid: 1500, high: 2500 } },
    };
  }

  // Add contract for analysis
  addContract(contract) {
    const c = {
      id: contract.id,
      vendor: contract.vendor,
      description: contract.description,
      category: contract.category,
      totalValue: contract.totalValue,
      term: contract.term, // in months
      startDate: contract.startDate,
      endDate: contract.endDate,
      competitive: contract.competitive || false, // Was it competitively bid?
      renewals: contract.renewals || 0,
      metrics: contract.metrics || {}, // e.g., { hours: 1000, sqft: 50000 }
    };
    this.contracts.push(c);
    return c;
  }

  // Analyze single contract
  analyzeContract(contract) {
    const analysis = {
      id: contract.id,
      vendor: contract.vendor,
      totalValue: contract.totalValue,
      annualValue: contract.totalValue / (contract.term / 12),
      flags: [],
      benchmarkComparison: null,
      recommendations: [],
    };

    // Check if competitively bid
    if (!contract.competitive && contract.totalValue > 100000) {
      analysis.flags.push({
        type: 'NO_COMPETITIVE_BID',
        severity: 'HIGH',
        message: 'Contract >$100K not competitively bid',
      });
      analysis.recommendations.push('Consider rebidding at renewal');
    }

    // Check for excessive renewals
    if (contract.renewals >= 3) {
      analysis.flags.push({
        type: 'EXCESSIVE_RENEWALS',
        severity: 'MODERATE',
        message: `Contract renewed ${contract.renewals} times without rebid`,
      });
      analysis.recommendations.push('Issue new RFP to ensure competitive pricing');
    }

    // Benchmark comparison
    const benchmark = this.benchmarks[contract.category];
    if (benchmark && contract.metrics) {
      if (benchmark.hourlyRate && contract.metrics.hours) {
        const effectiveRate = contract.totalValue / contract.metrics.hours;
        analysis.benchmarkComparison = {
          metric: 'Hourly Rate',
          actual: effectiveRate,
          benchmark: benchmark.hourlyRate,
          status: this.rateStatus(effectiveRate, benchmark.hourlyRate),
        };

        if (effectiveRate > benchmark.hourlyRate.high) {
          analysis.flags.push({
            type: 'ABOVE_BENCHMARK',
            severity: 'MODERATE',
            message: `Rate $${effectiveRate.toFixed(0)}/hr exceeds high benchmark $${benchmark.hourlyRate.high}/hr`,
          });
          analysis.recommendations.push('Negotiate rate reduction or seek alternative vendors');
        }
      }

      if (benchmark.sqftAnnual && contract.metrics.sqft) {
        const annualValue = contract.totalValue / (contract.term / 12);
        const effectiveRate = annualValue / contract.metrics.sqft;
        analysis.benchmarkComparison = {
          metric: 'Cost per Sq Ft (Annual)',
          actual: effectiveRate,
          benchmark: benchmark.sqftAnnual,
          status: this.rateStatus(effectiveRate, benchmark.sqftAnnual),
        };

        if (effectiveRate > benchmark.sqftAnnual.high) {
          analysis.flags.push({
            type: 'ABOVE_BENCHMARK',
            severity: 'MODERATE',
            message: `Rate $${effectiveRate.toFixed(2)}/sqft exceeds benchmark`,
          });
        }
      }
    }

    // Check contract age
    const monthsRemaining = this.monthsUntil(contract.endDate);
    if (monthsRemaining <= 3 && monthsRemaining > 0) {
      analysis.flags.push({
        type: 'EXPIRING_SOON',
        severity: 'INFO',
        message: `Contract expires in ${monthsRemaining} months`,
      });
      analysis.recommendations.push('Begin procurement process for replacement/renewal');
    }

    return analysis;
  }

  rateStatus(actual, benchmark) {
    if (actual <= benchmark.low) return 'EXCELLENT';
    if (actual <= benchmark.mid) return 'GOOD';
    if (actual <= benchmark.high) return 'ACCEPTABLE';
    return 'ABOVE_MARKET';
  }

  monthsUntil(dateStr) {
    const end = new Date(dateStr);
    const now = new Date();
    return Math.round((end - now) / (1000 * 60 * 60 * 24 * 30));
  }

  // Analyze all contracts
  analyzeAll() {
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalContracts: this.contracts.length,
        totalValue: 0,
        flaggedCount: 0,
        potentialSavings: 0,
      },
      byCategory: {},
      analyses: [],
      topConcerns: [],
    };

    for (const contract of this.contracts) {
      const analysis = this.analyzeContract(contract);
      results.analyses.push(analysis);
      results.summary.totalValue += contract.totalValue;

      if (analysis.flags.length > 0) {
        results.summary.flaggedCount++;

        // Estimate potential savings for above-benchmark contracts
        if (analysis.benchmarkComparison?.status === 'ABOVE_MARKET') {
          const savings = contract.totalValue * 0.15; // Estimate 15% savings potential
          results.summary.potentialSavings += savings;
          results.topConcerns.push({
            vendor: contract.vendor,
            value: contract.totalValue,
            issue: analysis.flags[0].message,
            potentialSavings: savings,
          });
        }
      }

      // Aggregate by category
      if (!results.byCategory[contract.category]) {
        results.byCategory[contract.category] = { count: 0, value: 0 };
      }
      results.byCategory[contract.category].count++;
      results.byCategory[contract.category].value += contract.totalValue;
    }

    results.topConcerns.sort((a, b) => b.potentialSavings - a.potentialSavings);

    return results;
  }

  // Generate report
  generateReport(results) {
    const lines = [
      '='.repeat(60),
      'CONTRACT ANALYSIS REPORT',
      `Generated: ${results.timestamp}`,
      '='.repeat(60),
      '',
      `Total Contracts Analyzed: ${results.summary.totalContracts}`,
      `Total Contract Value: $${results.summary.totalValue.toLocaleString()}`,
      `Contracts Flagged: ${results.summary.flaggedCount}`,
      `Potential Savings Identified: $${results.summary.potentialSavings.toLocaleString()}`,
      '',
      'CONTRACTS BY CATEGORY:',
      '-'.repeat(40),
    ];

    for (const [cat, data] of Object.entries(results.byCategory)) {
      lines.push(`  ${cat}: ${data.count} contracts, $${data.value.toLocaleString()}`);
    }

    if (results.topConcerns.length > 0) {
      lines.push('');
      lines.push('TOP CONCERNS:');
      lines.push('-'.repeat(40));
      for (const concern of results.topConcerns.slice(0, 10)) {
        lines.push(`  ${concern.vendor}`);
        lines.push(`    Value: $${concern.value.toLocaleString()}`);
        lines.push(`    Issue: ${concern.issue}`);
        lines.push(`    Potential Savings: $${concern.potentialSavings.toLocaleString()}`);
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}

module.exports = { ContractAnalyzer };
