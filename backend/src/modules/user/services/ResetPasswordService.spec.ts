import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import IUserRepository from '../repositories/IUserRepository';

import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: IUserRepository;
let fakeUserTokenRepository: IUserTokensRepository;
let fakeHashProvider: IHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '1234567',
      token,
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('1234567');
    expect(updatedUser?.password).toBe('1234567');
  });

  it('should not be able to reset the password with a non-existing token', async () => {
    await expect(
      resetPassword.execute({
        password: '1234567',
        token: 'invalid-token',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with a non-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate('invalid-user-id');

    await expect(
      resetPassword.execute({
        password: '1234567',
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password after 2h timeout', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '1234567',
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
