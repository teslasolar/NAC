/**
 * NAC WebLLM Engine
 *
 * In-browser AI inference using WebLLM for local, private legal code analysis
 * No data sent to external servers - everything runs in browser via WebGPU
 *
 * @module ai/webllm-engine
 */

// WebLLM Configuration
const WebLLMConfig = {
  // Recommended models for legal analysis (balance of capability and size)
  models: {
    primary: "Llama-3.2-3B-Instruct-q4f16_1-MLC",  // Good balance
    small: "Phi-3.5-mini-instruct-q4f16_1-MLC",    // Faster, smaller
    capable: "Qwen2.5-7B-Instruct-q4f16_1-MLC"     // More capable
  },

  // System prompts for different analysis types
  systemPrompts: {
    legalAnalysis: `You are a legal code analysis assistant specializing in Pennsylvania county government law.
You have expertise in:
- PA County Code (Title 16)
- County Controller statutory duties
- Government auditing standards
- Municipal finance and accounting

Provide accurate, well-reasoned analysis based on the legal text and context provided.
Cite specific code sections when applicable.`,

    auditAssistant: `You are an audit assistant for a Pennsylvania County Controller's Office.
Your expertise includes:
- Government Auditing Standards (Yellow Book)
- Internal control assessment
- Risk-based audit planning
- Fraud detection and prevention
- GASB accounting standards

Analyze data and documents for audit risks, compliance issues, and control weaknesses.`,

    budgetAnalyst: `You are a county budget analyst assistant.
Your expertise includes:
- Government fund accounting
- Budget variance analysis
- Revenue forecasting
- Expenditure tracking
- GFOA best practices

Help analyze budgets, identify variances, and provide financial insights.`
  }
};

// WebLLM Engine Class
class NACWebLLMEngine {
  constructor() {
    this.engine = null;
    this.isLoaded = false;
    this.currentModel = null;
    this.loadProgress = 0;
  }

  /**
   * Initialize WebLLM engine with selected model
   * @param {string} modelId - Model identifier from WebLLMConfig.models
   * @param {function} progressCallback - Called with load progress (0-100)
   */
  async initialize(modelId = 'primary', progressCallback = null) {
    if (typeof window === 'undefined') {
      throw new Error('WebLLM requires browser environment');
    }

    // Dynamic import of WebLLM
    const webllm = await import('https://esm.run/@mlc-ai/web-llm');

    const modelName = WebLLMConfig.models[modelId] || modelId;

    console.log(`[NAC-AI] Initializing WebLLM with model: ${modelName}`);

    const initProgressCallback = (progress) => {
      this.loadProgress = Math.round(progress.progress * 100);
      console.log(`[NAC-AI] Loading: ${this.loadProgress}%`);
      if (progressCallback) {
        progressCallback(this.loadProgress, progress.text);
      }
    };

    this.engine = await webllm.CreateMLCEngine(modelName, {
      initProgressCallback
    });

    this.isLoaded = true;
    this.currentModel = modelName;
    console.log(`[NAC-AI] Model loaded successfully: ${modelName}`);

    return this;
  }

  /**
   * Analyze legal code text
   * @param {string} codeText - Legal code section to analyze
   * @param {string} question - Question about the code
   */
  async analyzeLegalCode(codeText, question) {
    if (!this.isLoaded) throw new Error('Engine not initialized');

    const response = await this.engine.chat.completions.create({
      messages: [
        { role: "system", content: WebLLMConfig.systemPrompts.legalAnalysis },
        { role: "user", content: `Legal Code Section:\n${codeText}\n\nQuestion: ${question}` }
      ],
      temperature: 0.3,  // Lower for more factual responses
      max_tokens: 1024
    });

    return response.choices[0].message.content;
  }

  /**
   * Audit risk assessment
   * @param {object} data - Data to assess for audit risk
   */
  async assessAuditRisk(data) {
    if (!this.isLoaded) throw new Error('Engine not initialized');

    const response = await this.engine.chat.completions.create({
      messages: [
        { role: "system", content: WebLLMConfig.systemPrompts.auditAssistant },
        { role: "user", content: `Analyze this data for audit risks:\n${JSON.stringify(data, null, 2)}` }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    return response.choices[0].message.content;
  }

  /**
   * Budget variance analysis
   * @param {object} budgetData - Budget vs actual data
   */
  async analyzeBudgetVariance(budgetData) {
    if (!this.isLoaded) throw new Error('Engine not initialized');

    const response = await this.engine.chat.completions.create({
      messages: [
        { role: "system", content: WebLLMConfig.systemPrompts.budgetAnalyst },
        { role: "user", content: `Analyze these budget variances:\n${JSON.stringify(budgetData, null, 2)}` }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    return response.choices[0].message.content;
  }

  /**
   * Streaming chat for interactive analysis
   * @param {array} messages - Chat messages array
   * @param {string} systemPrompt - System prompt key or custom prompt
   * @param {function} onChunk - Callback for each streamed chunk
   */
  async streamChat(messages, systemPrompt = 'legalAnalysis', onChunk = null) {
    if (!this.isLoaded) throw new Error('Engine not initialized');

    const system = WebLLMConfig.systemPrompts[systemPrompt] || systemPrompt;

    const fullMessages = [
      { role: "system", content: system },
      ...messages
    ];

    const stream = await this.engine.chat.completions.create({
      messages: fullMessages,
      temperature: 0.4,
      max_tokens: 2048,
      stream: true
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      if (onChunk) {
        onChunk(content, fullResponse);
      }
    }

    return fullResponse;
  }

  /**
   * Controller duties lookup and explanation
   * @param {string} section - PA County Code section number
   */
  async explainControllerDuty(section) {
    const prompt = `Explain the County Controller's duties under PA County Code Section ${section}.
Include:
1. The specific statutory requirement
2. How this applies in practice
3. Common compliance issues
4. Best practices for fulfilling this duty`;

    return this.analyzeLegalCode(`PA County Code Section ${section}`, prompt);
  }

  /**
   * Generate audit checklist for specific area
   * @param {string} auditArea - Area to audit (e.g., "payroll", "procurement")
   */
  async generateAuditChecklist(auditArea) {
    if (!this.isLoaded) throw new Error('Engine not initialized');

    const response = await this.engine.chat.completions.create({
      messages: [
        { role: "system", content: WebLLMConfig.systemPrompts.auditAssistant },
        { role: "user", content: `Generate a comprehensive audit checklist for: ${auditArea}

Include:
- Pre-audit preparation steps
- Key documents to request
- Internal control tests
- Substantive testing procedures
- Common findings to look for
- Compliance requirements to verify` }
      ],
      temperature: 0.4,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  }

  /**
   * Get engine status
   */
  getStatus() {
    return {
      isLoaded: this.isLoaded,
      currentModel: this.currentModel,
      loadProgress: this.loadProgress
    };
  }

  /**
   * Unload model to free memory
   */
  async unload() {
    if (this.engine) {
      await this.engine.unload();
      this.isLoaded = false;
      this.currentModel = null;
      console.log('[NAC-AI] Model unloaded');
    }
  }
}

// Pre-built analysis templates for common Controller tasks
const AnalysisTemplates = {
  claimsReview: {
    name: "Claims Against County Review",
    prompt: `Review this claim against the county:
{claim_data}

Determine:
1. Is the claim properly documented?
2. Does it comply with procurement policies?
3. Is there budget authority for payment?
4. Are there any red flags requiring further review?
5. Recommendation: Approve, Deny, or Request More Information`
  },

  rowOfficeAudit: {
    name: "Row Office Audit Planning",
    prompt: `Plan an audit for this row office: {office_name}

Consider:
1. Key financial processes to test
2. High-risk areas based on office functions
3. Compliance requirements specific to this office
4. Prior audit findings to follow up
5. Recommended sample sizes and testing approach`
  },

  budgetRequest: {
    name: "Budget Request Analysis",
    prompt: `Analyze this department budget request:
{budget_data}

Evaluate:
1. Comparison to prior year actual
2. Justification for increases
3. Alignment with county priorities
4. Potential cost savings
5. Questions for budget hearing`
  },

  contractReview: {
    name: "Contract Compliance Review",
    prompt: `Review this contract for compliance:
{contract_data}

Check:
1. Proper procurement process followed
2. Required terms and clauses included
3. Insurance and bonding requirements met
4. Pricing reasonableness
5. Performance metrics defined`
  }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NACWebLLMEngine, WebLLMConfig, AnalysisTemplates };
}

if (typeof window !== 'undefined') {
  window.NACWebLLMEngine = NACWebLLMEngine;
  window.WebLLMConfig = WebLLMConfig;
  window.AnalysisTemplates = AnalysisTemplates;
}
