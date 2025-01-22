import { loader } from "~/routes/api/v1/runData"; // Adjust the path as necessary
import RunsController from "~/dataController/runs.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForRunId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("~/dataController/runs.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

describe("Get Run Detail - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch run details for a valid runId", async () => {
    const request = new Request("http://localhost?runId=123", { method: "GET" });
    const mockRunData = {
      runId: 123,
      runName: "Sample Run",
      createdBy: 456,
      createdOn: "2023-01-01",
      status: "Active",
      projectId: 789,
      runDescription: "Run description",
    };

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForRunId as jest.Mock).mockReturnValue(true);
    (RunsController.getRunInfo as jest.Mock).mockResolvedValue([mockRunData]);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.RunDetail,
    });
    expect(checkForRunId).toHaveBeenCalledWith(123);
    expect(RunsController.getRunInfo).toHaveBeenCalledWith({ runId: 123 });
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockRunData,
      status: 200,
    });
  });

  it("should return an error if runId is invalid", async () => {
    const request = new Request("http://localhost?runId=invalid", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForRunId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(checkForRunId).toHaveBeenCalledWith(NaN);
    expect(responseHandler).toHaveBeenCalledWith({
      error: "Invalid params runId or projectId",
      status: 400,
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Invalid params runId or projectId",
      status: 400,
    });
  });

  it("should return an error if runId is missing", async () => {
    const request = new Request("http://localhost", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(responseHandler).toHaveBeenCalledWith({
      error: "Params runId or projectId not provided",
      status: 400,
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Params runId or projectId not provided",
      status: 400,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost?runId=123", { method: "GET" });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.RunDetail,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });
});
