import mongoose, { models } from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
		},
		markedForDeletion: {
			type: Boolean,
		},

		role: {
			type: String,
			trim: true,
			enum: {
				values: ['user', 'admin', 'superAdmin'],
				message: '{VALUE} is not supported',
			},
			default: 'user',
		},
	},
	{ timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = models.User || mongoose.model('User', userSchema);

export default User;
