import { Request, Response } from "express";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { GetCustomerService } from "../services/GetCustomerService";
import 'express-async-errors';
import { MeasureExistsInMonthService } from "../services/MeasureExistsInMonthService";
import { MeasureRepository } from "../repositories/MeasureRepository";

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

    constructor() {
        const customerRepository = new CustomerRepository();
        this.getCustomerService = new GetCustomerService(customerRepository);
        const measureRepository = new MeasureRepository();
        this.measureExistsInMonthService = new MeasureExistsInMonthService(measureRepository)
    }

    async handle(req: UploadRequest, res: Response) {
        const { image, customer_code, measure_datetime, measure_type } = req.body

        // get customer
        const customer = await this.getCustomerService.execute(customer_code);
        const isMeasureInCurrentMonth = await this.measureExistsInMonthService.execute(customer.id, measure_type, measure_datetime)

        if (isMeasureInCurrentMonth) {
            return res.status(400).json({ message: "Measure already exists in this month" });
        }

    }

}