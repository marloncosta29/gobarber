import {
  getDate,
  getDaysInMonth,
  getHours,
  isAfter,
  startOfHour,
} from 'date-fns';
import Appointment from '../infra/typeorm/entities/appointments';
import AppError from '@shared/errors/app-errors';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';

interface IRequestDTO {
  user_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailibilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,
  ) {}
  public async execute({
    user_id,
    month,
    year,
    day,
  }: IRequestDTO): Promise<IResponse> {
    const appintments = await this.appointmentRepository.findAllInDay({
      provider_id: user_id,
      month,
      year,
      day,
    });

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );
    const currentDate = new Date(Date.now());
    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appintments.find(
        a => getHours(a.date) === hour,
      );
      const compareDate = new Date(year, month - 1, day, hour);
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}
