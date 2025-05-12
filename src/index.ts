import http, { Server } from 'http';
import 'dotenv/config';
import { Requests } from './req';

export const server: Server = http.createServer(Requests);

const PORT = process.env.PORT || 4000;

console.log(process.env.PORT);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
