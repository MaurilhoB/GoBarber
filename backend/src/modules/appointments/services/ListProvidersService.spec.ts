import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: IUserRepository;
let fakeCacheProvider: ICacheProvider;
let listProviders: ListProvidersService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list providers', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'test1@test.com',
      password: '123456',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Jane Doe',
      email: 'test2@test.com',
      password: '123456',
    });

    const user3 = await fakeUserRepository.create({
      name: 'Johnny Doe',
      email: 'test3@test.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: user.id,
    });

    expect(providers).toEqual([user2, user3]);
  });

  it('should not execute query if already is cached', async () => {
    const findAllProviders = jest.spyOn(fakeUserRepository, 'findAllProviders');

    const user = await fakeUserRepository.create({
      name: 'Johnny Doe',
      email: 'test3@test.com',
      password: '123456',
    });

    await listProviders.execute({
      user_id: user.id,
    });

    await listProviders.execute({
      user_id: user.id,
    });

    expect(findAllProviders).toHaveBeenCalledWith({
      except_user_id: user.id,
    });
    expect(findAllProviders).toHaveBeenCalledTimes(1);
  });
});
