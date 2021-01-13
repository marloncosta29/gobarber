import AppError from '@shared/errors/app-errors';
import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import CreateUserService from './create-user.service';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './update-user-avatar.service';
import { uuid } from 'uuidv4';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const updatedUser = await updateUserAvatar.execute({
      avatarFileName: 'fileteste.png',
      user_id: user.id,
    });

    expect(updatedUser.avatar).toBe('fileteste.png');
  });

  it('should not be able to update avatar from non exist user', async () => {
    expect(
      updateUserAvatar.execute({
        avatarFileName: 'fileteste.png',
        user_id: 'wrong-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete avatar when update user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFileName: 'fileteste.png',
      user_id: user.id,
    });
    await updateUserAvatar.execute({
      avatarFileName: 'filetesteDois.png',
      user_id: user.id,
    });
    expect(deleteFile).toHaveBeenCalledWith('fileteste.png');
    expect(user.avatar).toBe('filetesteDois.png');
  });
});
