import { z } from 'zod';
export default function registerGetSquads(server, makeRequest) {
    server.tool('get-squads', 'Retrieve list of squads for a project', {
        projectId: z.number().int().positive().describe('Project ID'),
    }, async ({ projectId }) => {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        const data = await makeRequest(`api/v1/project/squads?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve squads list' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
