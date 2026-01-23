/**
 * NAC OPC-UA Server
 * Industrial communication server for ISA-95 integration
 *
 * @module comm/opcua/server
 */

import { EventEmitter } from 'events';

/**
 * OPC-UA Server for NAC Digital Twin
 * Exposes county data as OPC-UA nodes
 */
export class NACOPCUAServer extends EventEmitter {
  constructor(options = {}) {
    super();
    this.port = options.port || 4840;
    this.serverName = options.serverName || 'NAC-OPCUA-Server';
    this.nodes = new Map();
    this.running = false;
    this.namespaceUri = 'urn:nac:digitalTwin';
    this.namespaceIndex = 2; // Custom namespace
  }

  /**
   * Start the OPC-UA server
   */
  async start() {
    this.running = true;
    this.initializeAddressSpace();
    this.emit('start', { port: this.port, serverName: this.serverName });
    console.log(`[OPC-UA] Server started on port ${this.port}`);
    return this;
  }

  /**
   * Stop the server
   */
  async stop() {
    this.running = false;
    this.emit('stop');
    console.log('[OPC-UA] Server stopped');
  }

  /**
   * Initialize the OPC-UA address space with NAC nodes
   */
  initializeAddressSpace() {
    // Root folder for NAC
    this.addFolder('NAC', 'Objects');

    // ISA-95 Level folders
    this.addFolder('L4_Enterprise', 'NAC');
    this.addFolder('L3_Operations', 'NAC');
    this.addFolder('L2_Control', 'NAC');
    this.addFolder('L1_Sensing', 'NAC');
    this.addFolder('L0_Physical', 'NAC');

    // L4 - Enterprise level
    this.addFolder('Sites', 'L4_Enterprise');
    this.addVariable('L4_Enterprise/Sites/CountyName', 'Northampton County', 'String');
    this.addVariable('L4_Enterprise/Sites/State', 'Pennsylvania', 'String');

    // L3 - Operations level (offices as work centers)
    const offices = [
      'Prothonotary', 'RegisterOfWills', 'Recorder', 'ClerkOfCourts',
      'Sheriff', 'Controller', 'Treasurer', 'Assessment', 'Elections'
    ];

    this.addFolder('WorkCenters', 'L3_Operations');
    offices.forEach(office => {
      this.addFolder(office, 'WorkCenters');
      this.addVariable(`L3_Operations/WorkCenters/${office}/Status`, 'Running', 'String');
      this.addVariable(`L3_Operations/WorkCenters/${office}/ActiveWorkOrders`, 0, 'Int32');
    });

    // L2 - Control level (production units)
    this.addFolder('ProductionUnits', 'L2_Control');
    offices.forEach(office => {
      this.addFolder(office, 'ProductionUnits');
      this.addVariable(`L2_Control/ProductionUnits/${office}/State`, 'Execute', 'String');
      this.addVariable(`L2_Control/ProductionUnits/${office}/OEE`, 0.85, 'Double');
      this.addVariable(`L2_Control/ProductionUnits/${office}/Availability`, 0.95, 'Double');
      this.addVariable(`L2_Control/ProductionUnits/${office}/Performance`, 0.90, 'Double');
      this.addVariable(`L2_Control/ProductionUnits/${office}/Quality`, 0.99, 'Double');
    });

    // L1 - Sensing level (events and metrics)
    this.addFolder('Events', 'L1_Sensing');
    this.addVariable('L1_Sensing/Events/LastEventTime', new Date().toISOString(), 'DateTime');
    this.addVariable('L1_Sensing/Events/EventCount', 0, 'Int32');

    // L0 - Physical level (equipment)
    this.addFolder('Equipment', 'L0_Physical');
    const equipmentTypes = ['Scanners', 'Printers', 'Workstations', 'Servers'];
    equipmentTypes.forEach(type => {
      this.addFolder(type, 'Equipment');
      this.addVariable(`L0_Physical/Equipment/${type}/Count`, 10, 'Int32');
      this.addVariable(`L0_Physical/Equipment/${type}/Online`, 9, 'Int32');
    });

    console.log(`[OPC-UA] Initialized ${this.nodes.size} nodes`);
  }

  /**
   * Add a folder node
   */
  addFolder(name, parentPath) {
    const path = parentPath === 'Objects' ? name : `${parentPath}/${name}`;
    const nodeId = `ns=${this.namespaceIndex};s=${path}`;

    this.nodes.set(path, {
      nodeId,
      nodeClass: 'Object',
      browseName: name,
      displayName: name,
      parentPath,
      children: [],
    });

    // Add to parent's children
    if (parentPath !== 'Objects') {
      const parent = this.nodes.get(parentPath);
      if (parent) parent.children.push(path);
    }

    return nodeId;
  }

  /**
   * Add a variable node
   */
  addVariable(path, value, dataType = 'String') {
    const parts = path.split('/');
    const name = parts.pop();
    const parentPath = parts.join('/');
    const nodeId = `ns=${this.namespaceIndex};s=${path}`;

    this.nodes.set(path, {
      nodeId,
      nodeClass: 'Variable',
      browseName: name,
      displayName: name,
      dataType,
      value,
      parentPath,
      accessLevel: 'ReadWrite',
      timestamp: new Date(),
    });

    // Add to parent's children
    const parent = this.nodes.get(parentPath);
    if (parent) parent.children.push(path);

    this.emit('nodeAdded', { nodeId, path, value, dataType });
    return nodeId;
  }

  /**
   * Read a variable value
   */
  readValue(path) {
    const node = this.nodes.get(path);
    if (!node || node.nodeClass !== 'Variable') {
      return { error: 'Node not found or not a variable' };
    }

    return {
      nodeId: node.nodeId,
      value: node.value,
      dataType: node.dataType,
      timestamp: node.timestamp,
      statusCode: 'Good',
    };
  }

  /**
   * Write a variable value
   */
  writeValue(path, value) {
    const node = this.nodes.get(path);
    if (!node || node.nodeClass !== 'Variable') {
      return { error: 'Node not found or not a variable' };
    }

    const oldValue = node.value;
    node.value = value;
    node.timestamp = new Date();

    this.emit('valueChanged', { path, oldValue, newValue: value });
    return { success: true, nodeId: node.nodeId };
  }

  /**
   * Browse nodes from a path
   */
  browse(path = 'NAC') {
    const node = this.nodes.get(path);
    if (!node) {
      return { error: 'Node not found' };
    }

    const children = (node.children || []).map(childPath => {
      const child = this.nodes.get(childPath);
      return {
        nodeId: child.nodeId,
        browseName: child.browseName,
        displayName: child.displayName,
        nodeClass: child.nodeClass,
        path: childPath,
      };
    });

    return {
      nodeId: node.nodeId,
      browseName: node.browseName,
      nodeClass: node.nodeClass,
      children,
    };
  }

  /**
   * Subscribe to value changes
   */
  createSubscription(paths, interval = 1000) {
    const subscriptionId = `sub_${Date.now()}`;

    const subscription = {
      id: subscriptionId,
      paths,
      interval,
      callback: null,
    };

    // Return subscription handle
    return {
      subscriptionId,
      setCallback: (callback) => {
        subscription.callback = callback;
      },
      unsubscribe: () => {
        // Cleanup
      },
    };
  }

  /**
   * Get all nodes as a tree
   */
  getAddressSpace() {
    const buildTree = (path) => {
      const node = this.nodes.get(path);
      if (!node) return null;

      const result = {
        nodeId: node.nodeId,
        browseName: node.browseName,
        nodeClass: node.nodeClass,
      };

      if (node.nodeClass === 'Variable') {
        result.value = node.value;
        result.dataType = node.dataType;
      }

      if (node.children && node.children.length > 0) {
        result.children = node.children.map(childPath => buildTree(childPath));
      }

      return result;
    };

    return buildTree('NAC');
  }

  /**
   * Get server info
   */
  getServerInfo() {
    return {
      serverName: this.serverName,
      port: this.port,
      namespaceUri: this.namespaceUri,
      running: this.running,
      nodeCount: this.nodes.size,
      buildInfo: {
        productName: 'NAC Digital Twin OPC-UA Server',
        manufacturerName: 'Northampton County',
        softwareVersion: '1.0.0',
      },
    };
  }
}

export default NACOPCUAServer;
