import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import History from '@/models/historyModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Blog from '@/models/blogsModel';

const joiHistorySchema = Joi.object({
	userId: Joi.string().min(5).required(),
	blogId: Joi.string().min(5).required(),
});

export async function POST(req) {
	try {
		const blogId = req.nextUrl.searchParams.get('blogId');
		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;

		const { error } = joiHistorySchema.validate({ userId, blogId });

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		await connectMongoDB();

		const historyExists = await History.findOneAndUpdate(
			{ User: userId, Blog: blogId },
			{ createdAt: new Date() },
			{ new: true }
		);

		if (historyExists) {
			return NextResponse.json(
				{ message: 'History Updated!', data: historyExists },
				{ status: 200 }
			);
		}

		const result = await History.create({
			User: userId,
			Blog: blogId,
		});

		await Blog.updateOne({ _id: blogId }, { $inc: { viewsCount: 1 } });

		return NextResponse.json(
			{ message: 'History Created!', data: result },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
