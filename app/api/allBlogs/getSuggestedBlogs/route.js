import Blog from '@/models/blogsModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		const blogId = req.nextUrl.searchParams.get('blogId');
		if (!blogId) {
			throw new Error('Provide blogId');
		}

		const BlogCount = await Blog.countDocuments();
		const take = 4;
		let skip = 0;

		if (BlogCount > take) {
			skip = Math.floor(Math.random() * (BlogCount - take));
		}

		const blogs = await Blog.find({ _id: { $ne: blogId } })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(take);

		return NextResponse.json({ blogs }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
