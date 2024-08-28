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

        const basePath = path.resolve(__dirname, '../../')
        const fileName = `${Date.now()}.jpeg`
        const filePath = path.join(basePath, 'tmp', fileName)
        await saveBase64AsFile(image, filePath)

        // envia arquivo para bucket aws e gera link temporario 
        await this.s3Storage.saveFile(fileName)
        const tmpUrlImage = await this.s3Storage.generateTmpUrlFile(fileName)

        const fileUploadedUri = await this.geminiService.uploadImageToGoogleApiFile(filePath)
        const measure_value = await this.geminiService.extractMeasureFromImage(fileUploadedUri)
        res.send(measure_value)

    }

}