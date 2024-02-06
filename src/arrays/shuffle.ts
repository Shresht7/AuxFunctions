/**
 * Shuffles the elements of an array in place using the {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle | Fisher-Yates} algorithm.
 * @param arr The array to be shuffled.
 * @returns The shuffled array.
 * @example
 * shuffle([1, 2, 3, 4, 5]); // [3, 2, 5, 1, 4]
 * shuffle([1, 'a', true, null, undefined]); // [true, 1, null, 'a', undefined]
 * @see {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle | Wikipedia - Fisher-Yates Shuffle}
 */
export function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
