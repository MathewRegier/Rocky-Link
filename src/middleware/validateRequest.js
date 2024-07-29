export function validateRequest(req, res, next) {
    // Example validation check
    if (!req.body.someRequiredField) {
        return res.status(400).json({ error: 'Missing required field: someRequiredField' });
    }
    next();
}
