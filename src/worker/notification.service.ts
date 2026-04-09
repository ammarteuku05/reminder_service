import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendBirthdayMessage(user: User): Promise<void> {
    this.logger.log(`Happy Birthday, ${user.name}! (Sent to ${user.email})`);
  }
}
