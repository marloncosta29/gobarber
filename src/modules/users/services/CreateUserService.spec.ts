import AppError from '@shared/errors/app-errors';
import FakeUserRepository from '../repositories/fakes/fakeUsersRepository';
import CreateUserService from './create-user.service';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'teste@teste.com',
      name: 'testinho',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('teste@teste.com');
  });
  it('should not be able to create a new user with same email', async () => {
    const userEmail = 'testeDois@testeDois.com';
    await createUser.execute({
      email: userEmail,
      name: 'testinho',
      password: '123456',
    });
    expect(
      createUser.execute({
        email: userEmail,
        name: 'testinho',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
