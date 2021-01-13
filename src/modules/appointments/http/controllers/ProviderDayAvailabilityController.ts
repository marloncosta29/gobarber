import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailibilityService from '@modules/appointments/services/ListProviderDayAvailibilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;
    const listProviderDayAvailibilityService = container.resolve(
      ListProviderDayAvailibilityService,
    );
    const availibity = await listProviderDayAvailibilityService.execute({
      user_id: provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });
    return response.json(availibity);
  }
}
