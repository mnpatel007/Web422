import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Helper to verify token
const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const userPayload = verifyToken(req);
    if (!userPayload) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    try {
        const user = await User.findById(userPayload._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.favourites);
    } catch (err) {
        res.status(500).json({ message: "Error fetching favourites" });
    }
}
