export default function registerGetUserDetails(server, makeRequest) {
    server.tool('get-user-details', 'Retrieve details of the authenticated user', {}, async () => {
        const data = await makeRequest('api/v1/user/details');
        if (!data) {
            return { content: [{ type: 'text', text: 'Failed to retrieve user details' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    });
}
