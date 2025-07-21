import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetRunStateDetail(server: McpServer, makeRequest: <T>(path: string, init?: RequestInit)=>Promise<T|null>) {
  server.tool(
    'get-run-state-detail',
    'Get meta information / state summary for a run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().optional().describe('Project ID (optional)'),
      groupBy: z.enum(['squads']).optional().describe('Group by field (optional)'),
    },
    async ({ runId, projectId, groupBy }) => {
      const qs = new URLSearchParams({ runId: String(runId) });
      if (projectId) qs.set('projectId', String(projectId));
      if (groupBy) qs.set('groupBy', groupBy);

      const data = await makeRequest(`api/v1/run/state-detail?${qs.toString()}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve run state detail' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
} 