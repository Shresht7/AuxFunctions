/**
 * Composes the given function as a pipe
 * 
 * usage:
 * 
 * ```ts
 * const header = pipe(inverse, bold, color.red)('Project Title')
 * ```
 * 
 * @param fns Variadic array of callback functions to pipe
 * @returns Piped function
 */
export const pipe = (...fns: Function[]) => (...args: any[]) => fns.reduce((acc, currFn) => currFn(...acc), args)

/**
 * Composes the given function
 * 
 * usage:
 * 
 * ```ts
 * const rootMeanSquare = compose(root, mean, square)(2, 5)
 * ```
 * 
 * @param fns Variadic array of callback functions to compose
 * @returns Composed function
 */
export const compose = (...fns: Function[]) => (...args: any[]) => fns.reduceRight((acc, currFn) => currFn(...acc), args)