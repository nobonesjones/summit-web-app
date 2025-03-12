# Cursor MCP Configuration for Summit Web App

This directory contains configuration for the Model Context Protocol (MCP) integration with Supabase.

## What is MCP?

Model Context Protocol (MCP) allows AI tools like Cursor to connect directly to your database, providing context-aware assistance for your codebase.

## Supabase Connection

The `mcp.json` file configures Cursor to connect to your Supabase database using the Postgres MCP server. This allows the AI to:

- Understand your database schema
- Query data (read-only)
- Provide more accurate assistance with database-related code

## Usage

When using Cursor with this project:

1. Ensure you have Node.js and NPX installed
2. The MCP server will start automatically when you open the project in Cursor
3. You should see a green "active" status in Cursor's Settings/MCP section

## Security

The connection uses your Supabase service role key, which has full access to your database. This configuration is for development purposes only and should not be committed to public repositories.

For production environments, consider:
- Using a more restricted database role
- Setting up separate development/production configurations
- Using environment variables for sensitive connection details 