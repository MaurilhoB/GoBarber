import { getHours, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  availability: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

    const appointmentsStartHour = 8;

    const appointmentsHoursArray = Array.from(
      { length: 10 },
      (_, index) => index + appointmentsStartHour
    );

    const currentDate = new Date(Date.now());

    const availability = appointmentsHoursArray.map(hour => {
      const appointmentAlreadyPicked = appointments.find(
        appointment => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        availability:
          !appointmentAlreadyPicked && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
