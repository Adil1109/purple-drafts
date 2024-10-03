import mongoose, { models } from 'mongoose';

const shortUrlSchema = new mongoose.Schema(
	{
		shortUrl: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		shortUrlIdentifier: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		shortUrlType: {
			type: String,
			required: true,
			enum: {
				values: ['INTERNEL', 'EXTERNEL'],
				message: '{VALUE} is not supported',
			},
		},
		shortUrlCreator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		shortUrlClickCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const ShortUrl = models.ShortUrl || mongoose.model('ShortUrl', shortUrlSchema);

export default ShortUrl;
