import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

const fakeUser = {
  id: 123,
  email: 'user@example.test',
  password: 'asdf',
  encodedPass:
    '4600d0e3e1dc3fb0.f6c4cd18ab0417561aadace165431ae34b79071bfd615ea583afa523ff1520fd',
};

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService> = {};

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('creates a new user with a salted and hashed password', async () => {
      const { email, password } = await service.signup(
        fakeUser.email,
        fakeUser.password,
      );

      const [salt, hash] = password.split('.');
      expect(email).toEqual(fakeUser.email);
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws an error if email is already in use', async () => {
      mockUsersService.findByEmail = () =>
        Promise.resolve([
          { email: 'existing@example.com', password: 'pass', id: 1 } as User,
        ]);

      await expect(
        service.signup(fakeUser.email, fakeUser.password),
      ).rejects.toThrow('Email in use');
    });
  });

  describe('signin', () => {
    it('returns a user if correct password is provided', async () => {
      mockUsersService.findByEmail = () =>
        Promise.resolve([
          {
            id: 1,
            email: fakeUser.email,
            password: fakeUser.encodedPass,
          } as User,
        ]);

      const user = await service.signin(fakeUser.email, fakeUser.password);

      expect(user).toEqual({
        id: 1,
        email: fakeUser.email,
        password: fakeUser.encodedPass,
      });
    });

    it('throws an error if an invalid password is provided', async () => {
      mockUsersService.findByEmail = () =>
        Promise.resolve([fakeUser as unknown as User]);

      await expect(
        service.signin(fakeUser.email, 'wrong password'),
      ).rejects.toThrow('Invalid password');
    });

    it('throws an error if user is not found', async () => {
      mockUsersService.findByEmail = () => Promise.resolve([]);

      await expect(
        service.signin(fakeUser.email, fakeUser.password),
      ).rejects.toThrow(`User with email ${fakeUser.email} not found`);
    });
  });
});
