type ValidatorFunction<T = any> = (val: T) => true | false

export function validate<T>(value: T) {
    return {
        is: (...fns: ValidatorFunction[]) => fns.reduce((acc, curr) => acc && curr(value), true)
    }
}

export const not = (vF: ValidatorFunction) => (val: any) => !vF(val)

export const validators = {
    undefined: <T>(val: T) => typeof val === 'undefined',
    null: <T>(val: T) => val === null,
    boolean: <T>(val: T) => typeof val === 'boolean',
    string: <T>(val: T) => typeof val === 'string',
    number: <T>(val: T) => typeof val === 'number',
    object: <T>(val: T) => typeof val === 'object' && val != null,
    array: <T>(val: T) => validators.object(val) && Array.isArray(val),
    function: <T>(val: T) => typeof val === 'function' && val instanceof Function,
    buffer: <T>(val: T) => validators.object(val) && val instanceof Buffer,
    regex: <T>(val: T) => validators.object(val) && val instanceof RegExp
}