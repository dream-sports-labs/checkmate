import { action } from "~/routes/api/v1/updateTests"; // Adjust the path as necessary
import TestsController from "@controllers/tests.controller";
import LabelsController from "@controllers/labels.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { getRequestParams } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/tests.controller");
jest.mock("@controllers/labels.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

const editableColumnTypes = [
    'sectionId',
    'projectId',
    'title',
    'squadId',
    'priorityId',
    'type',
    'automationStatusId',
    'testCoveredById',
    'preConditions',
    'steps',
    'expectedResult',
    'assignedTo',
    'createdBy',
    'createdOn',
    'testStatusHistory',
    'editInfo',
    'platformId',
    'status',
    'labelId',
  ]
  

describe("Update Run - Action Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update tests for a valid property and value", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      property: "priorityId",
      value: 5,
      projectId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 789 };
    const mockResponse = { affectedRows: 3 };

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (TestsController.updateTests as jest.Mock).mockResolvedValue(mockResponse);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTestsInBulk,
    });
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object));
    expect(TestsController.updateTests).toHaveBeenCalledWith({
      ...requestData,
      userId: mockUser.userId,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: "Updated 3 test(s) successfully",
      },
      status: 200,
    });
  });

  it("should successfully add label mappings when property is labelId", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      property: "labelId",
      value: 7,
      projectId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 789 };
    const mockResponse = { affectedRows: 3 };

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (LabelsController.addLabelTestMap as jest.Mock).mockResolvedValue(mockResponse);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTestsInBulk,
    });
    expect(LabelsController.addLabelTestMap).toHaveBeenCalledWith({
      labelId: 7,
      testIds: [1, 2, 3],
      projectId: 123,
      createdBy: 789,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: "Updated 3 test(s) successfully",
      },
      status: 200,
    });
  });

  it("should return an error for invalid content type", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "text/plain" },
    });

    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = await action({ request } as any);

    expect(responseHandler).toHaveBeenCalledWith({
      error: "Invalid content type",
      status: 400,
    });
  });

  it("should return an error for invalid property", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      property: "invalidProperty",
      value: "someValue",
      projectId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
  
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 400 })
    );
  
    const response = await action({ request } as any);
  
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object));
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Property ${requestData.property} is not editable or invalid, provide one of [${editableColumnTypes}]`,
      })
    );
    expect(response.status).toBe(400);
  
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: `Property ${requestData.property} is not editable or invalid, provide one of [${editableColumnTypes}]`,
    });
  });
  

it("should return an error when value is missing", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      property: "priorityId",
      value: null,
      projectId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
  
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 400 })
    );
  
    const response = await action({ request } as any);
  
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object));
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Value null is not valid, provide a valid value",
      })
    );
    expect(response.status).toBe(400);
  
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Value null is not valid, provide a valid value",
    });
  });
  

  it("should handle unexpected errors", async () => {
    const requestData = {
      testIds: [1, 2, 3],
      property: "priorityId",
      value: 5,
      projectId: 123,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockError = new Error("Unexpected error");

    (getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError);
    (errorResponseHandler as jest.Mock).mockImplementation((error) =>
      new Response(JSON.stringify({ error: error.message }), { status: 500 })
    );

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTestsInBulk,
    });
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
    expect(response.status).toBe(500);
  });
});
