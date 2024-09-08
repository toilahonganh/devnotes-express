const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

const connection = require('./configs/connectDB.config');
const router = require('./routes/api');

const PORT = process.env.PORT || 9999;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use(cookieParser());
app.use(express.json())

app.use('/', router);

(async () => {
    try {
        await connection();
        app.listen(PORT, HOSTNAME, () => {
            console.log(`Server is running at port ${PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
})() 