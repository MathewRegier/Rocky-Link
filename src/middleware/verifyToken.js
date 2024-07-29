// middleware/verifyToken.js
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);  // Forbidden if error occurs
            } else {
                req.authData = authData;  // Store auth data (includes company info)
                next();
            }
        });
    } else {
        res.sendStatus(401);  // Unauthorized
    }
};

export default verifyToken;
