# RSS CRUD API

Small API with once endpont who supportes CRUD operations.
Used in-memory database.

# Get started

    1. git clone https://github.com/kravchuk-st/crud-api.git - clone this repository
    2. git switch dev - go to the root directory and change branch to dev
    3. npm install - install required dependencies

# You can run

    1. npm run start:prod - bundle & started server (production mode)
    2. npm run start:dev - started server in development mode
    3. npm run start:multi - run server in multi poccess - development mode
    4. npm run test - run tests (start with a running server!)

# Usage

The API exposes the following endpoints:

- GET /api/users - Returns a list of all users.
- GET /api/users/{userId} - Returns a single user by ID.
- POST /api/users - Creates a new user.
- PUT /api/users/{userId} - Updates an existing user by ID.
- DELETE /api/users/{userId} - Deletes a user by ID.
