import { Router } from 'express';
import AppointmetController from '../controllers/Appointment.controller';
import ensureAuthenticated from '../../../users/infra/http/midlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthController from '../controllers/ProviderMounthAvailabilityController';
import ProviderDayController from '../controllers/ProviderDayAvailabilityController';
import { celebrate, Joi, Segments } from 'celebrate';

const providersRoute = Router();
const providersController = new ProvidersController();
const providersMonthController = new ProviderMonthController();
const providersDayController = new ProviderDayController();
providersRoute.use(ensureAuthenticated);

providersRoute.get('/', providersController.index);
providersRoute.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersMonthController.index,
);
providersRoute.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersDayController.index,
);

export default providersRoute;
