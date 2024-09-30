import { connectMongoDB } from '@/lib/mongodb';
import Course from '@/models/coursesModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const userId = request.nextUrl.searchParams.get('userId');
		const CoursePerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}

		const userEnrolledCourses = await User.findOne({ _id: userId })
			.select('enrolledCourses')
			.populate({
				path: 'enrolledCourses',
				model: Course,
				options: {
					skip: pageNum * CoursePerPage,
					limit: CoursePerPage,
					sort: { createdAt: -1 },
				},
			});

		return NextResponse.json({ userEnrolledCourses }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
