import { connectMongoDB } from '@/lib/mongodb';
import Course from '@/models/coursesModel';
import Teacher from '@/models/teachersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(req) {
	try {
		const courseId = req.nextUrl.searchParams.get('courseId');

		const course = await Course.findOne({ _id: courseId }).populate({
			path: 'courseTeachers',
			select: 'teacherName teacherImageURL',
			model: Teacher,
		});

		return NextResponse.json({ course }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
