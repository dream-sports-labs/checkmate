import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetTestStatusHistory(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-test-status-history',
    'Retrieve status history for a test (across runs)',
    { testId: z.number().int().positive().describe('Test ID') },
    async ({ testId }) => {
      const data = await makeRequest(`api/v1/test/test-status-history?testId=${testId}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve test status history' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 