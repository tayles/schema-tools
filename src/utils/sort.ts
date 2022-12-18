/**
 * Sorts string values based on their position within an array.
 * This can be useful for sorting enum values.
 *
 * @param a
 * @param b
 * @param lookupArr The array in which the values belong
 */
export function indexInListSortCompareFn(
  a: string,
  b: string,
  lookupArr: string[],
): number {
  const aIdx = lookupArr.findIndex((item) => a === item);
  const bIdx = lookupArr.findIndex((item) => b === item);

  return aIdx === bIdx ? 0 : aIdx > bIdx ? 1 : -1;
}
