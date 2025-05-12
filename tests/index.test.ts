import http from 'http';
import 'dotenv/config';
import { users } from '../src/db';

describe('User API tests', () => {
  let id: string;
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 4000;
  const URL = process.env.BASE_URL;

  const newUser = {
    username: 'Ivan',
    age: 29,
    hobbies: ['bla', 'bla'],
  };

  test('GET /api/users should return an empty array', (done) => {
    http.get(`http://${HOST}:${PORT}${URL}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        expect(res.statusCode).toBe(200);
        expect(response).toEqual([]);
        expect(users).toEqual([]);
        done();
      });
    });
  });

  test('POST /api/users should create a new user object', (done) => {
    const options = {
      method: 'POST',
      hostname: HOST,
      port: PORT,
      path: URL,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        id = response.id;
        users.push(response);

        expect(res.statusCode).toBe(201);
        expect(response).toEqual(expect.objectContaining(newUser));
        expect(users[0]).toEqual(expect.objectContaining(newUser));

        done();
      });
    });

    req.write(JSON.stringify(newUser));

    req.end();
  });

  test('GET /api/users/{userId} should return the created user object', (done) => {
    http.get(`http://${HOST}:${PORT}${URL}/${id}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        expect(res.statusCode).toBe(200);
        expect(response.id).toBe(id);

        done();
      });
    });
  });

  test('PUT /api/users/{userId} should update the user object', (done) => {
    const updatedUser = {
      id,
      username: 'Ivan Ivanov',
      age: 30,
      hobbies: ['new', 'hobbi'],
    };

    const options = {
      method: 'PUT',
      hostname: HOST,
      port: PORT,
      path: `${URL}/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        users[0] = updatedUser;

        expect(res.statusCode).toBe(200);
        expect(response).toEqual(expect.objectContaining(updatedUser));
        expect(users[0]).toEqual(expect.objectContaining(updatedUser));
        done();
      });
    });

    req.write(JSON.stringify(updatedUser));
    req.end();
  });

  test('DELETE /api/users/{userId} should delete the user object', (done) => {
    const options = {
      method: 'DELETE',
      hostname: HOST,
      port: PORT,
      path: `${URL}/${id}`,
    };

    const req = http.request(options, (res) => {
      res.on('data', () => {});

      res.on('end', () => {
        expect(res.statusCode).toBe(204);

        const userIndex = users.findIndex((el) => el.id === id);
        if (userIndex !== -1) users.splice(userIndex, 1);

        expect(users).toEqual([]);
        done();
      });
    });

    req.end();
  });
});
