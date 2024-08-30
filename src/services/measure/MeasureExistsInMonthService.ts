import { MeasureRepository } from "../../repositories/MeasureRepository";

export class MeasureExistsInMonthService {

    constructor(private measureRepository: MeasureRepository) {}

    async execute(customer_uuid: string, measure_type: string, measure_datetime: string): Promise<boolean> {
        const measureDate = new Date(measure_datetime)
        const measures = await this.measureRepository.getMeasuresByCustomerAndMonth(customer_uuid, measure_type, measureDate.getMonth(), measureDate.getFullYear())

        return measures.length > 0
    }

}