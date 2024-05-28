import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(function (req, res, next) {
  setTimeout(next, 400);
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', function (req, res, next) {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    res.status(200).send({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    });
  } else {
    res.status(401).send({});
  }
});

server.post('/movements', function (req, res, next) {
  req.body = {
    amount: req.body.amount,
    type: req.body.type,
    date: new Date().toISOString(),
    balance: 10000,
    id: new Date().getTime(),
  };
  next();
});

server.use(router);
server.listen(3000, function () {
  console.log('JSON Server is running');
});
