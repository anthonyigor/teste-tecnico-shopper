import { Request, Response } from "express";
import 'express-async-errors';
import path from "path";
import { randomUUID } from "crypto";

import { GetCustomerService } from "../services/customer/GetCustomerService";
import { MeasureExistsInMonthService } from "../services/measure/MeasureExistsInMonthService";
import { GeminiService } from "../services/gemini/GeminiService";
import { CreateMeasureService } from "../services/measure/CreateMeasureService";

import { saveBase64AsFile } from "../utils/saveBase64AsFile";
import S3Storage from "../lib/S3Storage";

interface UploadRequestBody {
    image: string,
    customer_code: string,
    measure_datetime: string,
    measure_type: string 
}

interface UploadRequest extends Request {
    body: UploadRequestBody
}

export class UploadController {

    constructor(
        private readonly getCustomerService: GetCustomerService,
        private readonly measureExistsInMonthService: MeasureExistsInMonthService,
        private readonly geminiService: GeminiService,
        private readonly s3Storage: S3Storage,
        private readonly createMeasureService: CreateMeasureService
    ) {}

    async handle(req: UploadRequest, res: Response) {
        const { image, customer_code, measure_datetime, measure_type } = req.body
        const type = measure_type.toUpperCase();

        // get customer
        const customer = await this.getCustomerService.execute(customer_code);

        // verifica se já existe leitura naquele mês
        const isMeasureInCurrentMonth = await this.measureExistsInMonthService.execute(customer.id, type, measure_datetime)
        if (isMeasureInCurrentMonth) {
            return res.status(409).json({ "error_code": "DOUBLE_REPORT", "error_description": "Leitura do mês já realizada" });   
        }
        
        const fileName = `${Date.now()}.jpeg`

        // Save image to a temporary file
        const filePath = this.saveImageToFileSystem(image, fileName);

        // Upload file to AWS S3 and get temporary URL
        const tmpUrlImage = await this.uploadFileToS3(filePath);

        // Analyze the image and extract measure value using LLM
        const measure_value = await this.extractMeasureValueFromImage(filePath);

        // Create a new measure record
        const newMeasure = await this.createMeasureService.execute({
            id: randomUUID(),
            customerId: customer.id,
            type: type,
            value: Number(measure_value),
            isConfirmed: false,
            image_url: tmpUrlImage,
            created_at: new Date(measure_datetime)
        });
    
        return res.status(200).json({ "image_url": tmpUrlImage, "measure_value": measure_value, "measure_uuid": newMeasure.id })
    }

    private saveImageToFileSystem(image: string, fileName: string): string {
        const basePath = path.resolve(__dirname, '../../');
        const filePath = path.join(basePath, 'tmp', fileName);
        saveBase64AsFile(image, filePath);
        return filePath;
    }

    private async uploadFileToS3(filePath: string): Promise<string> {
        const fileName = path.basename(filePath);
        await this.s3Storage.saveFile(fileName);
        return this.s3Storage.generateTmpUrlFile(fileName);
    }

    private async extractMeasureValueFromImage(filePath: string): Promise<string> {
        const fileUploadedUri = await this.geminiService.uploadImageToGoogleApiFile(filePath);
        return this.geminiService.extractMeasureFromImage(fileUploadedUri);
    }

}