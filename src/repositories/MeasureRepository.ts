import { Measure } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class MeasureRepository {
    async create(measure: Measure) {
        try {         
            const createdMeasure = await prisma.measure.create({
                data: measure
            });
            return createdMeasure
        } catch (error) {
            throw new Error('Erro ao inserir leitura!')
        }
    }

    async getMeasuresByCustomerAndMonth(customer_uuid: string, measure_type: string, month: number, year: number): Promise<Measure[]> {
        const measures = await prisma.measure.findMany({
            where: {
                customerId: customer_uuid,
                type: measure_type,
                created_at: {
                    gte: new Date(year, month, 1), // maior que o dia 1 do mês informado
                    lte: new Date(year, month + 1, 1) // menor que o último dia do mês informado
                }
            }
        });

        return measures;
    }

    async findMeasureById(id:string): Promise<Measure | null> {
        const measure = await prisma.measure.findUnique({
            where: {
                id: id
            }
        });

        return measure;
    }

    async confirmMeasureValue(id: string, value: number) {
        try {
            await prisma.measure.update({
                where: {
                    id: id
                },
                data: {
                    value: value,
                    isConfirmed: true
                }
            });
        } catch (error) {
            throw new Error('Erro ao confirmar leitura!')
        }
    }

    async findMeasuresByCustomerId(id: string) {
        const measures = await prisma.measure.findMany({
            where: {
                customerId: id
            }
        });

        return measures;
    }

    async findMeasuresByCustomerAndType(id: string, measure_type: string) {
        const measures = await prisma.measure.findMany({
            where: {
                customerId: id,
                type: measure_type
            }
        });

        return measures;
    }

}