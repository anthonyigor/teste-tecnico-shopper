// __tests__/customerService.test.ts
import { GetCustomerService } from './GetCustomerService';
import { CustomerRepository } from '../../repositories/CustomerRepository';
import { BadRequest } from '../../errors/BadRequest';
import { Customer } from '@prisma/client';

jest.mock('../repositories/CustomerRepository');

describe('GetCustomerService', () => {
  let customerService: GetCustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  // instanciar mocks do service e repository
  beforeEach(() => {
    mockCustomerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    customerService = new GetCustomerService(mockCustomerRepository);
  });

  // limpar os mocks no final
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return a customer when found', async () => {
    const mockCustomer: Customer = {
      id: '123',
      name: 'John Doe',
      created_at: new Date(),
    };

    mockCustomerRepository.getCustomerByUUID.mockResolvedValue(mockCustomer);

    const result = await customerService.execute('123');

    expect(result).toEqual(mockCustomer);
    expect(mockCustomerRepository.getCustomerByUUID).toHaveBeenCalledWith('123');
  });

  it('should throw BadRequest error when customer is not found', async () => {
    mockCustomerRepository.getCustomerByUUID.mockResolvedValue(null);

    await expect(customerService.execute('error')).rejects.toThrow(BadRequest);
    await expect(customerService.execute('error')).rejects.toThrow('Customer not found');
    expect(mockCustomerRepository.getCustomerByUUID).toHaveBeenCalledWith('error');
  });
});
