/**
 * MQMCP Protocol
 * Combined MQTT + MCP Protocol
 *
 * Merges MQTT pub/sub messaging with MCP tool-calling capabilities.
 * Subscribe to topics to receive real-time data, call tools via MQTT messages.
 *
 * @module comm/mqmcp/protocol
 */

import { EventEmitter } from 'events';
import { NACMQTTClient, NACTopics } from '../mqtt/client.js';
import { NACMQTTBroker } from '../mqtt/broker.js';

/**
 * MQMCP - MQTT + MCP Protocol
 *
 * Features:
 * - Tool invocation via MQTT topics
 * - Real-time responses via pub/sub
 * - Request/response correlation
 * - Streaming results support
 * - ISA-95 level routing
 */
export class MQMCP extends EventEmitter {
  constructor(options = {}) {
    super();
    this.broker = new NACMQTTBroker({ port: options.brokerPort || 1883 });
    this.tools = new Map();
    this.pendingRequests = new Map();
    this.requestTimeout = options.requestTimeout || 30000;

    // MQMCP topic namespace
    this.namespace = 'mqmcp';

    // Reserved topics
    this.topics = {
      TOOL_CALL: `${this.namespace}/tools/call`,
      TOOL_RESPONSE: `${this.namespace}/tools/response`,
      TOOL_LIST: `${this.namespace}/tools/list`,
      TOOL_SCHEMA: `${this.namespace}/tools/schema`,
      STREAM: `${this.namespace}/stream`,
      ERROR: `${this.namespace}/error`,
    };
  }

  /**
   * Start the MQMCP server
   */
  async start() {
    await this.broker.start();
    this.setupInternalClient();
    console.log('[MQMCP] Protocol server started');
    return this;
  }

  /**
   * Stop the server
   */
  async stop() {
    await this.broker.stop();
    console.log('[MQMCP] Protocol server stopped');
  }

  /**
   * Setup internal client for handling requests
   */
  setupInternalClient() {
    const clientId = 'mqmcp-server';

    // Register as a broker client
    this.broker.registerClient(clientId, {
      onMessage: (topic, message) => this.handleMessage(topic, message),
    });

    // Subscribe to tool call requests
    this.broker.subscribe(clientId, `${this.topics.TOOL_CALL}/+`);
    this.broker.subscribe(clientId, this.topics.TOOL_LIST);
    this.broker.subscribe(clientId, `${this.topics.TOOL_SCHEMA}/+`);
  }

  /**
   * Register a tool
   */
  registerTool(tool) {
    if (!tool.name || !tool.execute) {
      throw new Error('Tool must have name and execute function');
    }

    this.tools.set(tool.name, {
      name: tool.name,
      description: tool.description || '',
      inputSchema: tool.inputSchema || { type: 'object', properties: {} },
      execute: tool.execute,
    });

    console.log(`[MQMCP] Registered tool: ${tool.name}`);
    return this;
  }

  /**
   * Register multiple tools
   */
  registerTools(tools) {
    tools.forEach(tool => this.registerTool(tool));
    return this;
  }

  /**
   * Handle incoming MQTT message
   */
  async handleMessage(topic, message) {
    try {
      const parsed = typeof message === 'string' ? JSON.parse(message) : message;

      // Tool list request
      if (topic === this.topics.TOOL_LIST) {
        this.handleToolList(parsed);
        return;
      }

      // Tool schema request
      if (topic.startsWith(this.topics.TOOL_SCHEMA + '/')) {
        const toolName = topic.split('/').pop();
        this.handleToolSchema(toolName, parsed);
        return;
      }

      // Tool call request
      if (topic.startsWith(this.topics.TOOL_CALL + '/')) {
        const toolName = topic.split('/').pop();
        await this.handleToolCall(toolName, parsed);
        return;
      }
    } catch (err) {
      this.publishError(err, { topic, message });
    }
  }

  /**
   * Handle tool list request
   */
  handleToolList(request) {
    const tools = Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));

    this.publish(`${this.topics.TOOL_LIST}/response`, {
      requestId: request.requestId,
      tools,
    });
  }

  /**
   * Handle tool schema request
   */
  handleToolSchema(toolName, request) {
    const tool = this.tools.get(toolName);

    if (!tool) {
      this.publishError(new Error(`Tool not found: ${toolName}`), { requestId: request.requestId });
      return;
    }

    this.publish(`${this.topics.TOOL_SCHEMA}/${toolName}/response`, {
      requestId: request.requestId,
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    });
  }

  /**
   * Handle tool call request
   */
  async handleToolCall(toolName, request) {
    const { requestId, arguments: args, stream = false } = request;
    const tool = this.tools.get(toolName);

    if (!tool) {
      this.publishError(new Error(`Tool not found: ${toolName}`), { requestId });
      return;
    }

    try {
      // Emit start event
      this.emit('toolCall', { toolName, requestId, args });

      // Execute the tool
      const startTime = Date.now();
      const result = await tool.execute(args);
      const duration = Date.now() - startTime;

      // Publish response
      const responseTopic = `${this.topics.TOOL_RESPONSE}/${toolName}`;
      this.publish(responseTopic, {
        requestId,
        toolName,
        success: true,
        result,
        duration,
        timestamp: new Date().toISOString(),
      });

      this.emit('toolComplete', { toolName, requestId, result, duration });
    } catch (err) {
      this.publishError(err, { requestId, toolName });
    }
  }

  /**
   * Publish a message
   */
  publish(topic, message) {
    this.broker.publish('mqmcp-server', topic, JSON.stringify(message));
  }

  /**
   * Publish an error
   */
  publishError(error, context = {}) {
    this.publish(this.topics.ERROR, {
      error: error.message,
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString(),
    });

    this.emit('error', { error, context });
  }

  /**
   * Create a client for calling MQMCP tools
   */
  createClient(options = {}) {
    return new MQMCPClient({
      broker: this.broker,
      namespace: this.namespace,
      topics: this.topics,
      ...options,
    });
  }
}

/**
 * MQMCP Client
 * Client for calling MQMCP tools via MQTT
 */
export class MQMCPClient extends EventEmitter {
  constructor(options) {
    super();
    this.broker = options.broker;
    this.namespace = options.namespace;
    this.topics = options.topics;
    this.clientId = options.clientId || `mqmcp-client-${Date.now()}`;
    this.pendingCalls = new Map();
    this.timeout = options.timeout || 30000;

    this.setup();
  }

  /**
   * Setup client subscriptions
   */
  setup() {
    this.broker.registerClient(this.clientId, {
      onMessage: (topic, message) => this.handleResponse(topic, message),
    });

    // Subscribe to responses
    this.broker.subscribe(this.clientId, `${this.topics.TOOL_RESPONSE}/+`);
    this.broker.subscribe(this.clientId, `${this.topics.TOOL_LIST}/response`);
    this.broker.subscribe(this.clientId, `${this.topics.TOOL_SCHEMA}/+/response`);
    this.broker.subscribe(this.clientId, this.topics.ERROR);
  }

  /**
   * Handle response message
   */
  handleResponse(topic, message) {
    try {
      const parsed = typeof message === 'string' ? JSON.parse(message) : message;
      const { requestId } = parsed;

      if (requestId && this.pendingCalls.has(requestId)) {
        const { resolve, reject, timeoutId } = this.pendingCalls.get(requestId);
        clearTimeout(timeoutId);
        this.pendingCalls.delete(requestId);

        if (topic === this.topics.ERROR) {
          reject(new Error(parsed.error));
        } else {
          resolve(parsed);
        }
      }
    } catch (err) {
      this.emit('error', err);
    }
  }

  /**
   * Call a tool
   */
  async callTool(toolName, args = {}) {
    const requestId = `${this.clientId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingCalls.delete(requestId);
        reject(new Error(`Tool call timeout: ${toolName}`));
      }, this.timeout);

      this.pendingCalls.set(requestId, { resolve, reject, timeoutId });

      this.broker.publish(this.clientId, `${this.topics.TOOL_CALL}/${toolName}`, JSON.stringify({
        requestId,
        arguments: args,
      }));
    });
  }

  /**
   * List available tools
   */
  async listTools() {
    const requestId = `${this.clientId}-list-${Date.now()}`;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingCalls.delete(requestId);
        reject(new Error('List tools timeout'));
      }, this.timeout);

      this.pendingCalls.set(requestId, { resolve, reject, timeoutId });

      this.broker.publish(this.clientId, this.topics.TOOL_LIST, JSON.stringify({
        requestId,
      }));
    });
  }

  /**
   * Get tool schema
   */
  async getToolSchema(toolName) {
    const requestId = `${this.clientId}-schema-${Date.now()}`;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingCalls.delete(requestId);
        reject(new Error(`Get schema timeout: ${toolName}`));
      }, this.timeout);

      this.pendingCalls.set(requestId, { resolve, reject, timeoutId });

      this.broker.publish(this.clientId, `${this.topics.TOOL_SCHEMA}/${toolName}`, JSON.stringify({
        requestId,
      }));
    });
  }

  /**
   * Subscribe to a topic for real-time updates
   */
  subscribe(topic, handler) {
    const fullTopic = topic.startsWith(this.namespace) ? topic : `nac/${topic}`;
    this.broker.subscribe(this.clientId, fullTopic);

    // Custom handler registration
    this.on(`message:${fullTopic}`, handler);

    return () => {
      this.broker.unsubscribe(this.clientId, fullTopic);
      this.off(`message:${fullTopic}`, handler);
    };
  }

  /**
   * Disconnect client
   */
  disconnect() {
    for (const { timeoutId } of this.pendingCalls.values()) {
      clearTimeout(timeoutId);
    }
    this.pendingCalls.clear();
    this.broker.unregisterClient(this.clientId);
  }
}

export default MQMCP;
