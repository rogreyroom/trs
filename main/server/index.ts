import app from './app';

const server = app;
const port = 3001;

// starting the server
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server: listening on port ${port}`);
});

export default server;
