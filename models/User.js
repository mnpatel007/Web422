import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    favourites: [{ type: String }] // Array of book IDs
});

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) return reject(err);
            if (isMatch) resolve(true);
            else resolve(false);
        });
    });
};

// Check if model exists before compiling to avoid OverwriteModelError
export default mongoose.models.users || mongoose.model('users', userSchema);
