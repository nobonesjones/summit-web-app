#!/bin/bash

# Start the MCP server in the background
echo "Starting Supabase MCP server..."
nohup node scripts/supabase-mcp-server.js > logs/mcp-server.log 2>&1 &

# Save the process ID
echo $! > .mcp-server.pid

echo "MCP server started with PID $(cat .mcp-server.pid)"
echo "Logs are being written to logs/mcp-server.log"
echo "To stop the server, run: scripts/stop-mcp-server.sh" 