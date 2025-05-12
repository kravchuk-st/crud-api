import { IncomingMessage, ServerResponse } from 'http';
import { Response } from '../helpers/response';
import { isValidUUID } from '../helpers/uuid';
import { users } from '../db';
import { IErrorResponse } from '../types';

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
    }
  } catch (error) {
    console.error(error);
    Response(res, 500, {
      message: 'Internal server error',
    } as IErrorResponse);
  }
};
