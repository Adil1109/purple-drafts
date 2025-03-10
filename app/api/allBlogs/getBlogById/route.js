import Blog from '@/models/blogsModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		const blogId = req.nextUrl.searchParams.get('blogId');

		const blog = await Blog.findOne({ _id: blogId });
		if (!blog) {
			throw new Error('Blog does not exist!');
		}

		return NextResponse.json({ blog }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
