import { S3 } from 'aws-sdk';
import path from 'path';
import { readFile } from 'fs/promises';

class S3Storage {
    private client: S3

    constructor() {
        this.client = new S3({
            region: 'sa-east-1',
        })
    }

    async saveFile(fileName: string) {
        const basePath = path.resolve(__dirname, '../..')
        const filePath = path.resolve(basePath, 'tmp', fileName)


        const fileContent = await readFile(filePath)

        await this.client.putObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileName,
            ACL: 'public-read',
            Body: fileContent,
            ContentType: 'image/jpeg'
        }).promise()

    }

}

export default S3Storage