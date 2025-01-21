import { action } from "~/routes/api/v1/bulkDeleteTests"; // Adjust the path as needed
import TestsController from "@controllers/tests.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { getRequestParams } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/tests.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

describe("Bulk Delete Tests - Action Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete tests when request is valid", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 123 };
    const mockResponse = { affectedRows: 3 };

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (TestsController.bulkDeleteTests as jest.Mock).mockResolvedValue(mockResponse);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteBulkTests,
    });
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object));
    expect(TestsController.bulkDeleteTests).toHaveBeenCalledWith({
      testIds: [1, 2, 3],
      projectId: 101,
      userId: 123,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: { message: "3 test(s) deleted successfully" },
      status: 200,
    });
  });

  it("should return validation error if request data is invalid", async () => {
    const invalidRequestData = {
      testIds: [], // Empty testIds, which is invalid
      projectId: -1, // Invalid projectId
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(invalidRequestData),
    });

    (getRequestParams as jest.Mock).mockRejectedValue(
      new Error("Validation Error: Invalid data")
    );
    (errorResponseHandler as jest.Mock).mockImplementation((error) => error);

    const response = await action({ request } as any);

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object));
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error("Validation Error: Invalid data")
    );
  });

  it("should handle unexpected errors", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) => error);

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteBulkTests,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
  });
});
