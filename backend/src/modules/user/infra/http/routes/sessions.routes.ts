import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  sessionsController.create
);

export default sessionsRouter;
