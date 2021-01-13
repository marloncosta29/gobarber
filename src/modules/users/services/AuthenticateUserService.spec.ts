import AppError from '@shared/errors/app-errors';
import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './authenticate-user.service';
import CreateUserService from './create-user.service';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeAll(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to authenticate user', async () => {
    const user = await createUser.execute({
      email: 'testeAuth@testeAuth.com',
      name: 'testinho',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'testeAuth@testeAuth.com',
      password: '123456',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with wrong user email', async () => {
    expect(
      authenticateUser.execute({
        email: 'testeAuthDois@testeAuthDois.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong user password', async () => {
    const user = await createUser.execute({
      email: 'teste@teste.com',
      name: 'testinho',
      password: '123456',
    });
    expect(
      authenticateUser.execute({
        email: 'teste@teste.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
