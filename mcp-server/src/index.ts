#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import 'dotenv/config';
import fg from 'fast-glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


// Create server instance
const server = new McpServer({
  name: "checkmate-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Base URL for the Checkmate REST API. If not provided via env, default to local dev server.
const CHECKMATE_API_BASE = process.env.CHECKMATE_API_BASE;

// Auth token for private Checkmate API endpoints. Either set the env var CHECKMATE_API_TOKEN or hard-code the token here.
const CHECKMATE_API_TOKEN = process.env.CHECKMATE_API_TOKEN;

// Helper for making requests to Checkmate API endpoints
async function makeRequest<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = `${CHECKMATE_API_BASE}/${path}`.replace(/([^:]?)\/\/+/g, '$1/'); // ensure no double slashes except after protocol
  try {
    console.error('MCP › Fetch', url, CHECKMATE_API_TOKEN ? '[auth header set]' : '[no auth]');
    const response = await fetch(url, {
      ...init,
      // ensure GET unless otherwise specified
      method: init?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(CHECKMATE_API_TOKEN ? { Authorization: `Bearer ${CHECKMATE_API_TOKEN}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error('Error making Checkmate request:', error);
    return null;
  }
}

// ---------------------- TOOL DEFINITIONS ----------------------

// Dynamically import every tool module in src/tools/**/index.ts
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolFiles = await fg(path.join(__dirname, 'tools/**/index.@(js|ts)'));
for (const file of toolFiles) {
  const mod = await import(path.resolve(file));
  if (typeof mod.default === 'function') {
    mod.default(server, makeRequest);
  }
}

// ---------------------- START SERVER ----------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Checkmate MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

