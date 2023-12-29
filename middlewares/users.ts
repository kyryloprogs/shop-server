import { Request, Response, NextFunction } from 'express';

import jwt from "jsonwebtoken";

export default function authenticateJWT (req: Request, res: Response, next: NextFunction)  {
    const authHeader = req.headers.authorization;
    console.log("token", authHeader)
    if (authHeader) {
        console.log(process.env.JWT_SECRET)
        jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }

            req.body.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};