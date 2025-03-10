import { connectMongoDB } from '@/lib/mongodb';
import Blog from '@/models/blogsModel';
import History from '@/models/historyModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
		const type = request.nextUrl.searchParams.get('type');
		const BlogPerPage = 10;
		let query = {};
		let sortOption = { createdAt: -1 };

		if (type === 'most-viewed') {
			sortOption = { viewsCount: -1 };
		} else if (type === 'trending') {
			const twentyFourHoursAgo = new Date();
			twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

			const trendingBlogs = await History.aggregate([
				{
					$match: { createdAt: { $gte: twentyFourHoursAgo } },
				},
				{
					$group: {
						_id: '$Blog', // Updated to match the History schema
						views: { $sum: 1 },
					},
				},
				{ $sort: { views: -1 } },
				{ $skip: (page - 1) * BlogPerPage },
				{ $limit: BlogPerPage },
				{
					$lookup: {
						from: 'blogs',
						localField: '_id',
						foreignField: '_id',
						as: 'blogDetails',
					},
				},
				{ $unwind: '$blogDetails' },
				{
					$replaceRoot: { newRoot: '$blogDetails' },
				},
			]);

			return NextResponse.json({ blogs: trendingBlogs }, { status: 200 });
		}

		const blogs = await Blog.find(query)
			.sort(sortOption)
			.skip((page - 1) * BlogPerPage)
			.limit(BlogPerPage);

		return NextResponse.json({ blogs }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
