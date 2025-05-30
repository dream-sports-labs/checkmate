#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import 'dotenv/config';
// Create server instance
const server = new McpServer({
    name: "checkmate-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Base URL for the Checkmate REST API. If not provided via env, default to local dev server.
const CHECKMATE_API_BASE = process.env.CHECKMATE_API_BASE ?? "http://localhost:3000";
// Auth token for private Checkmate API endpoints. Either set the env var CHECKMATE_API_TOKEN or hard-code the token here.
const CHECKMATE_API_TOKEN = process.env.CHECKMATE_API_TOKEN ?? "93b5ac5f2ce2464f";
// Helper for making requests to Checkmate API endpoints
async function makeRequest(path, init) {
    const url = `${CHECKMATE_API_BASE}/${path}`.replace(/([^:]?)\/\/+/g, '$1/'); // ensure no double slashes except after protocol
    try {
        console.error('MCP › Fetch', url, CHECKMATE_API_TOKEN ? '[auth header set]' : '[no auth]');
        const response = await fetch(url, {
            ...init,
            // ensure GET unless otherwise specified
            method: init?.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(CHECKMATE_API_TOKEN ? { Authorization: `Bearer ${CHECKMATE_API_TOKEN}` } : {}),
                ...(init?.headers ?? {}),
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error('Error making Checkmate request:', error);
        return null;
    }
}
// ---------------------- TOOL DEFINITIONS ----------------------
// get-runs
server.tool('get-runs', 'Get list of runs for a project', {
    projectId: z.number().int().positive().describe('ID of the project'),
    page: z.number().int().positive().optional().describe('Page number (optional, default 1)'),
    pageSize: z
        .number()
        .int()
        .positive()
        .optional()
        .describe('Number of items per page (optional, default 250)'),
    search: z.string().optional().describe('Search string (optional)'),
    status: z
        .enum(['Active', 'Locked', 'Archived', 'Deleted'])
        .optional()
        .describe('Run status filter (optional)'),
}, async ({ projectId, page, pageSize, search, status }) => {
    const params = new URLSearchParams();
    params.set('projectId', String(projectId));
    if (page)
        params.set('page', String(page));
    if (pageSize)
        params.set('pageSize', String(pageSize));
    if (search)
        params.set('search', search);
    if (status)
        params.set('status', status);
    console.error("Making request to Checkmate API to get runs");
    console.error("token: ", CHECKMATE_API_TOKEN);
    console.error("baseurl: ", CHECKMATE_API_BASE);
    const data = await makeRequest(`api/v1/runs?${params.toString()}`);
    if (!data) {
        return {
            content: [{ type: 'text', text: 'Failed to retrieve runs data' }],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
});
// get-run-state-detail
server.tool('get-run-state-detail', 'Get meta information / state summary for a run', {
    runId: z.number().int().positive().describe('ID of the run'),
    projectId: z.number().int().positive().optional().describe('ID of the project (optional)'),
    groupBy: z.enum(['squads']).optional().describe("Group by field. Currently only 'squads' is supported (optional)"),
}, async ({ runId, projectId, groupBy }) => {
    const params = new URLSearchParams();
    params.set('runId', String(runId));
    if (projectId)
        params.set('projectId', String(projectId));
    if (groupBy)
        params.set('groupBy', groupBy);
    const data = await makeRequest(`api/v1/run/state-detail?${params.toString()}`);
    if (!data) {
        return {
            content: [{ type: 'text', text: 'Failed to retrieve run state detail' }],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
});
// get-run-tests
server.tool('get-run-tests', 'Get list of tests inside a run', {
    projectId: z.number().int().positive().describe('Project ID'),
    runId: z.number().int().positive().describe('Run ID'),
    page: z.number().int().positive().optional().describe('Page number (optional, default 1)'),
    pageSize: z.number().int().positive().optional().describe('Page size (optional, default 100)'),
    textSearch: z.string().optional().describe('Search string (optional)'),
}, async ({ projectId, runId, page, pageSize, textSearch }) => {
    const params = new URLSearchParams();
    params.set('projectId', String(projectId));
    params.set('runId', String(runId));
    if (page)
        params.set('page', String(page));
    if (pageSize)
        params.set('pageSize', String(pageSize));
    if (textSearch)
        params.set('textSearch', textSearch);
    const data = await makeRequest(`api/v1/run/tests?${params.toString()}`);
    if (!data) {
        return {
            content: [{ type: 'text', text: 'Failed to retrieve run tests list' }],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
});
// get-run-test-status
server.tool('get-run-test-status', 'Get the status of a particular test in a run', {
    projectId: z.number().int().positive().describe('Project ID'),
    runId: z.number().int().positive().describe('Run ID'),
    testId: z.number().int().positive().describe('Test ID'),
}, async ({ projectId, runId, testId }) => {
    const params = new URLSearchParams({ projectId: String(projectId), runId: String(runId), testId: String(testId) });
    const data = await makeRequest(`api/v1/run/test-status?${params.toString()}`);
    if (!data) {
        return {
            content: [{ type: 'text', text: 'Failed to retrieve run test status' }],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
});
// get-test-details
server.tool('get-test-details', 'Get details of a test', {
    projectId: z.number().int().positive().describe('Project ID'),
    testId: z.number().int().positive().describe('Test ID'),
}, async ({ projectId, testId }) => {
    const params = new URLSearchParams({ projectId: String(projectId), testId: String(testId) });
    const data = await makeRequest(`api/v1/test/details?${params.toString()}`);
    if (!data) {
        return {
            content: [{ type: 'text', text: 'Failed to retrieve test details' }],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
});
// get-project-tests
server.tool('get-project-tests', 'Get tests of a project (not tied to a run)', {
    projectId: z.number().int().positive().describe('Project ID'),
    page: z.number().int().positive().optional().describe('Page number (optional, default 1)'),
    pageSize: z.number().int().positive().optional().describe('Page size (optional, default 250)'),
    textSearch: z.string().optional().describe('Search string (optional)'),
}, async ({ projectId, page, pageSize, textSearch }) => {
    const params = new URLSearchParams();
    params.set('projectId', String(projectId));
    if (page)
        params.set('page', String(page));
    if (pageSize)
        params.set('pageSize', String(pageSize));
    if (textSearch)
        params.set('textSearch', textSearch);
    const data = await makeRequest(`api/v1/project/tests?${params.toString()}`);
    if (!data) {
        return {
            content: [{ type: 'text', text: 'Failed to retrieve project tests' }],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
});
// ---------------------- START SERVER ----------------------
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Checkmate MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
