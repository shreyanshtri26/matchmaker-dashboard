import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
