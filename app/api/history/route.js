import { connectMongoDB } from '@/lib/mongodb';
import Blog from '@/models/blogsModel';
import History from '@/models/historyModel';
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
		const HistoryPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const histories = await History.find({ User: userId })
			.sort({ createdAt: 1 })
			.skip(pageNum * HistoryPerPage)
			.limit(HistoryPerPage)
			.populate({
				path: 'Blog',
				model: Blog,
			})
			.populate({
				path: 'User',
				model: User,
			});

		return NextResponse.json({ histories }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
