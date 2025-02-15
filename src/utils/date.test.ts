import { formatDate, parseDateString, parseDateRangeString, formatDateQueryParam, isAllTime } from "./date";

describe("formatDate", () => {
  it("should format the date", () => {
    expect(formatDate(new Date("2023-03-13T17:20:21.198113"))).toEqual("Mar 13, 2023");
  });
});

describe("parseDateString", () => {
  it("should return undefined if date is not provided", () => {
    expect(parseDateString()).toBeUndefined();
  });

  it("should return the same date if it is already a Date object", () => {
    const date = new Date("2011-10-05T14:48:00.000Z");
    expect(parseDateString(date)).toEqual(date);
  });

  it("should parse the date string and return a Date object", () => {
    const dateString = "2011-10-05T14:48:00.000Z";
    const expected = new Date(dateString);
    expect(parseDateString(dateString)).toEqual(expected);
  });
});

describe("parseDateRangeString", () => {
  it("should return undefined if dateRange is not provided", () => {
    expect(parseDateRangeString()).toBeUndefined();
  });

  it("should parse the date range string", () => {
    const dateRange = {
      from: "2011-10-05T14:48:00.000Z",
      to: "2011-10-07T14:48:00.000Z",
    };
    const expected = {
      from: new Date(dateRange.from),
      to: new Date(dateRange.to),
    };
    expect(parseDateRangeString(dateRange)).toEqual(expected);
  });

  it("should parse the date range string with missing 'from' or 'to'", () => {
    const dateRange = {
      from: "2011-10-05T14:48:00.000Z",
    };
    const expected = {
      from: new Date(dateRange.from),
      to: undefined,
    };
    expect(parseDateRangeString(dateRange)).toEqual(expected);
  });
});

describe("formatDateQueryParam", () => {
  it("should format the date as a query parameter", () => {
    const date = new Date("2023-03-13T17:20:21.198113");
    expect(formatDateQueryParam(date)).toEqual("2023-03-13");
  });

  it("should format the date string as a query parameter", () => {
    const dateString = "2023-03-13T17:20:21.198113";
    expect(formatDateQueryParam(dateString)).toEqual("2023-03-13");
  });
});

describe("isAllTime", () => {
  it("should return true if dateRange.from and dateRange.to are equal to allTime.from and allTime.to", () => {
    const dateRange = {
      from: new Date(0),
      to: new Date(),
    };
    expect(isAllTime(dateRange)).toBe(true);
  });

  it("should return false if dateRange.from is different from allTime.from", () => {
    const dateRange = {
      from: new Date("2022-01-01T00:00:00.000Z"),
      to: new Date(),
    };
    expect(isAllTime(dateRange)).toBe(false);
  });

  it("should return false if dateRange.to is different from allTime.to", () => {
    const dateRange = {
      from: new Date(0),
      to: new Date("2022-12-31T23:59:59.999Z"),
    };
    expect(isAllTime(dateRange)).toBe(false);
  });

  it("should return false if dateRange.from and dateRange.to are different from allTime.from and allTime.to", () => {
    const dateRange = {
      from: new Date("2022-01-01T00:00:00.000Z"),
      to: new Date("2022-12-31T23:59:59.999Z"),
    };
    expect(isAllTime(dateRange)).toBe(false);
  });
});
