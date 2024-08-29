import { Measure } from "@prisma/client";
import { MeasureRepository } from "../../repositories/MeasureRepository";
import { InternalError } from "../../errors/InternalError";

export class CreateMeasureService {
    constructor(private measureRepository: MeasureRepository) {}
    
    async execute(measure: Measure) {
        try {
            const createdMeasure = await this.measureRepository.create(measure)
            return createdMeasure
        } catch (error) {
            throw new InternalError('Erro ao inserir leitura!')
        }
    }
}