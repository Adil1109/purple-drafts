'use server';
import { connectMongoDB } from '@/lib/mongodb';
import Joi from 'joi';
import fileUploader from '@/lib/fileUploader';
import Blog from '@/models/blogsModel';

const joiBlogCreateSchema = Joi.object({
	title: Joi.string().required(),
	shortDescription: Joi.string().required(),
	categories: Joi.array().items(Joi.string()).required(),
	description: Joi.string().required(),
	tags: Joi.string().required(),
	author: Joi.string().required(),
	thumbnailURL: Joi.string().required(),
});
const joiBlogUpdateSchema = Joi.object({
	title: Joi.string().required(),
	shortDescription: Joi.string().required(),
	categories: Joi.array().items(Joi.string()).required(),
	description: Joi.string().required(),
	tags: Joi.string().required(),
	author: Joi.string().required(),
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

export const addBlogAction = async (formData) => {
	try {
		const title = formData.get('title')?.toString();
		const shortDescription = formData.get('shortDescription')?.toString();
		const description = formData.get('description')?.toString();
		const tags = formData.get('tags')?.toString();
		const author = formData.get('author')?.toString();
		const thumbnailImage = formData.get('thumbnailImage');
		const categories = formData.getAll('categories');

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
			shortDescription,
			description,
			tags,
			author,
			categories,
			thumbnailURL,
		});

		if (error) {
			throw new Error(error);
		}
		await connectMongoDB();

		const result = await Blog.create({
			title,
			shortDescription,
			description,
			tags,
			author,
			categories,
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
		const blogId = formData.get('blogId')?.toString();
		const title = formData.get('title')?.toString();
		const shortDescription = formData.get('shortDescription')?.toString();
		const description = formData.get('description')?.toString();
		const tags = formData.get('tags')?.toString();
		const author = formData.get('author')?.toString();
		const thumbnailImage = formData.get('thumbnailImage');
		const categories = formData.getAll('categories');

		let thumbnailURL;

		if (
			thumbnailImage &&
			thumbnailImage.size > 0 &&
			(thumbnailImage.type === 'image/jpeg' ||
				thumbnailImage.type === 'image/png')
		) {
			thumbnailURL = await fileUploader(thumbnailImage, 'images');
		}
		const { error, value } = joiBlogUpdateSchema.validate({
			title,
			shortDescription,
			description,
			author,
			tags,
			categories,
			thumbnailURL,
		});

		if (error) {
			throw new Error(error.details[0].message);
		}

		await connectMongoDB();

		const existingBlog = await Blog.findById(blogId);
		if (!existingBlog) {
			throw new Error('Blog not found');
		}
		existingBlog.title = title;
		existingBlog.shortDescription = shortDescription;
		existingBlog.description = description;
		existingBlog.tags = tags;
		existingBlog.author = author;
		existingBlog.categories = categories;
		if (thumbnailURL) {
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
