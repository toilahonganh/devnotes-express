const PostModel = require('../models/PostModel');
const jsonwebtoken = require('jsonwebtoken');
const secret = 'askasasasas';

module.exports = {
    postCreateAPostController: async (req, res) => {
        try {
            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            jsonwebtoken.verify(token, secret, async (err, info) => {
                if (err) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                const { title, description, content, type } = req.body;
                if (!title || !content || !type) {
                    return res.status(400).json({ error: 'Title, content and type are required' });
                }

                try {
                    const postDoc = await PostModel.create({
                        title,
                        content,
                        description,
                        type,
                        author: info.id
                    });
                    res.status(201).json(postDoc); // Trả về bài viết mới tạo với mã trạng thái 201 Created
                } catch (createError) {
                    console.error('Error creating post:', createError);
                    res.status(500).json({ error: 'Error creating post' });
                }
            });
        } catch (err) {
            console.error('Error uploading post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    putCreateAPostController: async (req, res) => {
        try {
            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            jsonwebtoken.verify(token, secret, async (err, info) => {
                if (err) {
                    console.error('JWT verification error:', err);
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                const { id, title, description, content, type } = req.body;
                const postDoc = await PostModel.findById(id);

                if (!postDoc) {
                    return res.status(404).json({ error: 'Post not found' });
                }

                const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
                if (!isAuthor) {
                    return res.status(403).json({ error: 'You are not the author' });
                }

                postDoc.title = title || postDoc.title;
                postDoc.description = description || postDoc.description;
                postDoc.content = content || postDoc.content;
                postDoc.type = type || postDoc.type;

                await postDoc.save();
                res.json(postDoc);
            });
        } catch (err) {
            console.error('Error updating post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deletePostController: async (req, res) => {
        try {
            const { token } = req.cookies;

            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            jsonwebtoken.verify(token, secret, async (err, info) => {
                if (err) {
                    console.error('JWT verification error:', err);
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                const { id } = req.params; // Assuming the post ID is passed as a URL parameter

                const postDoc = await PostModel.findById(id);

                if (!postDoc) {
                    return res.status(404).json({ error: 'Post not found' });
                }

                const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
                if (!isAuthor) {
                    return res.status(403).json({ error: 'You are not the author' });
                }

                await PostModel.findByIdAndDelete(id);
                res.status(200).json({ message: 'Post deleted successfully' });
            });
        } catch (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    searchPostsController: async (req, res) => {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ error: 'Title query parameter is required' });
        }

        try {
            const posts = await PostModel.find({ title: { $regex: title, $options: 'i' } }).populate('author', ['username']);
            res.json(posts);
        } catch (error) {
            console.error('Error searching posts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
