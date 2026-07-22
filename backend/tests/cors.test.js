import assert from 'node:assert/strict';
import test from 'node:test';

test('CORS origin allowlist validation', () => {
    const originalEnv = process.env.FRONTEND_URL;
    process.env.FRONTEND_URL = 'http://localhost:5173, https://app.wisemindos.com';

    const allowedOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
        : ['http://localhost:5173', 'http://localhost:3000'];

    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
    };

    // Allowed origin #1
    corsOptions.origin('http://localhost:5173', (err, allow) => {
        assert.equal(err, null);
        assert.equal(allow, true);
    });

    // Allowed origin #2
    corsOptions.origin('https://app.wisemindos.com', (err, allow) => {
        assert.equal(err, null);
        assert.equal(allow, true);
    });

    // Requests with no origin (e.g. CLI tools / same origin)
    corsOptions.origin(undefined, (err, allow) => {
        assert.equal(err, null);
        assert.equal(allow, true);
    });

    // Disallowed origin
    corsOptions.origin('http://untrusted-domain.com', (err, allow) => {
        assert.equal(err, null);
        assert.equal(allow, false);
    });

    process.env.FRONTEND_URL = originalEnv;
});
