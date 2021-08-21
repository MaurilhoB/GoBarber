import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: IAppointmentsRepository;
let listProvidersDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProvidersDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the day availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date(2021, 4, 15, 11);
      return customDate.getTime();
    });
    await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 15, 14),
      provider_id: 'teste',
      user_id: 'test-user',
    });
    await fakeAppointmentsRepository.create({
      date: new Date(2021, 4, 15, 16),
      provider_id: 'teste',
      user_id: 'test-user',
    });

    const availability = await listProvidersDayAvailability.execute({
      day: 15,
      month: 5,
      year: 2021,
      provider_id: 'teste',
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, availability: false },
        { hour: 9, availability: false },
        { hour: 12, availability: true },
        { hour: 14, availability: false },
        { hour: 16, availability: false },
      ])
    );
  });
});
