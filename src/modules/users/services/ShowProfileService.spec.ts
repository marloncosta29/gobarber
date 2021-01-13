import AppError from '@shared/errors/app-errors';
import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });
    const profile = await showProfileService.execute({
      user_id: user.id,
    });
    await expect(profile.name).toBe('teste');
    await expect(profile.email).toBe('teste@teste.com.br');
  });
});
