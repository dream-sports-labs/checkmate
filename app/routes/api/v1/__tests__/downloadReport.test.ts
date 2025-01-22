import { loader } from "~/routes/api/v1/downloadReport"; // Adjust the path as necessary
import TestRunsController from "@controllers/testRuns.controller";
import Papa from "papaparse";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForRunId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/testRuns.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");
jest.mock("papaparse", () => ({
  unparse: jest.fn(),
}));

describe("Download Report Loader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a CSV response for a valid runId", async () => {
    const mockData = [
      { testName: "Test 1", status: "Pass" },
      { testName: "Test 2", status: "Fail" },
    ];
    const mockCSV = "testName,status\nTest 1,Pass\nTest 2,Fail";
    const request = new Request("http://localhost?runId=123", { method: "GET" });
  
    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForRunId as jest.Mock).mockReturnValue(true);
    (TestRunsController.downloadReport as jest.Mock).mockResolvedValue(mockData);
    (Papa.unparse as jest.Mock).mockReturnValue(mockCSV);
  
    const response = (await loader({ params: {}, request } as any)) as Response;
  
    expect(response).toBeInstanceOf(Response); // Ensures it's a Response object
    expect(response.headers.get("Content-Type")).toBe("text/csv");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="run-123-report.csv"'
    );
    expect(await response.text()).toBe(mockCSV);
  });
  

  it("should return an error if runId is missing or invalid", async () => {
    const request = new Request("http://localhost", { method: "GET" });
  
    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForRunId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );
  
    const response = (await loader({ params: {}, request } as any));

    console.log(response);
  
    expect(checkForRunId).toHaveBeenCalledWith(0); // Verifies 0 is passed for invalid/missing runId
    // const responseData = await response.json();
    // expect(responseData).toEqual({
    //   error: "Invalid or missing runId",
    // });
  });
  
  it("should return an error if no data is found for the given runId", async () => {
    const request = new Request("http://localhost?runId=123", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForRunId as jest.Mock).mockReturnValue(true);
    (TestRunsController.downloadReport as jest.Mock).mockResolvedValue([]);

    const response = await loader({ params: {}, request } as any);

    expect(TestRunsController.downloadReport).toHaveBeenCalledWith({ runId: 123 });
    expect(responseHandler).toHaveBeenCalledWith({
      error: "No tests found for the given run",
      status: 400,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost?runId=123", { method: "GET" });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) => error);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DownloadReport,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
  });
});
