import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    body: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create
);

passwordRouter.post(
  '/reset',
  celebrate({
    body: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required().min(6),
      password_confirmation: Joi.valid(Joi.ref('password')).required(),
    },
  }),
  resetPasswordController.create
);

export default passwordRouter;
