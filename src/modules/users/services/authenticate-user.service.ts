import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import config from '@config/auth';
import User from '../infra/typeorm/entities/user';
import AppError from '@shared/errors/app-errors';
import IUserRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface AuthenticateUserDTO {
  email: string;
  password: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({
    email,
    password,
  }: AuthenticateUserDTO): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorret email/password conbination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );
    if (!passwordMatched) {
      throw new AppError('Incorret email/password conbination', 401);
    }
    const token = sign({ nome: user.name }, config.jwt.secret, {
      subject: user.id,
      expiresIn: config.jwt.expiresIn,
    });

    return { user, token };
  }
}
