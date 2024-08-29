import { Request, Response } from "express";
import { GetMeasuresByCustomerService } from "../services/measure/GetMeasuresByCustomerService";

export class CustomerListController {
    constructor(private getMeasuresByCustomerService: GetMeasuresByCustomerService) {}

    async handle(req: Request, res: Response) {
        const { customer_code } = req.params
        const { measure_type } = req.query
        const type = measure_type?.toString().toUpperCase()

        const measures = await this.getMeasuresByCustomerService.execute(customer_code, type)
        if (measures.length === 0) return res.status(401).json({ error_code: "MEASURES_NOT_FOUND", error_description: "Nenhuma leitura encontrada" })
        
        const renamedMeasures = measures.map(measure => ({
            measure_uuid: measure.id,
            measure_datetime: measure.created_at,
            measure_type: measure.type,
            has_confirmed: measure.isConfirmed,
            image_url: measure.image_url
        }));

        return res.status(200).json({customer_code, measures: renamedMeasures})
    }
}