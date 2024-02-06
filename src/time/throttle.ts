// --------
// THROTTLE
// --------

/**
 * Throttles the execution of a function by a specified time limit.
 * 
 * @param fn The function to be throttled.
 * @param limit The time limit in milliseconds.
 * @returns The throttled function.
 * 
 * @example
 * const throttled = throttle(() => console.log('Hello, World!'), 1000);
 * throttled(); // Logs 'Hello, World!' immediately.
 * throttled(); // Does nothing.
 * throttled(); // Does nothing.
 * ...
 * throttled(); // Logs 'Hello, World!' after 1 second.
 */
export function throttle<F extends (...args: any[]) => any>(fn: F, limit: number) {
    let waiting = false
    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        if (!waiting) {
            fn.apply(this, args)
            waiting = true
            setTimeout(() => { waiting = false }, limit)
        }
    } as F;
}
