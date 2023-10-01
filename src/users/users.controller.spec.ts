import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService> = {};
  let mockAuthService: Partial<AuthService> = {};

  beforeEach(async () => {
    mockUsersService = {
      findByEmail: () => Promise.resolve([]),
      findAll: () => Promise.resolve([{}, {}, {}] as User[]),
      findOne: (id) => Promise.resolve({} as User),
      remove: (id) => Promise.resolve({} as User),
      update: (id, attrs) => Promise.resolve({} as User),
    };

    mockAuthService = {
      signin: (email, password) =>
        Promise.resolve({ email, password, id: 123 } as User),
      signup: (email, password) =>
        Promise.resolve({ email, password, id: 321 } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // should really only test methods that do more than pass to service
  it('findAllUsers returns the list of users', async () => {
    const users = await controller.findAllUsers();

    expect(users).toBeDefined();
    expect(users.length).toEqual(3);
  });

  it('signup creates a new user and returns it', async () => {
    const session = {} as any;
    const user = await controller.createUser(
      {
        email: 'user@example.com',
        password: 'asdf',
      },
      session,
    );

    expect(user.id).toBe(321);
    expect(session.userId).toBe(321);
  });
});
