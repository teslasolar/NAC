#!/usr/bin/env node
/**
 * MQMCP Server
 * Combined MQTT + MCP Server for NAC Digital Twin
 *
 * Usage:
 *   node server.js
 *
 * @module comm/mqmcp/server
 */

import { MQMCP } from './protocol.js';
import { NACOPCUAServer } from '../opcua/server.js';

// Import NAC MCP tools
import {
  // Core government tools
  getOfficersTool,
  getMunicipalityTool,
  getFeeScheduleTool,
  searchPACodeTool,
  queryCountyDataTool,
  // Budget & Fiscal tools
  getBudgetTool,
  getDepartmentBudgetTool,
  getAuditsTool,
  getAuditStatusTool,
  getDebtInfoTool,
  getTaxRateTool,
  getFiscalYearInfoTool,
  // Parcel & GIS tools
  searchParcelsTool,
  getZoningInfoTool,
  // ISA-95 / Industrial tools
  getOEEBenchmarkTool,
  getWorkflowTool,
  getAssemblyLineTool,
} from '../../mcp/tools/index.js';

/**
 * MQMCP Server
 * Integrates MQTT, MCP tools, and OPC-UA
 */
export class MQMCPServer {
  constructor(options = {}) {
    this.mqmcp = new MQMCP({
      brokerPort: options.mqttPort || 1883,
      requestTimeout: options.requestTimeout || 30000,
    });

    this.opcua = new NACOPCUAServer({
      port: options.opcuaPort || 4840,
      serverName: options.serverName || 'NAC-MQMCP-Server',
    });

    this.running = false;
  }

  /**
   * Start all servers
   */
  async start() {
    // Register MCP tools with MQMCP
    this.mqmcp.registerTools([
      // Core government tools
      getOfficersTool,
      getMunicipalityTool,
      getFeeScheduleTool,
      searchPACodeTool,
      queryCountyDataTool,
      // Budget & Fiscal tools
      getBudgetTool,
      getDepartmentBudgetTool,
      getAuditsTool,
      getAuditStatusTool,
      getDebtInfoTool,
      getTaxRateTool,
      getFiscalYearInfoTool,
      // Parcel & GIS tools
      searchParcelsTool,
      getZoningInfoTool,
      // ISA-95 / Industrial tools
      getOEEBenchmarkTool,
      getWorkflowTool,
      getAssemblyLineTool,
    ]);

    // Add MQMCP-specific tools
    this.mqmcp.registerTools([
      this.createOPCUABrowseTool(),
      this.createOPCUAReadTool(),
      this.createOPCUAWriteTool(),
      this.createMQTTPublishTool(),
      this.createMQTTSubscribeTool(),
    ]);

    // Start servers
    await this.mqmcp.start();
    await this.opcua.start();

    // Bridge OPC-UA changes to MQTT
    this.setupOPCUABridge();

    this.running = true;
    console.log('[MQMCP Server] All services started');
    console.log(`  MQTT Broker: port 1883`);
    console.log(`  OPC-UA Server: port 4840`);
    console.log(`  MQMCP Protocol: active`);

    return this;
  }

  /**
   * Stop all servers
   */
  async stop() {
    await this.mqmcp.stop();
    await this.opcua.stop();
    this.running = false;
    console.log('[MQMCP Server] All services stopped');
  }

  /**
   * Setup OPC-UA to MQTT bridge
   */
  setupOPCUABridge() {
    // Bridge OPC-UA value changes to MQTT topics
    this.opcua.on('valueChanged', ({ path, oldValue, newValue }) => {
      const topic = `nac/opcua/${path.replace(/\//g, '/')}`;
      this.mqmcp.publish(topic, {
        path,
        oldValue,
        newValue,
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Create OPC-UA browse tool
   */
  createOPCUABrowseTool() {
    const opcua = this.opcua;
    return {
      name: 'opcua_browse',
      description: 'Browse OPC-UA address space nodes',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Node path to browse (e.g., "NAC", "L2_Control/ProductionUnits")',
          },
        },
      },
      async execute(args) {
        const path = args.path || 'NAC';
        return opcua.browse(path);
      },
    };
  }

  /**
   * Create OPC-UA read tool
   */
  createOPCUAReadTool() {
    const opcua = this.opcua;
    return {
      name: 'opcua_read',
      description: 'Read OPC-UA variable value',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Full path to the variable node',
          },
        },
        required: ['path'],
      },
      async execute(args) {
        return opcua.readValue(args.path);
      },
    };
  }

  /**
   * Create OPC-UA write tool
   */
  createOPCUAWriteTool() {
    const opcua = this.opcua;
    return {
      name: 'opcua_write',
      description: 'Write value to OPC-UA variable',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Full path to the variable node',
          },
          value: {
            description: 'Value to write',
          },
        },
        required: ['path', 'value'],
      },
      async execute(args) {
        return opcua.writeValue(args.path, args.value);
      },
    };
  }

  /**
   * Create MQTT publish tool
   */
  createMQTTPublishTool() {
    const mqmcp = this.mqmcp;
    return {
      name: 'mqtt_publish',
      description: 'Publish message to MQTT topic',
      inputSchema: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Topic to publish to',
          },
          message: {
            description: 'Message payload (object or string)',
          },
          retain: {
            type: 'boolean',
            description: 'Retain message on broker',
          },
        },
        required: ['topic', 'message'],
      },
      async execute(args) {
        mqmcp.publish(args.topic, args.message);
        return { success: true, topic: args.topic };
      },
    };
  }

  /**
   * Create MQTT subscribe tool
   */
  createMQTTSubscribeTool() {
    return {
      name: 'mqtt_subscribe',
      description: 'Get information about subscribing to MQTT topics',
      inputSchema: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Topic pattern to subscribe to (supports + and # wildcards)',
          },
        },
        required: ['topic'],
      },
      async execute(args) {
        return {
          topic: args.topic,
          instructions: 'Use MQMCP client subscribe() method to receive messages',
          example: `client.subscribe('${args.topic}', (msg) => console.log(msg))`,
        };
      },
    };
  }

  /**
   * Create a client for this server
   */
  createClient(options = {}) {
    return this.mqmcp.createClient(options);
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      running: this.running,
      mqtt: this.mqmcp.broker.getStats(),
      opcua: this.opcua.getServerInfo(),
      tools: Array.from(this.mqmcp.tools.keys()),
    };
  }
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const server = new MQMCPServer();

  server.start().then(() => {
    console.log('\n[MQMCP] Server ready. Press Ctrl+C to stop.\n');
  });

  process.on('SIGINT', async () => {
    console.log('\n[MQMCP] Shutting down...');
    await server.stop();
    process.exit(0);
  });
}

export default MQMCPServer;
