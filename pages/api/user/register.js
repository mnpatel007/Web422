import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    await dbConnect();

    try {
        const newUser = new User({ userName, password, favourites: [] });
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (err) {
        res.status(422).json({ message: "User already exists or invalid data" });
    }
}
