import { connectMongoDB } from '@/lib/mongodb';
import Teacher from '@/models/teachersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const TeacherPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const teachers = await Teacher.find()
			.sort({ teacherName: 1 })
			.skip(pageNum * TeacherPerPage)
			.limit(TeacherPerPage);

		return NextResponse.json({ teachers }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
