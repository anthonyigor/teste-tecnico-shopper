import { GetMeasureService } from './GetMeasureService';
import { MeasureRepository } from '../../repositories/MeasureRepository';

describe('GetMeasureService', () => {
    let getMeasureService: GetMeasureService;
    let measureRepository: jest.Mocked<MeasureRepository>;

    beforeEach(() => {
        measureRepository = {
            findMeasureById: jest.fn(),
            // Outros métodos do MeasureRepository podem ser mockados aqui se necessário
        } as unknown as jest.Mocked<MeasureRepository>;

        getMeasureService = new GetMeasureService(measureRepository);
    });

    it('deve chamar findMeasureById com o parâmetro correto', async () => {
        const measure_uuid = 'uuid';
        const mockMeasure = { id: measure_uuid, value: 100, isConfirmed: true, type: "WATER", customerId: 'aaaaaaaaa', created_at: new Date(), image_url: 'https://example.com/image.jpg' };

        measureRepository.findMeasureById.mockResolvedValue(mockMeasure);

        const result = await getMeasureService.execute(measure_uuid);

        expect(measureRepository.findMeasureById).toHaveBeenCalledWith(measure_uuid);
        expect(result).toBe(mockMeasure);
    });
});
