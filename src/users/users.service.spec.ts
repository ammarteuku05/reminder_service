import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: USER_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    mockRepository.create.mockResolvedValue({ id: '1', name: 'Test' });
    const result = await service.create({ name: 'Test', email: 'test@test.com', birthday: '1990-01-01', timezone: 'UTC' });
    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('should throw ConflictException if email exists', async () => {
    mockRepository.create.mockRejectedValue({ code: 11000 });
    await expect(service.create({ name: 'Test', email: 'test@test.com', birthday: '1990-01-01', timezone: 'UTC' }))
      .rejects.toThrow(ConflictException);
  });

  it('should find a user', async () => {
    mockRepository.findById.mockResolvedValue({ id: '1', name: 'Test' });
    expect(await service.findOne('1')).toEqual({ id: '1', name: 'Test' });
  });

  it('should throw NotFoundException if user not found', async () => {
    mockRepository.findById.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    mockRepository.update.mockResolvedValue({ id: '1', name: 'Updated' });
    expect(await service.update('1', { name: 'Updated' })).toEqual({ id: '1', name: 'Updated' });
  });

  it('should throw NotFoundException when updating non-existent user', async () => {
    mockRepository.update.mockResolvedValue(null);
    await expect(service.update('1', { name: 'Updated' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a user', async () => {
    mockRepository.delete.mockResolvedValue({ id: '1' });
    expect(await service.remove('1')).toEqual({ id: '1' });
  });

  it('should throw NotFoundException when deleting non-existent user', async () => {
    mockRepository.delete.mockResolvedValue(null);
    await expect(service.remove('1')).rejects.toThrow(NotFoundException);
  });
});
