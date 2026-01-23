/**
 * Get Workflow Tool
 * Returns workflow definitions and state transitions
 * 
 * @module mcp/tools/get-workflow
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getWorkflowTool = {
  name: 'get_workflow',
  description: 'Get workflow definitions including states, transitions, and SLAs for county processes.',
  inputSchema: {
    type: 'object',
    properties: {
      workflow: {
        type: 'string',
        description: 'Workflow name (e.g., "sheriff-sale", "probate", "criminal-case", "cash-receipt")',
      },
    },
  },
  
  async execute(args) {
    const { workflow } = args || {};
    const workflowsDir = path.join(__dirname, '../../../docs/tags/workflows');
    
    try {
      if (workflow) {
        // Get specific workflow
        const filePath = path.join(workflowsDir, `${workflow}.json`);
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
        return {
          workflow: data,
          source: 'NAC Digital Twin - ISA-95 Workflows',
        };
      } else {
        // List all workflows
        const workflows = [
          'sheriff-sale', 'process-service', 'criminal-case',
          'probate', 'document-recording', 'cash-receipt'
        ];
        
        const results = [];
        for (const w of workflows) {
          const filePath = path.join(workflowsDir, `${w}.json`);
          try {
            const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
            results.push({
              id: data.id,
              description: data.description,
              states: data.states,
              slaBusinessDays: data.slaBusinessDays,
            });
          } catch (e) {
            // File not found
          }
        }
        
        return {
          workflows: results,
          source: 'NAC Digital Twin - ISA-95 Workflows',
        };
      }
    } catch (error) {
      return { error: error.message };
    }
  },
};
