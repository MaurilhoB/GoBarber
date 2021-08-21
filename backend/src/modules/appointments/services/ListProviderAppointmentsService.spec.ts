import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: IAppointmentsRepository;
let fakeCacheProvider: ICacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list the appointments of the day from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2021, 4, 15, 11);
      return customDate.getTime();
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 15, 14),
      provider_id: 'teste',
      user_id: 'test-user',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 15, 16),
      provider_id: 'teste2',
      user_id: 'test-user',
    });

    const appointments = await listProviderAppointments.execute({
      day: 15,
      month: 5,
      year: 2021,
      provider_id: 'teste2',
    });

    expect(appointments).toEqual([appointment2]);
  });

  it('should not execute query if already is cached', async () => {
    const findAllInDayFromProvider = jest.spyOn(
      fakeAppointmentsRepository,
      'findAllInDayFromProvider'
    );

    await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 15, 14),
      provider_id: 'teste',
      user_id: 'test-user',
    });

    await listProviderAppointments.execute({
      day: 15,
      month: 5,
      year: 2021,
      provider_id: 'teste',
    });

    await listProviderAppointments.execute({
      day: 15,
      month: 5,
      year: 2021,
      provider_id: 'teste',
    });

    expect(findAllInDayFromProvider).toHaveBeenCalledTimes(1);
  });
});
