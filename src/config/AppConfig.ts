import { GetCustomerService } from "../services/customer/GetCustomerService";
import { MeasureExistsInMonthService } from "../services/measure/MeasureExistsInMonthService";
import { GeminiService } from "../services/gemini/GeminiService";
import { CreateMeasureService } from "../services/measure/CreateMeasureService";
import { GetMeasureService } from "../services/measure/GetMeasureService";
import { ConfirmMeasureValue } from "../services/measure/ConfirmMeasureValue";

import { CustomerRepository } from "../repositories/CustomerRepository";
import { MeasureRepository } from "../repositories/MeasureRepository";

import { UploadController } from "../controllers/UploadController";
import { ConfirmController } from "../controllers/ConfirmController";
import S3Storage from "../lib/S3Storage";

export class AppConfig {
    public static createUploadController(): UploadController {
        // Instantiating Repositories
        const customerRepository = new CustomerRepository();
        const measureRepository = new MeasureRepository();

        // Instantiating Services
        const getCustomerService = new GetCustomerService(customerRepository);
        const measureExistsInMonthService = new MeasureExistsInMonthService(measureRepository);
        const geminiService = new GeminiService();
        const s3Storage = new S3Storage();
        const createMeasureService = new CreateMeasureService(measureRepository);

        // Instantiating and returning the UploadController
        return new UploadController(
            getCustomerService,
            measureExistsInMonthService,
            geminiService,
            s3Storage,
            createMeasureService
        );
    }

    public static createConfirmController(): ConfirmController {
        // Instantiating Repositories
        const measureRepository = new MeasureRepository();

        // Instantiating Services
        const getMeasure = new GetMeasureService(measureRepository);
        const confirmMeasureValue = new ConfirmMeasureValue(measureRepository);

        // Instantiating and returning the ConfirmController
        return new ConfirmController(
            getMeasure,
            confirmMeasureValue
        );
    }
}
