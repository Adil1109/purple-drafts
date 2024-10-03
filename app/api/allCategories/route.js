import { connectMongoDB } from '@/lib/mongodb';
import Category from '@/models/categoriesModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const CategoryPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const categories = await Category.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * CategoryPerPage)
			.limit(CategoryPerPage);

		return NextResponse.json({ categories }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
