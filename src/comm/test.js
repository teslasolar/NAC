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

  console.log('\n--- Test 8: Get Budget ---');
  const budget = await client.callTool('get_budget', { summary: true });
  console.log('FY2026 Budget:', JSON.stringify(budget.result, null, 2));

  console.log('\n--- Test 9: Get Department Budget ---');
  const deptBudget = await client.callTool('get_department_budget', { department: 'corrections' });
  console.log('Corrections Budget:', JSON.stringify(deptBudget.result, null, 2));

  console.log('\n--- Test 10: Search Audits (New v2.0) ---');
  const audits = await client.callTool('search_audits', { category: 'controller', limit: 3 });
  console.log('Controller Audits:', JSON.stringify(audits.result, null, 2));

  console.log('\n--- Test 11: Get Audit Categories ---');
  const categories = await client.callTool('get_audit_categories', { includeStats: true });
  console.log('Audit Categories:', JSON.stringify(categories.result.categories.map(c => ({ id: c.id, name: c.name, stats: c.stats })), null, 2));

  console.log('\n--- Test 12: Get Audit Detail ---');
  const auditDetail = await client.callTool('get_audit_detail', { auditId: 'CTRL-2024-007' });
  console.log('ACL Audit Detail:', JSON.stringify(auditDetail.result, null, 2));

  console.log('\n--- Test 13: Get Audit Findings ---');
  const findings = await client.callTool('get_audit_findings', { category: 'vfra' });
  console.log('VFRA Findings:', JSON.stringify(findings.result.analysis, null, 2));

  console.log('\n--- Test 14: Get Audit Statistics ---');
  const auditStats = await client.callTool('get_audit_statistics', {});
  console.log('Audit Statistics:', JSON.stringify(auditStats.result.summary, null, 2));

  console.log('\n--- Test 15: Get Debt Info ---');
  const debt = await client.callTool('get_debt_info', { detail: 'summary' });
  console.log('County Debt Summary:', JSON.stringify(debt.result, null, 2));

  console.log('\n--- Test 16: Get Tax Rate ---');
  const tax = await client.callTool('get_tax_rate', { type: 'property', municipality: 'Bethlehem' });
  console.log('Property Tax Info:', JSON.stringify(tax.result, null, 2));

  console.log('\n--- Test 17: Search Parcels ---');
  const parcels = await client.callTool('search_parcels', { municipality: 'Bethlehem', limit: 2 });
  console.log('Bethlehem Parcels:', JSON.stringify(parcels.result, null, 2));

  console.log('\n--- Test 18: Get Zoning Info ---');
  const zoning = await client.callTool('get_zoning_info', { district: 'R2' });
  console.log('R2 Zoning:', JSON.stringify(zoning.result, null, 2));

  console.log('\n--- Test 19: Server Status ---');
  const status = server.getStatus();
  console.log('Server status:', {
    running: status.running,
    mqttClients: status.mqtt.clients,
    opcuaNodes: status.opcua.nodeCount,
    toolCount: status.tools.length,
  });
  console.log(`\nAll ${status.tools.length} tools: ${status.tools.join(', ')}`);

  // Cleanup
  client.disconnect();
  await server.stop();

  console.log('\n=== All Tests Passed ===');
}

test().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
