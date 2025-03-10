import { connectMongoDB } from '@/lib/mongodb';
import Blog from '@/models/blogsModel';
import Bookmark from '@/models/bookmarksModel';
import User from '@/models/usersModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;
		const BookmarkPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const bookmarks = await Bookmark.find({ User: userId })
			.sort({ createdAt: 1 })
			.skip(pageNum * BookmarkPerPage)
			.limit(BookmarkPerPage)
			.populate({
				path: 'Blog',
				model: Blog,
			})
			.populate({
				path: 'User',
				model: User,
			});

		return NextResponse.json({ bookmarks }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
