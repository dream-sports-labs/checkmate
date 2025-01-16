import { action } from "~/routes/api/v1/addSection"; // Adjust the import path
import SectionsController from "@controllers/sections.controller";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import { getRequestParams } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/sections.controller");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/utils");

describe("Add Section - Action Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully add a section when request is valid", async () => {
    const requestData = {
      sectionHierarchyString: "Parent/Child",
      projectId: 1,
      sectionDescription: "Test description",
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 123 };
    const mockResponse = {
      sectionName: "Child",
      sectionId: 456,
    };

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (SectionsController.createSectionFromHierarchyString as jest.Mock).mockResolvedValue(
      mockResponse
    );
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddSection,
    });
    expect(SectionsController.createSectionFromHierarchyString).toHaveBeenCalledWith({
      sectionHierarchyString: "Parent/Child",
      sectionDescription: "Test description",
      projectId: 1,
      createdBy: 123,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: "Child section added with id 456",
      },
      status: 200,
    });
  });

  it("should return 400 if content-type is not application/json", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "text/plain" },
    });

    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(responseHandler).toHaveBeenCalledWith({
      error: "Invalid content type, expected application/json",
      status: 400,
    });
  });

  it("should return 409 if section already exists (duplicate entry)", async () => {
    const requestData = {
      sectionHierarchyString: "Parent/Child",
      projectId: 1,
      sectionDescription: null,
    };
    const request = new Request("http://localhost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const mockUser = { userId: 123 };

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser);
    (getRequestParams as jest.Mock).mockResolvedValue(requestData);
    (SectionsController.createSectionFromHierarchyString as jest.Mock).mockResolvedValue(
      null
    );
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await action({ request } as any);

    expect(SectionsController.createSectionFromHierarchyString).toHaveBeenCalledWith({
      sectionHierarchyString: "Parent/Child",
      sectionDescription: "",
      projectId: 1,
      createdBy: 123,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      error: "Error adding section due to duplicate entries",
      status: 409,
    });
  });

  it("should handle unexpected errors", async () => {
    const requestData = {
      sectionHierarchyString: "Parent/Child",
      projectId: 1,
      sectionDescription: "Test description",
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

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
  });
});
