import mongoose, { models } from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		commentBody: {
			type: String,
			required: true,
			trim: true,
		},
		commentAuthor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		commentContentID: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: 'commentRefModel',
			required: true,
		},
		commentContentIDRefModel: {
			type: String,
			required: true,
			enum: ['Blog'],
		},
	},
	{ timestamps: true }
);

const Comment = models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
