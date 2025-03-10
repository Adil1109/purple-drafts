import { connectMongoDB } from '@/lib/mongodb';
import Bookmark from '@/models/bookmarksModel';
import User from '@/models/usersModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

await connectMongoDB();

export async function GET(request) {
	try {
		const blogId = request.nextUrl.searchParams.get('blogId');
		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;

		const bookmarkExists = await Bookmark.findOne({
			User: userId,
			Blog: blogId,
		});

		if (!bookmarkExists) {
			throw new Error('Bookmark not found');
		}

		const hasBookmarked = true;

		return NextResponse.json({ hasBookmarked }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
