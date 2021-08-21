import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

let fakeUserRepository: IUserRepository;
let fakeMailProvider: IMailProvider;
let fakeUserTokenRepository: IUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository
    );
  });

  it('should be able to recover the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendEmail');

    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.execute({
      email: 'test@test.com'
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'test@test.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.execute({
      email: 'test@test.com'
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
