/**
 * Search PA Code Tool
 * Search Pennsylvania Consolidated Statutes references
 * 
 * @module mcp/tools/search-pa-code
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const searchPACodeTool = {
  name: 'search_pa_code',
  description: 'Search Pennsylvania Consolidated Statutes (PA Code) references used in county operations.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search term (e.g., "controller", "audit", "warrant", "16 P.S.")',
      },
      title: {
        type: 'number',
        description: 'PA Code title number (e.g., 16 for County Code, 42 for Judiciary)',
      },
    },
    required: ['query'],
  },
  
  async execute(args) {
    const { query, title } = args;
    
    // Common PA Code references for county operations
    const paCodeRefs = [
      { title: 16, section: '1701', description: 'Controller - General powers', office: 'controller' },
      { title: 16, section: '1702', description: 'Controller - Audit county accounts', office: 'controller' },
      { title: 16, section: '1703', description: 'Controller - Examine officer accounts', office: 'controller' },
      { title: 16, section: '1705', description: 'Controller - Pre-audit vouchers', office: 'controller' },
      { title: 16, section: '1706', description: 'Controller - Countersign warrants', office: 'controller' },
      { title: 16, section: '1720', description: 'Controller - Board memberships', office: 'controller' },
      { title: 16, section: '1201-1210', description: 'Sheriff duties and powers', office: 'sheriff' },
      { title: 16, section: '1301-1310', description: 'Treasurer duties and powers', office: 'treasurer' },
      { title: 16, section: '701-708', description: 'Coroner duties and powers', office: 'coroner' },
      { title: 16, section: '801-808', description: 'District Attorney duties', office: 'district-attorney' },
      { title: 16, section: '601-608', description: 'Clerk of Courts duties', office: 'clerk-of-courts' },
      { title: 16, section: '901-908', description: 'Prothonotary duties', office: 'prothonotary' },
      { title: 16, section: '1001-1009', description: 'Recorder of Deeds duties', office: 'recorder-of-deeds' },
      { title: 16, section: '1101-1110', description: 'Register of Wills duties', office: 'register-of-wills' },
      { title: 42, section: '1725', description: 'Court filing fees', office: 'clerk-of-courts' },
      { title: 42, section: '21101', description: 'Sheriff fees for service', office: 'sheriff' },
      { title: 20, section: '906', description: 'Register of Wills fees', office: 'register-of-wills' },
      { title: 21, section: '443', description: 'Recording fees', office: 'recorder-of-deeds' },
      { title: 42, section: '6801', description: 'Asset forfeiture', office: 'district-attorney' },
    ];
    
    // Filter by query and title
    const results = paCodeRefs.filter(ref => {
      const matchesQuery = query.toLowerCase().split(' ').some(term =>
        ref.description.toLowerCase().includes(term) ||
        ref.office.includes(term) ||
        ref.section.includes(term)
      );
      const matchesTitle = !title || ref.title === title;
      return matchesQuery && matchesTitle;
    });
    
    return {
      query,
      results: results.map(r => ({
        citation: `${r.title} P.S. §${r.section}`,
        description: r.description,
        office: r.office,
      })),
      note: 'For full text, visit legis.state.pa.us',
      source: 'NAC Digital Twin - PA Consolidated Statutes',
    };
  },
};
