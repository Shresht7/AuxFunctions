//  Library
import * as fs from 'fs'
import * as path from 'path'

//  WALK FILE SYSTEM
//  ================

/**
 * Walks the given directory and returns the corresponding paths
 * 
 * usage
 * 
 * ```ts
 * for await (const dir of walk('/dir/files/')) {
 *      console.log(dir)
 * }
 * ```
 * 
 * @param directory Directory to walk
 * @param options fs.OpenDirOptions
 */
export async function* walk(directory: fs.PathLike, options?: fs.OpenDirOptions): AsyncGenerator<string, void, unknown> {

    for await (const dir of await fs.promises.opendir(directory, options)) {
        const entry = path.join(directory.toString(), dir.name)

        if (dir.isDirectory()) { yield* walk(entry) }
        else if (dir.isFile()) { yield entry }
    }

}

/**
 * Walks the given directory and executes a callback function
 * @param directory Directory to walk
 * @param callback Callback function to execute for each entry
 */
export function walkdir(directory: fs.PathLike, callback: (filepath: string, stats: fs.Stats) => void) {

    fs.readdir(directory, (err, files) => {
        if (err) { throw err }

        files.forEach(file => {
            const entry = path.join(directory.toString(), file)

            fs.stat(entry, (err, stats) => {
                if (err) { throw err }

                if (stats.isDirectory()) { walkdir(entry, callback) }
                else if (stats.isFile()) { callback(entry, stats) }
            })
        })
    })

}

/**
 * Walks the given directory synchronously and executes a callback
 * @param directory Directory to walk
 * @param callback Callback function to execute
 */
export function walkdirSync(directory: fs.PathLike, callback: (filepath: string, stats: fs.Stats) => void) {

    fs.readdirSync(directory).forEach(file => {
        const entry = path.join(directory.toString(), file)
        const stats = fs.statSync(entry)

        if (stats.isDirectory()) { walkdirSync(entry, callback) }
        else if (stats.isFile()) { callback(entry, stats) }
    })

}