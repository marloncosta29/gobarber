import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/app-errors';
import FakeUsersTokenRepository from '../repositories/fakes/fakeUsersTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUsersTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;
describe('ResetPassword', () => {
  beforeAll(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUsersTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    let user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });
    const userToken = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token: userToken.token,
      password: '999999',
    });

    user = await fakeUserRepository.findById(user.id);
    expect(generateHash).toHaveBeenCalledWith('999999');
    expect(user.password).toBe('999999');
  });

  it('should not be able not reset with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '1234567',
        token: 'bla-bla',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able not reset with non-existing user', async () => {
    const userToken = await fakeUserTokensRepository.generate(
      'non-existing-id',
    );
    await expect(
      resetPasswordService.execute({
        password: '1234567',
        token: userToken.token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password after 2 hours', async () => {
    let user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: '999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
