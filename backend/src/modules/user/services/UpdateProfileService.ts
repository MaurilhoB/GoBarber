import User from '@modules/user/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found', 401);

    const userWithIncomingEmail = await this.userRepository.findByEmail(email);

    if (userWithIncomingEmail && userWithIncomingEmail.id != user_id)
      throw new AppError('Email already in use');

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set the new one'
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!checkOldPassword) throw new AppError('Old password does not match');

      user.password = await this.hashProvider.generateHash(password);
    }

    return await this.userRepository.save(user);
  }
}

export default UpdateProfileService;
