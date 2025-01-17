import { loader } from "~/routes/api/v1/priority"; // Adjust the path as necessary
import PriorityController from "@controllers/priority.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForValidId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/priority.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

describe("Get Priority - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch priority data for a valid orgId", async () => {
    const request = new Request("http://localhost?orgId=123", { method: "GET" });
    const mockPriorityData = [
      { priorityId: 1, priorityName: "High" },
      { priorityId: 2, priorityName: "Medium" },
    ];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(true);
    (PriorityController.getAllPriority as jest.Mock).mockResolvedValue(mockPriorityData);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetPriority,
    });
    expect(checkForValidId).toHaveBeenCalledWith(123);
    expect(PriorityController.getAllPriority).toHaveBeenCalledWith({ orgId: 123 });
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockPriorityData,
      status: 200,
    });
  });

  it("should return an error for an invalid orgId", async () => {
    const request = new Request("http://localhost?orgId=invalid", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ request } as any)) as Response;

    expect(checkForValidId).toHaveBeenCalledWith(NaN);
    expect(response).toBeInstanceOf(Response);
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

    const response = await loader({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetPriority,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });
});
