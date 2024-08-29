import { MeasureRepository } from "../../repositories/MeasureRepository";

export class GetMeasuresByCustomerService {
    constructor(private measureRepository: MeasureRepository) {}

    async execute(customerId: string, measure_type?: string) {
        if (!measure_type) return this.measureRepository.findMeasuresByCustomerId(customerId);

        return this.measureRepository.findMeasuresByCustomerAndType(customerId, measure_type);
    }
}