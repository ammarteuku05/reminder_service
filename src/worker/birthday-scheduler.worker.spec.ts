import { Test, TestingModule } from '@nestjs/testing';
import { BirthdaySchedulerWorker } from './birthday-scheduler.worker';
import { NotificationService } from './notification.service';
import { USER_REPOSITORY } from '../users/repositories/user.repository.interface';
import * as moment from 'moment-timezone';

describe('BirthdaySchedulerWorker', () => {
  let worker: BirthdaySchedulerWorker;
  let mockRepository = {
    findAll: jest.fn(),
  };

  let mockNotificationService = {
    sendBirthdayMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirthdaySchedulerWorker,
        { provide: USER_REPOSITORY, useValue: mockRepository },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    worker = module.get<BirthdaySchedulerWorker>(BirthdaySchedulerWorker);
  });

  afterEach(() => jest.clearAllMocks());

  it('should send birthday message to user with matching local time', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-10T13:00:00.000Z').getTime()); // UTC time
    
    // America/New_York is UTC-4. So at 13:00 UTC, it's 09:00 AM NY time.
    mockRepository.findAll.mockResolvedValue([
      { id: '1', name: 'New York User', email: 'ny@test.com', birthday: new Date('1990-05-10T00:00:00.000Z'), timezone: 'America/New_York' },
      { id: '2', name: 'London User', email: 'ldn@test.com', birthday: new Date('1990-05-10T00:00:00.000Z'), timezone: 'Europe/London' },
    ]);

    await worker.handleCron();

    expect(mockNotificationService.sendBirthdayMessage).toHaveBeenCalledTimes(1);
    expect(mockNotificationService.sendBirthdayMessage).toHaveBeenCalledWith(expect.objectContaining({ name: 'New York User' }));
    
    jest.useRealTimers();
  });
});
