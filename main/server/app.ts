import cors from 'cors';
import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import eesRouter from './api/ees/eesRouter';

export const port = process.env.PORT || 3002;

// defining the Express app
const app = express();

// add build-in body parser
app.use(urlencoded({ extended: false }));
app.use(json());

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use((_request: Request, response: Response, next: NextFunction) => {
  response.header('Access-Control-Allow-Origin', `http://localost:${port}`);
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/ees', eesRouter);
app.use('/api/ees/:symbol', eesRouter);

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Internal server error!');
  next();
});

export default app;
