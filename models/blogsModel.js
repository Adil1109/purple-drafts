import mongoose, { models } from 'mongoose';

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		shortDescription: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		viewsCount: {
			type: Number,
			required: true,
			default: 0,
		},
		thumbnailURL: {
			type: String,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
	},
	{ timestamps: true }
);

const Blog = models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
