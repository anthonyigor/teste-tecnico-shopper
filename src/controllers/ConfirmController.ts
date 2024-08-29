import { Request, Response } from "express";
import { GetMeasure } from "../services/GetMeasure";

interface ConfirmRequestBody {
    measure_uuid: string,
    confirm_value: number
}

interface ConfirmRequest extends Request {
    body: ConfirmRequestBody
}

export class ConfirmController {
    constructor(private verifyMeasureExistsService: GetMeasure) {}

    async handle(req: ConfirmRequest, res: Response) {
        const { measure_uuid, confirm_value } = req.body;

        const measure = await this.verifyMeasureExistsService.execute(measure_uuid)
        if (!measure) {
            return res.status(404).json({ "error_code": "MEASURE_NOT_FOUND", "error_description": "Leitura não encontrada" });
        }

        if (measure.confirmed_value) {
            return res.status(409).json({ "error_code": "CONFIRMATION_DUPLICATE", "error_description": "Leitura já confirmada" });
        }

    }

}