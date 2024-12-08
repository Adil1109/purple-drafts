import { connectMongoDB } from '@/lib/mongodb';
import Category from '@/models/categoriesModel';
import Blog from '@/models/blogModel'; // Import the Blog model
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const categories = await Category.find();

		const categoriesWithBlogs = await Promise.all(
			categories.map(async (category) => {
				const recentBlogs = await Blog.find({ categories: category._id })
					.sort({ createdAt: -1 })
					.limit(10);
				return {
					category,
					blogs: recentBlogs,
				};
			})
		);

		return NextResponse.json({ categoriesWithBlogs }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
