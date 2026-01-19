/**
 * NAC - Northampton County Legal Code Intelligence System
 * Main Application JavaScript
 */

// Module Data (embedded for GitHub Pages static hosting)
const ModuleData = {
  controller: {
    title: "County Controller",
    sections: {
      1602: {
        title: "System of Accounts",
        text: "The Controller shall prescribe the system of accounts to be maintained by all county offices and departments.",
        duties: [
          "Design uniform accounting procedures",
          "Establish chart of accounts",
          "Ensure GASB compliance",
          "Maintain accounting manual"
        ]
      },
      1704: {
        title: "Custody of Documents",
        text: "The Controller shall have custody of all contracts, titles to real estate, and deeds for the county.",
        duties: [
          "Secure storage of original documents",
          "Maintain document index",
          "Control access to records",
          "Verify document authenticity"
        ]
      },
      1705: {
        title: "Official Books and Papers",
        text: "The Controller shall prescribe and administer the form and manner of keeping the official books and papers in connection with the fiscal affairs of the county.",
        duties: [
          "Standardize record formats",
          "Establish retention schedules",
          "Ensure audit trail integrity",
          "Monitor compliance"
        ]
      },
      1720: {
        title: "Audit and Settlement",
        text: "The Controller shall audit, settle, and adjust the accounts of all county offices.",
        duties: [
          "Conduct annual audits of all offices",
          "Review internal controls",
          "Reconcile accounts",
          "Report findings to Council"
        ]
      },
      1750: {
        title: "Claims Against County",
        text: "The Controller shall scrutinize, audit, and decide on all claims against the county.",
        duties: [
          "Verify claim documentation",
          "Confirm budget authority",
          "Check procurement compliance",
          "Approve or reject claims"
        ]
      },
      1760: {
        title: "Disbursements",
        text: "The Controller shall oversee all disbursements of county moneys.",
        duties: [
          "Authorize payment releases",
          "Monitor cash flow",
          "Ensure proper approvals",
          "Maintain payment records"
        ]
      }
    }
  },
  modules: {
    budget: {
      dimension: 0,
      title: "Budget & Appropriations",
      description: "Annual budget process, fund accounting, and revenue projection",
      content: `
        <h4>Budget Cycle</h4>
        <ol>
          <li><strong>July-August:</strong> Department budget requests</li>
          <li><strong>September-October:</strong> Executive review and preparation</li>
          <li><strong>October-November:</strong> Council hearings</li>
          <li><strong>December:</strong> Budget adoption</li>
          <li><strong>January 1:</strong> New fiscal year begins</li>
        </ol>
        <h4>Controller's Role</h4>
        <ul>
          <li>Provide historical spending data</li>
          <li>Calculate revenue projections</li>
          <li>Monitor budget execution</li>
          <li>Report variances to Council</li>
        </ul>
      `
    },
    audit: {
      dimension: 1,
      title: "Audit & Compliance",
      description: "Internal audit, compliance testing, and fraud detection",
      content: `
        <h4>Audit Authority</h4>
        <p>PA County Code Section 1720 mandates the Controller to "audit, settle, and adjust the accounts of all County offices."</p>
        <h4>Audit Types</h4>
        <ul>
          <li><strong>Financial:</strong> Annual statement audits</li>
          <li><strong>Compliance:</strong> Law and regulation adherence</li>
          <li><strong>Operational:</strong> Efficiency and effectiveness</li>
          <li><strong>Forensic:</strong> Fraud investigation</li>
        </ul>
        <h4>Audit Targets</h4>
        <ul>
          <li>Row offices (Recorder, Register, Prothonotary, Clerk)</li>
          <li>Tax collectors</li>
          <li>Magisterial District Judges</li>
          <li>County departments</li>
        </ul>
      `
    },
    payroll: {
      dimension: 2,
      title: "Payroll & Disbursements",
      description: "Employee compensation and accounts payable",
      content: `
        <h4>Payroll Functions</h4>
        <ul>
          <li>Biweekly processing (26 pay periods)</li>
          <li>Tax withholding and remittance</li>
          <li>Benefits administration</li>
          <li>Garnishment processing</li>
        </ul>
        <h4>Tax Compliance</h4>
        <ul>
          <li>Federal 941 - Quarterly</li>
          <li>PA State - Quarterly</li>
          <li>Local EIT - Quarterly</li>
          <li>W-2/W-3 - Annual (Jan 31)</li>
        </ul>
      `
    },
    council: {
      dimension: 3,
      title: "County Council",
      description: "Legislative process and Controller interface",
      content: `
        <h4>Council Structure</h4>
        <ul>
          <li>9 part-time elected members</li>
          <li>4-year terms</li>
          <li>Meets twice monthly</li>
        </ul>
        <h4>Powers</h4>
        <ul>
          <li>Adopt budget and ordinances</li>
          <li>Levy taxes</li>
          <li>Confirm appointments</li>
          <li>Conduct investigations</li>
        </ul>
        <h4>Controller Reporting</h4>
        <ul>
          <li>Monthly financial reports</li>
          <li>Quarterly budget status</li>
          <li>Annual audit results</li>
          <li>Special findings as needed</li>
        </ul>
      `
    },
    executive: {
      dimension: 4,
      title: "Executive Branch",
      description: "County Executive and department oversight",
      content: `
        <h4>County Executive</h4>
        <ul>
          <li>Independently elected</li>
          <li>4-year term, two-term limit</li>
          <li>Chief executive officer</li>
          <li>Prepares annual budget</li>
        </ul>
        <h4>Departments</h4>
        <ul>
          <li>Administration</li>
          <li>Fiscal Affairs</li>
          <li>Human Services</li>
          <li>Public Works</li>
          <li>Corrections</li>
        </ul>
      `
    },
    judicial: {
      dimension: 5,
      title: "Judicial Interface",
      description: "Court reporting and MDJ audits",
      content: `
        <h4>Judicial Duties</h4>
        <ul>
          <li>Audit MDJ offices annually</li>
          <li>Report to Court of Common Pleas</li>
          <li>Audit probation officer accounts</li>
          <li>Serve on Constable Review Board</li>
        </ul>
        <h4>Court Funds</h4>
        <ul>
          <li>Filing fees</li>
          <li>Fines and costs</li>
          <li>Bail funds</li>
          <li>Restitution</li>
        </ul>
      `
    },
    personnel: {
      dimension: 6,
      title: "Personnel & HR",
      description: "Employee management and benefits",
      content: `
        <h4>Controller HR Role</h4>
        <ul>
          <li>Member of Salary Board</li>
          <li>Process all payroll</li>
          <li>Administer benefits deductions</li>
          <li>Audit personnel records</li>
        </ul>
      `
    },
    procurement: {
      dimension: 7,
      title: "Procurement & Contracts",
      description: "Bidding, contracts, and vendor management",
      content: `
        <h4>Controller Review</h4>
        <ul>
          <li>Verify proper bidding process</li>
          <li>Maintain contract custody</li>
          <li>Monitor contract compliance</li>
          <li>Process vendor payments</li>
        </ul>
      `
    },
    records: {
      dimension: 8,
      title: "Records & Archives",
      description: "Document retention and public access",
      content: `
        <h4>Controller Custody</h4>
        <ul>
          <li>Contracts and agreements</li>
          <li>Titles and deeds</li>
          <li>Financial records</li>
          <li>Audit reports</li>
        </ul>
      `
    },
    interagency: {
      dimension: 9,
      title: "Inter-agency Relations",
      description: "State reporting and federal grants",
      content: `
        <h4>External Reporting</h4>
        <ul>
          <li>DCED financial reports</li>
          <li>Single Audit (federal grants)</li>
          <li>Pension reporting</li>
          <li>Municipal cooperation agreements</li>
        </ul>
      `
    },
    transparency: {
      dimension: 10,
      title: "Public Transparency",
      description: "Open data and citizen engagement",
      content: `
        <h4>Public Access</h4>
        <ul>
          <li>Published audit reports</li>
          <li>Online financial data</li>
          <li>Right-to-Know requests</li>
          <li>Public meeting attendance</li>
        </ul>
      `
    },
    emergency: {
      dimension: 11,
      title: "Emergency Operations",
      description: "Disaster finance and FEMA",
      content: `
        <h4>Emergency Fiscal</h4>
        <ul>
          <li>Emergency procurement rules</li>
          <li>FEMA reimbursement tracking</li>
          <li>Disaster fund management</li>
          <li>Emergency appropriations</li>
        </ul>
      `
    }
  }
};

// Application State
const AppState = {
  aiLoaded: false,
  currentModule: null,
  chatHistory: [],
  engine: null
};

// DOM Elements
const elements = {
  loadAiBtn: document.getElementById('load-ai-btn'),
  aiStatus: document.getElementById('ai-status'),
  modelName: document.getElementById('model-name'),
  modelStatus: document.getElementById('model-status'),
  loadProgress: document.getElementById('load-progress'),
  chatContainer: document.getElementById('chat-container'),
  chatInput: document.getElementById('chat-input'),
  sendBtn: document.getElementById('send-btn'),
  sectionLookup: document.getElementById('section-lookup'),
  lookupBtn: document.getElementById('lookup-btn'),
  moduleModal: document.getElementById('module-modal'),
  modalBody: document.getElementById('modal-body')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  initNavigation();
});

// Event Listeners
function initEventListeners() {
  // Load AI Button
  elements.loadAiBtn.addEventListener('click', loadAIEngine);

  // Send Message
  elements.sendBtn.addEventListener('click', sendMessage);
  elements.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Section Lookup
  elements.lookupBtn.addEventListener('click', lookupSection);

  // Tool Buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => handleToolClick(btn.dataset.tool));
  });

  // Explore Buttons
  document.querySelectorAll('.explore-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const module = e.target.closest('.module-card').dataset.module;
      openModuleDetail(module);
    });
  });

  // Duty Items (clickable)
  document.querySelectorAll('.duty-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (section) {
        elements.sectionLookup.value = section;
        lookupSection();
      }
    });
  });

  // Modal Close
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  elements.moduleModal.addEventListener('click', (e) => {
    if (e.target === elements.moduleModal) closeModal();
  });
}

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// AI Engine Loading
async function loadAIEngine() {
  try {
    updateAIStatus('loading', 'Loading...');
    elements.loadAiBtn.disabled = true;
    elements.loadProgress.style.display = 'block';

    // Add loading message to chat
    addChatMessage('system', 'Loading AI model... This may take a few minutes on first load as the model is downloaded to your browser.');

    // Dynamic import of WebLLM
    const webllm = await import('https://esm.run/@mlc-ai/web-llm');

    // Use a smaller, faster model for quick loading
    const modelId = "Phi-3.5-mini-instruct-q4f16_1-MLC";

    const initProgressCallback = (progress) => {
      const percent = Math.round(progress.progress * 100);
      elements.loadProgress.querySelector('.progress-fill').style.width = `${percent}%`;
      elements.modelStatus.textContent = `Loading: ${percent}%`;
    };

    AppState.engine = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback
    });

    AppState.aiLoaded = true;
    elements.modelName.textContent = modelId.split('-').slice(0, 3).join('-');
    updateAIStatus('online', 'AI: Online');
    elements.sendBtn.disabled = false;
    elements.loadProgress.style.display = 'none';

    addChatMessage('system', 'AI engine loaded successfully! You can now ask questions about PA County Code, Controller duties, audit procedures, and more. All processing happens locally in your browser.');

  } catch (error) {
    console.error('Failed to load AI:', error);
    updateAIStatus('offline', 'AI: Error');
    addChatMessage('system', `Failed to load AI engine: ${error.message}. Make sure you're using a browser with WebGPU support (Chrome 113+, Edge 113+).`);
    elements.loadAiBtn.disabled = false;
  }
}

// Update AI Status Indicator
function updateAIStatus(status, text) {
  elements.aiStatus.className = `status-indicator ${status}`;
  elements.aiStatus.textContent = text;
  elements.modelStatus.textContent = status === 'online' ? 'Ready' : status;
}

// Send Message
async function sendMessage() {
  const message = elements.chatInput.value.trim();
  if (!message || !AppState.aiLoaded) return;

  elements.chatInput.value = '';
  addChatMessage('user', message);

  try {
    elements.sendBtn.disabled = true;

    const systemPrompt = `You are a legal code analysis assistant for Northampton County, Pennsylvania.
You have expertise in:
- PA County Code (Title 16), especially Controller sections 1602-1764
- Northampton County Home Rule Charter
- Government auditing standards
- County financial administration

Provide accurate, helpful responses. Cite code sections when relevant.
Keep responses concise but informative.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...AppState.chatHistory.slice(-6), // Keep last 6 messages for context
      { role: "user", content: message }
    ];

    // Add placeholder for streaming response
    const assistantDiv = addChatMessage('assistant', '');
    const contentDiv = assistantDiv.querySelector('.message-content');

    let fullResponse = '';

    const stream = await AppState.engine.chat.completions.create({
      messages,
      temperature: 0.4,
      max_tokens: 1024,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      contentDiv.innerHTML = `<p>${formatResponse(fullResponse)}</p>`;
      elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }

    // Save to history
    AppState.chatHistory.push({ role: "user", content: message });
    AppState.chatHistory.push({ role: "assistant", content: fullResponse });

  } catch (error) {
    console.error('Chat error:', error);
    addChatMessage('system', `Error: ${error.message}`);
  } finally {
    elements.sendBtn.disabled = false;
  }
}

// Add Chat Message
function addChatMessage(role, content) {
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;
  div.innerHTML = `<div class="message-content"><p>${formatResponse(content)}</p></div>`;
  elements.chatContainer.appendChild(div);
  elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
  return div;
}

// Format Response (basic markdown-like formatting)
function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// Section Lookup
function lookupSection() {
  const section = elements.sectionLookup.value;
  if (!section) return;

  const sectionData = ModuleData.controller.sections[section];
  if (sectionData) {
    let content = `<strong>PA County Code Section ${section}: ${sectionData.title}</strong>\n\n`;
    content += `"${sectionData.text}"\n\n`;
    content += `<strong>Key Duties:</strong>\n`;
    sectionData.duties.forEach(duty => {
      content += `- ${duty}\n`;
    });

    addChatMessage('system', content);

    // If AI is loaded, offer to explain further
    if (AppState.aiLoaded) {
      elements.chatInput.value = `Explain the practical implications of Section ${section} for a County Controller's daily work.`;
    }
  }
}

// Handle Tool Click
function handleToolClick(tool) {
  const prompts = {
    'legal-analysis': 'Analyze a legal code provision - paste the text and I\'ll explain its implications.',
    'audit-risk': 'Describe the department or process you want to assess for audit risk.',
    'budget-variance': 'Share budget vs. actual figures and I\'ll analyze the variance.',
    'compliance-check': 'Describe the transaction or process to check for compliance.',
    'claims-review': 'Describe the claim against the county for review.'
  };

  if (prompts[tool]) {
    elements.chatInput.value = prompts[tool];
    elements.chatInput.focus();
    if (!AppState.aiLoaded) {
      addChatMessage('system', 'Please load the AI engine first to use this tool.');
    }
  }
}

// Open Module Detail Modal
function openModuleDetail(moduleId) {
  const module = ModuleData.modules[moduleId];
  if (!module) return;

  elements.modalBody.innerHTML = `
    <div class="module-detail">
      <span class="dim-badge" style="font-size: 1.5rem; width: 40px; height: 40px;">
        ${module.dimension}
      </span>
      <h2>${module.title}</h2>
      <p class="module-desc">${module.description}</p>
      <div class="module-content">
        ${module.content}
      </div>
      ${AppState.aiLoaded ? `
        <div class="module-actions" style="margin-top: 1.5rem;">
          <button class="btn btn-primary" onclick="askAboutModule('${moduleId}')">
            Ask AI About This Module
          </button>
        </div>
      ` : ''}
    </div>
  `;

  elements.moduleModal.classList.add('active');
}

// Close Modal
function closeModal() {
  elements.moduleModal.classList.remove('active');
}

// Ask AI about module (global function for modal button)
window.askAboutModule = function(moduleId) {
  closeModal();
  const module = ModuleData.modules[moduleId];
  if (module) {
    elements.chatInput.value = `Explain the Controller's responsibilities related to ${module.title} in detail.`;
    elements.chatInput.focus();
  }
};

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
