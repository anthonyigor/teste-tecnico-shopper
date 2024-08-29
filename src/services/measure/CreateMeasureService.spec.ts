import { Measure } from "@prisma/client";
import { CreateMeasureService } from "./CreateMeasureService";
import { MeasureRepository } from "../../repositories/MeasureRepository";
import { InternalError } from "../../errors/InternalError";

describe('CreateMeasureService', () => {
    let createMeasureService: CreateMeasureService;
    let measureRepository: jest.Mocked<MeasureRepository>;

    beforeEach(() => {
        measureRepository = {
            create: jest.fn(),
            getMeasuresByCustomerAndMonth: jest.fn(),
        } as unknown as jest.Mocked<MeasureRepository>;

        createMeasureService = new CreateMeasureService(measureRepository);
    });

    it('should create a measure successfully', async () => {
        const measure: Measure = {
            id: 'measure-id',
            value: 123.45,
            type: 'water',
            created_at: new Date(),
            isConfirmed: false,
            customerId: 'customer-id',
            image_url: 'https://example.com/image.jpg'
        };

        measureRepository.create.mockResolvedValue(measure);

        const result = await createMeasureService.execute(measure);

        expect(result).toEqual(measure);
        expect(measureRepository.create).toHaveBeenCalledWith(measure);
    });

    it('should throw an InternalError if repository throws an error', async () => {
        const measure: Measure = {
            id: 'measure-id',
            value: 123.45,
            type: 'water',
            created_at: new Date(),
            isConfirmed: false,
            customerId: 'customer-id',
            image_url: 'https://example.com/image.jpg'
        };

        measureRepository.create.mockRejectedValue(new Error('Database error'));

        await expect(createMeasureService.execute(measure)).rejects.toThrow(InternalError);
        expect(measureRepository.create).toHaveBeenCalledWith(measure);
    });
});
