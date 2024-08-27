import express from 'express';
import applicationRoutes from './routes';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//routes
app.use('/', applicationRoutes);

// inialize
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});