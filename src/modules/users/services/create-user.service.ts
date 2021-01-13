import User from '../infra/typeorm/entities/user';
import AppError from '@shared/errors/app-errors';
import IUserRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface UserDTO {
  name: string;
  email: string;
  password: string;
}
@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private bCryptHashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: UserDTO): Promise<User> {
    const checkUserExist = await this.userRepository.findByEmail(email);
    if (checkUserExist) {
      throw new AppError('Email address is already used');
    }

    const hashPassword = await this.bCryptHashProvider.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });
    await this.cacheProvider.invalidatePrefix('providers-list');
    return user;
  }
}
