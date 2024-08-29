import { MeasureExistsInMonthService } from "./MeasureExistsInMonthService";
import { MeasureRepository } from "../repositories/MeasureRepository";

describe('MeasureExistsInMonthService', () => {
    let measureExistsInMonthService: MeasureExistsInMonthService;
    let measureRepository: jest.Mocked<MeasureRepository>;

    beforeEach(() => {
        measureRepository = {
            getMeasuresByCustomerAndMonth: jest.fn(),
            // Adicione outros métodos do MeasureRepository aqui, caso existam
        } as unknown as jest.Mocked<MeasureRepository>;

        measureExistsInMonthService = new MeasureExistsInMonthService(measureRepository);
    });

    it('should return true if measures exist for the customer in the specified month', async () => {
        const customer_uuid = 'customer-uuid';
        const measure_type = 'water';
        const measure_datetime = '2024-08-15T00:00:00Z';
        const measureDate = new Date(measure_datetime);

        measureRepository.getMeasuresByCustomerAndMonth.mockResolvedValue([
            { id: 'measure-id', value: 123.45, created_at: measureDate, customerId: customer_uuid, type: measure_type, confirmed_value: null, isConfirmed: false },
        ]);

        const result = await measureExistsInMonthService.execute(customer_uuid, measure_type, measure_datetime);

        expect(result).toBe(true);
        expect(measureRepository.getMeasuresByCustomerAndMonth).toHaveBeenCalledWith(
            customer_uuid, 
            measure_type, 
            measureDate.getMonth(), 
            measureDate.getFullYear()
        );
    });

    it('should return false if no measures exist for the customer in the specified month', async () => {
        const customer_uuid = 'customer-uuid';
        const measure_type = 'water';
        const measure_datetime = '2024-08-15T00:00:00Z';
        const measureDate = new Date(measure_datetime);

        measureRepository.getMeasuresByCustomerAndMonth.mockResolvedValue([]);

        const result = await measureExistsInMonthService.execute(customer_uuid, measure_type, measure_datetime);

        expect(result).toBe(false);
        expect(measureRepository.getMeasuresByCustomerAndMonth).toHaveBeenCalledWith(
            customer_uuid, 
            measure_type, 
            measureDate.getMonth(), 
            measureDate.getFullYear()
        );
    });
});
