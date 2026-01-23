/**
 * NAC MQTT Client
 * Pub/sub messaging for ISA-95 level communication
 *
 * @module comm/mqtt/client
 */

import { EventEmitter } from 'events';

/**
 * MQTT Client for NAC Digital Twin
 * Handles pub/sub messaging between ISA-95 levels
 */
export class NACMQTTClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.broker = options.broker || 'mqtt://localhost:1883';
    this.clientId = options.clientId || `nac-${Date.now()}`;
    this.subscriptions = new Map();
    this.connected = false;
    this.messageQueue = [];

    // NAC topic namespace
    this.topicPrefix = options.topicPrefix || 'nac';
  }

  /**
   * Connect to MQTT broker
   */
  async connect() {
    // Simulated connection for demo
    this.connected = true;
    this.emit('connect', { broker: this.broker, clientId: this.clientId });
    console.log(`[MQTT] Connected to ${this.broker} as ${this.clientId}`);

    // Process queued messages
    while (this.messageQueue.length > 0) {
      const { topic, message } = this.messageQueue.shift();
      await this.publish(topic, message);
    }

    return this;
  }

  /**
   * Disconnect from broker
   */
  async disconnect() {
    this.connected = false;
    this.emit('disconnect');
    console.log('[MQTT] Disconnected');
  }

  /**
   * Subscribe to a topic
   * @param {string} topic - Topic pattern (supports wildcards: + single level, # multi level)
   * @param {Function} handler - Message handler
   */
  subscribe(topic, handler) {
    const fullTopic = this.buildTopic(topic);

    if (!this.subscriptions.has(fullTopic)) {
      this.subscriptions.set(fullTopic, []);
    }
    this.subscriptions.get(fullTopic).push(handler);

    this.emit('subscribe', { topic: fullTopic });
    console.log(`[MQTT] Subscribed to ${fullTopic}`);

    return () => this.unsubscribe(topic, handler);
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(topic, handler) {
    const fullTopic = this.buildTopic(topic);
    const handlers = this.subscriptions.get(fullTopic);

    if (handlers) {
      const idx = handlers.indexOf(handler);
      if (idx > -1) handlers.splice(idx, 1);
      if (handlers.length === 0) this.subscriptions.delete(fullTopic);
    }
  }

  /**
   * Publish a message
   * @param {string} topic - Topic to publish to
   * @param {any} message - Message payload (will be JSON stringified)
   * @param {Object} options - Publish options (qos, retain)
   */
  async publish(topic, message, options = {}) {
    const fullTopic = this.buildTopic(topic);
    const payload = typeof message === 'string' ? message : JSON.stringify(message);

    if (!this.connected) {
      this.messageQueue.push({ topic, message });
      return;
    }

    // Emit for local subscribers (simulated broker behavior)
    this.routeMessage(fullTopic, payload);

    this.emit('publish', { topic: fullTopic, message: payload, ...options });
    console.log(`[MQTT] Published to ${fullTopic}`);
  }

  /**
   * Route message to matching subscribers
   */
  routeMessage(topic, payload) {
    for (const [pattern, handlers] of this.subscriptions) {
      if (this.topicMatches(pattern, topic)) {
        const parsed = this.parsePayload(payload);
        handlers.forEach(handler => {
          try {
            handler(parsed, { topic });
          } catch (err) {
            this.emit('error', err);
          }
        });
      }
    }
  }

  /**
   * Check if topic matches pattern (supports + and # wildcards)
   */
  topicMatches(pattern, topic) {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') return true;
      if (patternParts[i] === '+') continue;
      if (patternParts[i] !== topicParts[i]) return false;
    }

    return patternParts.length === topicParts.length;
  }

  /**
   * Build full topic with namespace prefix
   */
  buildTopic(topic) {
    if (topic.startsWith(this.topicPrefix + '/')) return topic;
    return `${this.topicPrefix}/${topic}`;
  }

  /**
   * Parse message payload
   */
  parsePayload(payload) {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }
}

/**
 * NAC Topic Structure (ISA-95 aligned)
 *
 * nac/
 *   L4/                    # Business Planning & Logistics
 *     enterprise/          # County-wide data
 *     site/                # Office-level data
 *
 *   L3/                    # Manufacturing Operations
 *     workflow/            # Workflow state changes
 *       {office}/          # Per-office workflows
 *         {workflowId}/
 *           state          # Current state
 *           transition     # State transitions
 *
 *   L2/                    # Control
 *     unit/                # Production unit status
 *       {unitId}/
 *         status           # PackML state
 *         oee              # OEE metrics
 *
 *   L1/                    # Sensing
 *     sensor/              # Raw sensor data
 *     event/               # System events
 *
 *   L0/                    # Physical
 *     equipment/           # Equipment status
 */

export const NACTopics = {
  // L4 - Enterprise
  ENTERPRISE_STATUS: 'L4/enterprise/status',
  SITE_STATUS: 'L4/site/+/status',

  // L3 - Operations
  WORKFLOW_STATE: 'L3/workflow/+/+/state',
  WORKFLOW_TRANSITION: 'L3/workflow/+/+/transition',
  WORK_ORDER: 'L3/workorder/+',

  // L2 - Control
  UNIT_STATUS: 'L2/unit/+/status',
  UNIT_OEE: 'L2/unit/+/oee',
  UNIT_COMMAND: 'L2/unit/+/command',

  // L1 - Sensing
  SENSOR_DATA: 'L1/sensor/+/data',
  EVENT: 'L1/event/+',

  // L0 - Physical
  EQUIPMENT_STATUS: 'L0/equipment/+/status',
};

export default NACMQTTClient;
