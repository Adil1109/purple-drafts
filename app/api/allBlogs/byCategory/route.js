import { connectMongoDB } from '@/lib/mongodb';
import Blog from '@/models/blogsModel';
import Category from '@/models/categoriesModel';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
		const categoryId = request.nextUrl.searchParams.get('categoryId');
		const BlogPerPage = 10;

		let query = {};
		if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
			query.categories = new mongoose.Types.ObjectId(categoryId);
		}

		const blogs = await Blog.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * BlogPerPage)
			.limit(BlogPerPage)
			.populate({
				path: 'categories',
				model: Category,
			});

		return NextResponse.json({ blogs }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
