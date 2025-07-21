import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetType(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-type',
    'Retrieve list of types for an organisation',
    { orgId: z.number().int().positive().describe('Organisation ID') },
    async ({ orgId }) => {
      const data = await makeRequest(`api/v1/type?orgId=${orgId}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve type list' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 