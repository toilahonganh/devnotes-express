const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    type: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
}, {
    timestamps: true
});

const PostModel = mongoose.model('Posts', PostSchema);

module.exports = PostModel;
