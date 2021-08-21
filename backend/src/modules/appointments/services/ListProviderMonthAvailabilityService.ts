import { getDate, getDaysInMonth, getHours, isFuture, isToday } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availability: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInMonthFromProvider({
        provider_id,
        month,
        year,
      });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const monthDaysArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    const availability = monthDaysArray.map(day => {
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day
      );

      const appointmentDate = new Date(year, month - 1, day);

      return {
        day,
        availability: (function () {
          if (appointmentsInDay.length >= 10) {
            return false;
          }

          if (
            (isToday(appointmentDate) && getHours(Date.now()) < 17) ||
            isFuture(appointmentDate)
          ) {
            return true;
          }
          return false;
        })(),
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
