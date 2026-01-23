/**
 * NAC Communication Protocols
 *
 * Unified exports for all communication protocols:
 * - MQTT: Pub/sub messaging
 * - OPC-UA: Industrial communication
 * - MQMCP: Combined MQTT + MCP protocol
 *
 * @module comm
 */

// MQTT
export { NACMQTTClient, NACMQTTBroker, NACTopics } from './mqtt/index.js';

// OPC-UA
export { NACOPCUAServer } from './opcua/index.js';

// MQMCP - Combined Protocol
export { MQMCP, MQMCPClient, MQMCPServer } from './mqmcp/index.js';
