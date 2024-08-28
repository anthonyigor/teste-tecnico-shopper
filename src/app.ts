import express from 'express';
import applicationRoutes from './routes';
import { errorHandling } from './middlewares/errorHandling';

const app = express();

// middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

//routes
app.use('/', applicationRoutes);

app.use(errorHandling)
// initialize
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});