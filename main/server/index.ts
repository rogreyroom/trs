import http from 'http';
import app, { port } from './app';

const server = new http.Server(app);

// starting the server
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server: listening on port ${port}`);
});

export default server;
