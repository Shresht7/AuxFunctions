/**
 * Returns the result of regex match
 * @param str String to match
 * @param regex Regex to match with
 * @returns Capture array
 */
export function stringMatch(str: string, regex: RegExp) {
    const match = str.match(regex)  //  Match string with regex
    if (!match?.length) { return null } //  If no match, then return null
    const [_, ...matches] = match   //  extract matches
    return matches
}