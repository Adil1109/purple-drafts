import { connectMongoDB } from '@/lib/mongodb';
import Blog from '@/models/blogsModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const BlogPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const blogs = await Blog.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * BlogPerPage)
			.limit(BlogPerPage);

		return NextResponse.json({ blogs }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
