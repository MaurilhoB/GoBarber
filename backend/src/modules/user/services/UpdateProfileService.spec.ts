import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import IUserRepository from '../repositories/IUserRepository';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: IUserRepository;
let fakeHashProvider: IHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'New name',
      email: 'new@test.com',
    });

    expect(user.name).toBe('New name');
    expect(user.email).toBe('new@test.com');
  });

  it('should be able to update user password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      password: '123123',
      old_password: '123456',
    });
    expect(user.password).toBe('123123');
  });

  it('should not be able to update inexistent user', async () => {
    return expect(
      updateProfile.execute({
        user_id: 'inexistent-id',
        name: 'New name',
        email: 'new@test.com',
        old_password: '123456',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email if it is already in use', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Jane Doe',
      email: 'test2@test.com',
      password: '123456',
    });

    return expect(
      updateProfile.execute({
        user_id: user2.id,
        name: 'Jane Doe',
        email: 'test@test.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password without the old one', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    return expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'New name',
        email: 'new@test.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    return expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'New name',
        email: 'new@test.com',
        password: '123123',
        old_password: 'wrong-old-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
