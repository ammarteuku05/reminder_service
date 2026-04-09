# Birthday Reminder Service

## Run the Service

### Starting with Docker
1. Navigate to the root directory where `docker-compose.yml` is located.
2. Build and start the containers in the background:
   ```bash
   docker compose up --build -d
   ```
3. The API will be accessible at: `http://localhost:3000`.
4. To view the worker's cron job logs (where the "Happy Birthday" simulation messages will be outputted):
   ```bash
   docker logs -f reminder_service-api-1
   ```
5. To shut down the application:
   ```bash
   docker compose down
   ```

### Starting Locally (without Docker)
1. Ensure MongoDB is running locally on port `27017` or provide a `.env` export for `MONGO_URI`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run start:dev
   ```
4. Run Unit Tests:
   ```bash
   npm run test:cov
   ```

---

## API Docs

### 1. Create a User
Must provide a valid `ISO8601` birthday and a valid `IANA` timezone string.
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "birthday": "1990-05-15",
    "timezone": "America/New_York"
  }'
```

### 2. Retrieve a User
```bash
curl http://localhost:3000/users/<USER_ID>
```

### 3. Update a User
```bash
curl -X PATCH http://localhost:3000/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'
```

### 4. Delete a User
```bash
curl -X DELETE http://localhost:3000/users/<USER_ID>
```

---

## Design Decisions & Limitations

- **SOLID Principles & Dependency Injection:** The implementation heavily isolates business logic from infrastructure implementation. We utilized an `IUserRepository` boundary interface. The `UsersService` strictly depends on this abstraction (DIP) rather than a direct Mongoose model, making the system modular and testable.
- **Worker Cron Strategy:** The `BirthdaySchedulerWorker` fetches all users and executes checking logic *every hour* on the hour (`0 * * * *`). It checks if the current moment converted to the *user's local timezone* equates to 9 AM, and if the month/date match their birthday. 
- **Message Simulation:** As requested, the "Happy Birthday" message is not integrated with external SMTPs right now; it simulates a send by logging directly to the NestJS Logger terminal output via the `NotificationService`.
- **Database Indexing:** We defined the `email` property as `unique: true` on the Mongoose schema. The application service layer catches `11000` duplicate key errors and returns graceful `409 Conflict` exceptions.
- **Assumptions**: 
  - Valid IANA Timezones are required (validated globally using a custom decorator and `moment-timezone`).
  - Leap years are handled generally by `moment.utc`. (e.g., Feb 29 birthdays evaluated natively).
