import { z } from 'zod';
export default function registerGetRuns(server, makeRequest) {
    server.tool('get-runs', 'Get list of runs for a project', {
        projectId: z.number().int().positive().describe('Project ID'),
        page: z.number().int().positive().optional(),
        pageSize: z.number().int().positive().optional(),
        search: z.string().optional(),
        status: z.enum(['Active', 'Locked', 'Archived', 'Deleted']).optional(),
    }, async ({ projectId, page, pageSize, search, status }) => {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        if (page)
            qs.set('page', String(page));
        if (pageSize)
            qs.set('pageSize', String(pageSize));
        if (search)
            qs.set('search', search);
        if (status)
            qs.set('status', status);
        const data = await makeRequest(`api/v1/runs?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve runs data' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
