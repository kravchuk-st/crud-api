import { parse } from 'uuid';

export const isValidUUID = (uuid: string): boolean => {
  try {
    parse(uuid);
    return true;
  } catch (error) {
    return false;
  }
};
