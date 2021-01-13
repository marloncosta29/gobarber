import { getDate, getDaysInMonth, isAfter, startOfHour } from 'date-fns';
import Appointment from '../infra/typeorm/entities/appointments';
import AppError from '@shared/errors/app-errors';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';

interface IRequestDTO {
  user_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMounthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,
  ) {}
  public async execute({
    user_id,
    month,
    year,
  }: IRequestDTO): Promise<IResponse> {
    const appintments = await this.appointmentRepository.findAllInMounth({
      provider_id: user_id,
      month,
      year,
    });

    const numberInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appintments.filter(
        a => getDate(a.date) === day,
      );
      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });
    return availability;
  }
}
