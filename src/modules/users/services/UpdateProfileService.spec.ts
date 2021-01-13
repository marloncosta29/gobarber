import AppError from '@shared/errors/app-errors';
import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      email: 'testeDois@teste.com',
      name: 'testeDois',
    });
    await expect(updatedUser.name).toBe('testeDois');
    await expect(updatedUser.email).toBe('testeDois@teste.com');
  });

  it('should not be able to update email profile', async () => {
    await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const user = await fakeUserRepository.create({
      name: 'testeDois',
      email: 'testeDois@teste.com.br',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'teste@teste.com.br',
        name: 'teste alterado',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      email: 'teste@teste.com',
      name: 'teste alterado',
      old_password: '123456',
      password: '999999',
    });
    await expect(updatedUser.password).toBe('999999');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'teste@teste.com',
        name: 'teste alterado',
        password: '999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'teste@teste.com',
        name: 'teste alterado',
        old_password: '123123',
        password: '999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
