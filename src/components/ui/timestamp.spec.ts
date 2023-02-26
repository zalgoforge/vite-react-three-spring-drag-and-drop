import { describe, expect, it } from "@jest/globals";
import { createFindTimestampIndexes } from "./timestamp";

describe("snaphost module", () => {
  const table: [[number[], number], number[]][] = [
    [
      [[0, 1, 2], 0],
      [0, 0],
    ],
    [
      [[0, 1, 2], 0.5],
      [0, 1],
    ],
    [
      [[0, 1, 2], 1],
      [1, 1],
    ],
    [
      [[0, 1, 2], 2],
      [2, 2],
    ],
    [
      [[0, 1, 2], 3],
      [2, 2],
    ],
    [
      [[0, 1, 2], -1],
      [0, 0],
    ],
    [
      [[], 1.5],
      [-1, -1],
    ],
  ];

  it.each(table)(
    "finds snaphots when time is %o",
    (
      [timestamps, targetTimestamp],
      [expectedPreviousSnapshotIndex, expectedCurrentSnapshotIndex]
    ) => {
      const findTimestampIndexes = createFindTimestampIndexes<number>((x) => x);

      const [previousSnapshotIndex, currentSnapshotIndex] =
        findTimestampIndexes(timestamps, targetTimestamp);

      expect(previousSnapshotIndex).toEqual(expectedPreviousSnapshotIndex);
      expect(currentSnapshotIndex).toEqual(expectedCurrentSnapshotIndex);
    }
  );
});
