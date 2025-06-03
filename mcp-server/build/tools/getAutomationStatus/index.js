import { z } from 'zod';
export default function registerGetAutomationStatus(server, makeRequest) {
    server.tool('get-automation-status', 'Get list of available automation statuses', { orgId: z.number().int().positive().describe('Organisation ID') }, async ({ orgId }) => {
        const data = await makeRequest(`api/v1/automation-status?orgId=${orgId}`);
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve automation status list' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
