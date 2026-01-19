/**
 * NAC AI Prompt Templates
 *
 * Reusable prompt templates for various Controller functions
 * Used with WebLLM for in-browser analysis
 *
 * @module templates/prompts
 */

const PromptTemplates = {
  // Legal Code Analysis
  legalAnalysis: {
    codeSection: (section, context) => `
Analyze Pennsylvania County Code Section ${section}.

Context: ${context}

Provide:
1. Plain language explanation of the requirement
2. Practical implications for the Controller
3. Common compliance challenges
4. Best practices for implementation
5. Related code sections to consider
`,

    charterProvision: (article, section) => `
Analyze Northampton County Home Rule Charter Article ${article}, Section ${section}.

Explain:
1. What this provision requires
2. How it affects county operations
3. Controller's role in implementation
4. Interaction with state law
`,

    compareProvisions: (provision1, provision2) => `
Compare and contrast these two legal provisions:

Provision 1: ${provision1}
Provision 2: ${provision2}

Analyze:
1. Key similarities
2. Important differences
3. How they work together
4. Potential conflicts
5. Practical resolution
`
  },

  // Audit Templates
  audit: {
    riskAssessment: (entity, data) => `
Perform an audit risk assessment for: ${entity}

Available data:
${JSON.stringify(data, null, 2)}

Evaluate using these risk factors:
1. Dollar volume (25% weight)
2. Complexity (20% weight)
3. Prior findings (20% weight)
4. Time since last audit (15% weight)
5. Control environment (10% weight)
6. Public sensitivity (10% weight)

Provide:
- Overall risk score (0-100)
- Risk level (Low/Moderate/High)
- Key risk factors identified
- Recommended audit frequency
- Suggested audit scope
`,

    findingDraft: (condition, criteria, cause, effect) => `
Draft an audit finding based on:

Condition (what was found): ${condition}
Criteria (what should be): ${criteria}
Cause (why it happened): ${cause}
Effect (what's the impact): ${effect}

Format the finding with:
1. Finding title
2. Background
3. Condition statement
4. Criteria reference
5. Cause analysis
6. Effect/potential effect
7. Recommendation
8. Management response section (placeholder)
`,

    followUpStatus: (priorFindings) => `
Review these prior audit findings for follow-up:

${JSON.stringify(priorFindings, null, 2)}

For each finding, assess:
1. Implementation status (Implemented/Partially Implemented/Not Implemented)
2. Evidence of corrective action
3. Remaining risk
4. Recommendation (Close/Continue to monitor/Escalate)
`
  },

  // Budget Templates
  budget: {
    varianceAnalysis: (department, budgetData) => `
Analyze budget variances for ${department}:

Budget Data:
${JSON.stringify(budgetData, null, 2)}

For each significant variance (>10%), provide:
1. Variance amount and percentage
2. Possible explanations
3. Trend vs. prior periods
4. Concern level (Low/Medium/High)
5. Recommended action
`,

    revenueProjection: (historicalData, factors) => `
Project revenue based on historical data:

Historical Revenue:
${JSON.stringify(historicalData, null, 2)}

Economic factors to consider:
${JSON.stringify(factors, null, 2)}

Provide:
1. Projected revenue by category
2. Confidence level for each projection
3. Risk factors that could affect projections
4. Recommended conservative vs. optimistic scenarios
`,

    costSavings: (operations) => `
Identify potential cost savings opportunities:

Current Operations:
${JSON.stringify(operations, null, 2)}

Analyze:
1. Areas of potential waste
2. Process improvement opportunities
3. Technology/automation possibilities
4. Consolidation opportunities
5. Estimated savings for each recommendation
`
  },

  // Claims Review Templates
  claims: {
    review: (claim) => `
Review this claim against the county:

Claim Details:
${JSON.stringify(claim, null, 2)}

Evaluate:
1. Documentation completeness
2. Proper approvals obtained
3. Budget authority exists
4. Procurement compliance (if applicable)
5. Amount reasonableness

Recommendation: Approve / Deny / Request Additional Information
Reason:
`,

    duplicateCheck: (invoice, existingPayments) => `
Check for potential duplicate payment:

New Invoice:
${JSON.stringify(invoice, null, 2)}

Recent Payments to Same Vendor:
${JSON.stringify(existingPayments, null, 2)}

Analyze:
1. Exact matches (same invoice #, amount, date)
2. Potential duplicates (similar amounts, dates)
3. Unusual patterns
4. Recommendation
`
  },

  // Payroll Templates
  payroll: {
    exceptionReview: (exceptions) => `
Review these payroll exceptions:

Exceptions:
${JSON.stringify(exceptions, null, 2)}

For each exception:
1. Type of exception
2. Risk level
3. Required documentation
4. Recommended action
5. Follow-up needed
`,

    taxCompliance: (period, taxData) => `
Review tax compliance for period ${period}:

Tax Data:
${JSON.stringify(taxData, null, 2)}

Verify:
1. Withholding calculations
2. Deposit timeliness
3. Reporting accuracy
4. Reconciliation status
5. Any penalties or issues
`
  },

  // Compliance Templates
  compliance: {
    procurementCheck: (purchase) => `
Check procurement compliance for:

Purchase Details:
${JSON.stringify(purchase, null, 2)}

Verify against requirements:
1. Threshold determination
   - Under $11,300: No formal process required
   - $11,300-$21,900: Three quotes required
   - Over $21,900: Formal bid required
   - Over $100,000: Council approval required
2. Proper documentation
3. Vendor selection process
4. Contract terms
5. Insurance/bonding (if required)

Compliance Status: Compliant / Non-Compliant / Cannot Determine
Issues Found:
Recommendations:
`,

    grantCompliance: (grant, expenditures) => `
Review grant compliance:

Grant Details:
${JSON.stringify(grant, null, 2)}

Expenditures Charged:
${JSON.stringify(expenditures, null, 2)}

Verify:
1. Allowable costs
2. Cost allocation methodology
3. Match requirements
4. Reporting deadlines
5. Documentation requirements

Compliance Issues:
Recommendations:
`
  },

  // General Controller Templates
  controller: {
    boardPrep: (board, agenda) => `
Prepare for ${board} meeting:

Agenda Items:
${JSON.stringify(agenda, null, 2)}

Provide for each item:
1. Background/context
2. Controller's role/vote
3. Key considerations
4. Potential questions
5. Recommended position
`,

    reportDraft: (reportType, data) => `
Draft a ${reportType} report:

Data:
${JSON.stringify(data, null, 2)}

Include:
1. Executive summary
2. Key findings
3. Data analysis
4. Conclusions
5. Recommendations
`
  }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptTemplates;
}

if (typeof window !== 'undefined') {
  window.PromptTemplates = PromptTemplates;
}
