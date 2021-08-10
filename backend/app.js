import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

//Routes Import
import notFound from './routes/404.js';
import errorHandler from './routes/errorHandler.js'
import authRoute from './routes/authRoute/auth.js';
import productRoute from './routes/productRoute/product.js';
import userRoute from './routes/userRoute/profile.js';
import paymentRoute from './routes/paymentRoute/payment.js';
import cartRoute from './routes/paymentRoute/cart.js';

// Deps
const app = express();
dotenv.config();

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static('public'));

//Routes
app.use('/api/users/', authRoute);
app.use('/api/products/', productRoute);
app.use('/api/users/', userRoute);
app.use('/api/payments/', paymentRoute);
app.use('/api/checkout/', cartRoute);
app.use('*', notFound);
app.use(errorHandler);

//Db And Listen
try {
    await mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    app.listen(process.env.PORT, () => {
        console.log("Server Running!");
    })
} catch (err) {
    console.log(err.message);
}