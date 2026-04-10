import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoUserRepository } from './mongo-user.repository';
import { User } from '../schemas/user.schema';

describe('MongoUserRepository', () => {
  let repository: MongoUserRepository;

  class MockUserModel {
    constructor(public data: any) {}
    save() {
      return Promise.resolve(this.data);
    }
    static findOne = jest.fn();
    static findOneAndUpdate = jest.fn();
    static find = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoUserRepository,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    repository = module.get<MongoUserRepository>(MongoUserRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create user', async () => {
    const dto = { name: 'Test', email: 'x@y.com', birthday: '1990-01-01', timezone: 'UTC' };
    const res = await repository.create(dto);
    expect(res).toBeDefined();
  });

  it('should find by id (excluding soft-deleted)', async () => {
    MockUserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({ id: '1' }) });
    const result = await repository.findById('1');
    expect(result).toEqual({ id: '1' });
    expect(MockUserModel.findOne).toHaveBeenCalledWith({ _id: '1', deleted_at: null });
  });

  it('should return null for soft-deleted user on findById', async () => {
    MockUserModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    const result = await repository.findById('deleted-id');
    expect(result).toBeNull();
  });

  it('should update active user', async () => {
    MockUserModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue({ id: '1' }) });
    expect(await repository.update('1', {} as any)).toEqual({ id: '1' });
    expect(MockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '1', deleted_at: null },
      {},
      { new: true },
    );
  });

  it('should soft delete user by setting deleted_at', async () => {
    const deletedUser = { id: '1', deleted_at: expect.any(Number) };
    MockUserModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(deletedUser) });
    const result = await repository.delete('1');
    expect(result).toBeDefined();
    expect(MockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '1', deleted_at: null },
      { deleted_at: expect.any(Number) },
      { new: true },
    );
  });

  it('should return null when deleting an already soft-deleted user', async () => {
    MockUserModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    const result = await repository.delete('deleted-id');
    expect(result).toBeNull();
  });

  it('should find all active users only', async () => {
    MockUserModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([{ id: '1' }]) });
    const result = await repository.findAll();
    expect(result).toEqual([{ id: '1' }]);
    expect(MockUserModel.find).toHaveBeenCalledWith({ deleted_at: null });
  });
});
