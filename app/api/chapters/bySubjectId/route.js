import { connectMongoDB } from '@/lib/mongodb';
import Chapter from '@/models/chaptersModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/usersModel';
import Course from '@/models/coursesModel';
import { headers } from 'next/headers';
import { jwtVerify } from '@/lib/jwtVerify';

await connectMongoDB();

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);

		const subjectId = request.nextUrl.searchParams.get('subjectId');
		const courseId = request.nextUrl.searchParams.get('courseId');
		const page = request.nextUrl.searchParams.get('page');

		const headerList = headers();
		const Authorization = headerList.get('Authorization');
		const user = jwtVerify(Authorization);

		const userId = session?.user?.mongoId || user.userId;
		const ChapterPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}

		if (
			session?.user?.role !== 'admin' &&
			session?.user?.role !== 'superAdmin'
		) {
			const { enrolledCourses } = await User.findOne({
				_id: userId,
			}).select('enrolledCourses');

			if (!enrolledCourses.includes(courseId)) {
				throw new Error('You have not enrolled the course');
			}
		}

		const chapters = await Course.findOne({
			_id: courseId,
		})
			.select('courseChapters')
			.populate({
				path: 'courseChapters',
				model: Chapter,
				match: { chapterSubject: subjectId },
				options: {
					skip: pageNum * ChapterPerPage,
					limit: ChapterPerPage,
				},
			});

		return NextResponse.json({ chapters }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
