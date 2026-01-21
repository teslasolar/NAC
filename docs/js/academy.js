/**
 * NAC Academy - Interactive Learning Module
 * Teaches citizens how county government works
 */

// Course data
const courses = {
  'govt101': {
    title: 'County Government 101',
    icon: '🏛️',
    lessons: [
      {
        title: 'What is County Government?',
        content: `
          <h3>Welcome to County Government 101!</h3>
          <p>Northampton County is one of Pennsylvania's 67 counties. But what does the county actually do? And why should you care?</p>

          <h3>County vs. Municipal vs. State</h3>
          <p>There are multiple layers of government that affect your daily life:</p>
          <ul>
            <li><strong>Federal</strong> - National defense, social security, immigration</li>
            <li><strong>State (PA)</strong> - Highways, state police, licensing</li>
            <li><strong>County</strong> - Courts, elections, assessments, human services</li>
            <li><strong>Municipal</strong> - Local police, zoning, roads, trash</li>
          </ul>

          <div class="info-box">
            <strong>Key Insight</strong>
            Counties handle things that are too big for one town but don't need state-level coordination - like running the court system, managing elections, and providing human services.
          </div>

          <h3>Home Rule Charter</h3>
          <p>Northampton County operates under a <strong>Home Rule Charter</strong>, adopted in 1978. This means we're not bound by the default PA County Code - we wrote our own rules for how to govern ourselves.</p>
        `
      },
      {
        title: 'The Three Branches',
        content: `
          <h3>Separation of Powers</h3>
          <p>Just like the federal government, Northampton County has three branches:</p>

          <div class="diagram">
            <div class="org-chart">
              <div class="org-level">
                <div class="org-box highlight">
                  <div class="title">THE PEOPLE</div>
                  <div class="subtitle">312,000 residents</div>
                </div>
              </div>
              <div class="org-connector"></div>
              <div class="org-level">
                <div class="org-box">
                  <div class="title">Executive</div>
                  <div class="subtitle">County Executive</div>
                </div>
                <div class="org-box">
                  <div class="title">Legislative</div>
                  <div class="subtitle">County Council (9)</div>
                </div>
                <div class="org-box">
                  <div class="title">Judicial</div>
                  <div class="subtitle">Court of Common Pleas</div>
                </div>
              </div>
            </div>
          </div>

          <h3>Executive Branch</h3>
          <p>The <strong>County Executive</strong> is like the CEO - they run day-to-day operations, propose the budget, and oversee county departments.</p>

          <h3>Legislative Branch</h3>
          <p><strong>County Council</strong> (9 members) passes ordinances, approves the budget, and provides oversight. Think of them as the board of directors.</p>

          <h3>Judicial Branch</h3>
          <p>The <strong>Court of Common Pleas</strong> handles civil and criminal cases. Judges are elected but operate independently.</p>

          <div class="info-box tip">
            <strong>Checks & Balances</strong>
            The Executive proposes the budget, but Council must approve it. Council passes laws, but the Executive can veto. This prevents any one branch from having too much power.
          </div>
        `
      },
      {
        title: 'Row Officers: Independent Watchdogs',
        content: `
          <h3>What are Row Officers?</h3>
          <p>In addition to the three branches, Pennsylvania counties have <strong>independently elected "row officers"</strong> - officials who answer directly to voters, not the Executive or Council.</p>

          <p>Northampton County has <strong>9 row officers</strong>:</p>

          <table class="data-table">
            <tr>
              <th>Office</th>
              <th>Primary Function</th>
            </tr>
            <tr><td>Controller</td><td>Audits spending, approves payments</td></tr>
            <tr><td>Treasurer</td><td>Collects taxes, manages investments</td></tr>
            <tr><td>District Attorney</td><td>Prosecutes crimes</td></tr>
            <tr><td>Sheriff</td><td>Court security, warrants, civil process</td></tr>
            <tr><td>Recorder of Deeds</td><td>Records property transactions</td></tr>
            <tr><td>Prothonotary</td><td>Civil court records</td></tr>
            <tr><td>Clerk of Courts</td><td>Criminal court records</td></tr>
            <tr><td>Register of Wills</td><td>Probate, estates, marriage licenses</td></tr>
            <tr><td>Coroner</td><td>Death investigations</td></tr>
          </table>

          <div class="info-box">
            <strong>Why Independent?</strong>
            Row officers can't be fired by the Executive or Council. This independence allows the Controller to audit the Executive's spending without fear of retaliation.
          </div>
        `
      },
      {
        title: 'County Services You Use',
        content: `
          <h3>What Does the County Do For You?</h3>
          <p>You interact with county government more than you might realize:</p>

          <h3>Courts & Legal</h3>
          <ul>
            <li>Civil lawsuits and family court</li>
            <li>Criminal prosecutions</li>
            <li>Marriage licenses</li>
            <li>Probate and estates</li>
          </ul>

          <h3>Elections</h3>
          <ul>
            <li>Voter registration</li>
            <li>Running all elections (federal, state, local)</li>
            <li>Counting ballots</li>
          </ul>

          <h3>Property</h3>
          <ul>
            <li>Recording deeds when you buy a house</li>
            <li>Assessing property values for taxes</li>
            <li>Tax collection</li>
          </ul>

          <h3>Human Services</h3>
          <ul>
            <li>Mental health services</li>
            <li>Drug & alcohol programs</li>
            <li>Children, youth & families services</li>
            <li>Area Agency on Aging</li>
          </ul>

          <h3>Emergency Services</h3>
          <ul>
            <li>911 dispatch center</li>
            <li>Emergency management</li>
            <li>Coroner investigations</li>
          </ul>

          <div class="info-box tip">
            <strong>Fun Fact</strong>
            The county 911 center dispatches for 38 municipalities - over 500,000 calls per year!
          </div>
        `
      },
      {
        title: 'Quiz: Test Your Knowledge',
        content: `
          <h3>Let's See What You've Learned!</h3>

          <div class="quiz-section">
            <h4>Question 1: What is a "row officer"?</h4>
            <label class="quiz-option" data-correct="true">
              <input type="radio" name="q1"> An independently elected county official
            </label>
            <label class="quiz-option">
              <input type="radio" name="q1"> Someone who works in the Executive's office
            </label>
            <label class="quiz-option">
              <input type="radio" name="q1"> A state-appointed inspector
            </label>
          </div>

          <div class="quiz-section">
            <h4>Question 2: Who approves the county budget?</h4>
            <label class="quiz-option">
              <input type="radio" name="q2"> The County Executive
            </label>
            <label class="quiz-option" data-correct="true">
              <input type="radio" name="q2"> County Council
            </label>
            <label class="quiz-option">
              <input type="radio" name="q2"> The Controller
            </label>
          </div>

          <div class="quiz-section">
            <h4>Question 3: How many row officers does Northampton County have?</h4>
            <label class="quiz-option">
              <input type="radio" name="q3"> 5
            </label>
            <label class="quiz-option" data-correct="true">
              <input type="radio" name="q3"> 9
            </label>
            <label class="quiz-option">
              <input type="radio" name="q3"> 12
            </label>
          </div>

          <button onclick="checkQuiz()" class="quiz-submit">Check Answers</button>
          <div id="quiz-result" style="margin-top: 1rem; display: none;"></div>
        `
      }
    ]
  },
  'row-officers': {
    title: 'Meet Your Row Officers',
    icon: '👥',
    lessons: [
      { title: 'What are Row Officers?', content: '<h3>Pennsylvania\'s Unique System</h3><p>Pennsylvania is one of the few states that still elects "row officers" - independent officials who appear in a row on your ballot. These 9 officials answer directly to YOU, not to the County Executive or Council.</p><div class="info-box"><strong>Why It Matters</strong><br>Row officers provide checks and balances. The Controller can audit the Executive without fear of being fired. The DA prosecutes independently of politics.</div><h3>The 9 Row Officers</h3><ul><li>Controller</li><li>Treasurer</li><li>District Attorney</li><li>Sheriff</li><li>Recorder of Deeds</li><li>Prothonotary</li><li>Clerk of Courts</li><li>Register of Wills</li><li>Coroner</li></ul>' },
      { title: 'The Controller', content: '<h3>Controller - The County\'s Watchdog</h3><p>The Controller is your financial watchdog. They audit every department, pre-approve every payment, and ensure tax dollars are spent properly.</p><h3>Key Responsibilities</h3><ul><li><strong>Pre-Audit Claims:</strong> Every payment must be approved by the Controller before it\'s issued</li><li><strong>Annual Audits:</strong> Audits all 8 other row officers annually</li><li><strong>Financial Reports:</strong> Produces monthly and annual financial reports</li><li><strong>Board Memberships:</strong> Sits on Retirement Board, Salary Board, Prison Board</li></ul><div class="info-box tip"><strong>Controller\'s Power</strong><br>The Controller can refuse to pay a bill if it\'s improper - even if the Executive approved it. This is a critical check on spending.</div><h3>Why It Matters to You</h3><p>The Controller ensures your tax dollars aren\'t wasted, stolen, or misused. They\'re the last line of defense before money goes out the door.</p>' },
      { title: 'The Treasurer', content: '<h3>Treasurer - Managing the Money</h3><p>The Treasurer collects taxes, manages investments, and ensures the county has cash to pay its bills.</p><h3>Key Responsibilities</h3><ul><li><strong>Tax Collection:</strong> Collects county property taxes</li><li><strong>Investments:</strong> Invests county funds to earn interest</li><li><strong>Disbursements:</strong> Issues checks/payments approved by Controller</li><li><strong>Banking:</strong> Manages county bank accounts</li></ul><div class="info-box"><strong>Fun Fact</strong><br>The Treasurer manages over $500 million in cash flow annually and earns the county millions in interest income.</div>' },
      { title: 'The District Attorney', content: '<h3>District Attorney - Prosecuting Crime</h3><p>The DA prosecutes all criminal cases in the county, from misdemeanors to murder.</p><h3>Key Responsibilities</h3><ul><li><strong>Criminal Prosecution:</strong> Files charges and tries cases</li><li><strong>Grand Jury:</strong> Convenes grand juries for investigations</li><li><strong>Victim Services:</strong> Supports crime victims</li><li><strong>Diversion Programs:</strong> Alternatives to incarceration</li></ul><div class="info-box warning"><strong>Independence Matters</strong><br>The DA must be independent to prosecute anyone - including county officials if necessary.</div>' },
      { title: 'The Sheriff', content: '<h3>Sheriff - Court Security & Civil Process</h3><p>The Sheriff provides security for the courthouse and serves legal papers throughout the county.</p><h3>Key Responsibilities</h3><ul><li><strong>Court Security:</strong> Deputies protect the courthouse</li><li><strong>Civil Process:</strong> Serves subpoenas, eviction notices, lawsuits</li><li><strong>Warrant Service:</strong> Arrests people with warrants</li><li><strong>Sheriff Sales:</strong> Conducts property auctions for delinquent taxes</li><li><strong>Concealed Carry:</strong> Issues concealed carry permits</li></ul>' },
      { title: 'Recorder & Prothonotary', content: '<h3>Recorder of Deeds</h3><p>Every time property changes hands, the Recorder records it. Your deed, your mortgage, your property rights - all protected here.</p><ul><li>Records deeds, mortgages, liens</li><li>Maintains property ownership history</li><li>Issues veteran discharge recordings</li></ul><h3>Prothonotary</h3><p>The Prothonotary is the clerk of the civil courts - handling lawsuits, divorces, and civil judgments.</p><ul><li>Files civil lawsuits</li><li>Records judgments and liens</li><li>Handles civil appeals</li><li>Issues writs and subpoenas</li></ul>' },
      { title: 'Clerk & Register', content: '<h3>Clerk of Courts</h3><p>While the Prothonotary handles civil cases, the Clerk of Courts handles criminal records.</p><ul><li>Criminal case records</li><li>Bail and bond processing</li><li>Jury management</li><li>Criminal appeals</li></ul><h3>Register of Wills</h3><p>When someone dies, their estate goes through the Register of Wills.</p><ul><li>Probate of wills and estates</li><li>Letters testamentary/administration</li><li>Marriage licenses (yes, really!)</li><li>Estate inheritance tax collection</li></ul><div class="info-box tip"><strong>Fun Fact</strong><br>Getting married? You get your license from the Register of Wills, not a wedding planner!</div>' },
      { title: 'The Coroner', content: '<h3>Coroner - Death Investigations</h3><p>The Coroner investigates unexpected, violent, or suspicious deaths to determine cause and manner of death.</p><h3>When the Coroner Investigates</h3><ul><li>Homicides and suicides</li><li>Accidents and overdoses</li><li>Unexpected deaths</li><li>Deaths without a physician present</li><li>Deaths within 24 hours of hospital admission</li></ul><div class="info-box"><strong>Medical Examiner vs Coroner</strong><br>Some counties have appointed Medical Examiners (must be doctors). PA counties have elected Coroners (don\'t have to be doctors, but Northampton\'s is).</div>' },
      { title: 'Quiz: Row Officers', content: '<h3>Test Your Knowledge!</h3><div class="quiz-section"><h4>Q1: Who pre-audits every payment before it\'s issued?</h4><label class="quiz-option" data-correct="true"><input type="radio" name="ro1">Controller</label><label class="quiz-option"><input type="radio" name="ro1">Treasurer</label><label class="quiz-option"><input type="radio" name="ro1">County Executive</label></div><div class="quiz-section"><h4>Q2: Where do you get a marriage license?</h4><label class="quiz-option"><input type="radio" name="ro2">Clerk of Courts</label><label class="quiz-option" data-correct="true"><input type="radio" name="ro2">Register of Wills</label><label class="quiz-option"><input type="radio" name="ro2">Recorder of Deeds</label></div><div class="quiz-section"><h4>Q3: Who conducts Sheriff Sales for delinquent taxes?</h4><label class="quiz-option"><input type="radio" name="ro3">Treasurer</label><label class="quiz-option"><input type="radio" name="ro3">Controller</label><label class="quiz-option" data-correct="true"><input type="radio" name="ro3">Sheriff</label></div><button onclick="checkQuiz()" class="quiz-submit">Check Answers</button><div id="quiz-result" style="margin-top: 1rem; display: none;"></div>' }
    ]
  },
  'budget101': {
    title: 'Budget & Your Tax Dollars',
    icon: '💰',
    lessons: [
      { title: 'The $583 Million Question', content: '<h3>Where Does $583 Million Come From?</h3><p>Northampton County\'s 2026 budget is approximately $583 million. That\'s a lot of money! Let\'s break down where it comes from.</p><h3>Revenue Sources</h3><table class="data-table"><tr><th>Source</th><th>Amount</th><th>%</th></tr><tr><td>Property Taxes</td><td>$156M</td><td>27%</td></tr><tr><td>State/Federal Grants</td><td>$198M</td><td>34%</td></tr><tr><td>Fees & Charges</td><td>$87M</td><td>15%</td></tr><tr><td>Other Revenue</td><td>$142M</td><td>24%</td></tr></table><div class="info-box"><strong>Property Tax Rate</strong><br>The county tax rate is about 10.8 mills. That means $10.80 per $1,000 of assessed value. A home assessed at $200,000 pays ~$2,160/year to the county.</div>' },
      { title: 'Where Does It Go?', content: '<h3>Major Spending Categories</h3><table class="data-table"><tr><th>Category</th><th>Amount</th><th>%</th></tr><tr><td>Human Services</td><td>$175M</td><td>30%</td></tr><tr><td>Courts & Justice</td><td>$98M</td><td>17%</td></tr><tr><td>Public Safety</td><td>$76M</td><td>13%</td></tr><tr><td>General Government</td><td>$64M</td><td>11%</td></tr><tr><td>Debt Service</td><td>$52M</td><td>9%</td></tr><tr><td>Other</td><td>$118M</td><td>20%</td></tr></table><div class="info-box tip"><strong>Biggest Expense</strong><br>Human Services (mental health, drug/alcohol, children & youth, aging) is the largest category - nearly 1/3 of the budget!</div>' },
      { title: 'The Budget Process', content: '<h3>How the Budget Gets Made</h3><ol><li><strong>July-Aug:</strong> Departments submit requests to the Executive</li><li><strong>Sept-Oct:</strong> Executive reviews and prepares proposed budget</li><li><strong>November:</strong> Executive presents budget to Council</li><li><strong>Nov-Dec:</strong> Council holds public hearings</li><li><strong>December:</strong> Council votes to adopt budget</li><li><strong>January 1:</strong> New fiscal year begins</li></ol><div class="info-box"><strong>Your Voice Matters</strong><br>Public hearings are your chance to speak! Council must hear citizen input before adopting the budget.</div>' },
      { title: 'Understanding Property Tax', content: '<h3>How Property Tax Works</h3><p>Your property tax bill has THREE parts:</p><ul><li><strong>County Tax:</strong> ~10.8 mills (goes to county)</li><li><strong>School Tax:</strong> Varies by district (largest portion!)</li><li><strong>Municipal Tax:</strong> Varies by township/borough</li></ul><h3>What\'s a Mill?</h3><p>1 mill = $1 per $1,000 of assessed value</p><p>Example: Home assessed at $200,000</p><ul><li>County tax (10.8 mills): $2,160</li><li>School tax (25 mills): $5,000</li><li>Municipal (5 mills): $1,000</li><li><strong>Total: $8,160/year</strong></li></ul><div class="info-box warning"><strong>Assessment vs Market Value</strong><br>Assessed value is often lower than market value. Northampton\'s last reassessment was in 1991!</div>' },
      { title: 'Grants & Federal Money', content: '<h3>The Grant Game</h3><p>Over 1/3 of the county budget comes from state and federal grants. This "free money" isn\'t really free - it comes with strings attached.</p><h3>Major Grant Programs</h3><ul><li><strong>Human Services:</strong> Mental health, drug & alcohol programs</li><li><strong>Children & Youth:</strong> Foster care, child protective services</li><li><strong>Aging:</strong> Senior centers, meals on wheels</li><li><strong>Emergency Management:</strong> FEMA, homeland security</li><li><strong>Elections:</strong> HAVA funds for voting machines</li></ul><div class="info-box tip"><strong>Use It or Lose It</strong><br>Grant money often must be spent by a deadline. The Controller tracks grant utilization to ensure we don\'t leave money on the table.</div>' },
      { title: 'Quiz: Budget Basics', content: '<h3>Test Your Budget Knowledge!</h3><div class="quiz-section"><h4>Q1: What\'s the largest spending category?</h4><label class="quiz-option" data-correct="true"><input type="radio" name="b1">Human Services</label><label class="quiz-option"><input type="radio" name="b1">Courts & Justice</label><label class="quiz-option"><input type="radio" name="b1">Public Safety</label></div><div class="quiz-section"><h4>Q2: Who proposes the county budget?</h4><label class="quiz-option"><input type="radio" name="b2">County Council</label><label class="quiz-option" data-correct="true"><input type="radio" name="b2">County Executive</label><label class="quiz-option"><input type="radio" name="b2">Controller</label></div><div class="quiz-section"><h4>Q3: What is a "mill"?</h4><label class="quiz-option"><input type="radio" name="b3">$1 per $100 of value</label><label class="quiz-option" data-correct="true"><input type="radio" name="b3">$1 per $1,000 of value</label><label class="quiz-option"><input type="radio" name="b3">$1 per $10,000 of value</label></div><button onclick="checkQuiz()" class="quiz-submit">Check Answers</button><div id="quiz-result" style="margin-top: 1rem; display: none;"></div>' }
    ]
  },
  'controller': {
    title: 'The Controller\'s Office',
    icon: '🔍',
    lessons: [
      { title: 'Why the Controller Matters', content: '<h3>The Financial Watchdog</h3><p>The Controller is the only elected official whose job is specifically to watch how your money is spent. While the Executive spends money and Council approves budgets, the Controller audits everything.</p><h3>Independence is Key</h3><p>The Controller is independently elected - they can\'t be fired by the Executive or Council. This means they can investigate anyone without fear of retaliation.</p><div class="info-box"><strong>The Controller Can:</strong><ul><li>Refuse to pay improper bills</li><li>Audit any department or row officer</li><li>Report findings directly to the public</li><li>Refer fraud to the DA for prosecution</li></ul></div>' },
      { title: 'Pre-Audit: The First Line', content: '<h3>Every Dollar Gets Checked</h3><p>Before ANY payment goes out, it must be pre-audited by the Controller\'s office. This includes:</p><ul><li>Vendor invoices</li><li>Employee payroll</li><li>Contract payments</li><li>Grant expenditures</li><li>Capital purchases</li></ul><h3>What Gets Checked?</h3><ul><li>Is there budget authority?</li><li>Was it properly approved?</li><li>Does the invoice match the contract?</li><li>Is it a legitimate expense?</li><li>Are we paying the right amount?</li></ul><div class="info-box warning"><strong>The Controller Can Say No</strong><br>If something looks wrong, the Controller can refuse to sign the warrant. The payment doesn\'t go out until it\'s fixed.</div>' },
      { title: 'Annual Audits', content: '<h3>Auditing Every Row Officer</h3><p>Each year, the Controller audits all 8 other row officers:</p><table class="data-table"><tr><th>Office</th><th>What Gets Audited</th></tr><tr><td>Treasurer</td><td>Cash handling, investments, reconciliations</td></tr><tr><td>Sheriff</td><td>Fee collections, seized property</td></tr><tr><td>Recorder</td><td>Recording fees, document storage</td></tr><tr><td>Prothonotary</td><td>Civil filing fees, judgments</td></tr><tr><td>Clerk of Courts</td><td>Criminal fees, bail bonds</td></tr><tr><td>Register of Wills</td><td>Estate fees, marriage licenses</td></tr><tr><td>Coroner</td><td>Investigation fees, procedures</td></tr><tr><td>DA</td><td>Forfeiture funds, victim restitution</td></tr></table>' },
      { title: 'Board Memberships', content: '<h3>The Controller Sits on Key Boards</h3><p>Beyond auditing, the Controller has a vote on critical boards:</p><h3>Retirement Board</h3><p>Manages the $500M+ pension fund. Controller ensures investment decisions are sound and benefits are paid correctly.</p><h3>Salary Board</h3><p>Sets salaries for county employees. Controller provides financial analysis for decisions.</p><h3>Prison Board</h3><p>Oversees the county prison. Controller audits prison finances and commissary funds.</p><div class="info-box tip"><strong>Why It Matters</strong><br>These boards make major financial decisions. Having the Controller at the table ensures someone is watching the money.</div>' }
    ]
  },
  'engage': {
    title: 'Civic Engagement Guide',
    icon: '🗣️',
    lessons: [
      { title: 'Attend a Meeting', content: '<h3>Your Right to Be There</h3><p>All County Council meetings are open to the public under Pennsylvania\'s Sunshine Law. You have the right to attend, observe, and speak.</p><h3>Meeting Schedule</h3><ul><li><strong>County Council:</strong> 1st & 3rd Thursdays, 6:30 PM</li><li><strong>Committees:</strong> Various schedules posted online</li><li><strong>Budget Hearings:</strong> November-December</li></ul><h3>How to Speak</h3><ol><li>Sign up for public comment (usually at start of meeting)</li><li>State your name and municipality</li><li>You typically get 3-5 minutes</li><li>Be respectful but direct</li></ol><div class="info-box tip"><strong>Pro Tip</strong><br>Arrive early, sign up first, and bring written notes. Meetings can run long!</div>' },
      { title: 'Right-to-Know Requests', content: '<h3>Access Public Records</h3><p>Pennsylvania\'s Right-to-Know Law (RTKL) gives you access to most government documents. You can request:</p><ul><li>Contracts and agreements</li><li>Budgets and financial records</li><li>Meeting minutes</li><li>Emails about official business</li><li>Policies and procedures</li></ul><h3>How to File a Request</h3><ol><li>Submit in writing (email works)</li><li>Be specific about what you want</li><li>Agency has 5 business days to respond</li><li>Can extend 30 days for complex requests</li><li>Appeal to Office of Open Records if denied</li></ol><div class="info-box"><strong>It\'s Free (Usually)</strong><br>Inspection is free. Copies cost $0.25/page. Electronic records should be provided at no charge.</div>' },
      { title: 'Contact Your Officials', content: '<h3>Who to Contact</h3><p>Different issues require different contacts:</p><table class="data-table"><tr><th>Issue</th><th>Contact</th></tr><tr><td>County policy/laws</td><td>Your Council member</td></tr><tr><td>County services</td><td>County Executive\'s office</td></tr><tr><td>Financial concerns</td><td>Controller\'s office</td></tr><tr><td>Tax issues</td><td>Treasurer\'s office</td></tr><tr><td>Crime/prosecution</td><td>District Attorney</td></tr></table><h3>Tips for Effective Contact</h3><ul><li>Be specific about your concern</li><li>Include your address (proves you\'re a constituent)</li><li>Propose a solution, not just a complaint</li><li>Follow up if you don\'t hear back</li></ul>' },
      { title: 'Run for Office', content: '<h3>You Can Do This!</h3><p>Every row officer position is elected. Every Council seat is elected. If you don\'t like how things are run - run yourself!</p><h3>Requirements</h3><ul><li>U.S. citizen</li><li>County resident (typically 1 year)</li><li>Registered voter</li><li>No felony convictions</li></ul><h3>The Process</h3><ol><li>Decide what office to seek</li><li>Circulate nomination petitions (varies by position)</li><li>File petitions by deadline (usually February)</li><li>Campaign!</li><li>Win the primary</li><li>Win the general election</li></ol><div class="info-box tip"><strong>Start Local</strong><br>Many successful politicians started on municipal boards or committees. Build experience and name recognition first.</div>' },
      { title: 'Other Ways to Engage', content: '<h3>Beyond Voting</h3><ul><li><strong>Serve on a Board:</strong> Many advisory boards need citizen members</li><li><strong>Volunteer:</strong> Election poll workers always needed</li><li><strong>Attend Budget Hearings:</strong> Your voice matters on spending</li><li><strong>Join Civic Groups:</strong> League of Women Voters, etc.</li><li><strong>Use This Website:</strong> Track spending, report issues, stay informed</li></ul><div class="info-box"><strong>Democracy Requires Participation</strong><br>Government works best when citizens pay attention. You\'re already doing that by being here!</div>' }
    ]
  },
  'elections': {
    title: 'Elections & Voting',
    icon: '🗳️',
    lessons: [
      { title: 'How County Elections Work', content: '<h3>The County Runs ALL Elections</h3><p>Whether you\'re voting for President, Governor, or School Board - the county runs the election. That includes:</p><ul><li>Voter registration</li><li>Polling place management</li><li>Ballot design and printing</li><li>Voting machines</li><li>Mail-in ballot processing</li><li>Results reporting</li></ul><h3>Election Office</h3><p>The Elections Division (under Voter Registration) handles everything. They\'re nonpartisan - they run elections for all parties fairly.</p>' },
      { title: 'What\'s on Your Ballot?', content: '<h3>County Offices You Elect</h3><table class="data-table"><tr><th>Office</th><th>Term</th><th>Next Election</th></tr><tr><td>County Executive</td><td>4 years</td><td>2027</td></tr><tr><td>County Council (9)</td><td>4 years</td><td>2027</td></tr><tr><td>Controller</td><td>4 years</td><td>2027</td></tr><tr><td>Treasurer</td><td>4 years</td><td>2027</td></tr><tr><td>District Attorney</td><td>4 years</td><td>2027</td></tr><tr><td>Sheriff</td><td>4 years</td><td>2027</td></tr><tr><td>Coroner</td><td>4 years</td><td>2027</td></tr><tr><td>Other Row Officers</td><td>4 years</td><td>2027</td></tr><tr><td>Judges</td><td>10 years</td><td>Varies</td></tr></table><div class="info-box"><strong>Mid-term matters!</strong><br>County elections happen in odd years when turnout is lower. Your vote counts MORE in these elections!</div>' },
      { title: 'Voting Options', content: '<h3>Three Ways to Vote</h3><h3>1. In-Person on Election Day</h3><ul><li>Polls open 7 AM - 8 PM</li><li>Find your polling place at votespa.com</li><li>Bring ID if it\'s your first time at that location</li></ul><h3>2. Mail-In Ballot</h3><ul><li>Any registered voter can request one</li><li>Apply at votespa.com or county website</li><li>Must be RECEIVED by 8 PM Election Day</li></ul><h3>3. Early In-Person</h3><ul><li>Vote at Elections Office before Election Day</li><li>Dates vary by election</li></ul><div class="info-box warning"><strong>Mail-In Deadline</strong><br>Your ballot must be RECEIVED by 8 PM on Election Day - not just postmarked. Drop it off early or use a drop box!</div>' },
      { title: 'Quiz: Elections', content: '<h3>Test Your Election Knowledge!</h3><div class="quiz-section"><h4>Q1: Who runs all elections in the county?</h4><label class="quiz-option"><input type="radio" name="e1">State government</label><label class="quiz-option" data-correct="true"><input type="radio" name="e1">County Elections Office</label><label class="quiz-option"><input type="radio" name="e1">Each municipality</label></div><div class="quiz-section"><h4>Q2: How long is a County Controller\'s term?</h4><label class="quiz-option"><input type="radio" name="e2">2 years</label><label class="quiz-option" data-correct="true"><input type="radio" name="e2">4 years</label><label class="quiz-option"><input type="radio" name="e2">6 years</label></div><div class="quiz-section"><h4>Q3: When must mail-in ballots be received?</h4><label class="quiz-option"><input type="radio" name="e3">Postmarked by Election Day</label><label class="quiz-option" data-correct="true"><input type="radio" name="e3">Received by 8 PM Election Day</label><label class="quiz-option"><input type="radio" name="e3">One week after Election Day</label></div><button onclick="checkQuiz()" class="quiz-submit">Check Answers</button><div id="quiz-result" style="margin-top: 1rem; display: none;"></div>' }
    ]
  }
};

// State
let currentCourse = null;
let currentLesson = 0;

/**
 * Show the course list (main view)
 */
function showCourseList() {
  document.getElementById('course-list').style.display = 'block';
  document.querySelectorAll('.lesson-view').forEach(v => v.classList.remove('active'));
}

/**
 * Show a specific course
 */
function showCourse(courseId) {
  currentCourse = courseId;
  currentLesson = 0;

  if (!courses[courseId]) {
    alert('Course not found!');
    return;
  }

  document.getElementById('course-list').style.display = 'none';
  document.getElementById('course-govt101').classList.add('active');
  renderLesson();
}

/**
 * Render current lesson
 */
function renderLesson() {
  const course = courses[currentCourse];
  const lesson = course.lessons[currentLesson];

  // Update content
  document.getElementById('lesson-content').innerHTML = lesson.content;

  // Update counter
  document.getElementById('lesson-counter').textContent = `${currentLesson + 1} / ${course.lessons.length}`;

  // Update buttons
  document.getElementById('prev-btn').disabled = currentLesson === 0;
  document.getElementById('next-btn').disabled = currentLesson === course.lessons.length - 1;
  document.getElementById('next-btn').textContent = currentLesson === course.lessons.length - 1 ? 'Complete' : 'Next';

  // Update progress bar
  const progressHtml = course.lessons.map((_, i) =>
    `<div class="progress-step ${i < currentLesson ? 'completed' : ''} ${i === currentLesson ? 'current' : ''}"></div>`
  ).join('');
  document.getElementById('progress-bar').innerHTML = progressHtml;

  // Setup quiz if present
  setupQuiz();
}

/**
 * Navigate to next lesson
 */
function nextLesson() {
  const course = courses[currentCourse];
  if (currentLesson < course.lessons.length - 1) {
    currentLesson++;
    renderLesson();
    window.scrollTo(0, 0);
  }
}

/**
 * Navigate to previous lesson
 */
function prevLesson() {
  if (currentLesson > 0) {
    currentLesson--;
    renderLesson();
    window.scrollTo(0, 0);
  }
}

/**
 * Setup quiz interaction
 */
function setupQuiz() {
  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      const name = this.querySelector('input').name;
      document.querySelectorAll(`[name="${name}"]`).forEach(input => {
        input.closest('.quiz-option').classList.remove('correct', 'incorrect');
      });
    });
  });
}

/**
 * Check quiz answers
 */
function checkQuiz() {
  let correct = 0;
  let total = 0;

  document.querySelectorAll('.quiz-section').forEach(section => {
    total++;
    const selected = section.querySelector('input:checked');
    if (selected) {
      const option = selected.closest('.quiz-option');
      if (option.dataset.correct) {
        option.classList.add('correct');
        correct++;
      } else {
        option.classList.add('incorrect');
        section.querySelector('[data-correct]').classList.add('correct');
      }
    }
  });

  const result = document.getElementById('quiz-result');
  result.style.display = 'block';

  if (correct === total) {
    result.innerHTML = `<div class="info-box tip"><strong>Perfect Score!</strong> You got all ${total} questions correct!</div>`;
  } else {
    result.innerHTML = `<div class="info-box warning"><strong>Keep Learning!</strong> You got ${correct}/${total} correct. Review the lessons and try again!</div>`;
  }
}

// Export for use
window.NACacademy = {
  courses,
  showCourseList,
  showCourse,
  nextLesson,
  prevLesson,
  checkQuiz
};
