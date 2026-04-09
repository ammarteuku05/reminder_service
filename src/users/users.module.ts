import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongoUserRepository } from './repositories/mongo-user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, MongooseModule],
})
export class UsersModule {}
