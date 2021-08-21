import User from '@modules/user/infra/typeorm/entities/User';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

import { injectable, inject } from 'tsyringe';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`
    );

    if (!providers) {
      providers = await this.userRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(providers)
      );
    }

    return providers;
  }
}

export default ListProvidersService;
