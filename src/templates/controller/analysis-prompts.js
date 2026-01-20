/**
 * Controller Analysis Prompts
 *
 * AI prompts for Controller analysis functions
 * Used with WebLLM or Claude for automated analysis
 *
 * @module templates/controller/analysis-prompts
 */

export const ControllerAnalysisPrompts = {
  auditRisk: {
    id: 'audit-risk',
    name: 'Audit Risk Assessment',
    description: 'Analyze department data for audit risk factors',
    prompt: `Analyze the following county department data for audit risk factors:
- Unusual transaction patterns
- Segregation of duties concerns
- Cash handling vulnerabilities
- Revenue recognition issues
- Expenditure anomalies
- Internal control weaknesses
- Prior audit findings not remediated

Provide a risk score (1-100) and specific areas of concern.`,
    inputSchema: {
      departmentId: 'string',
      transactionData: 'array',
      priorFindings: 'array',
      controlAssessment: 'object'
    },
    outputSchema: {
      riskScore: 'number',
      riskLevel: 'string', // low, moderate, high
      concerns: 'array',
      recommendations: 'array'
    }
  },

  budgetVariance: {
    id: 'budget-variance',
    name: 'Budget Variance Analysis',
    description: 'Review budget vs. actual performance',
    prompt: `Review budget vs. actual performance for:
- Line item variances exceeding 10%
- Trending over/under spending
- Unexplained fluctuations
- Revenue shortfalls
- Appropriation transfers needed
- Year-end projections

Provide specific recommendations for corrective actions.`,
    inputSchema: {
      fiscalYear: 'number',
      department: 'string',
      budgetData: 'array',
      actualData: 'array',
      priorYearData: 'array'
    },
    outputSchema: {
      variances: 'array',
      trends: 'array',
      projections: 'object',
      recommendations: 'array'
    }
  },

  complianceCheck: {
    id: 'compliance-check',
    name: 'Compliance Evaluation',
    description: 'Evaluate regulatory compliance',
    prompt: `Evaluate compliance with:
- PA County Code requirements (Title 16)
- Home Rule Charter provisions
- GASB accounting standards
- Federal/state grant requirements
- Internal policies and procedures
- Bond covenants
- Pension obligations

Identify any compliance gaps and remediation steps.`,
    inputSchema: {
      entityType: 'string',
      entityId: 'string',
      regulatoryFramework: 'array',
      documentsReviewed: 'array',
      observedPractices: 'array'
    },
    outputSchema: {
      complianceStatus: 'string', // compliant, partial, non-compliant
      gaps: 'array',
      risks: 'array',
      remediationPlan: 'array'
    }
  },

  fraudIndicators: {
    id: 'fraud-indicators',
    name: 'Fraud Indicator Screening',
    description: 'Screen for potential fraud indicators',
    prompt: `Screen for potential fraud indicators:
- Duplicate payments (same vendor, amount, date)
- Ghost employees (no valid SSN, address anomalies)
- Fictitious vendors (PO Box only, no history)
- Unauthorized transactions (no approval chain)
- Missing documentation (gaps in records)
- Unusual timing (end of period transactions)
- Round dollar amounts (possible estimates)
- Excessive sole source contracts

Flag suspicious items for further investigation.`,
    inputSchema: {
      transactionType: 'string',
      transactions: 'array',
      vendorMaster: 'array',
      employeeMaster: 'array',
      approvalRecords: 'array'
    },
    outputSchema: {
      flaggedItems: 'array',
      riskLevel: 'string',
      investigationPriority: 'number',
      nextSteps: 'array'
    }
  },

  claimReview: {
    id: 'claim-review',
    name: 'Claim Pre-Audit Review',
    description: 'Review claims for payment approval',
    prompt: `Review this claim for payment approval per 16 Pa.C.S. §1750:
- Valid appropriation exists
- Sufficient budget balance
- Proper authorization chain
- Supporting documentation complete
- Vendor in good standing
- No duplicate payment
- Correct account coding
- Arithmetic accuracy

Recommend: Approve, Return for Correction, or Deny.`,
    inputSchema: {
      claimId: 'string',
      vendorId: 'string',
      amount: 'number',
      accountCode: 'string',
      supportingDocs: 'array',
      priorPayments: 'array'
    },
    outputSchema: {
      recommendation: 'string', // approve, return, deny
      issues: 'array',
      correctionsNeeded: 'array',
      notes: 'string'
    }
  },

  rowOfficerAudit: {
    id: 'row-officer-audit',
    name: 'Row Officer Audit Planning',
    description: 'Plan annual row officer audit',
    prompt: `Plan the annual audit for this row officer per 16 Pa.C.S. §1720:
- Identify high-risk areas based on prior findings
- Determine sample sizes for testing
- Plan analytical procedures
- Schedule fieldwork timing
- Estimate hours and resources
- Consider fraud risk factors
- Plan confirmations and verifications

Produce an audit plan with specific procedures.`,
    inputSchema: {
      officer: 'string',
      priorFindings: 'array',
      currentYearData: 'object',
      riskAssessment: 'object',
      availableResources: 'object'
    },
    outputSchema: {
      auditPlan: 'object',
      procedures: 'array',
      timeline: 'object',
      resourceAllocation: 'object',
      riskFocus: 'array'
    }
  }
};

/**
 * Get prompt by ID
 */
export function getPrompt(promptId) {
  return Object.values(ControllerAnalysisPrompts).find(p => p.id === promptId);
}

/**
 * Get all prompts
 */
export function getAllPrompts() {
  return Object.values(ControllerAnalysisPrompts);
}

/**
 * Execute a prompt (placeholder - integrate with AI engine)
 */
export async function executePrompt(promptId, input, aiEngine = null) {
  const promptDef = getPrompt(promptId);
  if (!promptDef) {
    throw new Error(`Unknown prompt: ${promptId}`);
  }

  // Validate input against schema (simplified)
  for (const [key, type] of Object.entries(promptDef.inputSchema)) {
    if (input[key] === undefined) {
      throw new Error(`Missing required input: ${key}`);
    }
  }

  // If no AI engine provided, return the formatted prompt
  if (!aiEngine) {
    return {
      prompt: promptDef.prompt,
      input,
      message: 'AI engine not configured - returning prompt template'
    };
  }

  // Execute with AI engine (integration point)
  const result = await aiEngine.complete({
    prompt: promptDef.prompt,
    context: JSON.stringify(input)
  });

  return result;
}

export default ControllerAnalysisPrompts;
