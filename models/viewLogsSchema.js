import mongoose, { models } from 'mongoose';

const viewLogSchema = new mongoose.Schema(
	{
		blog: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
			required: true,
		},
		viewer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const ViewLog = models.ViewLog || mongoose.model('ViewLog', viewLogSchema);

export default ViewLog;
