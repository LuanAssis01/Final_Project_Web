import http from 'http';
import { userRouter } from './router/userRouter.js';

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/users')) {
    userRouter(req, res);
  } else {
    res.writeHead(404);
    res.end('Rota não encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
