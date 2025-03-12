#!/usr/bin/env node

/**
 * This script tests the connection to Supabase using the MCP server
 * Run with: node scripts/test-mcp-connection.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the MCP configuration
try {
  const mcpConfigPath = path.join(__dirname, '..', '.cursor', 'mcp.json');
  const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  
  if (!mcpConfig.mcpServers || !mcpConfig.mcpServers.supabase) {
    console.error('❌ Error: No Supabase MCP configuration found in .cursor/mcp.json');
    process.exit(1);
  }
  
  const { command, args } = mcpConfig.mcpServers.supabase;
  
  console.log('🔄 Testing Supabase MCP connection...');
  console.log(`Command: ${command} ${args.join(' ')}`);
  
  // Start the MCP server
  const mcpServer = spawn(command, args);
  
  // Handle server output
  mcpServer.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Check for successful connection
    if (output.includes('Server started') || output.includes('listening')) {
      console.log('✅ MCP server started successfully!');
      console.log('🔌 Your Supabase connection is working.');
      console.log('🎉 You can now use Cursor with MCP to interact with your Supabase database.');
      
      // Kill the server after successful test
      setTimeout(() => {
        mcpServer.kill();
        process.exit(0);
      }, 2000);
    }
  });
  
  mcpServer.stderr.on('data', (data) => {
    console.error(`❌ Error: ${data.toString()}`);
  });
  
  mcpServer.on('error', (error) => {
    console.error(`❌ Failed to start MCP server: ${error.message}`);
    process.exit(1);
  });
  
  mcpServer.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ MCP server exited with code ${code}`);
      process.exit(code);
    }
  });
  
  // Set a timeout to kill the server if it doesn't connect
  setTimeout(() => {
    console.error('❌ Connection test timed out after 10 seconds');
    mcpServer.kill();
    process.exit(1);
  }, 10000);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
} 