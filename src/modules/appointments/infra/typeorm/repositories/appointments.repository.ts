import Appoitment from '../entities/appointments';
import { getRepository, Raw, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMounthDTO from '@modules/appointments/dtos/IFindAllInMounthDTO';
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO';

export default class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appoitment>;
  constructor() {
    this.ormRepository = getRepository(Appoitment);
  }
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appoitment | undefined> {
    const findAppointmentsInSameDate = await this.ormRepository.findOne({
      where: { date, provider_id },
    });
    return findAppointmentsInSameDate;
  }
  public async create({
    user_id,
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appoitment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }

  public async findAllInMounth({
    provider_id,
    month,
    year,
  }: IFindAllInMounthDTO): Promise<Appoitment[]> {
    const parseMount = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMount}-${year}'`,
        ),
      },
    });
    return appointments;
  }
  public async findAllInDay({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayDTO): Promise<Appoitment[]> {
    const parseMount = String(month).padStart(2, '0');
    const parseDay = String(day).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMount}-${year}'`,
        ),
      },
      relations: ['user'],
    });
    return appointments;
  }
}
