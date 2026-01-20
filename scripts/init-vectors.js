#!/usr/bin/env node

/**
 * Initialize Vector Database with PA County Code
 *
 * Creates .db file with:
 * - All PA Code sections as vector blocks
 * - 3D coordinates for visualization
 * - Document order links
 * - Semantic similarity links
 */

const path = require('path');
const { VectorBlockDB } = require('../src/vectordb/VectorBlockDB');
const { EmbeddingGenerator } = require('../src/vectordb/EmbeddingGenerator');
const { ChainLinker } = require('../src/vectordb/ChainLinker');

// PA County Code Title 16 - Controller sections
const PA_CODE_SECTIONS = [
  // Article XVI - Controller
  { article: 'XVI', section: '1601', statute: '16 Pa.C.S. §1601', title: 'Definitions',
    content: 'As used in this article: "Controller" means the chief fiscal officer of the county elected under this title.' },
  { article: 'XVI', section: '1602', statute: '16 Pa.C.S. §1602', title: 'System of Accounts',
    content: 'The controller shall prescribe a uniform system of accounts for all county officers, departments, boards, and agencies. The system shall provide for adequate internal controls and audit trails.' },
  { article: 'XVI', section: '1603', statute: '16 Pa.C.S. §1603', title: 'Account Books',
    content: 'The controller shall keep proper books of account, including a general ledger showing all receipts, disbursements, assets, and liabilities of the county.' },
  { article: 'XVI', section: '1604', statute: '16 Pa.C.S. §1604', title: 'Monthly Reports',
    content: 'The controller shall prepare monthly reports showing the financial condition of the county, including budget status, cash position, and outstanding obligations.' },
  { article: 'XVI', section: '1605', statute: '16 Pa.C.S. §1605', title: 'Annual Report',
    content: 'The controller shall prepare an annual financial report within 90 days after the close of the fiscal year, containing a complete statement of all receipts and expenditures.' },
  { article: 'XVI', section: '1606', statute: '16 Pa.C.S. §1606', title: 'Independence',
    content: 'The controller shall be independent of the board of commissioners and shall not be subject to their direction in the performance of audit and fiscal supervision duties.' },
  { article: 'XVI', section: '1607', statute: '16 Pa.C.S. §1607', title: 'Bond Requirement',
    content: 'Before assuming office, the controller shall execute a bond in such amount as the court of common pleas shall direct, conditioned on faithful performance of duties.' },
  { article: 'XVI', section: '1608', statute: '16 Pa.C.S. §1608', title: 'Subpoena Power',
    content: 'The controller shall have power to compel the attendance of witnesses and the production of documents in connection with any audit or examination. Witnesses may be examined under oath.' },

  // Article XVII - Fiscal Affairs
  { article: 'XVII', section: '1701', statute: '16 Pa.C.S. §1701', title: 'Fiscal Year',
    content: 'The fiscal year of all counties shall begin January 1 and end December 31 of each year.' },
  { article: 'XVII', section: '1705', statute: '16 Pa.C.S. §1705', title: 'Fiscal Supervision',
    content: 'The controller shall have general supervision of the fiscal affairs of the county, including oversight of all financial transactions and compliance with budgetary requirements.' },
  { article: 'XVII', section: '1710', statute: '16 Pa.C.S. §1710', title: 'Budget Preparation',
    content: 'The budget shall be prepared annually by the commissioners with input from all county departments. The controller shall review the proposed budget for compliance with fiscal policies.' },
  { article: 'XVII', section: '1720', statute: '16 Pa.C.S. §1720', title: 'Audit and Settlement',
    content: 'The controller shall audit and settle the accounts of all county officers, including the treasurer, sheriff, prothonotary, register of wills, recorder of deeds, clerk of courts, coroner, and district attorney.' },
  { article: 'XVII', section: '1730', statute: '16 Pa.C.S. §1730', title: 'Pre-Audit of Claims',
    content: 'No claim against the county shall be paid until it has been audited by the controller. The controller shall examine each claim for proper authorization, available appropriation, and compliance with law.' },
  { article: 'XVII', section: '1731', statute: '16 Pa.C.S. §1731', title: 'Warrant Issuance',
    content: 'Upon approval of a claim, the controller shall issue a warrant directing the treasurer to pay the amount due. No warrant shall issue without prior audit.' },

  // Article XV - Salary Board
  { article: 'XV', section: '1501', statute: '16 Pa.C.S. §1501', title: 'Salary Board Composition',
    content: 'The salary board shall consist of the commissioners, the controller, and one judge designated by the president judge. The board shall fix the compensation of county employees.' },
  { article: 'XV', section: '1502', statute: '16 Pa.C.S. §1502', title: 'Salary Board Meetings',
    content: 'The salary board shall meet at least annually to review and establish salaries for all county positions. The controller shall maintain records of all salary board actions.' },

  // Article XIX - Retirement
  { article: 'XIX', section: '1901', statute: '16 Pa.C.S. §1901', title: 'Retirement System',
    content: 'Each county shall maintain a retirement system for county employees. The system shall provide defined benefits based on years of service and compensation.' },
  { article: 'XIX', section: '1902', statute: '16 Pa.C.S. §1902', title: 'Retirement Board',
    content: 'The retirement board shall consist of the commissioners, the controller, and two employee representatives. The controller shall ensure proper accounting of retirement funds.' },

  // Row Officers
  { article: 'XX', section: '2001', statute: '16 Pa.C.S. §2001', title: 'Treasurer Duties',
    content: 'The treasurer shall receive all county funds and make disbursements as directed by warrant of the controller. The treasurer shall maintain detailed records of all receipts and payments.' },
  { article: 'XX', section: '2010', statute: '16 Pa.C.S. §2010', title: 'Sheriff Duties',
    content: 'The sheriff shall collect fees and costs as prescribed by law. All funds collected shall be deposited and accounted for monthly to the controller.' },
  { article: 'XX', section: '2020', statute: '16 Pa.C.S. §2020', title: 'Register of Wills',
    content: 'The register of wills shall collect fees for probate services and inheritance tax. Monthly reports shall be filed with the controller.' },
  { article: 'XX', section: '2030', statute: '16 Pa.C.S. §2030', title: 'Recorder of Deeds',
    content: 'The recorder of deeds shall collect recording fees and realty transfer tax. All collections shall be remitted to the treasurer and reported to the controller.' },
  { article: 'XX', section: '2040', statute: '16 Pa.C.S. §2040', title: 'Prothonotary',
    content: 'The prothonotary shall collect fees for civil court filings. Escrow accounts shall be reconciled monthly with controller oversight.' },
  { article: 'XX', section: '2050', statute: '16 Pa.C.S. §2050', title: 'Clerk of Courts',
    content: 'The clerk of courts shall collect fees for criminal and civil court matters. All funds shall be deposited daily and reconciled with controller records.' },
  { article: 'XX', section: '2060', statute: '16 Pa.C.S. §2060', title: 'Coroner',
    content: 'The coroner shall collect fees for autopsy and investigation services. Financial records shall be subject to controller audit.' },
  { article: 'XX', section: '2070', statute: '16 Pa.C.S. §2070', title: 'District Attorney',
    content: 'The district attorney shall account for all forfeiture funds and grant receipts. The controller shall audit forfeiture accounts annually.' },
];

async function main() {
  console.log('Initializing Vector Database...\n');

  // Create database
  const dbPath = path.join(__dirname, '../data/vectors/legal-vectors.db');
  const db = new VectorBlockDB(dbPath);
  const embedder = new EmbeddingGenerator();
  const linker = new ChainLinker(db);

  // Build vocabulary from all content
  console.log('Building vocabulary...');
  embedder.buildVocab(PA_CODE_SECTIONS.map(s => s.content));

  // Insert blocks with embeddings
  console.log('Inserting blocks with embeddings...');
  const blockIds = [];

  PA_CODE_SECTIONS.forEach((section, idx) => {
    const embedding = embedder.generateBlockEmbedding(section);
    const coords = embedding.coords3D;

    const id = db.insertBlock({
      statute: section.statute,
      title: section.title,
      content: section.content,
      embedding: embedding.semantic,
      x: coords.x,
      y: coords.y,
      z: coords.z,
      article: section.article,
      section: section.section,
      sequence: idx,
      blockType: 'section',
    });

    blockIds.push(id);
    console.log(`  + ${section.statute}: ${section.title}`);
  });

  // Link blocks in document order
  console.log('\nLinking document order...');
  const orderLinks = linker.linkDocumentOrder(blockIds);
  console.log(`  Created ${orderLinks} order links`);

  // Build semantic links
  console.log('\nBuilding semantic links...');
  const semanticLinks = linker.buildSemanticLinks(0.6, 3);
  console.log(`  Created ${semanticLinks} semantic links`);

  // Build hierarchy links
  console.log('\nBuilding hierarchy links...');
  const hierarchyLinks = linker.buildHierarchyLinks();
  console.log(`  Created ${hierarchyLinks} hierarchy links`);

  // Build 3D proximity links
  console.log('\nBuilding 3D proximity links...');
  const spatialLinks = linker.build3DProximityLinks(3.0, 2);
  console.log(`  Created ${spatialLinks} spatial links`);

  // Create master document
  console.log('\nCreating PA County Code document...');
  db.createDocument(
    'pa-county-code-title-16',
    'PA County Code Title 16',
    'Pennsylvania County Code - Controller and Fiscal Affairs',
    blockIds
  );

  // Verify chain
  console.log('\nVerifying chain integrity...');
  const verification = linker.verifyChain(blockIds[0]);
  console.log(`  Chain valid: ${verification.valid}`);
  console.log(`  Block count: ${verification.blockCount}`);
  console.log(`  Chain hash: ${verification.chainHash.substring(0, 16)}...`);

  // Print stats
  const stats = db.getStats();
  console.log('\n=== Database Stats ===');
  console.log(`  Blocks: ${stats.blocks}`);
  console.log(`  Links: ${stats.links}`);
  console.log(`  Documents: ${stats.documents}`);
  console.log(`  Articles: ${stats.articles}`);
  console.log(`  Database: ${dbPath}`);

  db.close();
  console.log('\nDone!');
}

main().catch(console.error);
