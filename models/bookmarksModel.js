import mongoose, { models } from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
	{
		Blog: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
			required: true,
		},
		User: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const Bookmark = models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
