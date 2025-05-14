import { loader } from "~/routes/api/v1/testCoveredBy"; 
import TestCoveredByController from "@controllers/testCoveredBy.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForValidId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/testCoveredBy.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

describe("Get Test Covered By - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch test covered by data for a valid orgId", async () => {
    const request = new Request("http://localhost?orgId=123", { method: "GET" });
    const mockTestCoveredByData = [
      { id: 1, name: "Test Coverage A" },
      { id: 2, name: "Test Coverage B" },
    ];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(true);
    (TestCoveredByController.getAllTestCoveredBy as jest.Mock).mockResolvedValue(
      mockTestCoveredByData
    );
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestCoveredBy,
    });
    expect(checkForValidId).toHaveBeenCalledWith(123);
    expect(TestCoveredByController.getAllTestCoveredBy).toHaveBeenCalledWith({ orgId: 123 });
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestCoveredByData,
      status: 500,
    });
  });

  it("should return an error for an invalid orgId", async () => {
    const request = new Request("http://localhost?orgId=invalid", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(checkForValidId).toHaveBeenCalledWith(NaN);
    expect(responseHandler).toHaveBeenCalledWith({
      error: "Invalid param orgId",
      status: 400,
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Invalid param orgId",
      status: 400,
    });
  });

  it("should return an error if orgId is missing", async () => {
    const request = new Request("http://localhost", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(checkForValidId).toHaveBeenCalledWith(NaN);
    expect(responseHandler).toHaveBeenCalledWith({
      error: "Invalid param orgId",
      status: 400,
    });
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Invalid param orgId",
      status: 400,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost?orgId=123", { method: "GET" });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestCoveredBy,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });
});
