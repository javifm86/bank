# Bank
Bank application.
- Frontend app developed with React.
- Backend API developed with Express + postgresql database.

## Requirements
- You should be able to deposit money
- You should be able to withdraw money
- Display the movements in the bank account

## Setup development environment

### Frontend
Go to `frontend` folder and install the dependencies. Developed with version 18 of Node.
```sh
cd frontend
npm install
```
Run the app with the following script:
```sh
npm run dev
```
App should be accessible on http://localhost:5173

### Backend
In order to work properly, backend needs to stablish a connection with postgresql database. You can get up and running a database with [Docker](https://docs.docker.com/get-docker/).

For simplicity, the easiest way is running the provided image:

```sh
docker run --name postgres-bank -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

This way, the database will be ready on the local port 5432. Credentiales, database name and related information can be found in [.env](./backend/.env) file.

Go to `backend` folder and install the dependencies. Developed with version 18 of Node.
```sh
cd backend
npm install
```
Run the app with the following script:
```sh
npm run dev
```
App should be accessible on port 3000, as defined in [.env](./backend/.env) file.

## Comments
- frontend and backend include unit tests with enough coverage.
- backend provides a simple API to manage the data stored in the database.
- I included a backend mocked with `json-server` for the frontend app. The idea was to develop a basic e2e test with cypress using this server, but finally I didn't have time to include those e2e tests.
- There is only one user in the database, the credentials are:
  - user: admin
  - password: admin
- There is not an endpoint to Sign up and creating new user, I think that would be out of the scope of the exercise.
