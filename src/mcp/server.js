#!/usr/bin/env node
/**
 * NAC MCP Server
 * 
 * Model Context Protocol server for Northampton County Digital Twin.
 * Each tool is a separate UDT (User Defined Type) file in ./tools/
 * 
 * @module mcp/server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tools
import { getOfficersTool } from './tools/get-officers.js';
import { getMunicipalityTool } from './tools/get-municipality.js';
import { getFeeScheduleTool } from './tools/get-fee-schedule.js';
import { getOEEBenchmarkTool } from './tools/get-oee-benchmark.js';
import { searchPACodeTool } from './tools/search-pa-code.js';
import { getWorkflowTool } from './tools/get-workflow.js';
import { getAssemblyLineTool } from './tools/get-assembly-line.js';
import { queryCountyDataTool } from './tools/query-county-data.js';

// Register all tools
const tools = [
  getOfficersTool,
  getMunicipalityTool,
  getFeeScheduleTool,
  getOEEBenchmarkTool,
  searchPACodeTool,
  getWorkflowTool,
  getAssemblyLineTool,
  queryCountyDataTool,
];

// Create server
const server = new Server(
  {
    name: 'nac-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const tool = tools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  
  try {
    const result = await tool.execute(args);
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('NAC MCP Server running on stdio');
}

main().catch(console.error);
