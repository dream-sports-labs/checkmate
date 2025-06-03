import { z } from 'zod';
export default function registerGetTestsCount(server, makeRequest) {
    server.tool('get-tests-count', 'Retrieve the count of tests in a project with optional filters', {
        projectId: z.number().int().positive().describe('Project ID'),
        platformIds: z.array(z.number().int().positive()).optional().describe('Platform IDs'),
        squadIds: z.array(z.number().int().positive()).optional().describe('Squad IDs'),
        labelIds: z.array(z.number().int().positive()).optional().describe('Label IDs'),
        filterType: z.enum(['and', 'or']).optional().describe('Filter type'),
        includeTestIds: z.boolean().optional().describe('Include test IDs in response'),
    }, async ({ projectId, platformIds, squadIds, labelIds, filterType, includeTestIds }) => {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        if (platformIds)
            qs.set('platformIds', JSON.stringify(platformIds));
        if (squadIds)
            qs.set('squadIds', JSON.stringify(squadIds));
        if (labelIds)
            qs.set('labelIds', JSON.stringify(labelIds));
        if (filterType)
            qs.set('filterType', filterType);
        if (includeTestIds !== undefined)
            qs.set('includeTestIds', String(includeTestIds));
        const data = await makeRequest(`api/v1/project/tests-count?${qs.toString()}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve tests count' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
