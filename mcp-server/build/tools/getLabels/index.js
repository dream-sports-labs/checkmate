import { z } from 'zod';
export default function registerGetLabels(server, makeRequest) {
    server.tool('get-labels', 'Retrieve list of labels for a project', { projectId: z.number().int().positive().describe('Project ID') }, async ({ projectId }) => {
        const data = await makeRequest(`api/v1/labels?projectId=${projectId}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve labels list' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
