import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetRunDetail(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-run-detail',
    'Fetch detailed information of a run (basic run info)',
    {
      runId: z.number().int().positive().describe('Run ID'),
    },
    async ({ runId }) => {
      const qs = new URLSearchParams({ runId: String(runId) });
      const data = await makeRequest(`api/v1/run/detail?${qs.toString()}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve run detail' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 