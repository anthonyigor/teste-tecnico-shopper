import { Request, Response } from "express";
import { GetMeasureService } from "../services/measure/GetMeasureService";
import { ConfirmMeasureValue } from "../services/measure/ConfirmMeasureValue";

interface ConfirmRequestBody {
    measure_uuid: string,
    confirmed_value: number
}

interface ConfirmRequest extends Request {
    body: ConfirmRequestBody
}

export class ConfirmController {
    constructor(
        private getMeasureService: GetMeasureService,
        private confirmMeasureValueService: ConfirmMeasureValue
    ) {}

    async handle(req: ConfirmRequest, res: Response) {
        const { measure_uuid, confirmed_value } = req.body;

        const measure = await this.getMeasureService.execute(measure_uuid)
        if (!measure) {
            return res.status(404).json({ "error_code": "MEASURE_NOT_FOUND", "error_description": "Leitura não encontrada" });
        }

        if (measure.isConfirmed) {
            return res.status(409).json({ "error_code": "CONFIRMATION_DUPLICATE", "error_description": "Leitura já confirmada" });
        }

        await this.confirmMeasureValueService.execute(measure.id, confirmed_value)
        return res.status(200).json({ "success": true });
    }

}