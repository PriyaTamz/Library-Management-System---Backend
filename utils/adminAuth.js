const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const Admin = require('../models/admin');

const auth = {
    isAuthenticated: (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            const token = authHeader.split(" ")[1]; 
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
            jwt.verify(token, process.env.JWT_SECRET, (error, admin) => {
                if (error) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                req.adminId = admin.id; 
                req.admin = admin; 
                next();
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },    
    isAdmin: async (req, res, next) => {
        try {
            const { adminId } = req;
            if (!adminId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            if (admin.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = auth;
