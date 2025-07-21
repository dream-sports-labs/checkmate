import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetTestDetails(server: McpServer, makeRequest: <T>(path:string, init?:RequestInit)=>Promise<T|null>) {
  server.tool(
    'get-test-details',
    'Get details of a test',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      testId: z.number().int().positive().describe('Test ID'),
    },
    async ({ projectId, testId }) => {
      const qs = new URLSearchParams({ projectId: String(projectId), testId: String(testId) });
      const data = await makeRequest(`api/v1/test/details?${qs.toString()}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve test details' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
} 