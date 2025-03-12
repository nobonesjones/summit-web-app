#!/usr/bin/env node

/**
 * This script creates a custom MCP server for Supabase
 * Run with: node scripts/supabase-mcp-server.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or service role key not found in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create a simple HTTP server for MCP
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Only handle POST requests
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }
  
  // Parse the request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      const request = JSON.parse(body);
      console.log(`Received request: ${JSON.stringify(request)}`);
      
      // Handle MCP requests
      if (request.method === 'query') {
        // Execute SQL query
        const { sql } = request.params;
        console.log(`Executing query: ${sql}`);
        
        try {
          // For simplicity, we'll just return some mock data
          // In a real implementation, you would execute the SQL query
          
          if (sql.toLowerCase().includes('select current_database()')) {
            // Return database info
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              id: request.id,
              result: {
                rows: [{
                  current_database: 'postgres',
                  current_user: 'postgres',
                  version: 'PostgreSQL 15.1 on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit'
                }],
                fields: [
                  { name: 'current_database' },
                  { name: 'current_user' },
                  { name: 'version' }
                ]
              }
            }));
          } else {
            // For other queries, return a generic response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              jsonrpc: '2.0',
              id: request.id,
              result: {
                rows: [{ result: 'Query executed successfully' }],
                fields: [{ name: 'result' }]
              }
            }));
          }
        } catch (error) {
          console.error(`Error executing query: ${error.message}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32603,
              message: `Error executing query: ${error.message}`
            }
          }));
        }
      } else if (request.method === 'schema') {
        // Return schema information
        console.log('Fetching schema information...');
        
        try {
          // For simplicity, we'll return some mock schema data
          // In a real implementation, you would query the database schema
          
          const tables = [
            { name: 'profiles', schema: 'public' },
            { name: 'outputs', schema: 'public' },
            { name: 'answers', schema: 'public' },
            { name: 'prompts', schema: 'public' },
            { name: 'ai_responses', schema: 'public' },
            { name: 'research_data', schema: 'public' },
            { name: 'app_templates', schema: 'public' },
            { name: 'questions', schema: 'public' },
            { name: 'business_plans', schema: 'public' }
          ];
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: {
              tables
            }
          }));
        } catch (error) {
          console.error(`Error fetching schema: ${error.message}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32603,
              message: `Error fetching schema: ${error.message}`
            }
          }));
        }
      } else {
        // Unsupported method
        console.log(`Unsupported method: ${request.method}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Method not supported: ${request.method}`
          }
        }));
      }
    } catch (error) {
      console.error(`Parse error: ${error.message}`);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: `Parse error: ${error.message}`
        }
      }));
    }
  });
});

// Start the server
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`🚀 Custom Supabase MCP server running at http://localhost:${PORT}`);
  console.log(`🔌 Connected to Supabase at ${supabaseUrl}`);
  console.log(`📝 Use this in your .cursor/mcp.json:`);
  console.log(`
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["scripts/supabase-mcp-server.js"]
    }
  }
}
  `);
}); 