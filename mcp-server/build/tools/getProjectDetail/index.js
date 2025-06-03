import { z } from 'zod';
export default function registerGetProjectDetail(server, makeRequest) {
    server.tool('get-project-detail', 'Fetch detailed information of a project', { projectId: z.number().int().positive().describe('Project ID') }, async ({ projectId }) => {
        const data = await makeRequest(`api/v1/project/detail?projectId=${projectId}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve project detail' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
