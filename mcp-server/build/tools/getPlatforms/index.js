import { z } from 'zod';
export default function registerGetPlatforms(server, makeRequest) {
    server.tool('get-platforms', 'Retrieve list of platforms for an organisation', { orgId: z.number().int().positive().describe('Organisation ID') }, async ({ orgId }) => {
        const data = await makeRequest(`api/v1/platform?orgId=${orgId}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve platforms list' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
