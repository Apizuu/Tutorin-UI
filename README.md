# Tutorin-UI

## Endpoints

### POST /register
Registers a new user.
```json
{
  "username": "user1",
  "password": "123",
  "year_joined": 2022,
  "major": "Computer Science",
  "faculty": "Engineering"
}
```

### POST /login
Logs in and returns a JWT.
```json
{
  "username": "user1",
  "password": "123"
}
```

### POST /topup
Add balance to a user account.
```json
{
  "username": "user1",
  "amount": 50000
}
```

### POST /create_session
Creates a session (token required).
```json
{
  "date": "Tuesday, 06 11 2025",
  "location": "Room A",
  "limit": 5,
  "fee": 10000.0
}
```

### GET /sessions
Returns all available sessions.

### POST /join_session
Joins a session by ID and transfers balance.
```json
{
  "session_id": "<session_id_here>"
}
```
