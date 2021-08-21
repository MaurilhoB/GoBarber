import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/user/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';
import AppError from '@shared/errors/AppError';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    if (req.notAllowedFile) {
      throw new AppError('File type not allowed');
    }

    if (!req.file) {
      throw new AppError("No file with key 'avatar' was sent");
    }

    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateAvatar.execute({
      userId: req.user.id,
      fileName: req.file!.filename,
    });

    return res.json(classToClass(user));
  }
}
