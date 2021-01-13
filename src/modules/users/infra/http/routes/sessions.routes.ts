import { Router } from 'express';
import SessionsController from '../controllers/Sessions.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const sessionsRoute = Router();
const sessionsController = new SessionsController();

sessionsRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);
export default sessionsRoute;
