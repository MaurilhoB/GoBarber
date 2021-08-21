import { Router } from 'express';
import multer from 'multer';

import ensureAlthenticated from '@modules/user/infra/http/middlewares/ensureAutheticated';

import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';
import { celebrate, Joi } from 'celebrate';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    },
  }),
  usersController.create
);

usersRouter.patch(
  '/avatar',
  ensureAlthenticated,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;
