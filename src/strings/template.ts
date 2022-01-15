/** RegExp for placeholders: {{ variable }} */
const TEMPLATE_REGEX = /\{\{\s*(.*?)\s*\}\}/g

type data = Record<string, string | number | boolean>

/**
 * Interprets a template by performing regex-replace using the given data props
 * @param template Source template string
 * @param data Data object containing all the props
 * @returns Interpreted result
 */
export function interpret(template: string, data?: data) {
    return template.replace(TEMPLATE_REGEX, (match, capture) => {
        if (!data || !capture || !(capture in data)) { return match }
        return data[capture].toString()
    })
}

/**
 * Compiles the template into a renderer function
 * @param template Source template string
 * @returns Compiled renderer function
 */
export function compile(template: string) {
    /** Variable to hold compiled code */
    const code = ["''"]

    /** Match regex for template placeholders */
    let match = TEMPLATE_REGEX.exec(template)
    while (match) {

        //  If a string precedes the match, slice it out and push to code
        if (match.index !== 0) {
            code.push(`+"${template.slice(0, match.index)}"`)
            template = template.slice(match.index)
        }

        //  Slice out the captured key and push to code
        code.push(`+data.${match[1]}`)
        template = template.slice(match[0].length)

        /**
         * When you run `exec` on a RegExp object with the `g` flag, it sets the `lastIndex` to the last match's index
         * Calling `exec` again on the same RegExp object makes it start looking from the `lastIndex`, skipping all but the first match
         * Setting `lastIndex` to 0 manually effectively *resets* the RegExp without having to destroy-and-create new RegExp objects
         * @see https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically
         */
        TEMPLATE_REGEX.lastIndex = 0

        //  Continue iterating
        match = TEMPLATE_REGEX.exec(template)
    }

    //  Push the rest of the template
    if (template) { code.push(`+"${template}"`) }

    //  Return the compiled code
    return new Function("data", "return " + code.join('')) as (data: data) => string
}