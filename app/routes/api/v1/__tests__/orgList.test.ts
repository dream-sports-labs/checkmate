import { loader } from "~/routes/api/v1/orgList"; // Adjust the path as necessary
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

describe("Get Organization List - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch the organization list", async () => {
    const request = new Request("http://localhost", { method: "GET" });
    const mockOrgList = [
      { orgId: 1, orgName: "Org 1", orgStatus: "Active" },
      { orgId: 2, orgName: "Org 2", orgStatus: "Inactive" },
    ];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (OrgController.getOrgList as jest.Mock).mockResolvedValue(mockOrgList);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetLabels,
    });
    expect(OrgController.getOrgList).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockOrgList,
      status: 200,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost", { method: "GET" });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetLabels,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Unexpected error",
    });
  });

  it("should return an empty list if no organizations are found", async () => {
    const request = new Request("http://localhost", { method: "GET" });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (OrgController.getOrgList as jest.Mock).mockResolvedValue([]);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetLabels,
    });
    expect(OrgController.getOrgList).toHaveBeenCalled();
    expect(responseHandler).toHaveBeenCalledWith({
      data: [],
      status: 200,
    });
  });
});
