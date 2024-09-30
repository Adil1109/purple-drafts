import { connectMongoDB } from '@/lib/mongodb';
import Announcement from '@/models/announcementsModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/usersModel';
import { headers } from 'next/headers';
import { jwtVerify } from '@/lib/jwtVerify';

await connectMongoDB();

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		const courseId = request.nextUrl.searchParams.get('courseId');
		const page = request.nextUrl.searchParams.get('page');
		const AnnouncementPerPage = 10;
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

		const announcements = await Announcement.find({
			announcementCourse: courseId,
		})
			.sort({
				createdAt: -1,
			})
			.skip(pageNum * AnnouncementPerPage)
			.limit(AnnouncementPerPage);

		return NextResponse.json({ announcements }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
