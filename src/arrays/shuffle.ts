/**
 * Shuffle elements of an array
 * @param arr Array
 * @returns Shuffled Array
 */
export const shuffle = (arr: any[]) => arr.sort(() => 0.5 - Math.random())