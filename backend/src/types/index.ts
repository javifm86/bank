import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: string | undefined;
}

export type { RequestWithUser };
