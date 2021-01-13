import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/user';
import { uuid } from 'uuidv4';
import IUsersTokensRepository from '../IUserTokenRepository';
import UsersTokens from '@modules/users/infra/typeorm/entities/UserToken';

export default class FakeUsersTokenRepository
  implements IUsersTokensRepository {
  private usersTokens: UsersTokens[] = [];

  public async generate(user_id: string): Promise<UsersTokens> {
    const userToken = new UsersTokens();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    this.usersTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UsersTokens | undefined> {
    const userTokenFind = this.usersTokens.find(u => u.token === token);
    return userTokenFind;
  }
}
