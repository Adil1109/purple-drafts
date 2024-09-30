import { connectMongoDB } from '@/lib/mongodb';
import Chapter from '@/models/chaptersModel';
import Video from '@/models/videosModel';
import Subject from '@/models/subjectsModel';
import Teacher from '@/models/teachersModel';
import { NextResponse } from 'next/server';
import Course from '@/models/coursesModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/usersModel';
import { headers } from 'next/headers';
import { jwtVerify } from '@/lib/jwtVerify';

await connectMongoDB();

export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);
		const headerList = headers();
		const Authorization = headerList.get('Authorization');
		const user = jwtVerify(Authorization);

		const userId = session?.user?.mongoId || user.userId;

		const videoId = req.nextUrl.searchParams.get('videoId');

		const video = await Video.findOne({ _id: videoId })
			.select(
				'videoURL videoImageURL videoClass videoNumber videoLectureSheetURL videoNoteURL videoPracticeSheetURL videoSolveSheetURL videoStartTime'
			)
			.populate({
				path: 'videoCourse',
				select: 'courseName courseGroup',
				model: Course,
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
			});

		if (
			session?.user?.role !== 'admin' &&
			session?.user?.role !== 'superAdmin'
		) {
			const { enrolledCourses } = await User.findOne({
				_id: userId,
			}).select('enrolledCourses');

			if (!enrolledCourses.includes(video?.videoCourse?._id)) {
				throw new Error('You have not enrolled the course');
			}
		}

		return NextResponse.json({ video }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
