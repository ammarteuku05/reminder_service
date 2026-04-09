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