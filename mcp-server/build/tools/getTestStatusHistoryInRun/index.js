import { z } from 'zod';
export default function registerGetTestStatusHistoryInRun(server, makeRequest) {
    server.tool('get-test-status-history-in-run', 'Retrieve status history for a test within a specific run', {
        runId: z.number().int().positive().describe('Run ID'),
        testId: z.number().int().positive().describe('Test ID'),
    }, async ({ runId, testId }) => {
        const qs = new URLSearchParams({ runId: String(runId), testId: String(testId) });
        const data = await makeRequest(`api/v1/run/test-status-history?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve test status history in run' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
