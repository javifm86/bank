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
  req.method = 'GET';
  req.query = req.body;

  const { userName, password } = req.query;

  if (userName === 'admin' && password === 'admin') {
    res.status(200).send({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    });
  } else {
    res.status(401).send({});
  }
});

server.use(router);
server.listen(3001, function () {
  console.log('JSON Server is running');
});
