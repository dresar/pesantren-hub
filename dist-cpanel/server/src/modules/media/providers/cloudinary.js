"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
class CloudinaryProvider {
    constructor(config) {
        cloudinary_1.v2.config({
            cloud_name: config.cloudName,
            api_key: config.apiKey,
            api_secret: config.apiSecret,
        });
    }
    async upload(file, fileName, folder = '/') {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                public_id: fileName.split('.')[0], // Cloudinary often prefers public_id without extension
                folder: folder,
                resource_type: 'auto',
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('Upload failed, no result'));
                resolve({
                    fileId: result.public_id,
                    url: result.secure_url,
                    thumbnailUrl: result.secure_url, // Cloudinary generates thumbnails on fly usually
                    size: result.bytes,
                    height: result.height,
                    width: result.width,
                    fileType: result.format,
                    filePath: result.public_id, // Cloudinary uses public_id
                    name: result.original_filename || fileName,
                });
            });
            const stream = new stream_1.Readable();
            stream.push(file);
            stream.push(null);
            stream.pipe(uploadStream);
        });
    }
    async delete(fileId) {
        try {
            await cloudinary_1.v2.uploader.destroy(fileId);
        }
        catch (error) {
            console.error('Cloudinary Delete Error:', error);
            throw error;
        }
    }
    async getUsage() {
        try {
            // Cloudinary API usage method
            // Note: This requires the Admin API which might need different credentials or permissions
            // but usually the same API Key/Secret works for Admin API if it's the master account.
            const result = await cloudinary_1.v2.api.usage();
            // Return in bytes
            return {
                storage: {
                    usage: result.storage?.usage || 0,
                    limit: result.storage?.limit || 0 // Might be 0 if unlimited or credit based
                },
                bandwidth: {
                    usage: result.bandwidth?.usage || 0,
                    limit: result.bandwidth?.limit || 0
                },
                credits: {
                    usage: result.credits?.usage || 0,
                    limit: result.credits?.limit || 0
                }
            };
        }
        catch (error) {
            console.error('Cloudinary GetUsage Error:', error);
            // If Admin API fails (e.g. restricted key), return null
            return null;
        }
    }
}
exports.CloudinaryProvider = CloudinaryProvider;
