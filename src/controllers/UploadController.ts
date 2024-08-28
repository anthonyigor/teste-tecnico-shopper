import { Request, Response } from "express";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { GetCustomerService } from "../services/GetCustomerService";
import 'express-async-errors';
import { MeasureExistsInMonthService } from "../services/MeasureExistsInMonthService";
import { MeasureRepository } from "../repositories/MeasureRepository";
import { GeminiService } from "../services/GeminiService";
import { saveBase64AsFile } from "../utils/saveBase64AsFile";
import path from "path";
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
    private getCustomerService: GetCustomerService;
    private measureExistsInMonthService: MeasureExistsInMonthService;
    private geminiService: GeminiService
    private s3Storage: S3Storage;

    constructor() {
        const customerRepository = new CustomerRepository();
        this.getCustomerService = new GetCustomerService(customerRepository);
        const measureRepository = new MeasureRepository();
        this.measureExistsInMonthService = new MeasureExistsInMonthService(measureRepository)
        this.geminiService = new GeminiService()
        this.s3Storage = new S3Storage();
    }

    async handle(req: UploadRequest, res: Response) {
        const { image, customer_code, measure_datetime, measure_type } = req.body

        // get customer
        const customer = await this.getCustomerService.execute(customer_code);

        // verifica se já existe leitura naquele mês
        const isMeasureInCurrentMonth = await this.measureExistsInMonthService.execute(customer.id, measure_type, measure_datetime)
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
        
        res.json({ measure_value })
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