import { connectMongoDB } from '@/lib/mongodb';
import Video from '@/models/announcementsModel';
import { NextResponse } from 'next/server';
import Course from '@/models/coursesModel';
import User from '@/models/usersModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { headers } from 'next/headers';
import { jwtVerify } from '@/lib/jwtVerify';

await connectMongoDB();

export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);
		const announcementId = req.nextUrl.searchParams.get('announcementId');
		const headerList = headers();
		const Authorization = headerList.get('Authorization');
		const user = jwtVerify(Authorization);

		const userId = session?.user?.mongoId || user.userId;

		const announcement = await Video.findOne({ _id: announcementId }).populate({
			path: 'announcementCourse',
			select: 'courseName',
			model: Course,
		});

		if (
			session?.user?.role !== 'admin' &&
			session?.user?.role !== 'superAdmin'
		) {
			const { enrolledCourses } = await User.findOne({
				_id: userId,
			}).select('enrolledCourses');

			if (!enrolledCourses.includes(announcement?.announcementCourse?._id)) {
				throw new Error('You have not enrolled the course');
			}
		}

		return NextResponse.json({ announcement }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
