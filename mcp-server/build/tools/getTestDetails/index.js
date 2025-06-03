import { z } from 'zod';
export default function registerGetTestDetails(server, makeRequest) {
    server.tool('get-test-details', 'Get details of a test', {
        projectId: z.number().int().positive().describe('Project ID'),
        testId: z.number().int().positive().describe('Test ID'),
    }, async ({ projectId, testId }) => {
        const qs = new URLSearchParams({ projectId: String(projectId), testId: String(testId) });
        const data = await makeRequest(`api/v1/test/details?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve test details' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
