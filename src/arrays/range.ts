// -----
// RANGE
// -----

/**
 * Generates a sequence of numbers within a specified range.
 * @param start The starting number of the range.
 * @param end The ending number of the range (exclusive).
 * @param step The increment value between each number in the range.
 * @returns An iterator that yields the numbers in the range.
 * 
 * @example
 * for (const i of range(0, 5)) {
 *    console.log(i); // Logs 0, 1, 2, 3, 4
 * }
 * @example
 * const numbers = [...range(0, 5)]; // [0, 1, 2, 3, 4]
 * @example
 * const numbers = [...range(0, 5, 2)]; // [0, 2, 4]
 * @example
 * const numbers = [...range(5, 0, -1)]; // [5, 4, 3, 2, 1]
 */
export function* range(start: number, end: number, step: number = 1) {
    for (let i = start; i < end; i += step) {
        yield i
    }
}
