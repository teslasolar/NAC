/**
 * Get Municipality Tool
 * Returns Northampton County municipality data
 * 
 * @module mcp/tools/get-municipality
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getMunicipalityTool = {
  name: 'get_municipality',
  description: 'Get Northampton County municipality info including population, compliance scores, and audit findings.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Municipality name (e.g., "Easton", "Bethlehem"). Leave empty for all.',
      },
      type: {
        type: 'string',
        enum: ['city', 'borough', 'township'],
        description: 'Filter by municipality type',
      },
    },
  },
  
  async execute(args) {
    const { name, type } = args || {};
    const baseDir = path.join(__dirname, '../../../docs/tags/municipalities');
    
    try {
      const results = [];
      const types = type ? [type === 'city' ? 'cities' : type + 's'] : ['cities', 'boroughs', 'townships'];
      
      for (const t of types) {
        const dir = path.join(baseDir, t);
        try {
          const files = await fs.readdir(dir);
          for (const file of files) {
            if (!file.endsWith('.json')) continue;
            const data = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
            if (name && !data.name.toLowerCase().includes(name.toLowerCase())) continue;
            results.push(data);
          }
        } catch (e) {
          // Directory not found
        }
      }
      
      // Sort by population
      results.sort((a, b) => b.population - a.population);
      
      return {
        count: results.length,
        totalPopulation: results.reduce((sum, m) => sum + m.population, 0),
        municipalities: results,
        source: 'NAC Digital Twin - 2020 Census data',
      };
    } catch (error) {
      return { error: error.message };
    }
  },
};
