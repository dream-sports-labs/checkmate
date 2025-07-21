import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerRunLock(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-lock',
    'Lock a run (sets its status from Active to Locked)',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().describe('Project ID'),
    },
    async ({ runId, projectId }) => {
      const body = { runId, projectId };
      const data = await makeRequest('api/v1/run/lock', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to lock the run' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 