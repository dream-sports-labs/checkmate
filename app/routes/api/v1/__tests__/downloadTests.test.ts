import { loader } from "~/routes/api/v1/downloadTests"; // Adjust the path as necessary
import TestsController from "@controllers/tests.controller";
import SearchParams from "@route/utils/getSearchParams";
import Papa from "papaparse";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/tests.controller");
jest.mock("@route/utils/getSearchParams");
jest.mock("papaparse", () => ({
  unparse: jest.fn(),
}));
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");

describe("Download Tests Loader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a CSV response for valid search parameters", async () => {
    const mockData = [
      { testName: "Test 1", status: "Pass" },
      { testName: "Test 2", status: "Fail" },
    ];
    const mockCSV = "testName,status\nTest 1,Pass\nTest 2,Fail";
    const request = new Request("http://localhost?filter=example", {
      method: "GET",
    });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (SearchParams.getTests as jest.Mock).mockReturnValue({ filter: "example" });
    (TestsController.downloadTests as jest.Mock).mockResolvedValue(mockData);
    (Papa.unparse as jest.Mock).mockReturnValue(mockCSV);

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DownloadTests,
    });
    expect(SearchParams.getTests).toHaveBeenCalledWith({ params: {}, request });
    expect(TestsController.downloadTests).toHaveBeenCalledWith({
      filter: "example",
    });
    expect(Papa.unparse).toHaveBeenCalledWith(mockData);
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("Content-Type")).toBe("text/csv");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="run--report.csv"'
    );
    expect(await response.text()).toBe(mockCSV);
  });

  it("should return an error if no data is found for the given search parameters", async () => {
    const request = new Request("http://localhost?filter=example", {
      method: "GET",
    });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (SearchParams.getTests as jest.Mock).mockReturnValue({ filter: "example" });
    (TestsController.downloadTests as jest.Mock).mockResolvedValue([]);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(SearchParams.getTests).toHaveBeenCalledWith({ params: {}, request });
    expect(TestsController.downloadTests).toHaveBeenCalledWith({
      filter: "example",
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "No tests found for the given project with filter",
      status: 400,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost?filter=example", {
      method: "GET",
    });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DownloadTests,
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });
});
