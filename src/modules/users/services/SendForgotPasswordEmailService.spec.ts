import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/app-errors';
import FakeUsersTokenRepository from '../repositories/fakes/fakeUsersTokenRepository';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeAll(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUsersTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recovery password by email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const user = await fakeUserRepository.create({
      email: 'teste@teste.com',
      name: 'testinho',
      password: '123456',
    });
    await sendForgotPasswordEmail.execute({ email: user.email });
    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'teste@teste.com.br' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // it('should generate a forgot password token', async () => {
  //   const generate = jest.spyOn(fakeUserTokensRepository, 'generate');
  //   const user = await fakeUserRepository.create({
  //     email: 'teste@teste.com',
  //     name: 'testinho',
  //     password: '123456',
  //   });
  //   await sendForgotPasswordEmail.execute({ email: user.email });
  //   console.log({ user });
  //   await expect(generate).toHaveBeenCalledWith(user.id);
  // });
});
