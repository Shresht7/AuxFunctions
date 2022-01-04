/**
 * Generates an array with values ranging from start to end
 * @param start Start range at
 * @param end End range at
 * @param step Range step
 * @returns Array with values ranging from start to end
 */
export function range(start: number, end: number, step: number = 1) {
    const len = Math.floor((end - start) / step) + 1    //  Length of range
    return new Array(len).fill(0).map((_, i) => start + (i * step)) //  Build range array
}