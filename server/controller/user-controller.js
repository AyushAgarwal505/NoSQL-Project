import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import token from '../model/token.js';
dotenv.config();

export const signupUser = async (request, response) => {
    try {
        // check if username already exists
        const existingUser = await User.findOne({ username: request.body.username });
        if (existingUser) {
            return response.status(400).json({ msg: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const userData = {
            username: request.body.username,
            password: hashedPassword,
        };

        // Add these *only if provided*
        if (request.body.country) userData.country = request.body.country;
        if (request.body.city) userData.city = request.body.city;
        if (request.body.name) userData.name = request.body.name;

        const newUser = new User(userData);
        await newUser.save();


        return response.status(200).json({ msg: 'User signed up successfully' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error signing up user', error: error.message });
    }
};

export const loginUser = async (request, response) => {
    try {
        const userData = await User.findOne({ username: request.body.username });
        if (!userData) {
            return response.status(400).json({ msg: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(request.body.password, userData.password);
        if (!isPasswordValid) {
            return response.status(401).json({ msg: 'Invalid password' });
        }

        // generate tokens
        const accessToken = jwt.sign(
            userData.toJSON(),
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            userData.toJSON(),
            process.env.REFRESH_SECRET_KEY
        );

        // store refresh token
        const newToken = new token({ token: refreshToken });
        await newToken.save();

        return response.status(200).json({
            name: userData.name,
            username: userData.username,
            country: userData.country || '',
            city: userData.city || '',
            accessToken,
            refreshToken
        });
    } catch (error) {
        return response.status(500).json({ msg: 'Error logging in user', error: error.message });
    }
};
