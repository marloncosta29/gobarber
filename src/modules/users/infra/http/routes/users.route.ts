import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../../../../config/upload';
import ensureAuthenticated from '../midlewares/ensureAuthenticated';
import UsersController from '../controllers/Users.controller';
import UserAvatarController from '../controllers/UserAvatar.controller';
import { celebrate, Joi, Segments } from 'celebrate';

const upload = multer(uploadConfig.multer);
const usersRoute = Router();
const userController = new UsersController();
const userAvatarController = new UserAvatarController();
usersRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);
usersRoute.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRoute;
