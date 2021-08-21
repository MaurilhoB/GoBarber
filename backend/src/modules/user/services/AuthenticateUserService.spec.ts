import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

let fakeUserRepository: IUserRepository;
let fakeHashProvider: IHashProvider;
let fakeCacheProvider: ICacheProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const authenticationResult = await authenticateUser.execute({
      email: 'test@test.com',
      password: '123456',
    });

    expect(authenticationResult).toHaveProperty('token');
    expect(authenticationResult.user).toEqual(user);
  });

  it('should not be able to authenticate a non existing user', async () => {
    const authenticationResult = authenticateUser.execute({
      email: 'test@test.com',
      password: '123456',
    });

    return expect(authenticationResult).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with an invalid password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    });

    const authenticationResult = authenticateUser.execute({
      email: 'test@test.com',
      password: '000000',
    });

    return expect(authenticationResult).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with some blank credential', async () => {
    const blankEmail = authenticateUser.execute({
      email: '',
      password: '123456',
    });

    const blankPassword = authenticateUser.execute({
      email: 'test@test.com',
      password: '',
    });

    const [resultBlankEmail, resultBlankPassword] = await Promise.allSettled([
      blankEmail,
      blankPassword,
    ]);

    expect(resultBlankEmail.status === 'rejected').toBeTruthy();
    expect(resultBlankPassword.status === 'rejected').toBeTruthy();
  });
});
