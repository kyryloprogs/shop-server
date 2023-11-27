import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction, ...args: any) => Promise<Response>) => (
    req: Request,
    res: Response,
    next: NextFunction,
    ...args: any
) => {
    return Promise.resolve(fn(req, res, next, ...args)).catch(next);
};

export default asyncHandler;