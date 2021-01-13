import FakeUserRepository from '@modules/users/repositories/fakes/fakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all providers', async () => {
    const userOne = await fakeUserRepository.create({
      name: 'testeUm',
      email: 'testeUm@exemple.com.br',
      password: '123456',
    });
    const usertwo = await fakeUserRepository.create({
      name: 'testeDois',
      email: 'testeDois@exemple.com.br',
      password: '123456',
    });
    const userLogged = await fakeUserRepository.create({
      name: 'testeTres',
      email: 'testeTres@exemple.com.br',
      password: '123456',
    });
    const providers = await listProviders.execute({
      user_id: userLogged.id,
    });
    await expect(providers).toEqual([userOne, usertwo]);
  });
});
