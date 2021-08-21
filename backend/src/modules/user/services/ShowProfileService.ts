import User from '@modules/user/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found', 401);

    return user;
  }
}

export default ShowProfileService;
