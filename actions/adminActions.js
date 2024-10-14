'use server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import Joi from 'joi';

const joiAdminSchema = Joi.object({
	email: Joi.string().min(5).required(),
	role: Joi.string().required(),
});

export const fetchAdminAction = async () => {
	try {
		await connectMongoDB();

		const result = await User.find({
			role: { $in: ['admin', 'superAdmin'] },
		}).select('name email role');
		const dataObj = JSON.parse(JSON.stringify(result));

		return dataObj;
	} catch (error) {
		throw new Error(error.message);
	}
};

export async function createAdminAction(formData) {
	try {
		const email = formData.get('email')?.toString();
		const role = formData.get('role')?.toString();
		const { error, value } = joiAdminSchema.validate({
			email,
			role,
		});

		if (error) {
			return;
		}
		await connectMongoDB();
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return;
		}
		existingUser.role = role;
		const result = await existingUser.save();
	} catch (error) {
		throw new Error(error);
	}
}

export const deleteAdminAction = async (email) => {
	try {
		await connectMongoDB();
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return;
		}
		existingUser.role = 'user';
		await existingUser.save();
	} catch (error) {
		throw new Error(error);
	}
};
