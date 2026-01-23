/**
 * Get Officers Tool
 * Returns current Northampton County officers and officials
 * 
 * @module mcp/tools/get-officers
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getOfficersTool = {
  name: 'get_officers',
  description: 'Get current Northampton County row officers and officials. Returns name, position, status, and term info.',
  inputSchema: {
    type: 'object',
    properties: {
      position: {
        type: 'string',
        description: 'Filter by position (e.g., "controller", "sheriff", "coroner"). Leave empty for all.',
      },
      year: {
        type: 'number',
        description: 'Year to query (default: current year)',
      },
    },
  },
  
  async execute(args) {
    const { position, year = new Date().getFullYear() } = args || {};
    
    // Load officer data from tags
    const officersDir = path.join(__dirname, '../../../docs/tags/officers');
    const indexPath = path.join(officersDir, 'index.json');
    
    try {
      const index = JSON.parse(await fs.readFile(indexPath, 'utf8'));
      const results = [];
      
      // Load each position file
      const positions = [
        'county-executive', 'controller', 'district-attorney', 'sheriff',
        'coroner', 'fiscal-affairs', 'clerk-of-courts', 'prothonotary',
        'recorder-of-deeds', 'register-of-wills'
      ];
      
      for (const pos of positions) {
        if (position && !pos.includes(position.toLowerCase())) continue;
        
        const filePath = path.join(officersDir, `${pos}.json`);
        try {
          const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
          const record = data.records.find(r => r.year === year) || data.records[0];
          if (record) {
            results.push({
              position: data.position,
              ...record,
            });
          }
        } catch (e) {
          // File not found, skip
        }
      }
      
      return {
        year,
        officers: results,
        source: 'NAC Digital Twin - docs/tags/officers/',
      };
    } catch (error) {
      // Fallback to hardcoded current data
      return {
        year: 2026,
        officers: [
          { position: 'County Executive', name: 'Tara Zrinski', status: 'active', party: 'Democrat' },
          { position: 'Controller', name: 'VACANT', status: 'vacant', note: 'Zrinski became County Executive' },
          { position: 'Sheriff', name: 'Christopher Zieger', status: 'active', type: 'appointed' },
          { position: 'Coroner', name: 'Zachary Lysek', status: 'active', tenure: 34 },
          { position: 'District Attorney', name: 'Stephen G. Baratta', status: 'active', party: 'Democrat' },
          { position: 'Clerk of Courts', name: 'Leigh Ann Fisher', status: 'active', tenure: 19 },
          { position: 'Prothonotary', name: 'Holly Ruggiero', status: 'active', tenure: 25 },
          { position: 'Recorder of Deeds', name: 'Dorothy Edelman', status: 'active' },
          { position: 'Register of Wills', name: 'Patricia J. Manento', status: 'active' },
        ],
        source: 'NAC Digital Twin (fallback)',
      };
    }
  },
};
