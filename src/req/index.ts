import { IncomingMessage, ServerResponse } from 'http';
import { Response } from '../helpers/response';
import { IErrorResponse } from '../types';

export const Requests = (req: IncomingMessage, res: ServerResponse) => {
  try {
  } catch (error) {
    console.error(error);
    Response(res, 500, {
      message: 'Internal server error',
    } as IErrorResponse);
  }
};
