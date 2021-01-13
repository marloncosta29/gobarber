import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInDayDTO from '../dtos/IFindAllInDayDTO';
import IFindAllInMounthDTO from '../dtos/IFindAllInMounthDTO';
import Appointment from '../infra/typeorm/entities/appointments';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMounth(data: IFindAllInMounthDTO): Promise<Appointment[]>;
  findAllInDay(data: IFindAllInDayDTO): Promise<Appointment[]>;
}
