import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import IUserRepository from '../repositories/IUserRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: IUserRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfile = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show user by id', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const userProfile = await showProfile.execute({ user_id: user.id });

    expect(userProfile.id).toBe(user.id);
    expect(userProfile.email).toBe(user.email);
  });

  it('should not be able to show inexistent user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'inexistent-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
