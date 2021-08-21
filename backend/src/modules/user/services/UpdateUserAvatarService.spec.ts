import AppError from '@shared/errors/AppError';

import UpdateUserAvatarService from './UpdateUserAvatarService';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import IUserRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

let fakeUserRepository: IUserRepository;
let fakeStorageProvider: IStorageProvider;

let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider
    );
  });

  it('should be able to update an avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      fileName: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update an avatar un-authenticated', async () => {
    const updateAvatar = updateUserAvatar.execute({
      userId: 'unexists',
      fileName: 'avatar.png',
    });

    expect(updateAvatar).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar on uploading a new one', async () => {
    const deleted = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      fileName: 'avatar.png',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      fileName: 'avatar2.png',
    });

    expect(deleted).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
