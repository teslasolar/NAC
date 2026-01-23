/**
 * NAC MQTT Broker
 * Simple in-process MQTT broker for development/testing
 *
 * @module comm/mqtt/broker
 */

import { EventEmitter } from 'events';

/**
 * Simple MQTT Broker for NAC
 * Handles message routing between clients
 */
export class NACMQTTBroker extends EventEmitter {
  constructor(options = {}) {
    super();
    this.port = options.port || 1883;
    this.clients = new Map();
    this.subscriptions = new Map(); // topic pattern -> Set of clientIds
    this.retainedMessages = new Map(); // topic -> last retained message
    this.running = false;
  }

  /**
   * Start the broker
   */
  async start() {
    this.running = true;
    this.emit('start', { port: this.port });
    console.log(`[MQTT Broker] Started on port ${this.port}`);
    return this;
  }

  /**
   * Stop the broker
   */
  async stop() {
    this.running = false;
    this.clients.clear();
    this.subscriptions.clear();
    this.emit('stop');
    console.log('[MQTT Broker] Stopped');
  }

  /**
   * Register a client connection
   */
  registerClient(clientId, client) {
    this.clients.set(clientId, client);
    this.emit('clientConnected', { clientId });
    console.log(`[MQTT Broker] Client connected: ${clientId}`);

    // Send retained messages for client's subscriptions
    this.sendRetainedMessages(clientId);
  }

  /**
   * Unregister a client
   */
  unregisterClient(clientId) {
    this.clients.delete(clientId);

    // Remove from all subscriptions
    for (const [topic, clients] of this.subscriptions) {
      clients.delete(clientId);
      if (clients.size === 0) this.subscriptions.delete(topic);
    }

    this.emit('clientDisconnected', { clientId });
    console.log(`[MQTT Broker] Client disconnected: ${clientId}`);
  }

  /**
   * Handle subscription request
   */
  subscribe(clientId, topicPattern) {
    if (!this.subscriptions.has(topicPattern)) {
      this.subscriptions.set(topicPattern, new Set());
    }
    this.subscriptions.get(topicPattern).add(clientId);

    this.emit('subscribe', { clientId, topic: topicPattern });
    console.log(`[MQTT Broker] ${clientId} subscribed to ${topicPattern}`);

    // Send retained messages matching this pattern
    for (const [topic, message] of this.retainedMessages) {
      if (this.topicMatches(topicPattern, topic)) {
        this.deliverToClient(clientId, topic, message);
      }
    }
  }

  /**
   * Handle unsubscription
   */
  unsubscribe(clientId, topicPattern) {
    const clients = this.subscriptions.get(topicPattern);
    if (clients) {
      clients.delete(clientId);
      if (clients.size === 0) this.subscriptions.delete(topicPattern);
    }
  }

  /**
   * Handle publish request
   */
  publish(clientId, topic, message, options = {}) {
    const { qos = 0, retain = false } = options;

    // Store retained message
    if (retain) {
      if (message) {
        this.retainedMessages.set(topic, message);
      } else {
        this.retainedMessages.delete(topic);
      }
    }

    // Route to matching subscribers
    for (const [pattern, clients] of this.subscriptions) {
      if (this.topicMatches(pattern, topic)) {
        for (const subscriberId of clients) {
          if (subscriberId !== clientId || options.loopback) {
            this.deliverToClient(subscriberId, topic, message, { qos });
          }
        }
      }
    }

    this.emit('publish', { clientId, topic, message, qos, retain });
  }

  /**
   * Deliver message to a specific client
   */
  deliverToClient(clientId, topic, message, options = {}) {
    const client = this.clients.get(clientId);
    if (client && typeof client.onMessage === 'function') {
      try {
        client.onMessage(topic, message, options);
      } catch (err) {
        this.emit('error', { clientId, error: err });
      }
    }
  }

  /**
   * Send retained messages to newly subscribed client
   */
  sendRetainedMessages(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Find all subscriptions for this client
    for (const [pattern, clients] of this.subscriptions) {
      if (clients.has(clientId)) {
        for (const [topic, message] of this.retainedMessages) {
          if (this.topicMatches(pattern, topic)) {
            this.deliverToClient(clientId, topic, message, { retained: true });
          }
        }
      }
    }
  }

  /**
   * Check if topic matches pattern (MQTT wildcards)
   */
  topicMatches(pattern, topic) {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') return true;
      if (patternParts[i] === '+') continue;
      if (i >= topicParts.length) return false;
      if (patternParts[i] !== topicParts[i]) return false;
    }

    return patternParts.length === topicParts.length;
  }

  /**
   * Get broker stats
   */
  getStats() {
    return {
      clients: this.clients.size,
      subscriptions: this.subscriptions.size,
      retainedMessages: this.retainedMessages.size,
      running: this.running,
    };
  }
}

export default NACMQTTBroker;
