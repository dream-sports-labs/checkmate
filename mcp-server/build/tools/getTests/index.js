import { z } from 'zod';
export default function registerGetTests(server, makeRequest) {
    server.tool('get-tests', 'Get tests of a project (not tied to a run)', {
        projectId: z.number().int().positive().describe('Project ID'),
        page: z.number().int().positive().optional(),
        pageSize: z.number().int().positive().optional(),
        textSearch: z.string().optional(),
    }, async ({ projectId, page, pageSize, textSearch }) => {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        if (page)
            qs.set('page', String(page));
        if (pageSize)
            qs.set('pageSize', String(pageSize));
        if (textSearch)
            qs.set('textSearch', textSearch);
        const data = await makeRequest(`api/v1/project/tests?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve project tests' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
