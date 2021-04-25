import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const port = 3001;

// defining the Express app
const app = express();

// add build-in body parser
app.use(express.json());

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// starting the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server: listening on port ${port}`);
});

export default app;
