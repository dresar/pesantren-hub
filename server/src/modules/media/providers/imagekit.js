import ImageKit from "imagekit";
export class ImageKitProvider {
    client;
    constructor(config) {
        this.client = new ImageKit({
            publicKey: config.publicKey,
            privateKey: config.privateKey,
            urlEndpoint: config.urlEndpoint,
        });
    }
    async upload(file, fileName, folder = '/') {
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
        }
        catch (error) {
            console.error('ImageKit Upload Error:', error);
            // Re-throw with more context if possible
            if (error instanceof Error) {
                throw new Error(`ImageKit Upload Failed: ${error.message}`);
            }
            throw error;
        }
    }
    async delete(fileId) {
        try {
            await this.client.deleteFile(fileId);
        }
        catch (error) {
            console.error('ImageKit Delete Error:', error);
            throw error;
        }
    }
    async getFileDetails(fileId) {
        try {
            return await this.client.getFileDetails(fileId);
        }
        catch (error) {
            console.error('ImageKit GetDetails Error:', error);
            throw error;
        }
    }
}
