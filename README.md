# Bank

Bank application.

- Frontend app developed with React.
- Backend API developed with Express + postgresql database.

## Task requirements

- You should be able to deposit money
- You should be able to withdraw money
- Display the movements in the bank account

## Setup development environment

### Frontend

Developed with version 18 of Node. Go to `frontend` folder and install the dependencies.

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

For simplicity, the easiest way is generating an image with database information. From the project root, we will build from the script provided in [Dockerfile](./Dockerfile):

```sh
# Generate docker image with name
docker build -t my_postgres_with_data .

# Execute container with database already created
docker run --name name_you_want -e POSTGRES_PASSWORD=example -d -p 5432:5432 my_postgres_with_data

# Check container is running
docker ps
```

From now on, the next time you want to run the container, (as it is already created in your operative system), you can start it simply with:

```sh
docker start name_you_want
```

This way, the database will be ready on the local port 5432. Credentiales, database name and related information can be found in [.env](./backend/.env) file.

Express app has been developed with version 18 of Node as well. Go to `backend` folder and install the dependencies.

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

- `frontend` and `backend` include unit tests with enough coverage.
- `backend` provides a simple API to manage the data stored in the database.
- JWT is stored in memory in frontend app, if you refresh the page, login page is loaded for login again.
- I included a backend mocked with `json-server` for the frontend app. The idea was to develop a basic e2e test with cypress using this server, but finally I didn't have time to include those e2e tests.
- There is only one user in the database, the credentials are:
  - user: admin
  - password: admin
- There is not an endpoint to Sign up and creating new users, I think that it would be out of the scope of the exercise.
- Set up the application and running has been tested following the instructions included in this README in Ubuntu and Windows 10.

## Screenshots

![Login](/screenshots/login.png)
![Movements](/screenshots/movements.png)
