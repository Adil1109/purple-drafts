'use server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import Joi from 'joi';

const joiUserUpdateSchema = Joi.object({
	userId: Joi.string().min(3).required(),
});

export const fetchUserAction = async (_id) => {
	try {
		await connectMongoDB();

		const result = await User.findOne({ _id });
		const dataObj = JSON.parse(JSON.stringify(result));
		return dataObj;
	} catch (error) {
		return { error: error.message };
	}
};

export const updateUserDeletionRequestAction = async (_id, formData) => {
	try {
		const name = formData.get('name')?.toString();

		await connectMongoDB();

		const { error, value } = joiUserUpdateSchema.validate({
			userId: _id,
		});

		if (error) {
			return;
		}

		const existingUser = await User.findOne({ _id });

		existingUser.markedForDeletion = true;

		const result = await existingUser.save();
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};
