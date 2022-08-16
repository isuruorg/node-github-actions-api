import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import connect from 'db/db';
const errorHandler = require('middlewares/handlers/errorHandler');

dotenv.config();
colors.enable();

connect(); // initiating the db connection

const app: Application = express();
app.use(express.static('public'));
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

import router from 'routes/index';
app.use('/api/', router);

app.use('/', (req: Request, res: Response) => {
  res.send('Traceclaw API Running...');
});
//global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀🚀 Traceclaw server listening on port ${PORT}`.green);
});
