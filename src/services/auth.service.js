const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);



module.exports = {
    postUserService: async (userInfo) => {
        try {
            const existingUser = await UserModel.findOne({ username: userInfo.username });

            if (existingUser) {
                return { status: 'error', message: 'User already exists' };
            } else {
                let pwd = userInfo.password;
                let userDoc = await UserModel.create({
                    username: userInfo.username,
                    password: bcrypt.hashSync(pwd, salt)
                });
                return { status: 'success', user: userDoc };
            }
        } catch (error) {
            console.error('Error in postUserService:', error);
            return { status: 'error', message: 'Internal server error' };
        }
    },

    getUserService: async (userName, userPassword) => {
        try {
            const existingUser = await UserModel.findOne({ username: userName });
            if (!existingUser) {
                return { status: 'error', message: 'User not found' };
            }
            const passOk = await bcrypt.compare(userPassword, existingUser.password);
            if (passOk) {
                return { status: 'success', message: 'Login successful' };
            } else {
                return { status: 'error', message: 'Password does not match' };
            }
        } catch (error) {
            console.error('Error in getUserService:', error);
            return { status: 'error', message: 'Internal server error' };
        }
    }
};
