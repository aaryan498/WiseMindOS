import rateLimit from 'express-rate-limit';

// Throttles login attempts per email (falling back to IP for requests with
// no email) to slow down brute-force and credential-stuffing attempts.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    keyGenerator: (req, res) => {
        const identifier = req.body?.identifier;
        return typeof identifier === 'string' && identifier
            ? identifier.toLowerCase()
            : req.ip;
    }
});

// Throttles account creation per IP to slow down mass fake-account signup.
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many accounts created from this IP. Please try again later.'
    }
});

export { loginLimiter, registerLimiter };
