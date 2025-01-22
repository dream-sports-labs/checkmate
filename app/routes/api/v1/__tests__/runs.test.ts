import { loader } from "~/routes/api/v1/runs"; // Adjust the path as necessary
import RunsController from "~/dataController/runs.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForProjectId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("~/dataController/runs.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

describe("Get Runs - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch runs for a valid projectId", async () => {
    const request = new Request("http://localhost?projectId=123&page=1&pageSize=10&search=test", {
      method: "GET",
    });
    const mockRunsData = [
      {
        runId: 1,
        runName: "Run A",
        status: "Active",
        projectId: 123,
      },
      {
        runId: 2,
        runName: "Run B",
        status: "Completed",
        projectId: 123,
      },
    ];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForProjectId as jest.Mock).mockReturnValue(true);
    (RunsController.getAllRuns as jest.Mock).mockResolvedValue(mockRunsData);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetRuns,
    });
    expect(checkForProjectId).toHaveBeenCalledWith(123);
    expect(RunsController.getAllRuns).toHaveBeenCalledWith({
      projectId: 123,
      page: 1,
      pageSize: 10,
      search: "test",
      status: undefined,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: { runsData: mockRunsData, projectId: 123 },
      status: 200,
    });
  });

  it("should return an error if projectId is missing", async () => {
    const request = new Request("http://localhost?page=1&pageSize=10", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForProjectId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(checkForProjectId).toHaveBeenCalledWith(0);
    expect(responseHandler).toHaveBeenCalledWith({
      error: "Params projectId not provided",
      status: 400,
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Params projectId not provided",
      status: 400,
    });
  });

  

  it("should return an error for an invalid projectId", async () => {
    const request = new Request("http://localhost?projectId=invalid", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForProjectId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(checkForProjectId).toHaveBeenCalledWith(NaN);
    expect(responseHandler).toHaveBeenCalledWith({
      error: "Invalid params projectId",
      status: 400,
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Invalid params projectId",
      status: 400,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost?projectId=123&page=1&pageSize=10", {
      method: "GET",
    });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetRuns,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });
});
