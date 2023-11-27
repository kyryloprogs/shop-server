import dotenv from 'dotenv';
import express from 'express';
import { userRoute } from './routes/router';
import Knex from 'knex'
import knexConfig from './knexfile'
import { Model } from 'objection'
import cors from 'cors';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');
console.log(PORT);

const knex = Knex(knexConfig.development)
Model.knex(knex)

const server = async () => {

    const app = express();
    const allowedOrigins = ['http://localhost:3000'];

    const options: cors.CorsOptions = {
      origin: allowedOrigins
    };

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors(options));
    app.use('/', userRoute());

    app.use((err, req, res, next) => {
        // we can implement logger here
        res.status(err.status || 500).send({
            message: err.message,
            errors: err.errors,
        });
    });

    app.listen(PORT, () => {
        console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
    });

};


server().catch(e => e);