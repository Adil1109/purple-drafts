import { connectMongoDB } from '@/lib/mongodb';
import Course from '@/models/coursesModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const CoursePerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const courses = await Course.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * CoursePerPage)
			.limit(CoursePerPage);

		return NextResponse.json({ courses }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
