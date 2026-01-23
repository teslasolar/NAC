/**
 * Get Assembly Line Tool
 * Returns assembly line (process workflow) configurations per office
 *
 * @module mcp/tools/get-assembly-line
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getAssemblyLineTool = {
  name: 'get_assembly_line',
  description: 'Get assembly line (production workflow) configurations for row officer offices.',
  inputSchema: {
    type: 'object',
    properties: {
      office: {
        type: 'string',
        description: 'Office name (e.g., "sheriff", "treasurer", "prothonotary")',
      },
    },
  },

  async execute(args) {
    const { office } = args || {};
    const linesDir = path.join(__dirname, '../../../docs/tags/L3/lines');

    try {
      if (office) {
        // Get specific office assembly lines
        const filePath = path.join(linesDir, office.toLowerCase() + '.json');
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
        return {
          office: data.office,
          lines: data.lines,
          source: 'NAC Digital Twin - ISA-95 L3 Operations',
        };
      } else {
        // List all offices with their line counts
        const offices = [
          'sheriff', 'treasurer', 'coroner', 'district-attorney',
          'recorder-of-deeds', 'register-of-wills', 'clerk-of-courts',
          'prothonotary', 'fiscal-affairs'
        ];

        const results = [];
        for (const o of offices) {
          const filePath = path.join(linesDir, o + '.json');
          try {
            const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
            results.push({
              office: data.office,
              lineCount: data.lines.length,
              lines: data.lines.map(l => l.id),
            });
          } catch (e) {
            // File not found
          }
        }

        return {
          offices: results,
          totalLines: results.reduce((sum, o) => sum + o.lineCount, 0),
          source: 'NAC Digital Twin - ISA-95 L3 Operations',
        };
      }
    } catch (error) {
      return { error: error.message };
    }
  },
};
