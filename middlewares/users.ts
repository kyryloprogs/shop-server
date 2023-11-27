import { Request, Response, NextFunction } from 'express';

import jwt from "jsonwebtoken";

// module.exports = {
//     validateRegister: (req, res, next) => {
//         if (!req.body.username ||
//             req.body.username.length < 6) {
//             return res.status(400).send({
//                 message: 'Username must contain minimum 6 characters',
//             });
//         }
//         if (!req.body.password ||
//             req.body.password.length < 10) {
//             return res.status(400).send({
//                 message: 'Password must contain minimum 10 characters',
//             });
//         }
//         if (req.body.password &&
//             !(req.body.password.match('[a-zA-Z0-9-_.]+'))) {
//             return res.status(400).send({
//                 message: 'Password must contain only latin characters.',
//             });
//         }
//         if (
//             !req.body.password_repeat ||
//             req.body.password != req.body.password_repeat
//         ) {
//             return res.status(400).send({
//                 message: 'Password and confirm passwords must match',
//             });
//         }

//         next();
//     },
//     isLoggedIn: (req, res, next) => {
//         if (!req.headers.authorization) {
//             return res.status(400).send({
//                 message: 'Your session is not valid!',
//             });
//         }
//         try {
//             const authHeader = req.headers.authorization;
//             const token = authHeader.split(' ')[1];
//             const decoded = jwt.verify(token, 'SECRETKEY');
//             req.userData = decoded;
//             next();
//         } catch (err) {
//             return res.status(400).send({
//                 message: 'Your session is not valid!',
//             });
//         }
//     },
// };

export default function authenticateJWT (req: Request, res: Response, next: NextFunction)  {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // const token = authHeader.split(' ')[1];
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