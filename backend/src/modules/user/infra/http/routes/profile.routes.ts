import { Router } from 'express';
import ensureAlthenticated from '@modules/user/infra/http/middlewares/ensureAutheticated';

import ProfileController from '../controllers/ProfileController';
import { celebrate, Joi } from 'celebrate';

const profileController = new ProfileController();

const profileRouter = Router();

profileRouter.use(ensureAlthenticated);

profileRouter.put(
  '/update',
  celebrate({
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string().min(6),
      password: Joi.string()
        .min(6)
        .when('old_password', { then: Joi.required() }),
      password_confirmation: Joi.valid(Joi.ref('password')).when(
        'old_password',
        { then: Joi.required() }
      ),
    },
  }),
  profileController.update
);
profileRouter.get('/show', profileController.show);

export default profileRouter;
