import { Repository, getRepository, Not } from 'typeorm';

import User from '@modules/user/infra/typeorm/entities/User';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICreateUserDTO from '@modules/user/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/user/dtos/IFindAllProvidersDTO';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { id },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    if (except_user_id) {
      const providers = this.ormRepository.find({
        where: { id: Not(except_user_id) },
      });
      return providers;
    }
    return this.ormRepository.find();
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }
}

export default UserRepository;
