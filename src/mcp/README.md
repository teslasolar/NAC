# NAC MCP Server

Model Context Protocol (MCP) server for the Northampton County Digital Twin.

## Overview

This MCP server exposes NAC data through standardized tools that can be called by LLMs (like Claude). Each tool is a separate file (UDT pattern) for easy maintenance and extension.

## Tools

| Tool | Description |
|------|-------------|
| `get_officers` | Get current county officers and officials |
| `get_municipality` | Query municipality data (population, compliance) |
| `get_fee_schedule` | Look up fee schedules per PA statutes |
| `get_oee_benchmark` | Get OEE targets for each office |
| `search_pa_code` | Search PA Consolidated Statutes references |
| `get_workflow` | Get workflow state machines and SLAs |
| `get_assembly_line` | Get production line configs per office |
| `query_county_data` | Links to public county data sources |

## Installation

```bash
cd src/mcp
npm install
```

## Usage

### With Claude Code

Add to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "nac": {
      "command": "node",
      "args": ["src/mcp/server.js"],
      "cwd": "/path/to/NAC"
    }
  }
}
```

### Standalone

```bash
node server.js
```

## Adding New Tools

1. Create a new file in `tools/` (e.g., `tools/my-tool.js`)
2. Export a tool object with `name`, `description`, `inputSchema`, and `execute`
3. Import and add to the `tools` array in `server.js`

Example tool structure:

```javascript
export const myTool = {
  name: 'my_tool',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Parameter description' }
    },
    required: ['param1']
  },
  async execute(args) {
    const { param1 } = args;
    // Tool logic here
    return { result: 'data' };
  }
};
```

## Data Sources

Tools read from:
- `docs/tags/` - JSON tag files (officers, municipalities, fees, etc.)
- Public APIs - Links to county data portals

## License

MIT
