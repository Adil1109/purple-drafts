import { connectMongoDB } from '@/lib/mongodb';
import Comment from '@/models/commentsModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const ContentID = request.nextUrl.searchParams.get('ContentID');
		const CommentPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const comments = await Comment.find({ commentContentID: ContentID })
			.populate({
				path: 'commentAuthor',
				select: 'name image',
				model: User,
			})
			.sort({ createdAt: -1 })
			.skip(pageNum * CommentPerPage)
			.limit(CommentPerPage);

		return NextResponse.json({ comments }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
