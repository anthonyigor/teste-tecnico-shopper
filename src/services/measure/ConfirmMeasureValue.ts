import { InternalError } from "../../errors/InternalError";
import { MeasureRepository } from "../../repositories/MeasureRepository";

export class ConfirmMeasureValue {
    constructor(private measureRepository: MeasureRepository) {}

    async execute(measure_uuid: string, value: number){
        try {
            await this.measureRepository.confirmMeasureValue(measure_uuid, value)
        } catch (error) {
            throw new InternalError('Erro ao confirmar leitura')
        }
    }

}