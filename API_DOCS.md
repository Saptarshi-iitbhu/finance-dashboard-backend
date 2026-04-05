# Zorvyn Finance API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
This API uses standard JWT Cookies (`httpOnly`). Ensure your frontend is sending credentials (`withCredentials: true` in Axios or Fetch) so cookies are attached.

---

## Users & Authentication

### `POST /users/register`
- **Description**: Registers a new user. The first ever user is `ADMIN`, subsequent users are `VIEWER`.
- **Payload**:
  ```json
  {
      "username": "johndoe",
      "email": "john@example.com",
      "password": "Password123!"
  }
  ```

### `POST /users/login`
- **Payload**: `{ "email": "john@example.com", "password": "Password123!" }`
- **Response**: Sets `token` cookie. Returns User object minus password.

### `POST /users/logout`
- **Description**: Clears the authentication cookie.

---

## Records Management
*Requires Authentication for all routes below*

### `GET /records`
- **Description**: Fetch financial records, supports pagination and search.
- **Query Params**:
  - `page`: Page number (Default: 1)
  - `limit`: Items per page (Default: 10)
  - `search`: Searches `description` by keyword (Regex pattern matching)
  - `type`: Filter by `INCOME` or `EXPENSE`
  - `category`: Filter by category ObjectId
  - `startDate`, `endDate`: Date range filtering ('YYYY-MM-DD')

### `POST /records`
- **Authorization**: `ADMIN` only
- **Payload**:
  ```json
  {
      "amount": 100,
      "type": "EXPENSE",
      "category": "65b...",
      "date": "2024-02-01T00:00:00.000Z",
      "description": "Groceries"
  }
  ```

### `PUT /records/:id`
- **Authorization**: `ADMIN` only
- **Description**: Update fields on an existing record.
- **Payload**: Any fields to update.

### `DELETE /records/:id`
- **Authorization**: `ADMIN` only
- **Description**: **Soft deletes** the record (sets `isDeleted = true`).

### `GET /records/summary`
- **Description**: Compiles dashboard overview statistics.
- **Returns**: Overall `totalIncome`, `totalExpenses`, `netBalance`, category wise totals, and 5 recently added records.

---

## Categories Management

### `GET /categories`
- **Description**: Fetch list of all categories.

### `POST /categories`
- **Authorization**: `ADMIN` only
- **Payload**: `{ "name": "Food" }`
