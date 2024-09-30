import { connectMongoDB } from '@/lib/mongodb';
import Chapter from '@/models/chaptersModel';
import Course from '@/models/coursesModel';
import Subject from '@/models/subjectsModel';
import User from '@/models/usersModel';
import Video from '@/models/videosModel';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const userId = request.nextUrl.searchParams.get('userId');

		await connectMongoDB();

		const userEnrolledCourses = await User.findOne({ _id: userId }).select(
			'enrolledCourses'
		);

		const today = new Date();

		const routineVideos = await Video.find({
			videoCourse: { $in: userEnrolledCourses?.enrolledCourses },
			videoStartTime: { $gte: today },
		})
			.sort({ videoStartTime: 1 })
			.limit(3)
			.populate({
				path: 'videoCourse',
				select: 'courseName',
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
			});

		return NextResponse.json({ routineVideos }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
