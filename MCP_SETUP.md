# Supabase MCP Setup for Summit Web App

This document explains how to use the Model Context Protocol (MCP) with Supabase in the Summit Web App project.

## What is MCP?

Model Context Protocol (MCP) allows AI tools like Cursor and Claude to connect directly to your database, providing context-aware assistance for your codebase. This enables the AI to understand your database schema, query data, and provide more accurate assistance with database-related code.

## Setup Instructions

The project is already configured to use MCP with Supabase. Here's what you need to know:

### Configuration Files

- `.cursor/mcp.json`: Contains the MCP server configuration for Cursor
- `.cursor/README.md`: Documentation for the MCP setup

### Running the MCP Server

We've created a custom MCP server that connects to Supabase. To use it:

1. **Start the server**:
   ```bash
   ./scripts/start-mcp-server.sh
   ```
   This will start the MCP server in the background and save the logs to `logs/mcp-server.log`.

2. **Stop the server**:
   ```bash
   ./scripts/stop-mcp-server.sh
   ```
   This will stop the running MCP server.

3. **Check the logs**:
   ```bash
   tail -f logs/mcp-server.log
   ```
   This will show you the real-time logs from the MCP server.

### Testing the Connection

To test if your MCP connection to Supabase is working:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"schema"}' http://localhost:3100
```

This should return a list of tables in your Supabase database.

### Using with Cursor

When using Cursor with this project:

1. Start the MCP server using the script above
2. Open the project in Cursor
3. Navigate to Settings/MCP
4. You should see a green "active" status for the Supabase MCP server
5. If not, try restarting Cursor or checking the connection with the test command

### Using with Claude Desktop

To use with Claude Desktop:

1. Open Claude Desktop and navigate to Settings
2. Under the Developer tab, tap Edit Config
3. Add the following configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["scripts/supabase-mcp-server.js"]
    }
  }
}
```

4. Save the configuration file and restart Claude Desktop
5. From the new chat screen, you should see a hammer (MCP) icon with the Supabase server available

## Security Considerations

The MCP configuration contains sensitive database credentials. To protect these:

1. The `.cursor/mcp.json` file is added to `.gitignore` to prevent accidental commits
2. For production environments, consider using a more restricted database role
3. Never share your MCP configuration files publicly

## Troubleshooting

If you encounter issues with the MCP connection:

1. Check if the MCP server is running:
   ```bash
   ps aux | grep supabase-mcp-server.js
   ```

2. Check the MCP server logs:
   ```bash
   tail -f logs/mcp-server.log
   ```

3. Try stopping and restarting the server:
   ```bash
   ./scripts/stop-mcp-server.sh
   ./scripts/start-mcp-server.sh
   ```

4. Verify that your Supabase instance is running and accessible
5. Ensure you have Node.js installed
6. Check Cursor's logs for any error messages related to MCP

## Additional Resources

- [Model Context Protocol Documentation](https://github.com/modelcontextprotocol/mcp)
- [Supabase Documentation](https://supabase.com/docs)
- [Postgres MCP Server](https://github.com/modelcontextprotocol/server-postgres) 