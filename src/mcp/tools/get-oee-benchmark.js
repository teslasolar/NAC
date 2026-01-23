/**
 * Get OEE Benchmark Tool
 * Returns OEE (Overall Equipment Effectiveness) benchmarks for county offices
 * 
 * @module mcp/tools/get-oee-benchmark
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getOEEBenchmarkTool = {
  name: 'get_oee_benchmark',
  description: 'Get OEE (Overall Equipment Effectiveness) benchmarks and targets for county row officer offices.',
  inputSchema: {
    type: 'object',
    properties: {
      office: {
        type: 'string',
        description: 'Office name (e.g., "sheriff", "controller", "treasurer"). Leave empty for all.',
      },
    },
  },
  
  async execute(args) {
    const { office } = args || {};
    const benchmarksDir = path.join(__dirname, '../../../docs/tags/oee/benchmarks');
    
    try {
      const results = [];
      const offices = office 
        ? [office.toLowerCase()]
        : ['sheriff', 'treasurer', 'coroner', 'district-attorney', 'recorder-of-deeds', 'register-of-wills', 'clerk-of-courts', 'prothonotary', 'controller'];
      
      for (const o of offices) {
        const filePath = path.join(benchmarksDir, `${o}.json`);
        try {
          const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
          results.push({
            office: data.name,
            targetOEE: data.targetOEE,
            targets: data.targets,
            cycleTimeMinutes: data.cycleTimeMinutes,
            slaHours: data.slaHours,
            keyMetrics: data.keyMetrics,
          });
        } catch (e) {
          // File not found
        }
      }
      
      // Sort by target OEE descending
      results.sort((a, b) => b.targetOEE - a.targetOEE);
      
      return {
        explanation: 'OEE = Availability × Performance × Quality. Targets vary by office based on workload characteristics.',
        benchmarks: results,
        source: 'NAC Digital Twin - ISA-95 Metrics',
      };
    } catch (error) {
      return { error: error.message };
    }
  },
};
