# NAC Communication Protocols

Industrial communication protocols for the NAC Digital Twin.

## Protocols

### MQTT

Pub/sub messaging for real-time data distribution across ISA-95 levels.

```javascript
import { NACMQTTClient, NACMQTTBroker } from './mqtt/index.js';

// Start broker
const broker = new NACMQTTBroker({ port: 1883 });
await broker.start();

// Connect client
const client = new NACMQTTClient({ broker: 'mqtt://localhost:1883' });
await client.connect();

// Subscribe to workflow state changes
client.subscribe('L3/workflow/+/+/state', (msg, meta) => {
  console.log(`State change on ${meta.topic}:`, msg);
});

// Publish OEE update
client.publish('L2/unit/prothonotary/oee', { value: 0.87 });
```

### OPC-UA

Industrial communication server exposing NAC data as an OPC-UA address space.

```javascript
import { NACOPCUAServer } from './opcua/index.js';

const server = new NACOPCUAServer({ port: 4840 });
await server.start();

// Browse nodes
console.log(server.browse('NAC'));

// Read value
console.log(server.readValue('L2_Control/ProductionUnits/Prothonotary/OEE'));

// Write value
server.writeValue('L2_Control/ProductionUnits/Prothonotary/OEE', 0.92);
```

### MQMCP (MQTT + MCP Protocol)

Combined protocol that merges MQTT pub/sub with MCP tool-calling.

```javascript
import { MQMCPServer } from './mqmcp/index.js';

// Start the combined server
const server = new MQMCPServer({
  mqttPort: 1883,
  opcuaPort: 4840,
});
await server.start();

// Create a client
const client = server.createClient();

// Call MCP tools via MQTT
const officers = await client.callTool('get_officers', { position: 'Prothonotary' });
console.log(officers);

// List available tools
const tools = await client.listTools();
console.log(tools);

// Subscribe to real-time updates
client.subscribe('L2/unit/+/oee', (msg) => {
  console.log('OEE Update:', msg);
});
```

## Topic Structure

NAC uses an ISA-95 aligned topic structure:

```
nac/
├── L4/                     # Business Planning & Logistics
│   ├── enterprise/         # County-wide data
│   └── site/               # Office-level data
│
├── L3/                     # Manufacturing Operations
│   ├── workflow/           # Workflow state changes
│   │   └── {office}/{id}/
│   │       ├── state       # Current state
│   │       └── transition  # State transitions
│   └── workorder/          # Work order updates
│
├── L2/                     # Control
│   └── unit/               # Production unit status
│       └── {unitId}/
│           ├── status      # PackML state
│           ├── oee         # OEE metrics
│           └── command     # Control commands
│
├── L1/                     # Sensing
│   ├── sensor/             # Raw sensor data
│   └── event/              # System events
│
└── L0/                     # Physical
    └── equipment/          # Equipment status

mqmcp/                      # MQMCP Protocol
├── tools/
│   ├── call/{toolName}     # Tool invocation
│   ├── response/{toolName} # Tool response
│   ├── list                # List tools
│   └── schema/{toolName}   # Get tool schema
├── stream/                 # Streaming data
└── error/                  # Error messages
```

## Integration

### With Claude Code

Configure MQMCP as an MCP server in Claude Code:

```json
{
  "mcpServers": {
    "nac-mqmcp": {
      "command": "node",
      "args": ["src/comm/mqmcp/server.js"],
      "cwd": "/path/to/NAC"
    }
  }
}
```

### With External MQTT Clients

Connect any MQTT client to the broker:

```bash
# Using mosquitto_pub/sub
mosquitto_sub -h localhost -t 'nac/L2/unit/+/oee'
mosquitto_pub -h localhost -t 'nac/L2/unit/prothonotary/status' -m '{"state":"Execute"}'
```

### With OPC-UA Clients

Connect with any OPC-UA client:

- Endpoint: `opc.tcp://localhost:4840`
- Namespace: `urn:nac:digitalTwin`

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MQMCP Server                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ MQTT Broker  │  │   MCP Tools  │  │ OPC-UA Server│       │
│  │  (pub/sub)   │◄─►│  (call/resp) │◄─►│  (address    │       │
│  │              │  │              │  │   space)     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                 │               │
│         └────────────────┴────────────────┘               │
│                          │                                   │
│                   ┌──────┴──────┐                           │
│                   │  MQMCP API  │                           │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
   │  LLMs   │      │  SCADA  │      │   Web   │
   │ (Claude)│      │ Systems │      │  Apps   │
   └─────────┘      └─────────┘      └─────────┘
```

## License

MIT
