import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerRunReset(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-reset',
    'Reset a run by marking all Passed tests as Retest (RunReset endpoint)',
    {
      runId: z.number().int().positive().describe('Run ID'),
    },
    async ({ runId }) => {
      const body = { runId };
      const data = await makeRequest('api/v1/run/reset', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to reset run' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 