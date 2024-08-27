import { Request, Response } from "express";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { GetCustomerService } from "../services/GetCustomerService";
import 'express-async-errors';

interface UploadRequestBody {
    image: string,
    customer_code: string,
    measure_datetime: Date,
    measure_type: string 
}

interface UploadRequest extends Request {
    body: UploadRequestBody
}

export class UploadController {
    private getCustomerService: GetCustomerService;

    constructor() {
        const customerRepository = new CustomerRepository();
        this.getCustomerService = new GetCustomerService(customerRepository);
    }

    async handle(req: UploadRequest, res: Response) {
        const { image, customer_code, measure_datetime, measure_type } = req.body

        // get customer
        const customer = await this.getCustomerService.execute(customer_code);
        
        res.json(customer)
    }

}