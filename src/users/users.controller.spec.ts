import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create user', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    expect(await controller.create({} as any)).toEqual({ id: '1' });
  });

  it('should find user', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    expect(await controller.findOne('1')).toEqual({ id: '1' });
  });

  it('should update user', async () => {
    mockService.update.mockResolvedValue({ id: '1' });
    expect(await controller.update('1', {} as any)).toEqual({ id: '1' });
  });

  it('should soft delete user', async () => {
    mockService.remove.mockResolvedValue({ id: '1', deleted_at: 1712750000 });
    expect(await controller.remove('1')).toEqual({ id: '1', deleted_at: 1712750000 });
  });
});
