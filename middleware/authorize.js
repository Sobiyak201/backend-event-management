const Event = require('../models/Event');

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        },
        async (req, res, next) => {
            if (req.user.role === 'admin') {
                return next();
            }

            const event = await Event.findById(req.params.id);
            if (!event || event.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        },
    ];
};

module.exports = authorize;
