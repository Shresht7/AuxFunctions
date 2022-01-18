/**
 * Utility function to determine the elapsed time since start
 * 
 * usage:
 * 
 * ```ts
 * const delta = time() //  Returns a closure with the start time
 * doTimeConsumingStuff()
 * const elapsed = delta()  //  Call the closure to calculate the elapsed time since start
 * 
 * console.log(elapsed + 'ms')     //  Elapsed time is in ms
 * ```
 * 
 * @param start Start time (in ms) - default: Date.now()
 * @returns Elapsed time since start (in ms)
 */
export const time = (start: number = Date.now()) => () => (Date.now() - start).toFixed(2)
