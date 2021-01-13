import UpdateAvatarUserService from '../../../services/update-user-avatar.service';

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarUser = container.resolve(UpdateAvatarUserService);
    const user = await updateAvatarUser.execute({
      avatarFileName: request.file.filename,
      user_id: request.user.id,
    });
    return response.json(classToClass(user));
  }
}
