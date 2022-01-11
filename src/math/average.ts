/**
 * Calculate the average (arithmetic mean) of the given numbers
 * @param numbers Variadic array of numbers
 * @returns Arithmetic mean of the given numbers
 */
export const average = (...numbers: number[]) => (numbers.reduce((sum, n) => sum + n)) / numbers.length