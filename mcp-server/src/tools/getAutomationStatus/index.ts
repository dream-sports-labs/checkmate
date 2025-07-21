import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetAutomationStatus(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-automation-status',
    'Get list of available automation statuses',
    { orgId: z.number().int().positive().describe('Organisation ID') },
    async ({ orgId }) => {
      const data = await makeRequest(`api/v1/automation-status?orgId=${orgId}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve automation status list' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 