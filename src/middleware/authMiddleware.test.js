import { authorizeRoles } from './authMiddleware.js';
import { jest } from '@jest/globals';

describe('authorizeRoles', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            user: { role: 'VIEWER' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should call next() if user role is authorized', () => {
        const middleware = authorizeRoles('ADMIN', 'VIEWER');
        middleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is NOT authorized', () => {
        const middleware = authorizeRoles('ADMIN');
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Access Denied: Role (VIEWER) is not authorized."
        });
        expect(next).not.toHaveBeenCalled();
    });
});
