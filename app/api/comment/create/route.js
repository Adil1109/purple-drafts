import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import Comment from '@/models/commentsModel';

const CommentSchema = Joi.object({
	commentBody: Joi.string().min(3).max(1000).required(),
	commentAuthor: Joi.string().min(3).required(),
	commentContentID: Joi.string().min(3).required(),
	commentContentIDRefModel: Joi.string().min(3).required(),
});

export async function POST(request) {
	try {
		const {
			commentBody,
			commentAuthor,
			commentContentID,
			commentContentIDRefModel,
		} = await request.json();

		const { error } = CommentSchema.validate({
			commentBody,
			commentAuthor,
			commentContentID,
			commentContentIDRefModel,
		});

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		await connectMongoDB();

		const newComment = new Comment({
			commentBody,
			commentAuthor,
			commentContentID,
			commentContentIDRefModel,
		});

		const createdComment = await newComment.save();

		return NextResponse.json(
			{
				message: 'Comment created successfully',
				data: createdComment,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
