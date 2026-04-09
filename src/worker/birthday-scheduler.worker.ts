import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from './notification.service';
import { USER_REPOSITORY } from '../users/repositories/user.repository.interface';
import type { IUserRepository } from '../users/repositories/user.repository.interface';
import * as moment from 'moment-timezone';

@Injectable()
export class BirthdaySchedulerWorker {
  private readonly logger = new Logger(BirthdaySchedulerWorker.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(process.env.BIRTHDAY_CRON || CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Running global birthday scheduler check...');
    
    const users = await this.userRepository.findAll();

    for (const user of users) {
      if (!user.birthday || !user.timezone) continue;

      const userLocalTime = moment.tz(user.timezone);
      const userBirthdayMonth = moment.utc(user.birthday).month();
      const userBirthdayDate = moment.utc(user.birthday).date();

      const isSameMonth = userLocalTime.month() === userBirthdayMonth;
      const isSameDate = userLocalTime.date() === userBirthdayDate;
      const is9AM = userLocalTime.hour() === 9;

      if (isSameMonth && isSameDate && is9AM) {
        await this.notificationService.sendBirthdayMessage(user);
      }
    }
  }
}
