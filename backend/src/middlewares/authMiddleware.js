import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ error: 'Access Denied, Token Required' });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", verified);
        
        req.user = verified;
        next();
    } catch (error) {
        console.error("❌ Invalid Token:", error.message);
        res.status(400).json({ error: 'Invalid Token' });
    }
};


const isAdmin = (req, res, next) => {
    if (req.user.role !== 'A') {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    next();
};

export default { verifyToken, isAdmin };
