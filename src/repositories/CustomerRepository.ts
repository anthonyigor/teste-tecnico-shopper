import { Customer } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class CustomerRepository {
    async getCustomerByUUID(uuid: string): Promise<Customer | null> {
        const customer = await prisma.customer.findUnique({
            where: {
                id: uuid,
            }
        });

        return customer;
    }
}