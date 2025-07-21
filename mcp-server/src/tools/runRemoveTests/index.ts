import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerRunRemoveTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-remove-tests',
    'Remove one or more tests from a run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().describe('Project ID'),
      testIds: z.array(z.number().int().positive()).nonempty().describe('Array of Test IDs to remove'),
    },
    async ({ runId, projectId, testIds }) => {
      const body = { runId, projectId, testIds };
      const data = await makeRequest('api/v1/run/remove-tests', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to remove tests from run' }] };
      }

      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 