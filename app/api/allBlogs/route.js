import { connectMongoDB } from '@/lib/mongodb';
import Blog from '@/models/blogsModel';
import ViewLog from '@/models/viewLogsSchema';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
		const type = request.nextUrl.searchParams.get('type');
		const BlogPerPage = 10;
		let query = {};
		let sortOption = { createdAt: -1 }; // Default sorting (recent blogs)

		if (type === 'most-viewed') {
			sortOption = { viewsCount: -1 };
		} else if (type === 'trending') {
			// Get trending blogs from the last 24 hours with pagination
			const twentyFourHoursAgo = new Date();
			twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

			const trendingBlogs = await ViewLog.aggregate([
				{
					$match: { createdAt: { $gte: twentyFourHoursAgo } },
				},
				{
					$group: {
						_id: '$blog',
						views: { $sum: 1 },
					},
				},
				{ $sort: { views: -1 } },
				{ $skip: (page - 1) * BlogPerPage }, // Pagination
				{ $limit: BlogPerPage },
				{
					$lookup: {
						from: 'blogs', // Join with the Blog collection
						localField: '_id',
						foreignField: '_id',
						as: 'blogDetails',
					},
				},
				{ $unwind: '$blogDetails' }, // Convert array to object
				{
					$replaceRoot: { newRoot: '$blogDetails' }, // Keep only blog data
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
