import { ConfirmMeasureValue } from './ConfirmMeasureValue';
import { MeasureRepository } from '../repositories/MeasureRepository';
import { InternalError } from '../errors/InternalError';

describe('ConfirmMeasureValue', () => {
    let confirmMeasureValue: ConfirmMeasureValue;
    let measureRepository: jest.Mocked<MeasureRepository>;

    beforeEach(() => {
        measureRepository = {
            confirmMeasureValue: jest.fn()
        } as unknown as jest.Mocked<MeasureRepository>;

        confirmMeasureValue = new ConfirmMeasureValue(measureRepository);
    });

    it('should confirm a measure successfully', async () => {
        const measure_uuid = 'uuid';
        const value = 100;

        await confirmMeasureValue.execute(measure_uuid, value);

        expect(measureRepository.confirmMeasureValue).toHaveBeenCalledWith(measure_uuid, value);
    });

    it('should throw an InternalError if repository throws an error', async () => {
        const measure_uuid = 'uuid';
        const value = 100;

        measureRepository.confirmMeasureValue.mockRejectedValue(new Error('Erro ao confirmar leitura!'));

        await expect(confirmMeasureValue.execute(measure_uuid, value))
            .rejects
            .toThrow(InternalError);

        expect(measureRepository.confirmMeasureValue).toHaveBeenCalledWith(measure_uuid, value);
    });
});
