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

		// First, find the user
		const userExists = await User.findOne({ _id: userId }).select(
			'enrolledCourses'
		);

		if (!userExists) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		// Then, find the enrolled courses for the user
		const enrolledCourses = await Course.find({
			_id: { $in: userExists.enrolledCourses },
			$expr: {
				$gt: [{ $subtract: ['$coursePrice', '$courseDiscount'] }, 1],
			},
		})
			.sort({ createdAt: -1 })
			.skip(pageNum * CoursePerPage)
			.limit(CoursePerPage);

		return NextResponse.json({ enrolledCourses }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
