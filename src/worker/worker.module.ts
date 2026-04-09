import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';
import { BirthdaySchedulerWorker } from './birthday-scheduler.worker';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule],
  providers: [NotificationService, BirthdaySchedulerWorker],
})
export class WorkerModule {}
