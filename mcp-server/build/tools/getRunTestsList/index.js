import { z } from 'zod';
export default function registerGetRunTestsList(server, makeRequest) {
    server.tool('get-run-tests-list', 'Get list of tests inside a run', {
        projectId: z.number().int().positive().describe('Project ID'),
        runId: z.number().int().positive().describe('Run ID'),
        page: z.number().int().positive().optional(),
        pageSize: z.number().int().positive().optional(),
        textSearch: z.string().optional(),
    }, async ({ projectId, runId, page, pageSize, textSearch }) => {
        const qs = new URLSearchParams({ projectId: String(projectId), runId: String(runId) });
        if (page)
            qs.set('page', String(page));
        if (pageSize)
            qs.set('pageSize', String(pageSize));
        if (textSearch)
            qs.set('textSearch', textSearch);
        const data = await makeRequest(`api/v1/run/tests?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve run tests list' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
