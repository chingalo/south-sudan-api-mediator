import express from 'express';
import cors from 'cors';
import vaccineCertRouter from './api/vaccineCert/routes/routes';
import poeAirportRouter from './api/poe/routes/poeAirport';
import { hostPort } from './api/commons/utils/authConfig';
import errorHandler from './api/vaccineCert/middlewares/error';

const app = express();
const { PORT } = hostPort;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);
app.use('/api/v1/', vaccineCertRouter.router);
app.use('/api/v1/poe/', poeAirportRouter.router);

app.use((req, res) => {
  const error = new Error('Page not found!');
  error.status = 404;
  return res.status(404).json({ status: error.status, message: error.message });
});
// unexpected errors
app.use(errorHandler);

if (!module.parent) {
  app.listen(PORT || 5000, () => console.log(` App listening on port no: ${PORT}`)
  );
}

export default app;
