import { loader } from "~/routes/api/v1/labels"; // Adjust the path as necessary
import LabelsController from "~/dataController/labels.controller";
import { getUserAndCheckAccess } from "~/routes/utilities/checkForUserAndAccess";
import {
  responseHandler,
  errorResponseHandler,
} from "~/routes/utilities/responseHandler";
import { checkForValidId } from "~/routes/utilities/utils";
import { API } from "~/routes/utilities/api";

jest.mock("~/dataController/labels.controller");
jest.mock("~/routes/utilities/checkForUserAndAccess");
jest.mock("~/routes/utilities/responseHandler");
jest.mock("~/routes/utilities/utils");

describe("Get Labels - Loader Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch labels for a valid projectId", async () => {
    const request = new Request("http://localhost?projectId=123", {
      method: "GET",
    });
    const mockLabelsData = [
      { labelId: 1, labelName: "Label 1" },
      { labelId: 2, labelName: "Label 2" },
    ];

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(true);
    (LabelsController.getAllLabels as jest.Mock).mockResolvedValue(mockLabelsData);
    (responseHandler as jest.Mock).mockImplementation((response) => response);

    const response = await loader({ params: {}, request } as any);

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetLabels,
    });
    expect(checkForValidId).toHaveBeenCalledWith(123);
    expect(LabelsController.getAllLabels).toHaveBeenCalledWith({
      projectId: 123,
    });
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockLabelsData,
      status: 200,
    });
  });

  it("should return an error if projectId is invalid", async () => {
    const request = new Request("http://localhost?projectId=invalid", {
      method: "GET",
    });

    (getUserAndCheckAccess as jest.Mock).mockResolvedValue(true);
    (checkForValidId as jest.Mock).mockReturnValue(false);
    (responseHandler as jest.Mock).mockImplementation((data) =>
      new Response(JSON.stringify(data), { status: 400 })
    );

    const response = (await loader({ params: {}, request } as any)) as Response;

    expect(checkForValidId).toHaveBeenCalledWith(NaN);
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Invalid param projectId",
      status: 400,
    });
  });

  it("should handle unexpected errors", async () => {
    const request = new Request("http://localhost?projectId=123", {
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
      resource: API.GetLabels,
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
