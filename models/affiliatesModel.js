import mongoose from 'mongoose';

const affiliateSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minLength: 5,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		affiliateLink: {
			type: String,
			trim: true,
			required: true,
		},
		thumbnailURL: {
			type: String,
		},
		isPromotion: {
			type: Boolean,
			default: false,
			required: true,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const Affiliate =
	mongoose.models.Affiliate || mongoose.model('Affiliate', affiliateSchema);

export default Affiliate;
