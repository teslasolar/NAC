// Transformation Plan Data
const TP = {
  principles: [
    { title: 'Service First', desc: 'Every decision starts with "How does this help citizens?" Reduce wait times, increase accessibility, improve accuracy, treat people with dignity.' },
    { title: 'Empower, Not Replace', desc: 'Technology should free employees to do meaningful work, not eliminate jobs. Remove tedium so staff can focus on people.' },
    { title: 'Transparent & Accountable', desc: 'The public has a right to know how their government operates. Data available, processes documented, mistakes admitted.' },
    { title: 'Collaborative, Not Siloed', desc: 'Row officers working together serve citizens better than competing fiefdoms. Share information, reduce duplication, build relationships.' },
    { title: 'Ethical Efficiency', desc: 'Cost savings must never come at the expense of service quality or employee dignity. Cut waste, not corners.' }
  ],

  controllerInitiatives: [
    { days: 'Days 0-90', title: 'Continuous Auditing Platform', desc: 'Real-time transaction monitoring - auditors become advisors, not adversaries', statute: '16 P.S. § 1702 - Audit county accounts' },
    { days: 'Days 30-60', title: 'Voucher Fast-Track System', desc: 'Risk-based processing - trust routine items, focus expertise on complex ones', statute: '16 P.S. § 1705 - Pre-audit all vouchers' },
    { days: 'Days 60-120', title: 'Payroll Modernization', desc: 'Integrated timekeeping - 2,847 employees get accurate, on-time pay', statute: '16 P.S. § 1706 - Countersign warrants' },
    { days: 'Days 90-180', title: 'Financial Transparency Portal', desc: 'Public dashboard - citizens see where their $583M goes in real-time', statute: '16 P.S. § 1701 - General powers' },
    { days: 'Ongoing', title: 'Cross-Office Advisory Program', desc: 'Controller staff embedded with offices - prevent problems, don\'t just find them', statute: '16 P.S. § 1703 - Examine accounts of officers' }
  ],

  phases: [
    { num: 1, title: 'Days 1-30', theme: 'Listen, Learn, Quick Wins', actions: [
      ['Meet with every row officer one-on-one', 'Build relationships, understand challenges'],
      ['Shadow frontline staff in each office', 'See real work, not just reports'],
      ['Launch employee suggestion program', 'Signal that voices matter'],
      ['Fix top 3 citizen complaints', 'Demonstrate commitment to service'],
      ['Publish first transparency report', 'Start as we mean to continue']
    ]},
    { num: 2, title: 'Days 31-60', theme: 'Foundation Building', actions: [
      ['Deploy continuous auditing pilot', 'Modern tools for modern oversight'],
      ['Implement voucher fast-track', 'Immediate efficiency improvement'],
      ['Launch cross-office working group', 'Break down silos'],
      ['Begin payroll system assessment', 'Prepare for modernization'],
      ['Create public spending dashboard', 'Transparency in action']
    ]},
    { num: 3, title: 'Days 61-90', theme: 'Acceleration', actions: [
      ['Expand auditing to all departments', 'Full coverage, proactive oversight'],
      ['Launch employee training program', 'Invest in our people'],
      ['Implement first automation project', 'Free staff from tedium'],
      ['Publish comprehensive OEE report', 'Data-driven improvement'],
      ['Host first public town hall', 'Direct citizen engagement']
    ]},
    { num: 4, title: 'Days 91-100', theme: 'Assessment & Commitment', actions: [
      ['Publish 100-day progress report', 'Accountability to citizens'],
      ['Announce Year 1 transformation roadmap', 'Long-term vision'],
      ['Recognize employee contributors', 'Celebrate early wins'],
      ['Set public OEE improvement targets', 'Measurable commitments'],
      ['Commit to quarterly transparency reports', 'Ongoing accountability']
    ]}
  ],

  offices: [
    { name: "Sheriff's Office", officer: 'Mark Richter', oee: 77.8, target: 78, status: 'close', func: 'Protect citizens and serve the courts', human: 'Deputies face dangerous situations; efficiency cannot compromise safety', initiatives: [
      { title: 'Overtime Analysis Dashboard', benefit: 'Optimize scheduling while ensuring adequate coverage', ethical: 'Deputies get more predictable schedules, better work-life balance' },
      { title: 'Equipment Lifecycle Tracking', benefit: 'Proactive maintenance, fewer emergency purchases', ethical: 'Reliable equipment keeps deputies safe' }
    ]},
    { name: 'County Treasurer', officer: 'Veronica Kwoczka', oee: 86.4, target: 85, status: 'positive', func: 'Safeguard and grow county funds fairly', human: 'Tax collection is sensitive - people are often stressed when paying', initiatives: [
      { title: 'Best Practices Documentation', benefit: 'Share excellence across the county', ethical: 'Excellence should be shared, not hoarded' },
      { title: 'Tax Payment Accessibility Review', benefit: 'Help struggling taxpayers avoid penalties', ethical: 'Enforcement serves no one; assistance helps everyone' }
    ]},
    { name: "Coroner's Office", officer: 'Zachary Lysek', oee: 71.2, target: 72, status: 'close', func: 'Investigate deaths, provide closure to families', human: 'Every case is someone\'s loved one - dignity and compassion matter most', initiatives: [
      { title: 'On-Call Compensation Review', benefit: 'Retain experienced staff, reduce turnover', ethical: 'People who handle death deserve fair treatment' },
      { title: 'Opioid Response Funding Analysis', benefit: 'Sustainable funding for ongoing crisis', ethical: 'Every overdose death deserves proper investigation' }
    ]},
    { name: 'District Attorney', officer: 'Terence Houck', oee: 68.2, target: 70, status: 'gap', func: 'Pursue justice - prosecute crimes while protecting the innocent', human: 'Both victims and defendants deserve fair, timely resolution', initiatives: [
      { title: 'Caseload Cost Analysis', benefit: 'Right-size staffing for actual workload', ethical: 'Overworked prosecutors make mistakes; justice requires resources' },
      { title: 'Diversion Program ROI', benefit: 'Data to support rehabilitation programs', ethical: 'Rehabilitation serves society better than cycles of incarceration' }
    ]},
    { name: 'Register of Wills', officer: 'Ronald Heckman', oee: 73.5, target: 75, status: 'close', func: 'Guide families through probate during difficult times', human: 'People come here after losing loved ones - compassion is essential', initiatives: [
      { title: 'Small Estate Fast-Track', benefit: 'Grieving families get closure faster', ethical: 'Bureaucracy should not compound grief' },
      { title: 'Inheritance Tax Assistance', benefit: 'Fewer errors mean fewer penalties for families', ethical: 'Complexity should not punish grieving families' }
    ]},
    { name: 'Clerk of Courts', officer: 'Teresa Gordinier', oee: 74.2, target: 76, status: 'close', func: 'Enable the justice system - manage court records', human: 'Every filing affects someone\'s freedom, family, or future', initiatives: [
      { title: 'E-Filing Expansion Cost-Benefit', benefit: 'Faster filing, fewer courthouse trips', ethical: 'Access to justice should not require hours of waiting' },
      { title: 'Court Backlog Impact Study', benefit: 'Data to support adequate staffing', ethical: 'Delayed justice is denied justice' }
    ]}
  ],

  initiatives: [
    { title: 'Tedium Elimination Program', desc: 'Identify and automate repetitive data entry across all offices', current: 'Staff spend hours on manual data entry, copying between systems', future: 'Automated data flow lets staff focus on citizen interaction', ethical: 'No one went into public service to do data entry. Free people to serve.' },
    { title: 'Cross-Training Initiative', desc: 'Enable employees to learn skills from other offices', current: 'Staff siloed in single office with limited growth opportunities', future: 'Career paths across offices, shared knowledge, backup coverage', ethical: 'Growth opportunities retain talent and build institutional knowledge.' },
    { title: 'Process Improvement Teams', desc: 'Empower frontline staff to identify and fix inefficiencies', current: 'Staff see problems daily but have no channel to fix them', future: 'Employee-led improvement projects with management support', ethical: 'The people doing the work know best how to improve it.' },
    { title: 'Recognition Program', desc: 'Celebrate employees who exemplify public service values', current: 'Good work often goes unnoticed; only problems get attention', future: 'Regular recognition, peer nominations, public appreciation', ethical: 'Public servants deserve public recognition for their dedication.' }
  ],

  metrics: {
    citizen: [['Average wait time at offices', '23 min', '10 min'], ['Online transaction completion', '45%', '80%'], ['Citizen satisfaction score', '3.2/5', '4.2/5'], ['Days to complete typical request', '12 days', '5 days']],
    employee: [['Employee satisfaction score', '3.4/5', '4.0/5'], ['Annual turnover rate', '14%', '8%'], ['Training hours per employee', '8 hrs', '24 hrs'], ['Internal promotion rate', '12%', '25%']],
    financial: [['Audit finding resolution time', '90 days', '30 days'], ['Voucher processing time', '5 days', '2 days'], ['Payroll error rate', '0.3%', '0.05%'], ['Vendor payment timeliness', '78%', '95%']],
    transparency: [['Public data sets available', '12', '50'], ['FOIA response time', '18 days', '7 days'], ['Budget transparency score', 'C+', 'A'], ['Website accessibility score', '72%', '98%']]
  }
};

function render() {
  // Principles
  document.getElementById('principles').innerHTML = TP.principles.map(p =>
    `<div class="principle-card"><h3>${p.title}</h3><p>${p.desc}</p></div>`).join('');

  // Controller Hero
  document.getElementById('controller-hero').innerHTML = `
    <h2>Leading by Example</h2>
    <div class="oee-display"><span class="oee-current">74.2%</span><span class="oee-arrow">→</span><span class="oee-target">83%+</span></div>
    <p class="philosophy-quote">The Controller is the financial conscience of the county. Our job isn't to slow things down with bureaucracy - it's to ensure every dollar serves the public good.</p>
    <div class="controller-initiatives">${TP.controllerInitiatives.map(i =>
      `<div class="controller-initiative"><span class="timeline-badge">${i.days}</span><h4>${i.title}</h4><p>${i.desc}</p><div class="statutory">${i.statute}</div></div>`).join('')}</div>`;

  // Timeline
  document.getElementById('timeline').innerHTML = TP.phases.map(p =>
    `<div class="timeline-phase phase-${p.num}"><h3>${p.title}</h3><div class="theme">${p.theme}</div>
    <ul class="action-list">${p.actions.map(a => `<li><span class="action">${a[0]}</span><span class="purpose">${a[1]}</span></li>`).join('')}</ul></div>`).join('');

  // Offices
  document.getElementById('offices').innerHTML = TP.offices.map(o =>
    `<div class="office-card"><div class="office-header"><div><div class="office-name">${o.name}</div><div class="officer">${o.officer}</div></div>
    <div class="oee-badge"><div class="oee-value oee-${o.status}">${o.oee}%</div><div class="oee-target">Target: ${o.target}%${o.status === 'positive' ? ' ✓' : ''}</div></div></div>
    <div class="introspection"><p><strong>Core Function:</strong> ${o.func}</p><p class="human">"${o.human}"</p></div>
    <ul class="support-list">${o.initiatives.map(i => `<li><div class="initiative">${i.title}</div><div class="benefit">${i.benefit}</div><div class="ethical">${i.ethical}</div></li>`).join('')}</ul></div>`).join('');

  // Initiatives
  document.getElementById('initiatives').innerHTML = TP.initiatives.map(i =>
    `<div class="initiative-card"><h4>${i.title}</h4><p class="description">${i.desc}</p>
    <div class="states"><div class="state current"><div class="state-label">Current State</div><div class="state-text">${i.current}</div></div>
    <div class="state future"><div class="state-label">Future State</div><div class="state-text">${i.future}</div></div></div>
    <div class="ethical-note">"${i.ethical}"</div></div>`).join('');

  // Ethics
  document.getElementById('ethics').innerHTML = `
    <h3>Ethical Commitments: Labor Cost Reduction</h3><p style="color:#94a3b8;margin-bottom:1rem">Reduce costs through efficiency, not through layoffs</p>
    <div class="columns"><div class="commitments"><h4>We Will:</h4><ul>
    <li>Attrition before reduction - fill gaps with technology, not new hires</li><li>Retrain before terminate - skills change, people stay</li>
    <li>Automate tedium, not judgment - machines do repetition, humans do thinking</li><li>Savings reinvested - efficiency gains fund better services</li>
    <li>Transparency always - employees know why changes happen</li></ul></div>
    <div class="red-lines"><h4>We Will NOT:</h4><ul>
    <li>Lay off employees solely for automation savings</li><li>Reduce service quality for cost savings</li>
    <li>Use hidden metrics that pressure unsafe shortcuts</li><li>Implement surveillance that treats employees as suspects</li></ul></div></div>`;

  // Metrics
  const metricsHTML = (title, data) => `<div class="metrics-card"><h3>${title}</h3>${data.map(m =>
    `<div class="metric-row"><span class="label">${m[0]}</span><div class="values"><span class="baseline">${m[1]}</span><span class="target">${m[2]}</span></div></div>`).join('')}</div>`;
  document.getElementById('metrics').innerHTML = metricsHTML('Citizen Outcomes', TP.metrics.citizen) +
    metricsHTML('Employee Outcomes', TP.metrics.employee) + metricsHTML('Financial Outcomes', TP.metrics.financial) +
    metricsHTML('Transparency Outcomes', TP.metrics.transparency);
}

document.addEventListener('DOMContentLoaded', render);
