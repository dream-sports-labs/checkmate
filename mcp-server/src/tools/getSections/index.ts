import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetSections(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-sections',
    'Retrieve list of sections for a project (optionally scoped to a run)',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      runId: z.number().int().positive().optional().describe('Run ID (optional)'),
    },
    async ({ projectId, runId }) => {
      const qs = new URLSearchParams({ projectId: String(projectId) });
      if (runId) qs.set('runId', String(runId));

      const data = await makeRequest(`api/v1/project/sections?${qs.toString()}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve sections list' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 