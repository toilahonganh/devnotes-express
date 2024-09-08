const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const PostModel = require('../models/PostModel');
const { postUserController, getUserController } = require('../controllers/auth.controller');
const { getProfileController, postLogout } = require('../controllers/credential.controller');
const { postCreateAPostController, putCreateAPostController, deletePostController, searchPostsController } = require('../controllers/post.controller');

const app = express();
const router = express.Router();
app.use(cors({
    origin: 'http://localhost:3000', // Hoặc bất kỳ nguồn gốc nào phù hợp
    credentials: true
}));
app.use(cookieParser());
app.use(express.json())


router.get('/', (req, res) => {
    res.send('Hello, world');
});

// User
router.post('/register', postUserController);
router.post('/login', getUserController);


// Credential
router.get('/profile', getProfileController);
router.post('/logout', postLogout);

// Post
router.get('/post', async (req, res) => {
    res.json(await PostModel.find().populate('author', ['username']));
})
router.post('/post', postCreateAPostController);
app.put('/post', putCreateAPostController);
router.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id).populate('author', ['username']);
    console.log(postDoc);
    res.json(postDoc);
})
router.get('/posts', async (req, res) => {
    try {
        const userId = req.query.user; // Lấy ID người dùng từ query string
        const posts = await PostModel.find({ author: userId });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/post/:id', deletePostController);

router.get('/type', async (req, res) => {
    try {
        // Tìm tất cả các loại bài viết khác nhau
        const types = await PostModel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(types);
    } catch (error) {
        console.error('Error fetching post types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/posts/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const posts = await PostModel.find({ type }).populate('author', ['username']);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts by type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/search', searchPostsController);

app.use('/', router);
module.exports = app;