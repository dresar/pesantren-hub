import crypto from 'crypto';
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_chars_min_len_must_be_32_bytes';
const IV_LENGTH = 16;
const key = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);
export const encrypt = (text) => {
    if (!text)
        return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    catch (error) {
        console.error('Encryption error:', error);
        return text;
    }
};
export const decrypt = (text) => {
    if (!text)
        return text;
    try {
        const textParts = text.split(':');
        if (textParts.length < 2)
            return text;
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (error) {
        return text;
    }
};
