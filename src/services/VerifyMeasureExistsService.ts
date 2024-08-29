import { MeasureRepository } from "../repositories/MeasureRepository";

export class VerifyMeasureExistsService {
    constructor(private measureRepository: MeasureRepository) {}

    execute(measure_uuid: string) {
        return this.measureRepository.measureExists(measure_uuid)
    }

}