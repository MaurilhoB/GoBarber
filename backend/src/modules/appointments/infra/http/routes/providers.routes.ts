import { Router } from 'express';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAutheticated';

import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import { celebrate, Joi } from 'celebrate';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerDayAvailabilityController =
  new ProviderDayAvailabilityController();

const providerMonthAvailabilityController =
  new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    params: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index
);

providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    params: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index
);

export default providersRouter;
