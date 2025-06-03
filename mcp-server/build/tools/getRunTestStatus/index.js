import { z } from 'zod';
export default function registerGetRunTestStatus(server, makeRequest) {
    server.tool('get-run-test-status', 'Get the status of a particular test in a run', {
        projectId: z.number().int().positive().describe('Project ID'),
        runId: z.number().int().positive().describe('Run ID'),
        testId: z.number().int().positive().describe('Test ID'),
    }, async ({ projectId, runId, testId }) => {
        const qs = new URLSearchParams({ projectId: String(projectId), runId: String(runId), testId: String(testId) });
        const data = await makeRequest(`api/v1/run/test-status?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve run test status' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
