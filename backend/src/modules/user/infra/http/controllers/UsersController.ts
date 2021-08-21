import { Request, Response } from 'express';
import CreateUserService from '@modules/user/services/CreateUserService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const createUser = container.resolve(CreateUserService);

    try {
      const { name, email, password } = req.body;
      const user = await createUser.execute({
        name,
        email,
        password,
      });

      return res.json({ user: classToClass(user) });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
}
