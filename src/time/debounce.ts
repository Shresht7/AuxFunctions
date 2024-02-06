/**
 * Creates a debounced version of a function that delays its execution until after a specified wait time.
 * @param fn The function to debounce.
 * @param wait The number of milliseconds to wait before executing the debounced function.
 * @returns A debounced version of the original function.
 */
function debounce<F extends (...args: any[]) => any>(fn: F, wait: number) {
    let timeoutID: NodeJS.Timeout;
    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => fn.apply(this, args), wait);
    } as F;
}
