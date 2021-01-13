import CreateAppoimentService from '../../services/CreateAppointmentsService';
import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    const createAppoimentService = container.resolve(CreateAppoimentService);
    const appointment = await createAppoimentService.execute({
      user_id,
      provider_id,
      date,
    });
    return response.json(appointment);
  }
}
