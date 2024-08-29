import { BadRequest } from "../../errors/BadRequest";
import { CustomerRepository } from "../../repositories/CustomerRepository";

export class GetCustomerService {
    constructor(private customerRepository: CustomerRepository) {}

    async execute(customer_code: string) {
        const customer = await this.customerRepository.getCustomerByUUID(customer_code);

        if (!customer) {
            throw new BadRequest("Customer not found");
        }

        return customer;
    }
}