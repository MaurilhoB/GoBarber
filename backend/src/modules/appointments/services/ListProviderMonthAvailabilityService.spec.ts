import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: IAppointmentsRepository;
let listProvidersMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProvidersMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the month availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 4, 6, 7).getTime();
    });

    for (let i = 8; i <= 17; i++) {
      await fakeAppointmentsRepository.create({
        date: new Date(2021, 4, 6, i),
        provider_id: 'teste',
        user_id: 'test-user',
      });
    }

    await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 15, 10),
      provider_id: 'teste',
      user_id: 'test-user',
    });

    const availability = await listProvidersMonthAvailability.execute({
      month: 5,
      year: 2021,
      provider_id: 'teste',
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 21, availability: true },
        { day: 6, availability: false },
        { day: 15, availability: true },
        { day: 22, availability: true },
      ])
    );
  });

  it('should show availability false if time is greater than 17pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 4, 6, 18).getTime();
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 6, 12),
      provider_id: 'teste',
      user_id: 'test-user',
    });

    const availability = await listProvidersMonthAvailability.execute({
      month: 5,
      year: 2021,
      provider_id: 'teste',
    });

    expect(availability).toEqual(
      expect.arrayContaining([{ day: 6, availability: false }])
    );
  });
});
