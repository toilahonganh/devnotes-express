const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_HOSTNAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log('Connect to MongoDB');
        })
    } catch (error) {
        console.log('Connect failure!!!', error);
    }
};
module.exports = connection;