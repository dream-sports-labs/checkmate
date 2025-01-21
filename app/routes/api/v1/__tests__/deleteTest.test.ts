import { action } from "~/routes/api/v1/deleteTest"; // Adjust the path as necessary
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

describe("Delete Test - Action Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete a test when request is valid", async () => {
    const requestData = {
      testId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 456 };
    const mockResponse = { testData: 1 }; // 1 row affected

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (TestsController.deleteTest as jest.Mock).mockResolvedValue(mockResponse);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteTest,
    });
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object));
    expect(TestsController.deleteTest).toHaveBeenCalledWith({
      testId: 123,
      userId: 456,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: "TestId: 123 deleted successfully",
      },
      status: 200,
    });
  });

  it("should return an error if no test is found for the given testId", async () => {
    const requestData = {
      testId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 456 };
    const mockResponse = { testData: 0 }; // No rows affected

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (TestsController.deleteTest as jest.Mock).mockResolvedValue(mockResponse);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(TestsController.deleteTest).toHaveBeenCalledWith({
      testId: 123,
      userId: 456,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      error: "No test found for testId: 123",
      status: 400,
    });
  });

  it("should handle schema validation errors", async () => {
    const invalidRequestData = {
      testId: -1, // Invalid testId
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
      testId: 123,
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
      resource: API.DeleteTest,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
  });
});
