import { Request, Response } from "express";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { GetCustomerService } from "../services/GetCustomerService";
import 'express-async-errors';
import { MeasureExistsInMonthService } from "../services/MeasureExistsInMonthService";
import { MeasureRepository } from "../repositories/MeasureRepository";
import { GeminiService } from "../services/GeminiService";
import { saveBase64AsFile } from "../utils/saveBase64AsFile";
import path from "path";

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

    constructor() {
        const customerRepository = new CustomerRepository();
        this.getCustomerService = new GetCustomerService(customerRepository);
        const measureRepository = new MeasureRepository();
        this.measureExistsInMonthService = new MeasureExistsInMonthService(measureRepository)
        this.geminiService = new GeminiService()
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
        const filePath = path.join(basePath, 'tmp', 'image.jpeg')
        await saveBase64AsFile(image, filePath)

        const fileUploadedUri = await this.geminiService.uploadImageToGoogleApiFile(filePath)
        const measure_value = await this.geminiService.extractMeasureFromImage(fileUploadedUri)
        res.send(measure_value)

    }

}