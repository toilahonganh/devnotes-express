const UserModel = require('../models/UserModel');
const { postUserService, getUserService } = require('../services/auth.service');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'askasasasas';

module.exports = {
    postUserController: async (req, res) => {
        try {
            let { username, password } = req.body;
            let userInfo = { username, password };
            let userDoc = await postUserService(userInfo);

            if (userDoc) {
                console.log('Created a new user with username:', userDoc.username);
                return res.status(201).json(userDoc);  // Trả về mã trạng thái 201 Created
            } else {
                return res.status(400).json({ message: 'User creation failed' });  // Xử lý lỗi nếu không tạo được người dùng
            }
        } catch (error) {
            console.error('Error in postUserController:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    // getUserController: async (req, res) => {
    //     try {
    //         const { username, password } = req.body;

    //         const result = await getUserService(username, password);
    //         if (result.status === "error") {
    //             const statusCode = result.message === "User not found" ? 404 : 401;
    //             return res.status(statusCode).json({ message: result.message });
    //         }

    //         jsonwebtoken.sign({ username, id: result._id }, secret, {}, (err, token) => {
    //             if (err) throw err;
    //             res.cookie('token', token).json({
    //                 id: result._id,
    //                 username,
    //             })
    //         })
    //         return res.status(200).json({ message: 'Login successful' });
    //     } catch (error) {
    //         console.error('Error in getUserController:', error);
    //         return res.status(500).json({ message: 'Internal server error' });
    //     }
    // }
    getUserController: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json('Username and password are required');
            }

            const userDoc = await UserModel.findOne({ username });
            if (!userDoc) {
                return res.status(400).json('User not found');
            }

            const passOk = await bcrypt.compare(password, userDoc.password);
            if (passOk) {
                jsonwebtoken.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                    });
                });
            } else {
                res.status(400).json('Wrong credentials');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Internal Server Error');
        }
    }
};
