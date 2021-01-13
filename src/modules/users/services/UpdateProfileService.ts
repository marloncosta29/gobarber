import fs from 'fs';
import path from 'path';
import User from '../infra/typeorm/entities/user';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/app-errors';
import IUserRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new AppError('Email is already used');
    }
    if (password && !old_password) {
      throw new AppError('Old password must be informed');
    }

    user.name = name;
    user.email = email;
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Wrong old password informed');
      }
      user.password = await this.hashProvider.generateHash(password);
    }
    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}
