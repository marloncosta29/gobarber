import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import AppError from '@shared/errors/app-errors';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentsService';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointmentService.execute({
      user_id: '123456',
      date: new Date(2020, 4, 10, 13),
      provider_id: '123',
    });
    expect(appointment).toHaveProperty('id');
  });
  it('should not be able to create two appointment on the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointmentDate = new Date(2020, 4, 10, 15);
    await createAppointmentService.execute({
      user_id: '123456',
      date: appointmentDate,
      provider_id: '123',
    });
    await expect(
      createAppointmentService.execute({
        user_id: '123456',
        date: appointmentDate,
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a appointment in a past date ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        user_id: '123456',
        date: new Date(2020, 4, 10, 11),
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a appointment with yourself ', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        user_id: '123456',
        date: new Date(2020, 4, 10, 13),
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a appointment before 8h or after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointmentService.execute({
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 20),
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
