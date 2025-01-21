import ProjectsController, { IArchiveProjects } from "@controllers/projects.controller"; // Adjust the path as necessary
import ProjectsDao from "~/db/dao/projects.dao";

jest.mock("~/db/dao/projects.dao");

describe("ProjectsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProjects", () => {
    it("should call ProjectsDao.getAll with the correct parameters", async () => {
      const mockParams = {
        orgId: 123,
        page: 1,
        pageSize: 10
      };
      const mockResponse = [
        { projectId: 1, projectName: "Project A" },
        { projectId: 2, projectName: "Project B" },
      ];

      (ProjectsDao.getAll as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProjectsController.getAllProjects(mockParams);

      expect(ProjectsDao.getAll).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors from ProjectsDao.getAll", async () => {
      const mockParams = { orgId: 123, page: 1, pageSize: 10 };
      const mockError = new Error("Database error");

      (ProjectsDao.getAll as jest.Mock).mockRejectedValue(mockError);

      await expect(ProjectsController.getAllProjects(mockParams)).rejects.toThrow(
        "Database error"
      );

      expect(ProjectsDao.getAll).toHaveBeenCalledWith(mockParams);
    });
  });

  describe("getProjectInfo", () => {
    it("should call ProjectsDao.getProjectInfo with the correct projectId", async () => {
      const projectId = 123;
      const mockResponse = { projectId: 123, projectName: "Project A" };

      (ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProjectsController.getProjectInfo(projectId);

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors from ProjectsDao.getProjectInfo", async () => {
      const projectId = 123;
      const mockError = new Error("Database error");

      (ProjectsDao.getProjectInfo as jest.Mock).mockRejectedValue(mockError);

      await expect(ProjectsController.getProjectInfo(projectId)).rejects.toThrow(
        "Database error"
      );

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(projectId);
    });
  });

  describe("createProject", () => {
    it("should call ProjectsDao.createProject with the correct parameters", async () => {
      const mockParams = {
        projectName: "New Project",
        projectDescription: "A new project description",
        orgId: 123,
        createdBy: 456,
      };
      const mockResponse = { projectId: 789 };

      (ProjectsDao.createProject as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProjectsController.createProject(mockParams);

      expect(ProjectsDao.createProject).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors from ProjectsDao.createProject", async () => {
      const mockParams = {
        projectName: "New Project",
        orgId: 123,
        createdBy: 456,
      };
      const mockError = new Error("Database error");

      (ProjectsDao.createProject as jest.Mock).mockRejectedValue(mockError);

      await expect(ProjectsController.createProject(mockParams)).rejects.toThrow(
        "Database error"
      );

      expect(ProjectsDao.createProject).toHaveBeenCalledWith(mockParams);
    });
  });

  describe("editProject", () => {
    it("should call ProjectsDao.editProject with the correct parameters", async () => {
      const mockParams = {
        projectName: "Updated Project",
        projectDescription: "Updated description",
        projectId: 123,
        userId: 456,
      };
      const mockResponse = { affectedRows: 1 };

      (ProjectsDao.editProject as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProjectsController.editProject(mockParams);

      expect(ProjectsDao.editProject).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors from ProjectsDao.editProject", async () => {
      const mockParams = {
        projectName: "Updated Project",
        projectId: 123,
        userId: 456,
      };
      const mockError = new Error("Database error");

      (ProjectsDao.editProject as jest.Mock).mockRejectedValue(mockError);

      await expect(ProjectsController.editProject(mockParams)).rejects.toThrow(
        "Database error"
      );

      expect(ProjectsDao.editProject).toHaveBeenCalledWith(mockParams);
    });
  });

  describe("updateProjectStatus", () => {
    it("should call ProjectsDao.updateProjectStatus with the correct parameters", async () => {
        const mockParams: IArchiveProjects = {
            projectId: 123,
            status: "Archived" as IArchiveProjects["status"],
            userId: 456,
          };
      const mockResponse = { affectedRows: 1 };

      (ProjectsDao.updateProjectStatus as jest.Mock).mockResolvedValue(mockResponse);

      const result = await ProjectsController.updateProjectStatus(mockParams);

      expect(ProjectsDao.updateProjectStatus).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors from ProjectsDao.updateProjectStatus", async () => {
        const mockParams: IArchiveProjects = {
            projectId: 123,
            status: "Archived" as IArchiveProjects["status"],
            userId: 456,
          };
          
      const mockError = new Error("Database error");

      (ProjectsDao.updateProjectStatus as jest.Mock).mockRejectedValue(mockError);

      await expect(ProjectsController.updateProjectStatus(mockParams)).rejects.toThrow(
        "Database error"
      );

      expect(ProjectsDao.updateProjectStatus).toHaveBeenCalledWith(mockParams);
    });
  });
});
