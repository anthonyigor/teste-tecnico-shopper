import express from 'express';
import applicationRoutes from './routes';
import { errorHandling } from './middlewares/errorHandling';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//routes
app.use('/', applicationRoutes);

app.use(errorHandling)
// initialize
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});