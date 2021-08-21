import { sign } from 'jsonwebtoken';

import User from '@modules/user/infra/typeorm/entities/User';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/user/repositories/IUserRepository';

import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    email,
    password
  }: IRequest): Promise<{ user: User; token: string }> {
    if (!email || !password)
      throw new AppError('The fields email and password are needed.');

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError('Email or Password Invalid', 401);

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatched) throw new AppError('Email or Password Invalid', 401);

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
