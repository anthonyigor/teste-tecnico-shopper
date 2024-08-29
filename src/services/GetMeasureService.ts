import { MeasureRepository } from "../repositories/MeasureRepository";

export class GetMeasureService {
    constructor(private measureRepository: MeasureRepository) {}

    execute(measure_uuid: string) {
        return this.measureRepository.findMeasureById(measure_uuid)
    }

}