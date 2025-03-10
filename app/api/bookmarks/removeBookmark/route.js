import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import Bookmark from '@/models/bookmarksModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const joiBookmarkSchema = Joi.object({
	userId: Joi.string().min(5).required(),
	blogId: Joi.string().min(5).required(),
});

export async function DELETE(req) {
	try {
		const blogId = req.nextUrl.searchParams.get('blogId');
		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;
		const { error } = joiBookmarkSchema.validate({
			userId,
			blogId,
		});

		if (!userId) {
			throw new Error('You are not logged in!');
		}

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		await connectMongoDB();

		const bookmarkExists = await Bookmark.findOne({
			User: userId,
			Blog: blogId,
		});

		if (!bookmarkExists) {
			throw new Error('Bookmark not found');
		}

		const result = await Bookmark.findOneAndDelete({
			User: userId,
			Blog: blogId,
		});

		return NextResponse.json(
			{
				message: 'You removed bookmark successfully!',
				data: result,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
