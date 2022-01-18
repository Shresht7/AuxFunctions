/**
 * Reports the execution time for the given function
 * @param fn Function to measure execution time of
 * @param args Arguments to pass to the function
 */
export function timeExecution<T extends Array<any>>(fn: (...args: T) => void, ...args: T) {
    const label = `Time to execute ${fn.name}`
    console.time(label)
    fn(...args)
    console.timeEnd(label)
}

//TODO: Add option to specify number of iterations