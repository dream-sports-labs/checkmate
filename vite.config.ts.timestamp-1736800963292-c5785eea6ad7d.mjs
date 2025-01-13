// vite.config.ts
import { vitePlugin as remix } from "file:///Users/ashutoshpalania/work/checkmate/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///Users/ashutoshpalania/work/checkmate/node_modules/@remix-run/node/dist/index.js";
import { defineConfig } from "file:///Users/ashutoshpalania/work/checkmate/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/ashutoshpalania/work/checkmate/node_modules/vite-tsconfig-paths/dist/index.mjs";

// app/routes/utilities/api.ts
var API = /* @__PURE__ */ ((API2) => {
  API2["AddLabels"] = "api/v1/project/add-labels";
  API2["AddProjects"] = "api/v1/project/create";
  API2["AddRun"] = "api/v1/run/create";
  API2["AddSquads"] = "api/v1/project/add-squads";
  API2["AddTest"] = "api/v1/test/create";
  API2["AddTestBulk"] = "api/v1/test/bulk-add";
  API2["AddToken"] = "api/v1/token/generate";
  API2["DeleteBulkTests"] = "api/v1/test/bulk-delete";
  API2["DeleteRun"] = "api/v1/run/delete";
  API2["DeleteTest"] = "api/v1/test/delete";
  API2["DeleteToken"] = "api/v1/token/delete";
  API2["DownloadReport"] = "api/v1/run/report-download";
  API2["DownloadTests"] = "api/v1/tests/download";
  API2["EditProject"] = "api/v1/project/edit";
  API2["EditProjectStatus"] = "api/v1/project/update-status";
  API2["EditRun"] = "api/v1/run/edit";
  API2["EditTest"] = "api/v1/test/update";
  API2["EditTestsInBulk"] = "api/v1/test/bulk-update";
  API2["GetAutomationStatus"] = "api/v1/automation-status";
  API2["GetLabels"] = "api/v1/labels";
  API2["GetOrgDetails"] = "api/v1/org/detail";
  API2["GetOrgsList"] = "api/v1/orgs";
  API2["GetPlatforms"] = "api/v1/platform";
  API2["GetPriority"] = "api/v1/priority";
  API2["GetProjectDetail"] = "api/v1/project/detail";
  API2["GetProjects"] = "api/v1/projects";
  API2["GetRuns"] = "api/v1/runs";
  API2["GetRunStateDetail"] = "api/v1/run/state-detail";
  API2["GetRunTestsList"] = "api/v1/run/tests";
  API2["GetRunTestStatus"] = "api/v1/run/test-status";
  API2["GetSections"] = "api/v1/project/sections";
  API2["GetSquads"] = `api/v1/project/squads`;
  API2["GetTestCoveredBy"] = "api/v1/test-covered-by";
  API2["GetTestDetails"] = "api/v1/test/details";
  API2["GetTests"] = "api/v1/project/tests";
  API2["GetTestsCount"] = "api/v1/project/tests-count";
  API2["GetTestStatusHistory"] = "api/v1/test/test-status-history";
  API2["GetTestStatusHistoryInRun"] = "api/v1/run/test-status-history";
  API2["GetType"] = "api/v1/type";
  API2["GetUserDetails"] = "api/v1/user/details";
  API2["RunDetail"] = "api/v1/run/detail";
  API2["RunLock"] = "api/v1/run/lock";
  API2["RunRemoveTest"] = "api/v1/run/remove-tests";
  API2["RunReset"] = "api/v1/run/reset";
  API2["RunUpdateTestStatus"] = "api/v1/run/update-test-status";
  API2["GetAllUser"] = "api/v1/all-users";
  API2["UpdateUserRole"] = "api/v1/user/update-role";
  API2["AddSection"] = "api/v1/project/add-section";
  return API2;
})(API || {});
var API_RESOLUTION_PATHS = {
  ["api/v1/project/add-labels" /* AddLabels */]: "routes/api/v1/addLabels.ts",
  ["api/v1/project/create" /* AddProjects */]: "routes/api/v1/createProjects.ts",
  ["api/v1/run/create" /* AddRun */]: "routes/api/v1/createRun.ts",
  ["api/v1/project/add-squads" /* AddSquads */]: "routes/api/v1/addSquads.ts",
  ["api/v1/test/create" /* AddTest */]: "routes/api/v1/createTest.ts",
  ["api/v1/test/bulk-add" /* AddTestBulk */]: "routes/api/v1/bulkAddTest.ts",
  ["api/v1/token/generate" /* AddToken */]: "routes/api/v1/generateToken.ts",
  ["api/v1/test/bulk-delete" /* DeleteBulkTests */]: "routes/api/v1/bulkDeleteTests.ts",
  ["api/v1/run/delete" /* DeleteRun */]: "routes/api/v1/deleteRun.ts",
  ["api/v1/test/delete" /* DeleteTest */]: "routes/api/v1/deleteTest.ts",
  ["api/v1/token/delete" /* DeleteToken */]: "routes/api/v1/deleteToken.ts",
  ["api/v1/run/report-download" /* DownloadReport */]: "routes/api/v1/downloadReport.ts",
  ["api/v1/tests/download" /* DownloadTests */]: "routes/api/v1/downloadTests.ts",
  ["api/v1/project/edit" /* EditProject */]: "routes/api/v1/editProject.ts",
  ["api/v1/project/update-status" /* EditProjectStatus */]: "routes/api/v1/updateProjectStatus.ts",
  ["api/v1/run/edit" /* EditRun */]: "routes/api/v1/editRun.ts",
  ["api/v1/test/update" /* EditTest */]: "routes/api/v1/updateTest.ts",
  ["api/v1/test/bulk-update" /* EditTestsInBulk */]: "routes/api/v1/updateTests.ts",
  ["api/v1/automation-status" /* GetAutomationStatus */]: "routes/api/v1/automationStatus.ts",
  ["api/v1/labels" /* GetLabels */]: "routes/api/v1/labels.ts",
  ["api/v1/org/detail" /* GetOrgDetails */]: "routes/api/v1/org.ts",
  ["api/v1/orgs" /* GetOrgsList */]: "routes/api/v1/orgList.ts",
  ["api/v1/platform" /* GetPlatforms */]: "routes/api/v1/platform.ts",
  ["api/v1/priority" /* GetPriority */]: "routes/api/v1/priority.ts",
  ["api/v1/project/detail" /* GetProjectDetail */]: "routes/api/v1/projectData.ts",
  ["api/v1/projects" /* GetProjects */]: "routes/api/v1/projects.ts",
  ["api/v1/runs" /* GetRuns */]: "routes/api/v1/runs.ts",
  ["api/v1/run/state-detail" /* GetRunStateDetail */]: "routes/api/v1/runMetaInfo.ts",
  ["api/v1/run/tests" /* GetRunTestsList */]: "routes/api/v1/runTestsList.ts",
  ["api/v1/run/test-status" /* GetRunTestStatus */]: "routes/api/v1/testStatus.ts",
  ["api/v1/project/sections" /* GetSections */]: "routes/api/v1/sections.ts",
  ["api/v1/project/squads" /* GetSquads */]: "routes/api/v1/squads.ts",
  ["api/v1/test-covered-by" /* GetTestCoveredBy */]: "routes/api/v1/testCoveredBy.ts",
  ["api/v1/test/details" /* GetTestDetails */]: "routes/api/v1/testDetails.ts",
  ["api/v1/project/tests" /* GetTests */]: "routes/api/v1/tests.ts",
  ["api/v1/project/tests-count" /* GetTestsCount */]: "routes/api/v1/testsCount.ts",
  ["api/v1/test/test-status-history" /* GetTestStatusHistory */]: "routes/api/v1/testStatusHistory.ts",
  ["api/v1/run/test-status-history" /* GetTestStatusHistoryInRun */]: "routes/api/v1/testStatusHistoryOfRun.ts",
  ["api/v1/type" /* GetType */]: "routes/api/v1/type.ts",
  ["api/v1/user/details" /* GetUserDetails */]: "routes/api/v1/userDetails.ts",
  ["api/v1/run/detail" /* RunDetail */]: "routes/api/v1/runData.ts",
  ["api/v1/run/lock" /* RunLock */]: "routes/api/v1/lockRun.ts",
  ["api/v1/run/remove-tests" /* RunRemoveTest */]: "routes/api/v1/removeTestFromRun.ts",
  ["api/v1/run/reset" /* RunReset */]: "routes/api/v1/markPassedAsRetest.ts",
  ["api/v1/run/update-test-status" /* RunUpdateTestStatus */]: "routes/api/v1/updateStatusTestRuns.ts",
  ["api/v1/all-users" /* GetAllUser */]: "routes/api/v1/getAllUser.ts",
  ["api/v1/user/update-role" /* UpdateUserRole */]: "routes/api/v1/updateUserType.ts",
  ["api/v1/project/add-section" /* AddSection */]: "routes/api/v1/addSection.ts"
};
var CLOSED_API = {
  // GenerateToken: 'api/v1/generateToken',
};

// vite.config.ts
installGlobals();
var vite_config_default = defineConfig({
  plugins: [
    remix({
      routes(defineRoutes) {
        return defineRoutes((route) => {
          Object.keys(API).forEach((key) => {
            const apiPath = API[key];
            const routePath = API_RESOLUTION_PATHS[apiPath];
            if (apiPath && routePath && !CLOSED_API[key]) {
              route(apiPath, routePath);
            }
          });
        });
      }
    }),
    tsconfigPaths(),
    ,
  ],
  esbuild: {
    target: "es2022"
  },
  build: {
    target: "es2022"
  },
  server: {
    port: 1200
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYXBwL3JvdXRlcy91dGlsaXRpZXMvYXBpLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FzaHV0b3NocGFsYW5pYS93b3JrL2NoZWNrbWF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FzaHV0b3NocGFsYW5pYS93b3JrL2NoZWNrbWF0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHt2aXRlUGx1Z2luIGFzIHJlbWl4fSBmcm9tICdAcmVtaXgtcnVuL2RldidcbmltcG9ydCB7aW5zdGFsbEdsb2JhbHN9IGZyb20gJ0ByZW1peC1ydW4vbm9kZSdcbmltcG9ydCB7ZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbmltcG9ydCB7QVBJLCBBUElfUkVTT0xVVElPTl9QQVRIUywgQ0xPU0VEX0FQSX0gZnJvbSAnLi9hcHAvcm91dGVzL3V0aWxpdGllcy9hcGknXG5cbmluc3RhbGxHbG9iYWxzKClcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlbWl4KHtcbiAgICAgIHJvdXRlcyhkZWZpbmVSb3V0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGRlZmluZVJvdXRlcygocm91dGUpID0+IHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhBUEkpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXBpUGF0aCA9IEFQSVtrZXkgYXMga2V5b2YgdHlwZW9mIEFQSV1cbiAgICAgICAgICAgIGNvbnN0IHJvdXRlUGF0aCA9XG4gICAgICAgICAgICAgIEFQSV9SRVNPTFVUSU9OX1BBVEhTW2FwaVBhdGggYXMga2V5b2YgdHlwZW9mIEFQSV9SRVNPTFVUSU9OX1BBVEhTXVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBhcGlQYXRoICYmXG4gICAgICAgICAgICAgIHJvdXRlUGF0aCAmJlxuICAgICAgICAgICAgICAhQ0xPU0VEX0FQSVtrZXkgYXMga2V5b2YgdHlwZW9mIENMT1NFRF9BUEldXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcm91dGUoYXBpUGF0aCwgcm91dGVQYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICAsXG4gIF0sXG4gIGVzYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlczIwMjInLFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzMjAyMicsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDEyMDAsXG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL2FwcC9yb3V0ZXMvdXRpbGl0aWVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL2FwcC9yb3V0ZXMvdXRpbGl0aWVzL2FwaS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL2FwcC9yb3V0ZXMvdXRpbGl0aWVzL2FwaS50c1wiO2V4cG9ydCBlbnVtIEFjY2Vzc1R5cGUge1xuICBSRUFERVIgPSAncmVhZGVyJyxcbiAgVVNFUiA9ICd1c2VyJyxcbiAgQURNSU4gPSAnYWRtaW4nLFxufVxuXG5leHBvcnQgZW51bSBBcGlUeXBlcyB7XG4gIEdFVCA9ICdHRVQnLFxuICBQT1NUID0gJ1BPU1QnLFxuICBQVVQgPSAnUFVUJyxcbiAgREVMRVRFID0gJ0RFTEVURScsXG59XG5cbmV4cG9ydCBlbnVtIEFQSSB7XG4gIEFkZExhYmVscyA9ICdhcGkvdjEvcHJvamVjdC9hZGQtbGFiZWxzJyxcbiAgQWRkUHJvamVjdHMgPSAnYXBpL3YxL3Byb2plY3QvY3JlYXRlJyxcbiAgQWRkUnVuID0gJ2FwaS92MS9ydW4vY3JlYXRlJyxcbiAgQWRkU3F1YWRzID0gJ2FwaS92MS9wcm9qZWN0L2FkZC1zcXVhZHMnLFxuICBBZGRUZXN0ID0gJ2FwaS92MS90ZXN0L2NyZWF0ZScsXG4gIEFkZFRlc3RCdWxrID0gJ2FwaS92MS90ZXN0L2J1bGstYWRkJyxcbiAgQWRkVG9rZW4gPSAnYXBpL3YxL3Rva2VuL2dlbmVyYXRlJyxcbiAgRGVsZXRlQnVsa1Rlc3RzID0gJ2FwaS92MS90ZXN0L2J1bGstZGVsZXRlJyxcbiAgRGVsZXRlUnVuID0gJ2FwaS92MS9ydW4vZGVsZXRlJyxcbiAgRGVsZXRlVGVzdCA9ICdhcGkvdjEvdGVzdC9kZWxldGUnLFxuICBEZWxldGVUb2tlbiA9ICdhcGkvdjEvdG9rZW4vZGVsZXRlJyxcbiAgRG93bmxvYWRSZXBvcnQgPSAnYXBpL3YxL3J1bi9yZXBvcnQtZG93bmxvYWQnLFxuICBEb3dubG9hZFRlc3RzID0gJ2FwaS92MS90ZXN0cy9kb3dubG9hZCcsXG4gIEVkaXRQcm9qZWN0ID0gJ2FwaS92MS9wcm9qZWN0L2VkaXQnLFxuICBFZGl0UHJvamVjdFN0YXR1cyA9ICdhcGkvdjEvcHJvamVjdC91cGRhdGUtc3RhdHVzJyxcbiAgRWRpdFJ1biA9ICdhcGkvdjEvcnVuL2VkaXQnLFxuICBFZGl0VGVzdCA9ICdhcGkvdjEvdGVzdC91cGRhdGUnLFxuICBFZGl0VGVzdHNJbkJ1bGsgPSAnYXBpL3YxL3Rlc3QvYnVsay11cGRhdGUnLFxuICBHZXRBdXRvbWF0aW9uU3RhdHVzID0gJ2FwaS92MS9hdXRvbWF0aW9uLXN0YXR1cycsXG4gIEdldExhYmVscyA9ICdhcGkvdjEvbGFiZWxzJyxcbiAgR2V0T3JnRGV0YWlscyA9ICdhcGkvdjEvb3JnL2RldGFpbCcsXG4gIEdldE9yZ3NMaXN0ID0gJ2FwaS92MS9vcmdzJyxcbiAgR2V0UGxhdGZvcm1zID0gJ2FwaS92MS9wbGF0Zm9ybScsXG4gIEdldFByaW9yaXR5ID0gJ2FwaS92MS9wcmlvcml0eScsXG4gIEdldFByb2plY3REZXRhaWwgPSAnYXBpL3YxL3Byb2plY3QvZGV0YWlsJyxcbiAgR2V0UHJvamVjdHMgPSAnYXBpL3YxL3Byb2plY3RzJyxcbiAgR2V0UnVucyA9ICdhcGkvdjEvcnVucycsXG4gIEdldFJ1blN0YXRlRGV0YWlsID0gJ2FwaS92MS9ydW4vc3RhdGUtZGV0YWlsJyxcbiAgR2V0UnVuVGVzdHNMaXN0ID0gJ2FwaS92MS9ydW4vdGVzdHMnLFxuICBHZXRSdW5UZXN0U3RhdHVzID0gJ2FwaS92MS9ydW4vdGVzdC1zdGF0dXMnLFxuICBHZXRTZWN0aW9ucyA9ICdhcGkvdjEvcHJvamVjdC9zZWN0aW9ucycsXG4gIEdldFNxdWFkcyA9IGBhcGkvdjEvcHJvamVjdC9zcXVhZHNgLFxuICBHZXRUZXN0Q292ZXJlZEJ5ID0gJ2FwaS92MS90ZXN0LWNvdmVyZWQtYnknLFxuICBHZXRUZXN0RGV0YWlscyA9ICdhcGkvdjEvdGVzdC9kZXRhaWxzJyxcbiAgR2V0VGVzdHMgPSAnYXBpL3YxL3Byb2plY3QvdGVzdHMnLFxuICBHZXRUZXN0c0NvdW50ID0gJ2FwaS92MS9wcm9qZWN0L3Rlc3RzLWNvdW50JyxcbiAgR2V0VGVzdFN0YXR1c0hpc3RvcnkgPSAnYXBpL3YxL3Rlc3QvdGVzdC1zdGF0dXMtaGlzdG9yeScsXG4gIEdldFRlc3RTdGF0dXNIaXN0b3J5SW5SdW4gPSAnYXBpL3YxL3J1bi90ZXN0LXN0YXR1cy1oaXN0b3J5JyxcbiAgR2V0VHlwZSA9ICdhcGkvdjEvdHlwZScsXG4gIEdldFVzZXJEZXRhaWxzID0gJ2FwaS92MS91c2VyL2RldGFpbHMnLFxuICBSdW5EZXRhaWwgPSAnYXBpL3YxL3J1bi9kZXRhaWwnLFxuICBSdW5Mb2NrID0gJ2FwaS92MS9ydW4vbG9jaycsXG4gIFJ1blJlbW92ZVRlc3QgPSAnYXBpL3YxL3J1bi9yZW1vdmUtdGVzdHMnLFxuICBSdW5SZXNldCA9ICdhcGkvdjEvcnVuL3Jlc2V0JyxcbiAgUnVuVXBkYXRlVGVzdFN0YXR1cyA9ICdhcGkvdjEvcnVuL3VwZGF0ZS10ZXN0LXN0YXR1cycsXG4gIEdldEFsbFVzZXIgPSAnYXBpL3YxL2FsbC11c2VycycsXG4gIFVwZGF0ZVVzZXJSb2xlID0gJ2FwaS92MS91c2VyL3VwZGF0ZS1yb2xlJyxcbiAgQWRkU2VjdGlvbiA9ICdhcGkvdjEvcHJvamVjdC9hZGQtc2VjdGlvbicsXG59XG5cbmV4cG9ydCBjb25zdCBBUElfUkVTT0xVVElPTl9QQVRIUyA9IHtcbiAgW0FQSS5BZGRMYWJlbHNdOiAncm91dGVzL2FwaS92MS9hZGRMYWJlbHMudHMnLFxuICBbQVBJLkFkZFByb2plY3RzXTogJ3JvdXRlcy9hcGkvdjEvY3JlYXRlUHJvamVjdHMudHMnLFxuICBbQVBJLkFkZFJ1bl06ICdyb3V0ZXMvYXBpL3YxL2NyZWF0ZVJ1bi50cycsXG4gIFtBUEkuQWRkU3F1YWRzXTogJ3JvdXRlcy9hcGkvdjEvYWRkU3F1YWRzLnRzJyxcbiAgW0FQSS5BZGRUZXN0XTogJ3JvdXRlcy9hcGkvdjEvY3JlYXRlVGVzdC50cycsXG4gIFtBUEkuQWRkVGVzdEJ1bGtdOiAncm91dGVzL2FwaS92MS9idWxrQWRkVGVzdC50cycsXG4gIFtBUEkuQWRkVG9rZW5dOiAncm91dGVzL2FwaS92MS9nZW5lcmF0ZVRva2VuLnRzJyxcbiAgW0FQSS5EZWxldGVCdWxrVGVzdHNdOiAncm91dGVzL2FwaS92MS9idWxrRGVsZXRlVGVzdHMudHMnLFxuICBbQVBJLkRlbGV0ZVJ1bl06ICdyb3V0ZXMvYXBpL3YxL2RlbGV0ZVJ1bi50cycsXG4gIFtBUEkuRGVsZXRlVGVzdF06ICdyb3V0ZXMvYXBpL3YxL2RlbGV0ZVRlc3QudHMnLFxuICBbQVBJLkRlbGV0ZVRva2VuXTogJ3JvdXRlcy9hcGkvdjEvZGVsZXRlVG9rZW4udHMnLFxuICBbQVBJLkRvd25sb2FkUmVwb3J0XTogJ3JvdXRlcy9hcGkvdjEvZG93bmxvYWRSZXBvcnQudHMnLFxuICBbQVBJLkRvd25sb2FkVGVzdHNdOiAncm91dGVzL2FwaS92MS9kb3dubG9hZFRlc3RzLnRzJyxcbiAgW0FQSS5FZGl0UHJvamVjdF06ICdyb3V0ZXMvYXBpL3YxL2VkaXRQcm9qZWN0LnRzJyxcbiAgW0FQSS5FZGl0UHJvamVjdFN0YXR1c106ICdyb3V0ZXMvYXBpL3YxL3VwZGF0ZVByb2plY3RTdGF0dXMudHMnLFxuICBbQVBJLkVkaXRSdW5dOiAncm91dGVzL2FwaS92MS9lZGl0UnVuLnRzJyxcbiAgW0FQSS5FZGl0VGVzdF06ICdyb3V0ZXMvYXBpL3YxL3VwZGF0ZVRlc3QudHMnLFxuICBbQVBJLkVkaXRUZXN0c0luQnVsa106ICdyb3V0ZXMvYXBpL3YxL3VwZGF0ZVRlc3RzLnRzJyxcbiAgW0FQSS5HZXRBdXRvbWF0aW9uU3RhdHVzXTogJ3JvdXRlcy9hcGkvdjEvYXV0b21hdGlvblN0YXR1cy50cycsXG4gIFtBUEkuR2V0TGFiZWxzXTogJ3JvdXRlcy9hcGkvdjEvbGFiZWxzLnRzJyxcbiAgW0FQSS5HZXRPcmdEZXRhaWxzXTogJ3JvdXRlcy9hcGkvdjEvb3JnLnRzJyxcbiAgW0FQSS5HZXRPcmdzTGlzdF06ICdyb3V0ZXMvYXBpL3YxL29yZ0xpc3QudHMnLFxuICBbQVBJLkdldFBsYXRmb3Jtc106ICdyb3V0ZXMvYXBpL3YxL3BsYXRmb3JtLnRzJyxcbiAgW0FQSS5HZXRQcmlvcml0eV06ICdyb3V0ZXMvYXBpL3YxL3ByaW9yaXR5LnRzJyxcbiAgW0FQSS5HZXRQcm9qZWN0RGV0YWlsXTogJ3JvdXRlcy9hcGkvdjEvcHJvamVjdERhdGEudHMnLFxuICBbQVBJLkdldFByb2plY3RzXTogJ3JvdXRlcy9hcGkvdjEvcHJvamVjdHMudHMnLFxuICBbQVBJLkdldFJ1bnNdOiAncm91dGVzL2FwaS92MS9ydW5zLnRzJyxcbiAgW0FQSS5HZXRSdW5TdGF0ZURldGFpbF06ICdyb3V0ZXMvYXBpL3YxL3J1bk1ldGFJbmZvLnRzJyxcbiAgW0FQSS5HZXRSdW5UZXN0c0xpc3RdOiAncm91dGVzL2FwaS92MS9ydW5UZXN0c0xpc3QudHMnLFxuICBbQVBJLkdldFJ1blRlc3RTdGF0dXNdOiAncm91dGVzL2FwaS92MS90ZXN0U3RhdHVzLnRzJyxcbiAgW0FQSS5HZXRTZWN0aW9uc106ICdyb3V0ZXMvYXBpL3YxL3NlY3Rpb25zLnRzJyxcbiAgW0FQSS5HZXRTcXVhZHNdOiAncm91dGVzL2FwaS92MS9zcXVhZHMudHMnLFxuICBbQVBJLkdldFRlc3RDb3ZlcmVkQnldOiAncm91dGVzL2FwaS92MS90ZXN0Q292ZXJlZEJ5LnRzJyxcbiAgW0FQSS5HZXRUZXN0RGV0YWlsc106ICdyb3V0ZXMvYXBpL3YxL3Rlc3REZXRhaWxzLnRzJyxcbiAgW0FQSS5HZXRUZXN0c106ICdyb3V0ZXMvYXBpL3YxL3Rlc3RzLnRzJyxcbiAgW0FQSS5HZXRUZXN0c0NvdW50XTogJ3JvdXRlcy9hcGkvdjEvdGVzdHNDb3VudC50cycsXG4gIFtBUEkuR2V0VGVzdFN0YXR1c0hpc3RvcnldOiAncm91dGVzL2FwaS92MS90ZXN0U3RhdHVzSGlzdG9yeS50cycsXG4gIFtBUEkuR2V0VGVzdFN0YXR1c0hpc3RvcnlJblJ1bl06ICdyb3V0ZXMvYXBpL3YxL3Rlc3RTdGF0dXNIaXN0b3J5T2ZSdW4udHMnLFxuICBbQVBJLkdldFR5cGVdOiAncm91dGVzL2FwaS92MS90eXBlLnRzJyxcbiAgW0FQSS5HZXRVc2VyRGV0YWlsc106ICdyb3V0ZXMvYXBpL3YxL3VzZXJEZXRhaWxzLnRzJyxcbiAgW0FQSS5SdW5EZXRhaWxdOiAncm91dGVzL2FwaS92MS9ydW5EYXRhLnRzJyxcbiAgW0FQSS5SdW5Mb2NrXTogJ3JvdXRlcy9hcGkvdjEvbG9ja1J1bi50cycsXG4gIFtBUEkuUnVuUmVtb3ZlVGVzdF06ICdyb3V0ZXMvYXBpL3YxL3JlbW92ZVRlc3RGcm9tUnVuLnRzJyxcbiAgW0FQSS5SdW5SZXNldF06ICdyb3V0ZXMvYXBpL3YxL21hcmtQYXNzZWRBc1JldGVzdC50cycsXG4gIFtBUEkuUnVuVXBkYXRlVGVzdFN0YXR1c106ICdyb3V0ZXMvYXBpL3YxL3VwZGF0ZVN0YXR1c1Rlc3RSdW5zLnRzJyxcbiAgW0FQSS5HZXRBbGxVc2VyXTogJ3JvdXRlcy9hcGkvdjEvZ2V0QWxsVXNlci50cycsXG4gIFtBUEkuVXBkYXRlVXNlclJvbGVdOiAncm91dGVzL2FwaS92MS91cGRhdGVVc2VyVHlwZS50cycsXG4gIFtBUEkuQWRkU2VjdGlvbl06ICdyb3V0ZXMvYXBpL3YxL2FkZFNlY3Rpb24udHMnLFxufVxuXG5leHBvcnQgY29uc3QgQ0xPU0VEX0FQSSA9IHtcbiAgLy8gR2VuZXJhdGVUb2tlbjogJ2FwaS92MS9nZW5lcmF0ZVRva2VuJyxcbn1cblxuZXhwb3J0IGNvbnN0IEFwaVRvVHlwZU1hcDoge1xuICBba2V5IGluIEFQSV06IEFwaVR5cGVzXG59ID0ge1xuICBbQVBJLkFkZExhYmVsc106IEFwaVR5cGVzLlBPU1QsXG4gIFtBUEkuQWRkUHJvamVjdHNdOiBBcGlUeXBlcy5QT1NULFxuICBbQVBJLkFkZFJ1bl06IEFwaVR5cGVzLlBPU1QsXG4gIFtBUEkuQWRkU3F1YWRzXTogQXBpVHlwZXMuUE9TVCxcbiAgW0FQSS5BZGRUZXN0XTogQXBpVHlwZXMuUE9TVCxcbiAgW0FQSS5BZGRUZXN0QnVsa106IEFwaVR5cGVzLlBPU1QsXG4gIFtBUEkuQWRkVG9rZW5dOiBBcGlUeXBlcy5QT1NULFxuICBbQVBJLkRlbGV0ZUJ1bGtUZXN0c106IEFwaVR5cGVzLkRFTEVURSxcbiAgW0FQSS5EZWxldGVSdW5dOiBBcGlUeXBlcy5ERUxFVEUsXG4gIFtBUEkuRGVsZXRlVGVzdF06IEFwaVR5cGVzLkRFTEVURSxcbiAgW0FQSS5EZWxldGVUb2tlbl06IEFwaVR5cGVzLkRFTEVURSxcbiAgW0FQSS5Eb3dubG9hZFJlcG9ydF06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5Eb3dubG9hZFRlc3RzXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkVkaXRQcm9qZWN0XTogQXBpVHlwZXMuUFVULFxuICBbQVBJLkVkaXRQcm9qZWN0U3RhdHVzXTogQXBpVHlwZXMuUFVULFxuICBbQVBJLkVkaXRSdW5dOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuRWRpdFRlc3RdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuRWRpdFRlc3RzSW5CdWxrXTogQXBpVHlwZXMuUFVULFxuICBbQVBJLkdldEF1dG9tYXRpb25TdGF0dXNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0TGFiZWxzXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldE9yZ0RldGFpbHNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0T3Jnc0xpc3RdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0UGxhdGZvcm1zXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFByaW9yaXR5XTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFByb2plY3REZXRhaWxdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0UHJvamVjdHNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0UnVuc106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRSdW5TdGF0ZURldGFpbF06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRSdW5UZXN0c0xpc3RdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0UnVuVGVzdFN0YXR1c106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRTZWN0aW9uc106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRTcXVhZHNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0VGVzdENvdmVyZWRCeV06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRUZXN0RGV0YWlsc106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRUZXN0c106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRUZXN0c0NvdW50XTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFRlc3RTdGF0dXNIaXN0b3J5XTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFRlc3RTdGF0dXNIaXN0b3J5SW5SdW5dOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0VHlwZV06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRVc2VyRGV0YWlsc106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5SdW5EZXRhaWxdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuUnVuTG9ja106IEFwaVR5cGVzLlBVVCxcbiAgW0FQSS5SdW5SZW1vdmVUZXN0XTogQXBpVHlwZXMuUFVULFxuICBbQVBJLlJ1blJlc2V0XTogQXBpVHlwZXMuUFVULFxuICBbQVBJLlJ1blVwZGF0ZVRlc3RTdGF0dXNdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuR2V0QWxsVXNlcl06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5VcGRhdGVVc2VyUm9sZV06IEFwaVR5cGVzLlBVVCxcbiAgW0FQSS5BZGRTZWN0aW9uXTogQXBpVHlwZXMuUE9TVCxcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVMsU0FBUSxjQUFjLGFBQVk7QUFDblUsU0FBUSxzQkFBcUI7QUFDN0IsU0FBUSxvQkFBbUI7QUFDM0IsT0FBTyxtQkFBbUI7OztBQ1VuQixJQUFLLE1BQUwsa0JBQUtBLFNBQUw7QUFDTCxFQUFBQSxLQUFBLGVBQVk7QUFDWixFQUFBQSxLQUFBLGlCQUFjO0FBQ2QsRUFBQUEsS0FBQSxZQUFTO0FBQ1QsRUFBQUEsS0FBQSxlQUFZO0FBQ1osRUFBQUEsS0FBQSxhQUFVO0FBQ1YsRUFBQUEsS0FBQSxpQkFBYztBQUNkLEVBQUFBLEtBQUEsY0FBVztBQUNYLEVBQUFBLEtBQUEscUJBQWtCO0FBQ2xCLEVBQUFBLEtBQUEsZUFBWTtBQUNaLEVBQUFBLEtBQUEsZ0JBQWE7QUFDYixFQUFBQSxLQUFBLGlCQUFj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
