import { z } from 'zod';
export default function registerGetOrgDetails(server, makeRequest) {
    server.tool('get-org-details', 'Fetch organisation details by orgId', { orgId: z.number().int().positive().describe('Organisation ID') }, async ({ orgId }) => {
        const data = await makeRequest(`api/v1/org/detail?orgId=${orgId}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve organisation details' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
