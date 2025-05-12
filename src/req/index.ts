import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../helpers/response';
import { isValidUUID } from '../helpers/uuid';
import { jsonParse } from '../helpers/jsonParse';
import { users } from '../db';
import { IUser, IErrorResponse } from '../types';

export const Requests = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { method, url } = req;

    if (method === 'GET' && url === process.env.BASE_URL) {
      Response(res, 200, users);
    } else if (url && method === 'GET' && url.startsWith(`${process.env.BASE_URL}`)) {
      const userId = url.split('/')[3];

      if (userId && !isValidUUID(userId)) {
        Response(res, 400, { message: 'Invalid userId' } as IErrorResponse);
      }

      const user = users.find((el) => el.id === userId);

      if (!user) {
        Response(res, 404, { message: 'User not found' } as IErrorResponse);
      } else {
        Response(res, 200, user);
      }
    } else if (method === 'POST' && url === process.env.BASE_URL) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const { username, age, hobbies } = jsonParse<Partial<IUser>>(body) || {};

          if (!username || !age || !hobbies || !Array.isArray(hobbies)) {
            Response(res, 400, {
              message: 'Missing required fields',
            } as IErrorResponse);
          } else {
            const newUser: IUser = {
              id: uuidv4(),
              username,
              age,
              hobbies,
            };

            users.push(newUser);

            Response(res, 201, newUser);
          }
        } catch (error) {
          console.error(error);
          Response(res, 500, {
            message: 'Internal server error',
          } as IErrorResponse);
        }
      });
    } else if (url && method === 'PUT' && url.startsWith(`${process.env.BASE_URL}`)) {
      const userId = url.split('/')[3];
      if (userId && !isValidUUID(userId)) {
        Response(res, 400, { message: 'Invalid userId' } as IErrorResponse);
      }

      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const { username, age, hobbies } = jsonParse<Partial<IUser>>(body) || {};

          const userIndex = users.findIndex((el) => el.id === userId);
          const user = users[userIndex];

          if (!user) {
            Response(res, 404, {
              message: 'User not found',
            } as IErrorResponse);
          } else if (!username || !age || !hobbies || !Array.isArray(hobbies)) {
            Response(res, 400, {
              message: 'Missing required fields',
            } as IErrorResponse);
          } else {
            user.username = username;
            user.age = age;
            user.hobbies = hobbies;

            Response(res, 200, user);
          }
        } catch (error) {
          console.error(error);
          Response(res, 500, {
            message: 'Internal server error',
          } as IErrorResponse);
        }
      });
    } else if (url && method === 'DELETE' && url.startsWith(`${process.env.BASE_URL}`)) {
      const userId = url.split('/')[3];

      if (userId && !isValidUUID(userId)) {
        Response(res, 400, { message: 'Invalid userId' } as IErrorResponse);
      }

      const userIndex = users.findIndex((el) => el.id === userId);

      if (userIndex === -1) {
        Response(res, 404, { message: 'User not found' } as IErrorResponse);
      } else {
        users.splice(userIndex, 1);
        Response(res, 204);
      }
    } else {
      Response(res, 404, { message: 'Invalid route' } as IErrorResponse);
    }
  } catch (error) {
    console.error(error);
    Response(res, 500, {
      message: 'Internal server error',
    } as IErrorResponse);
  }
};
