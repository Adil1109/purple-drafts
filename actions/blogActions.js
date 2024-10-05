'use server';
import { connectMongoDB } from '@/lib/mongodb';
import Joi from 'joi';
import fileUploader from '@/lib/fileUploader';
import Blog from '@/models/blogsModel';

const joiBlogCreateSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().required(),
	thumbnailURL: Joi.string().allow('').optional(),
});
const joiBlogUpdateSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().required(),
	thumbnailURL: Joi.string().allow('').optional(),
});
export const fetchAllBlogAction = async () => {
	try {
		await connectMongoDB();
		const result = await Blog.find();
		const users = JSON.parse(JSON.stringify(result));
		return users;
	} catch (error) {
		throw new Error(error);
	}
};

export const fetchBlogAction = async (_id) => {
	try {
		await connectMongoDB();

		const result = await Blog.findOne({ _id });
		const dataObj = JSON.parse(JSON.stringify(result));
		return dataObj;
	} catch (error) {
		throw new Error(error.message);
	}
};

export const createBlogAction = async (formData) => {
	try {
		const title = formData.get('title')?.toString();
		const description = formData.get('description')?.toString();
		const thumbnailImage = formData.get('thumbnailImage');

		if (
			!thumbnailImage ||
			(thumbnailImage.type !== 'image/jpeg' &&
				thumbnailImage.type !== 'image/png')
		) {
			throw new Error('Image is Required');
		}

		const thumbnailURL = await fileUploader(thumbnailImage, 'images');

		const { error, value } = joiBlogCreateSchema.validate({
			title,
			description,
			thumbnailURL,
		});

		if (error) {
			throw new Error(error);
		}
		await connectMongoDB();

		const result = await Blog.create({
			title,
			description,
			thumbnailURL,
		});
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};

export const updateBlogAction = async (formData) => {
	try {
		const _id = formData.get('blogId')?.toString();
		const title = formData.get('title')?.toString();
		const description = formData.get('description')?.toString();
		const thumbnailImage = formData.get('thumbnailImage')?.toString();
		let thumbnailURL;
		if (
			thumbnailImage.size > 0 &&
			(thumbnailImage.type === 'image/jpeg' ||
				thumbnailImage.type === 'image/png')
		) {
			thumbnailURL = await fileUploader(thumbnailImage, 'images');
		}
		const { error, value } = joiBlogUpdateSchema.validate({
			title,
			description,
			thumbnailURL,
		});

		if (error) {
			throw new Error(error);
		}
		await connectMongoDB();
		const existingBlog = await Blog.findOne({ _id });

		existingBlog.title = title;
		existingBlog.description = description;
		if (thumbnailImage.size > 0) {
			existingBlog.thumbnailURL = thumbnailURL;
		}

		const result = await existingBlog.save();
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};

export const deleteBlogAction = async (_id) => {
	try {
		await connectMongoDB();
		const result = await Blog.findByIdAndDelete(_id);
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};
