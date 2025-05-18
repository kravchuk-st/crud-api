import http, { Server } from 'http';
import 'dotenv/config';
import { Requests } from './req';

export const server: Server = http.createServer(Requests);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
