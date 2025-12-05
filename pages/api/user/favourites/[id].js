import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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
    const { id } = req.query;
    const userPayload = verifyToken(req);

    if (!userPayload) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    try {
        if (req.method === 'PUT') {
            const user = await User.findByIdAndUpdate(
                userPayload._id,
                { $addToSet: { favourites: id } },
                { new: true }
            );
            res.json(user.favourites);
        } else if (req.method === 'DELETE') {
            const user = await User.findByIdAndUpdate(
                userPayload._id,
                { $pull: { favourites: id } },
                { new: true }
            );
            res.json(user.favourites);
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating favourites" });
    }
}
