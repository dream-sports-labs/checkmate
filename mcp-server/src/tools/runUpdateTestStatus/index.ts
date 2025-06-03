import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const TestStatusObject = z.object({
  testId: z.number().int().positive().optional().describe('Test ID'),
  status: z.string().optional().describe('New status'),
  comment: z.string().optional().describe('Comment for this test'),
});

export default function registerRunUpdateTestStatus(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-update-test-status',
    'Update status for one or more tests inside a run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      testIdStatusArray: z
        .array(TestStatusObject)
        .nonempty()
        .describe('Array of objects mapping testId to new status'),
      projectId: z.number().int().positive().optional().describe('Project ID (optional)'),
      comment: z.string().optional().describe('Overall comment (optional)'),
    },
    async ({ runId, testIdStatusArray, projectId, comment }) => {
      const body: any = { runId, testIdStatusArray };
      if (projectId) body.projectId = projectId;
      if (comment) body.comment = comment;

      const data = await makeRequest('api/v1/run/update-test-status', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to update test status(es)' }] };
      }

      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 