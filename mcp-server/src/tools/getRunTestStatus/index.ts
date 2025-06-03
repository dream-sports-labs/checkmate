import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetRunTestStatus(server: McpServer, makeRequest: <T>(path:string, init?:RequestInit)=>Promise<T|null>) {
  server.tool(
    'get-run-test-status',
    'Get the status of a particular test in a run',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      runId: z.number().int().positive().describe('Run ID'),
      testId: z.number().int().positive().describe('Test ID'),
    },
    async ({ projectId, runId, testId }) => {
      const qs = new URLSearchParams({ projectId: String(projectId), runId: String(runId), testId: String(testId) });
      const data = await makeRequest(`api/v1/run/test-status?${qs.toString()}`);
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve run test status' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
} 