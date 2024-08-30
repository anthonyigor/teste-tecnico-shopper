import express from 'express';
import applicationRoutes from './routes';
import { errorHandling } from './middlewares/errorHandling';
import 'dotenv/config';
import { CustomerRepository } from './repositories/CustomerRepository';

const app = express();

// middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

//routes
app.use('/', applicationRoutes);

// cria customers para testes das rotas
const createCustomersTest = async () => {
    const customerRepository = new CustomerRepository();
    await customerRepository.createCustomer('9ff6186a-9ba3-42a4-a2a5-3a668dfe6b72', 'Jonh Doe');
    await customerRepository.createCustomer('d3b981bd-ab76-40b6-be4a-cf8a6e195808', 'Maria D');
}
createCustomersTest();

app.use(errorHandling)
// initialize
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});