import { errorHandler } from '../utils/errorHandler.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return next(errorHandler(400, 'Invalid request'));
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, 'User already exists'));
        }
        const validPassword = await bcrypt.hash(password, 10);
        if (!validPassword) {
            return next(errorHandler(400, 'Error hashing password'));
        }
        const user = await User.create({ name: username, email, password: validPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        const { password: pass, ...rest } = user._doc;

        res.cookie('my_token', token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        console.log(error);
        return next(errorHandler(400, `Error: ${error}`));
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(errorHandler(400, 'Invalid request'));
    }
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(errorHandler(400, 'User does not exist'));
        }
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Wrong credentials'));
        }
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        let { password: pass, ...rest } = existingUser._doc;
        res.cookie('my_token', token, { httpOnly: true }).status(200).json(rest);
    } catch (error) {
        return next(errorHandler(400, `Error: ${error}`));
    }
};
