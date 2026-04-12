import ImageKit from "imagekit";
import { Readable } from 'stream';

export interface ImageKitConfig {
    publicKey: string;
    privateKey: string;
    urlEndpoint: string;
}

export class ImageKitProvider {
    private client: ImageKit;

    constructor(config: ImageKitConfig) {
        this.client = new ImageKit({
            publicKey: config.publicKey,
            privateKey: config.privateKey,
            urlEndpoint: config.urlEndpoint,
        });
    }

    async upload(file: Buffer, fileName: string, folder: string = '/') {
        try {
            console.log(`ImageKit: Uploading ${fileName} to ${folder} (Size: ${file.length} bytes)`);
            const response = await this.client.upload({
                file: file, // ImageKit SDK supports Buffer
                fileName: fileName,
                folder: folder,
                useUniqueFileName: true,
            });
            console.log('ImageKit: Upload success', response.fileId);
            return {
                fileId: response.fileId,
                url: response.url,
                thumbnailUrl: response.thumbnailUrl,
                size: response.size,
                height: response.height,
                width: response.width,
                fileType: response.fileType,
                filePath: response.filePath,
                name: response.name,
            };
        } catch (error) {
            console.error('ImageKit Upload Error:', error);
            // Re-throw with more context if possible
            if (error instanceof Error) {
                 throw new Error(`ImageKit Upload Failed: ${error.message}`);
            }
            throw error;
        }
    }

    async delete(fileId: string) {
        try {
            await this.client.deleteFile(fileId);
        } catch (error) {
            console.error('ImageKit Delete Error:', error);
            throw error;
        }
    }
    

    async getFileDetails(fileId: string) {
        try {
            return await this.client.getFileDetails(fileId);
        } catch (error) {
             console.error('ImageKit GetDetails Error:', error);
            throw error;
        }
    }
}
