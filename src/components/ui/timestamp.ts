import { equals } from "../../lib/equals";

export const createFindTimestampIndexes =
  <T>(accessor: (obj: T) => number) =>
  (timestamps: T[], targetTimestamp: number): [number, number] => {
    if (timestamps.length === 0) {
      return [-1, -1];
    }

    if (targetTimestamp < timestamps[0]) {
      return [0, 0];
    }

    const matchingTimeExectlyIndex = timestamps.findIndex((timestamp) =>
      equals(accessor(timestamp))(targetTimestamp)
    );
    if (matchingTimeExectlyIndex !== -1) {
      return [matchingTimeExectlyIndex, matchingTimeExectlyIndex];
    }
    const snapshotIndex = timestamps.findIndex(
      (timestamp) => accessor(timestamp) > targetTimestamp
    );

    if (snapshotIndex === 0) {
      return [0, 0];
    }

    if (snapshotIndex === -1) {
      return [timestamps.length - 1, timestamps.length - 1];
    }

    return [snapshotIndex - 1, snapshotIndex];
  };
