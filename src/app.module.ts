import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/birthday-service'),
    UsersModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
