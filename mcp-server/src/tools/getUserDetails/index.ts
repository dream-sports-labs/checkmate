import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetUserDetails(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-user-details',
    'Retrieve details of the authenticated user',
    {},
    async () => {
      const data = await makeRequest('api/v1/user/details');
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve user details' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 