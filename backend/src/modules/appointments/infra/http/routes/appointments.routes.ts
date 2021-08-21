import { Router } from 'express';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAutheticated';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsControlller from '../controllers/ProviderAppointmentsController';
import { celebrate, Joi } from 'celebrate';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

const providerAppointmentsController = new ProviderAppointmentsControlller();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get(
  '/me',
  celebrate({
    query: {
      day: Joi.string().required(),
      month: Joi.string().required(),
      year: Joi.string().required(),
    },
  }),
  providerAppointmentsController.index
);

appointmentsRouter.post(
  '/',
  celebrate({
    body: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().iso(),
    },
  }),
  appointmentsController.create
);

export default appointmentsRouter;
