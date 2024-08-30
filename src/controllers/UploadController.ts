import { Request, Response } from "express";
import 'express-async-errors';
import path from "path";
import { randomUUID } from "crypto";
import url from 'url';

import { GetCustomerService } from "../services/customer/GetCustomerService";
import { MeasureExistsInMonthService } from "../services/measure/MeasureExistsInMonthService";
import { GeminiService } from "../services/gemini/GeminiService";
import { CreateMeasureService } from "../services/measure/CreateMeasureService";

import { saveBase64AsFile } from "../utils/saveBase64AsFile";

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
        const filePath = await this.saveImageToFileSystem(image, fileName);
        const tempUrl = url.resolve(req.protocol + '://' + req.get('host'), `/images/${fileName}`);

        // Analyze the image and extract measure value using LLM
        const measure_value = await this.extractMeasureValueFromImage(filePath);

        // Create a new measure record
        const newMeasure = await this.createMeasureService.execute({
            id: randomUUID(),
            customerId: customer.id,
            type: type,
            value: Number(measure_value),
            isConfirmed: false,
            image_url: tempUrl,
            created_at: new Date(measure_datetime)
        });
    
        return res.status(200).json({ "image_url": tempUrl, "measure_value": measure_value, "measure_uuid": newMeasure.id })
    }

    private async saveImageToFileSystem(image: string, fileName: string): Promise<string> {
        const basePath = path.resolve(__dirname, '../../public/images');
        const filePath = path.join(basePath, fileName);
        await saveBase64AsFile(image, filePath);
        return filePath;
    }

    private async extractMeasureValueFromImage(filePath: string): Promise<string> {
        const fileUploadedUri = await this.geminiService.uploadImageToGoogleApiFile(filePath);
        return this.geminiService.extractMeasureFromImage(fileUploadedUri);
    }

}