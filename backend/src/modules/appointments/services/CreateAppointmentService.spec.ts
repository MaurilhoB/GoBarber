import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: IAppointmentsRepository;
let fakeNotificationsRepository: INotificationsRepository;
let fakeCacheProvider: ICacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create an appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 2, 5, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 2, 5, 13),
      provider_id: '1203941209',
      user_id: 'test-user',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1203941209');
  });

  it('should not to be able to create two appointments on same date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 6, 20, 12).getTime();
    });

    const date = new Date(2021, 6, 20, 14);

    await createAppointment.execute({
      date,
      provider_id: '1203941209',
      user_id: 'test-user',
    });

    const createAppointmentTwo = createAppointment.execute({
      date,
      provider_id: '1203941209',
      user_id: 'test-user',
    });

    return expect(createAppointmentTwo).rejects.toBeInstanceOf(AppError);
  });

  it('should not to be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 5, 17).getTime();
    });

    const appointment = createAppointment.execute({
      date: new Date(2021, 7, 5, 13),
      provider_id: '1203941209',
      user_id: 'test-user',
    });

    await expect(appointment).rejects.toBeInstanceOf(AppError);
  });

  it('should not to be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 5, 17).getTime();
    });

    const appointment = createAppointment.execute({
      date: new Date(2021, 7, 5, 13),
      provider_id: 'user-id',
      user_id: 'user-id',
    });

    await expect(appointment).rejects.toBeInstanceOf(AppError);
  });

  it('should not to be able to create an appointment out of the working time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 7, 5, 12).getTime();
    });

    const appointmentTooEarly = createAppointment.execute({
      date: new Date(2021, 7, 5, 7),
      provider_id: '12389128',
      user_id: 'user-id',
    });

    const appointmentTooLate = createAppointment.execute({
      date: new Date(2021, 7, 5, 18),
      provider_id: '32492399',
      user_id: 'user-id',
    });

    await expect(appointmentTooEarly).rejects.toBeInstanceOf(AppError);
    await expect(appointmentTooLate).rejects.toBeInstanceOf(AppError);
  });
});
