import { Router } from 'express';
import ProfileController from '../controllers/Profile.controller';
import { celebrate, Joi, Segments } from 'celebrate';
import ensureAuthenticated from '../midlewares/ensureAuthenticated';

const profileRoute = Router();
const profileController = new ProfileController();
profileRoute.use(ensureAuthenticated);

profileRoute.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);
profileRoute.get('/', profileController.show);

export default profileRoute;
