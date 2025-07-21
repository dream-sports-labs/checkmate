import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerGetOrgsList(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-orgs-list',
    'Retrieve list of organisations',
    {},
    async () => {
      const data = await makeRequest('api/v1/orgs');
      if (!data) {
        return { content: [{ type: 'text', text: 'Failed to retrieve organisations list' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
} 