/**
 * Get Fee Schedule Tool
 * Returns fee schedules for county row officer services
 * 
 * @module mcp/tools/get-fee-schedule
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getFeeScheduleTool = {
  name: 'get_fee_schedule',
  description: 'Get fee schedules for Northampton County row officer services per PA statutes.',
  inputSchema: {
    type: 'object',
    properties: {
      office: {
        type: 'string',
        description: 'Office name (e.g., "sheriff", "recorder-of-deeds", "prothonotary"). Leave empty for all.',
      },
      service: {
        type: 'string',
        description: 'Search for specific service type (e.g., "recording", "filing", "certified copy")',
      },
    },
  },
  
  async execute(args) {
    const { office, service } = args || {};
    const feesDir = path.join(__dirname, '../../../docs/tags/fees');
    
    try {
      const results = [];
      const offices = office 
        ? [office.toLowerCase()]
        : ['sheriff', 'treasurer', 'coroner', 'district-attorney', 'recorder-of-deeds', 'register-of-wills', 'clerk-of-courts', 'prothonotary'];
      
      for (const o of offices) {
        const filePath = path.join(feesDir, `${o}.json`);
        try {
          const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
          
          // Filter by service if specified
          let fees = data.fees;
          if (service) {
            fees = Object.fromEntries(
              Object.entries(fees).filter(([key, val]) => 
                key.includes(service.toLowerCase()) || 
                val.description.toLowerCase().includes(service.toLowerCase())
              )
            );
          }
          
          if (Object.keys(fees).length > 0) {
            results.push({
              office: data.name,
              authority: data.authority,
              fees,
            });
          }
        } catch (e) {
          // File not found
        }
      }
      
      return {
        results,
        source: 'NAC Digital Twin - PA Statutes',
      };
    } catch (error) {
      return { error: error.message };
    }
  },
};
