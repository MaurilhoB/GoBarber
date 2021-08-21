import { format, getHours, isBefore, startOfHour } from 'date-fns';

import Appointment from '../infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { injectable, inject } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  date: Date;
  provider_id: string;
  user_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    if (provider_id === user_id)
      throw new AppError("You can't create an appointment with yourself");

    const appointmentDate = startOfHour(date);

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can't create an appointment out of the working time"
      );
    }

    if (isBefore(appointmentDate, Date.now()))
      throw new AppError("You can't create an appointment on a past date");

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate({
        date: appointmentDate,
        provider_id,
      });

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    const formatedDate = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm");

    await this.notificationsRepository.create({
      content: `Novo agendamento para ${formatedDate}h`,
      recipient_id: provider_id,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'd-M-yyyy'
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
