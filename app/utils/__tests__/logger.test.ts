import { logger, LogType } from "~/utils/logger"; // Adjust the path as necessary

describe("Logger Function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.console, "log").mockImplementation(() => {});
  });

  it("should log an exception with the correct format", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.EXCEPTION,
      tag: "ExceptionTag",
      message: "An exception occurred",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[EXCEPTION\]:::: ExceptionTag, \[An exception occurred\]/
      )
    );
  });

  it("should log an error with the correct format", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.ERROR,
      tag: "ErrorTag",
      message: "An error occurred",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[ERROR\]:::: ErrorTag, \[An error occurred\]/
      )
    );
  });

  it("should log a warning with the correct format", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.WARN,
      tag: "WarningTag",
      message: "A warning occurred",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[WARN\]:::: WarningTag, \[A warning occurred\]/
      )
    );
  });

  it("should log an info message with the correct format", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.INFO,
      tag: "InfoTag",
      message: "An informational message",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[INFO\]:::: InfoTag, \[An informational message\]/
      )
    );
  });

  it("should log a debug message with the correct format", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.DEBUG,
      tag: "DebugTag",
      message: "A debug message",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[DEBUG\]:::: DebugTag, \[A debug message\]/
      )
    );
  });

  it("should log an SQL error with the correct format", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.SQL_ERROR,
      tag: "SQLTag",
      message: "An SQL error occurred",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[SQL_ERROR\]:::: SQLTag, \[An SQL error occurred\]/
      )
    );
  });

  it("should handle logs without a tag", () => {
    const logSpy = jest.spyOn(global.console, "log");

    logger({
      type: LogType.INFO,
      message: "No tag provided",
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M\] \[INFO\]:::: , \[No tag provided\]/
      )
    );
  });
});
