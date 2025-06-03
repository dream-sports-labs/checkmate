import { z } from 'zod';
export default function registerGetProjects(server, makeRequest) {
    server.tool('get-projects', 'Retrieve paginated list of projects for an organisation', {
        orgId: z.number().int().positive().describe('Organisation ID'),
        page: z.number().int().positive().optional().describe('Page number (default 1)'),
        pageSize: z.number().int().positive().optional().describe('Page size (default 100)'),
        textSearch: z.string().optional().describe('Text search filter'),
        projectDescription: z.string().optional().describe('Project description filter'),
    }, async ({ orgId, page, pageSize, textSearch, projectDescription }) => {
        const qs = new URLSearchParams({ orgId: String(orgId) });
        if (page)
            qs.set('page', String(page));
        if (pageSize)
            qs.set('pageSize', String(pageSize));
        if (textSearch)
            qs.set('textSearch', textSearch);
        if (projectDescription)
            qs.set('projectDescription', projectDescription);
        const data = await makeRequest(`api/v1/projects?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve projects list' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
