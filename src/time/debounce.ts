// --------
// DEBOUNCE
// --------

/**
 * Creates a debounced version of a function that delays its execution until after a specified wait time.
 * 
 * @param fn The function to debounce.
 * @param wait The number of milliseconds to wait before executing the debounced function.
 * @returns A debounced version of the original function.
 * 
 * @example
 * const debounced = debounce(() => console.log('Hello, World!'), 1000);
 * debounced(); // Does nothing immediately.
 * debounced(); // Does nothing immediately.
 * debounced(); // Invokes the debounced function after 1 second.
 * 
 * @example
 * const debounced = debounce(() => console.log('Hello, World!'), 1000);
 * debounced.cancel(); // Cancels the debounced function invocation.
 * 
 * @example
 * const debounced = debounce(() => console.log('Hello, World!'), 1000);
 * debounced.invoke(); // Invokes the debounced function immediately.
 */
function debounce<F extends (...args: any[]) => any>(fn: F, wait: number): DebouncedFn<F> {

    /** The identifier of the timeout used to delay the function execution. */
    let timeout: NodeJS.Timeout;

    /** The debounced function that delays its execution until after a specified wait time. */
    const debouncedFn = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };

    /** Cancels the debounced function invocation to prevents it from being called. */
    debouncedFn.cancel = () => clearTimeout(timeout);

    /** Invokes the debounced function immediately. */
    debouncedFn.invoke = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        clearTimeout(timeout);
        fn.apply(this, args);
    } as F;

    return debouncedFn as DebouncedFn<F>;

}

// TYPE DEFINITIONS
// ----------------

/** The debounced version of a function that delays its execution until after a specified wait time. */
type DebouncedFn<F extends (...args: any[]) => any> = F & {
    /** Cancels the debounced function invocation to prevents it from being called. */
    cancel: () => void;
    /** Invokes the debounced function immediately. */
    invoke: F;
};
