import { Request, Response } from "express";
import { VerifyMeasureExistsService } from "../services/VerifyMeasureExistsService";

interface ConfirmRequestBody {
    measure_uuid: string,
    confirm_value: number
}

interface ConfirmRequest extends Request {
    body: ConfirmRequestBody
}

export class ConfirmController {
    constructor(private verifyMeasureExistsService: VerifyMeasureExistsService) {}

    async handle(req: ConfirmRequest, res: Response) {
        const { measure_uuid, confirm_value } = req.body;

        const measureExists = await this.verifyMeasureExistsService.execute(measure_uuid)
        if (!measureExists) {
            return res.status(404).json({ "error_code": "MEASURE_NOT_FOUND", "error_description": "Leitura não encontrada" });
        }

    }

}