import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
