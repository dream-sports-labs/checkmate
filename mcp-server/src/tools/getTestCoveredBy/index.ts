import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetTestCoveredBy(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-test-covered-by',
    'Retrieve the mapping of tests covered by other tests for an organisation',
    { orgId: z.number().int().positive().describe('Organisation ID') },
    async ({ orgId }) => {
      const data = await makeRequest(`api/v1/test-covered-by?orgId=${orgId}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve test covered-by data' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 