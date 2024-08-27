import { Request, Response } from "express";

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

    async handle(req: UploadRequest, res: Response) {
        const { image, customer_code, measure_datetime, measure_type } = req.body

        //to implement
    }

}