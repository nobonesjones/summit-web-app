#!/bin/bash

# Check if the PID file exists
if [ -f .mcp-server.pid ]; then
  PID=$(cat .mcp-server.pid)
  
  # Check if the process is still running
  if ps -p $PID > /dev/null; then
    echo "Stopping MCP server with PID $PID..."
    kill $PID
    echo "MCP server stopped."
  else
    echo "MCP server is not running (PID $PID not found)."
  fi
  
  # Remove the PID file
  rm .mcp-server.pid
else
  echo "MCP server PID file not found. Server may not be running."
  
  # Try to find and kill any running MCP server processes
  PIDS=$(pgrep -f "node scripts/supabase-mcp-server.js")
  if [ -n "$PIDS" ]; then
    echo "Found running MCP server processes: $PIDS"
    echo "Stopping all MCP server processes..."
    pkill -f "node scripts/supabase-mcp-server.js"
    echo "All MCP server processes stopped."
  fi
fi 