import { Customer } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class CustomerRepository {
    async createCustomer(id: string, name: string): Promise<Customer> {
        const customer = await prisma.customer.create({
            data: {
                id,
                name
            }
        });

        return customer;
    }

    async getCustomerByUUID(uuid: string): Promise<Customer | null> {
        const customer = await prisma.customer.findUnique({
            where: {
                id: uuid,
            }
        });

        return customer;
    }
}