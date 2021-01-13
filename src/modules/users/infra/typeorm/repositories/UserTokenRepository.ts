import { getRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import UsersTokens from '../entities/UserToken';
import IUsersTokensRepository from '@modules/users/repositories/IUserTokenRepository';

export default class UserTokenRepository implements IUsersTokensRepository {
  private ormRepository: Repository<UsersTokens>;
  constructor() {
    this.ormRepository = getRepository(UsersTokens);
  }
  public async findByToken(token: string): Promise<UsersTokens | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        token,
      },
    });
    return userToken;
  }
  public async generate(user_id: string): Promise<UsersTokens> {
    const userToken = this.ormRepository.create({ user_id });
    await this.ormRepository.save(userToken);
    return userToken;
  }
}
