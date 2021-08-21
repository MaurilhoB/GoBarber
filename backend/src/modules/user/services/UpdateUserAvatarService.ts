import User from '@modules/user/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  userId: string;
  fileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ userId, fileName }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user)
      throw new AppError('Only authenticated user can change the avatar.', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    await this.storageProvider.saveFile(fileName);

    user.avatar = fileName;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
