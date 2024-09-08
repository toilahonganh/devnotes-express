const jsonwebtoken = require('jsonwebtoken');

const secret = 'askasasasas';

module.exports = {
    getProfileController: async (req, res) => {
        const { token } = req.cookies;
        jsonwebtoken.verify(token, secret, {}, (err, info) => {
            if (err) return res.status(401).json({ error: 'Unauthorized' });
            res.json(info);
        });
    },
    postLogout: async (req, res) => {
        res.cookie('token', '').json('ok');
    }
}

