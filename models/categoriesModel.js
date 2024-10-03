import mongoose, { models } from 'mongoose';

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			trim: true,
		},
		thumbnailURL: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Category = models.Category || mongoose.model('Category', categorySchema);

export default Category;
