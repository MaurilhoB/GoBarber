import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/user/services/UpdateProfileService';
import ShowProfileService from '@modules/user/services/ShowProfileService';
import { classToClass } from 'class-transformer';

export default class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateProfile = container.resolve(UpdateProfileService);

    try {
      const { name, email, password, old_password } = req.body;

      const user = await updateProfile.execute({
        user_id: req.user.id,
        name,
        email,
        password,
        old_password,
      });

      return res.json(classToClass(user));
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const showUser = container.resolve(ShowProfileService);

    try {
      const user = await showUser.execute({
        user_id: req.user.id,
      });

      return res.json({ user: classToClass(user) });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
}
