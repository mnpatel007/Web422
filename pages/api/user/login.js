import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userName, password } = req.body;

    await dbConnect();

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(422).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.checkPassword(password);
        if (isMatch) {
            const payload = { _id: user._id, userName: user.userName };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({ message: "login successful", token: token });
        } else {
            res.status(422).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(422).json({ message: "Error logging in" });
    }
}
