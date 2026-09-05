
export class MockProvider {
    constructor(private config: any) {}

    async upload(fileBuffer: Buffer, fileName: string, options?: any) {
        console.log(`[MockProvider] Uploading ${fileName}`);
        return {
            fileId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            url: `https://mock.cdn.com/${fileName}`,
            thumbnailUrl: `https://mock.cdn.com/thumb/${fileName}`,
            name: fileName,
            size: fileBuffer.length,
            width: 100,
            height: 100,
            format: 'png',
            fileType: 'image'
        };
    }

    async delete(fileId: string) {
        console.log(`[MockProvider] Deleting ${fileId}`);
        return { result: 'ok' };
    }

    async getFileDetails(fileId: string) {
        return {
            fileId,
            url: `https://mock.cdn.com/${fileId}`,
            thumbnailUrl: `https://mock.cdn.com/thumb/${fileId}`,
            name: 'mock_file.png',
            size: 1024,
            width: 100,
            height: 100,
            format: 'png',
            fileType: 'image',
            createdAt: new Date().toISOString()
        };
    }

    async getUsage() {
        return {
            used: 0,
            limit: 1000000000
        };
    }
}
