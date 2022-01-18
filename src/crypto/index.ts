//  Library
import * as fs from 'fs'
import * as crypto from 'crypto'
import { Transform, TransformCallback, TransformOptions } from 'stream'

//  Defaults
const HASH_ALGORITHM = 'sha256'
const ENCRYPTION_ALGORITHM = 'aes256'

//TODO: Split into separate files

//  GENERATE CIPHER KEY
//  ===================

/**
 * Generates a cipher-key by creating a hash using the given password
 * @param password Password used to generate the cryptographic hash
 * @param algorithm Hashing algorithm
 * @param options Hashing options
 * @returns Cryptographic Cipher Key
 */
export function generateCipherKey(password: string, algorithm: string = HASH_ALGORITHM, options?: crypto.HashOptions) {
    if (!password) { throw Error('Invalid password') }
    return crypto.createHash(algorithm, options).update(password).digest()
}

//  GENERATE HMAC
//  =============

/**
 * Generates HMAC using cipher-key and text in given format
 * @param cipherKey Cipher key generated using a password
 * @param text Text to generate HMAC of
 * @param algorithm Hashing algorithm
 * @param format Digest format (defaults to 'hex')
 * @param options Transform Options
 * @returns HMAC
 */
export function generateHMAC(
    cipherKey: Buffer,
    text: string | Buffer,
    algorithm: string = HASH_ALGORITHM,
    format: crypto.BinaryToTextEncoding = 'hex',
    options?: TransformOptions
) {
    return crypto.createHmac(algorithm, cipherKey, options).update(text).digest(format)
}

//  ADD IV TRANSFORM
//  ================

/** Extend Node.js Stream-Transform class to add IV (initialization vector) infront of stream */
class AddIV extends Transform {

    private iv: Buffer
    private done: boolean = false

    constructor(iv: Buffer, options?: TransformOptions) {
        super()

        this.iv = iv
        this.done = false
    }

    _transform(chunk: string | Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        //  Add IV to the stream and set done
        if (!this.done) {
            this.push(this.iv)
            this.done = true
        }

        //  Continue pusing the chunks as is
        this.push(chunk, encoding)

        callback()
    }

}

//  ==========
//  ENCRYPTION
//  ==========

/**
 * Encrypts the given data using the given password
 * @param data Data to encrypt (string | Buffer)
 * @param password Password used to generate the cipher for encryption
 * @param algorithm Encryption algorithm (default: aes256)
 * @returns Encrypted Data
 */
export function encrypt(data: string | Buffer, password: string, algorithm: string = ENCRYPTION_ALGORITHM) {  //? Check types for algorithms
    const key = generateCipherKey(password) //  Generate Cipher Key

    const iv = crypto.randomBytes(16)   //  Generate Initialization Vector  //? Extract into function?
    const cipher = crypto.createCipheriv(algorithm, key, iv)    //  Generate Cipher

    const encryptedBuffer = Buffer.concat([iv, cipher.update(data), cipher.final()])  //  Adds IV to the start and returns the buffer

    //  Generate and add HMAC infront of Buffer
    const HMAC = Buffer.from(generateHMAC(key, encryptedBuffer))
    const result = Buffer.concat([HMAC, encryptedBuffer])

    return result
}

/**
 * Encrypts the file-contents of the file at srcPath using the given password and writes to destPath
 * @param srcPath Source File Path
 * @param destPath Destination File Path
 * @param password Password used to generate the cipher for encryption
 * @param algorithm Encryption algorithm
 */
export function encryptFile(srcPath: fs.PathLike, destPath: fs.PathLike, password: string, algorithm: string = ENCRYPTION_ALGORITHM) {
    const key = generateCipherKey(password) //  Generate Cipher Key

    const iv = crypto.randomBytes(16)   //  Generate Initialization Vector //? Again, extract into function?
    const addIV = new AddIV(iv)     //  Stream Transform to add IV infront of the piped stream

    const cipher = crypto.createCipheriv(algorithm, key, iv)    //  Generate cipher

    //  Process File-Stream
    const readStream = fs.createReadStream(srcPath)
    const writeStream = fs.createWriteStream(destPath)

    readStream
        .pipe(cipher)
        .pipe(addIV)
        .pipe(writeStream)
}

//  ==========
//  DECRYPTION
//  ==========

/**
 * Decrypts the encrypted data using the given password
 * @param encryptedData Encrypted data
 * @param password Password used to generate the decipher for decrpytion
 * @param algorithm Decryption algorithm
 * @returns Decrypted data
 */
export function decrypt(encryptedData: string | Buffer, password: string, algorithm: string = ENCRYPTION_ALGORITHM) {
    const key = generateCipherKey(password) //  Generate Cipher Key

    const extractedHMAC = Buffer.from(encryptedData.slice(0, 64))    //  Extract HMAC
    const encryptedBuffer = Buffer.from(encryptedData.slice(64))    //  Rest of the encrypted message

    const actualHMAC = Buffer.from(generateHMAC(key, encryptedBuffer))  //  Generate actual HMAC
    if (!crypto.timingSafeEqual(actualHMAC, extractedHMAC)) { throw Error('HMACs do not match') }   //  Verify HMAC     //TODO: Learn more aboout timingSafeEqual

    const iv = encryptedBuffer.slice(0, 16) //  Extract the Initialization Vector
    const content = encryptedBuffer.slice(16)   //  Rest of the content

    const decipher = crypto.createDecipheriv(algorithm, key, iv)    //  Create Decipher

    const result = Buffer.concat([decipher.update(content), decipher.final()])
    return result
}

/**
 * Decrypts the file at srcPath using the given password and writes to destPath
 * @param srcPath Source Path
 * @param destPath Destination Path
 * @param password Password used for decryption
 * @param algorithm Decryption algorithm
 */
export function decryptFile(srcPath: fs.PathLike, destPath: fs.PathLike, password: string, algorithm: string = ENCRYPTION_ALGORITHM) {
    const key = generateCipherKey(password) //  Generate Cipher Key //TODO: Accept in optional paramters too

    const readIV = fs.createReadStream(srcPath, { end: 15 })    //  Creates a read stream that reads the first 16 characters of srcPath file

    //  Extract Initialization Vector
    let iv: string | Buffer
    readIV.on('data', chunk => iv = chunk)

    //  Start Decryption
    readIV.on('close', () => {

        const decipher = crypto.createDecipheriv(algorithm, key, iv)    //  Create Decipher

        const readStream = fs.createReadStream(srcPath, { start: 16 })  //  Read the rest of the content
        const writeStream = fs.createWriteStream(destPath)

        readStream
            .pipe(decipher)
            .pipe(writeStream)

    })

}