'use server';
import { connectMongoDB } from '@/lib/mongodb';
import ShortUrl from '@/models/shortUrlsModel';
import Joi from 'joi';

const joiShortUrlSchema = Joi.object({
	shortUrl: Joi.string().min(3).required(),
	shortUrlType: Joi.string().min(3).required(),
	shortUrlIdentifier: Joi.string().min(3).required(),
});
const joiShortUrlUpdateSchema = Joi.object({
	shortUrl: Joi.string().min(3).required(),
	shortUrlType: Joi.string().min(3).required(),
	shortUrlIdentifier: Joi.string().min(3).required(),
});

export const fetchAllShortUrlAction = async () => {
	try {
		await connectMongoDB();
		const result = await ShortUrl.find();
		const shortUrls = JSON.parse(JSON.stringify(result));
		return shortUrls;
	} catch (error) {
		return { error: error.message };
	}
};

export const fetchShortUrlAction = async (_id) => {
	try {
		await connectMongoDB();

		const result = await ShortUrl.findOne({ _id }).select(
			'shortUrl shortUrlType shortUrlIdentifier'
		);
		const dataObj = JSON.parse(JSON.stringify(result));
		return dataObj;
	} catch (error) {
		throw new Error(error.message);
	}
};

export const createShortUrlAction = async (formData) => {
	try {
		const shortUrl = formData.get('shortUrl')?.toString();
		const shortUrlType = formData.get('shortUrlType')?.toString();
		const shortUrlIdentifier = formData.get('shortUrlIdentifier')?.toString();

		const { error, value } = joiShortUrlSchema.validate({
			shortUrl,
			shortUrlType,
			shortUrlIdentifier,
		});

		if (error) {
			throw new Error(error);
		}
		await connectMongoDB();

		const existingUrl = await ShortUrl.findOne({
			$or: [{ shortUrl }, { shortUrlIdentifier }],
		});

		if (existingUrl) {
			throw new Error('Error: shortUrl or shortUrlIdentifier already exists');
		}

		const result = await ShortUrl.create({
			shortUrl,
			shortUrlType,
			shortUrlIdentifier,
		});
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};

export const updateShortUrlAction = async (_id, formData) => {
	try {
		const shortUrl = formData.get('shortUrl')?.toString();
		const shortUrlType = formData.get('shortUrlType')?.toString();
		const shortUrlIdentifier = formData.get('shortUrlIdentifier')?.toString();

		await connectMongoDB();

		const { error, value } = joiShortUrlUpdateSchema.validate({
			shortUrl,
			shortUrlIdentifier,
			shortUrlType,
		});

		if (error) {
			throw new Error(error);
		}

		const existingShortUrl = await ShortUrl.findOne({ _id });

		existingShortUrl.shortUrl = shortUrl;
		existingShortUrl.shortUrlType = shortUrlType;
		existingShortUrl.shortUrlIdentifier = shortUrlIdentifier;

		const result = await existingShortUrl.save();
		if (result) {
			return { success: true };
		}
	} catch (error) {
		return { error: error.message };
	}
};

export const deleteShortUrlAction = async (_id) => {
	try {
		await connectMongoDB();
		const result = await ShortUrl.findByIdAndDelete(_id);
	} catch (error) {
		return { error: error.message };
	}
};
