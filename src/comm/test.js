#!/usr/bin/env node
/**
 * MQMCP Protocol Test
 */

import { MQMCPServer } from './mqmcp/index.js';

async function test() {
  console.log('=== MQMCP Protocol Test ===\n');

  // Start server
  const server = new MQMCPServer();
  await server.start();

  // Create client
  const client = server.createClient({ clientId: 'test-client' });

  console.log('\n--- Test 1: List Tools ---');
  const toolList = await client.listTools();
  console.log(`Available tools (${toolList.tools.length}):`);
  toolList.tools.forEach(t => console.log(`  - ${t.name}: ${t.description.slice(0, 50)}...`));

  console.log('\n--- Test 2: Call get_officers ---');
  const officers = await client.callTool('get_officers', {});
  console.log('Officers result:', JSON.stringify(officers.result, null, 2).slice(0, 500) + '...');

  console.log('\n--- Test 3: Call get_municipality ---');
  const muni = await client.callTool('get_municipality', { name: 'Bethlehem' });
  console.log('Municipality result:', JSON.stringify(muni.result, null, 2));

  console.log('\n--- Test 4: OPC-UA Browse ---');
  const browse = await client.callTool('opcua_browse', { path: 'NAC' });
  console.log('OPC-UA Root children:', browse.result.children.map(c => c.browseName));

  console.log('\n--- Test 5: OPC-UA Read ---');
  const read = await client.callTool('opcua_read', {
    path: 'L2_Control/ProductionUnits/Prothonotary/OEE'
  });
  console.log('OEE Value:', read.result);

  console.log('\n--- Test 6: OPC-UA Write & Read ---');
  await client.callTool('opcua_write', {
    path: 'L2_Control/ProductionUnits/Prothonotary/OEE',
    value: 0.92
  });
  const readAfter = await client.callTool('opcua_read', {
    path: 'L2_Control/ProductionUnits/Prothonotary/OEE'
  });
  console.log('OEE after write:', readAfter.result.value);

  console.log('\n--- Test 7: Get OEE Benchmark ---');
  const oee = await client.callTool('get_oee_benchmark', { office: 'prothonotary' });
  console.log('OEE Benchmark:', JSON.stringify(oee.result, null, 2));

  console.log('\n--- Test 8: Server Status ---');
  const status = server.getStatus();
  console.log('Server status:', {
    running: status.running,
    mqttClients: status.mqtt.clients,
    opcuaNodes: status.opcua.nodeCount,
    toolCount: status.tools.length,
  });

  // Cleanup
  client.disconnect();
  await server.stop();

  console.log('\n=== All Tests Passed ===');
}

test().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
