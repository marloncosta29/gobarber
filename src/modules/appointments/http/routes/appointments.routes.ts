import { Router } from 'express';
import AppointmetController from '../controllers/Appointment.controller';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';
import ensureAuthenticated from '../../../users/infra/http/midlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';
const appointmentsRouter = Router();
const appointmentController = new AppointmetController();
const providerAppointmentsController = new ProviderAppointmentsController();
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentRepository.find()
//   response.json(appointments)
// })
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentController.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
