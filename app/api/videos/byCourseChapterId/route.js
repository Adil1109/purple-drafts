import { connectMongoDB } from '@/lib/mongodb';
import Chapter from '@/models/chaptersModel';
import Video from '@/models/videosModel';
import Subject from '@/models/subjectsModel';
import Teacher from '@/models/teachersModel';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/usersModel';
import { headers } from 'next/headers';
import { jwtVerify } from '@/lib/jwtVerify';

await connectMongoDB();

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		const courseId = request.nextUrl.searchParams.get('courseId');
		const chapterId = request.nextUrl.searchParams.get('chapterId');
		const page = request.nextUrl.searchParams.get('page');
		const VideoPerPage = 10;
		const headerList = headers();
		const Authorization = headerList.get('Authorization');
		const user = jwtVerify(Authorization);

		const userId = session?.user?.mongoId || user.userId;
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

		const videos = await Video.find({
			videoCourse: courseId,
			videoChapter: chapterId,
		})
			.populate({
				path: 'videoSubject',
				select: 'subjectName',
				model: Subject,
			})
			.populate({
				path: 'videoChapter',
				select: 'chapterName',
				model: Chapter,
			})
			.populate({
				path: 'videoTeacher',
				select: 'teacherName teacherImageURL',
				model: Teacher,
			})
			.sort({
				videoNumber: 1,
			})
			.skip(pageNum * VideoPerPage)
			.limit(VideoPerPage);

		return NextResponse.json({ videos }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
