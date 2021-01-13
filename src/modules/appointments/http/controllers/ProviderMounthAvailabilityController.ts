import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMounthAvailabilityService from '@modules/appointments/services/ListProviderMounthAvailabilityService';

export default class ProviderMounthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;
    const listProviderMounthAvailabilityService = container.resolve(
      ListProviderMounthAvailabilityService,
    );
    const availibity = await listProviderMounthAvailabilityService.execute({
      user_id: provider_id,
      month: Number(month),
      year: Number(year),
    });
    return response.json(availibity);
  }
}
