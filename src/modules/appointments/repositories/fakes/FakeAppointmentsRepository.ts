import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointments';
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindAllInMounthDTO from '@modules/appointments/dtos/IFindAllInMounthDTO';
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO';
export default class FakeAppointmentsRepository
  implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointmentsInSameDate = this.appointments.find(
      a => isEqual(a.date, date) && a.provider_id === provider_id,
    );
    return findAppointmentsInSameDate;
  }
  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });
    this.appointments.push(appointment);
    return appointment;
  }
  public async findAllInMounth({
    provider_id,
    month,
    year,
  }: IFindAllInMounthDTO): Promise<Appointment[]> {
    const appintments = this.appointments.filter(
      a =>
        a.provider_id === provider_id &&
        getMonth(a.date) + 1 === month &&
        getYear(a.date) === year,
    );
    return appintments;
  }
  public async findAllInDay({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayDTO): Promise<Appointment[]> {
    const appintments = this.appointments.filter(
      a =>
        a.provider_id === provider_id &&
        getMonth(a.date) + 1 === month &&
        getYear(a.date) === year &&
        getDate(a.date) === day,
    );
    return appintments;
  }
}
