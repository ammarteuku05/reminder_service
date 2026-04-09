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
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
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

  it('should create user', async () => {
    const dto = { name: 'Test', email: 'x@y.com', birthday: '1990-01-01', timezone: 'UTC' };
    const res = await repository.create(dto);
    expect(res).toBeDefined();
  });

  it('should find by id', async () => {
    MockUserModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ id: '1' }) });
    expect(await repository.findById('1')).toEqual({ id: '1' });
  });

  it('should update', async () => {
    MockUserModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue({ id: '1' }) });
    expect(await repository.update('1', {} as any)).toEqual({ id: '1' });
  });

  it('should delete', async () => {
    MockUserModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue({ id: '1' }) });
    expect(await repository.delete('1')).toEqual({ id: '1' });
  });

  it('should find all', async () => {
    MockUserModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([{ id: '1' }]) });
    expect(await repository.findAll()).toEqual([{ id: '1' }]);
  });
});
