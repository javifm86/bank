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

Developed with Node.js version 18. Navigate to the `frontend` folder and install the dependencies.

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

For the backend to work properly, it needs to establish a connection with a PostgreSQL database. You can set up and run a database using [Docker](https://docs.docker.com/get-docker/).

For simplicity, the easiest way is to generate an image with the database information. From the project root, we will build the image using the script provided in the [Dockerfile](./Dockerfile):

```sh
# Generate docker image with name
docker build -t my_postgres_with_data .

# Execute container with database already created
docker run --name name_you_want -e POSTGRES_PASSWORD=example -d -p 5432:5432 my_postgres_with_data

# Check container is running
docker ps
```

From now on, whenever you want to run the container (since it is already created on your operating system), you can start it simply with:

```sh
docker start name_you_want
```

This way, the database will be accessible on the local port `5432`. Credentials, database name, and related information can be found in the [.env](./backend/.env) file.

The Express app has also been developed with Node.js version 18. Navigate to the `backend` folder and install the dependencies.

```sh
cd backend
npm install
```

Run the app with the following script:

```sh
npm run dev
```

Server should be accessible on port `3000`, as defined in [.env](./backend/.env) file.

Finally, open http://localhost:5173 and log in using the username `admin` and the password `admin` to check movements and deposit or withdraw money.

## Comments

- The `frontend` and `backend` include unit tests with sufficient coverage.
- The `backend` provides a simple API to manage the data stored in the database.
- A very basic logging system has been implemented in the backend using `console.log` and `console.error`.
- `JWT` is stored in memory in the frontend app, so if you refresh the page, the login page will load again.
- I included a mocked backend using json-server for the frontend app. The idea was to develop a basic end-to-end (e2e) test with Cypress using this server, but I did not have time to include those e2e tests.
- There is only one user in the database with the following credentials:
  - user: `admin`
  - password: `admin`
- There is no endpoint for signing up or creating new users, as this was considered outside the scope of the exercise.
- Setting up and running the application has been tested on Linux and Windows following the instructions included in this README.

## Screenshots

![Login](/screenshots/login.png)
![Movements](/screenshots/movements.png)
