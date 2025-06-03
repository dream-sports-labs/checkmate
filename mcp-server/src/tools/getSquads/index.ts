import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetSquads(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-squads',
    'Retrieve list of squads for a project',
    {
      projectId: z.number().int().positive().describe('Project ID'),
    },
    async ({ projectId }) => {
      const qs = new URLSearchParams({ projectId: String(projectId) });
      const data = await makeRequest(`api/v1/project/squads?${qs.toString()}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve squads list' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 