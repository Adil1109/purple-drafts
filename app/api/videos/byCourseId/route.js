import { connectMongoDB } from '@/lib/mongodb';
import Chapter from '@/models/chaptersModel';
import Video from '@/models/videosModel';
import Subject from '@/models/subjectsModel';
import Teacher from '@/models/teachersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const courseId = request.nextUrl.searchParams.get('courseId');
		const page = request.nextUrl.searchParams.get('page');
		const VideoPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const videos = await Video.find({ videoCourse: courseId })
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
				createdAt: -1,
			})
			.skip(pageNum * VideoPerPage)
			.limit(VideoPerPage);

		return NextResponse.json({ videos }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
