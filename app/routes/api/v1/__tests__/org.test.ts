import { loader } from "~/routes/api/v1/org"; // Adjust the path as necessary
import OrgController from "~/dataController/org.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { API } from "~/routes/utilities/api";

jest.mock("~/dataController/org.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");

describe("Get Organization Details - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch organization details for a valid orgId", async () => {
    const request = new Request("http://localhost?orgId=123", {
      method: "GET",
    });
    const mockOrgInfo = [{ orgId: 123, orgName: "Test Org", orgStatus: "Active" }];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (OrgController.getOrgInfo as jest.Mock).mockResolvedValue(mockOrgInfo);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetOrgDetails,
    });
    expect(OrgController.getOrgInfo).toHaveBeenCalledWith(123);
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockOrgInfo[0],
      status: 200,
    });
  });

  it("should return an error if orgId is invalid", async () => {
    const request = new Request("http://localhost?orgId=invalid", {
      method: "GET",
    });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ request } as any)) as Response;

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
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ request } as any)) as Response;

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
    const request = new Request("http://localhost?orgId=123", {
      method: "GET",
    });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = await loader({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetOrgDetails,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });
});
