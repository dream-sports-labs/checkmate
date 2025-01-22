import { loader } from "~/routes/api/v1/automationStatus"; // Adjust path as necessary
import AutomationStatusController from "@controllers/automationStatus.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForValidId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("@controllers/automationStatus.controller");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/utils");

describe("Automation Status Loader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return automation status data when orgId is valid", async () => {
    const request = new Request("http://localhost?orgId=123", {
      method: "GET",
    });
    const mockAutomationStatusData = [
      { id: 1, status: "active" },
      { id: 2, status: "inactive" },
    ];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(true);
    (AutomationStatusController.getAllAutomationStatus as jest.Mock).mockResolvedValue(
      mockAutomationStatusData
    );
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetAutomationStatus,
    });
    expect(checkForValidId).toHaveBeenCalledWith(123);
    expect(AutomationStatusController.getAllAutomationStatus).toHaveBeenCalledWith({
      orgId: 123,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockAutomationStatusData,
      status: 200,
    });
  });

  it("should return 400 if orgId is invalid", async () => {
    const request = new Request("http://localhost?orgId=invalid", {
      method: "GET",
    });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetAutomationStatus,
    });
    expect(checkForValidId).toHaveBeenCalledWith(NaN); // Invalid `orgId` converts to `NaN`
    expect(responseHandler).toHaveBeenCalledWith({
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
    (errorResponseHandler as jest.Mock).mockImplementation((error) => error);

    const response = await loader({ params: {}, request } as any);

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError);
  });
});
