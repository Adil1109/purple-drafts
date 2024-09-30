import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const courseId = request.nextUrl.searchParams.get('courseId');
		const userId = request.nextUrl.searchParams.get('userId');

		const userExists = await User.findOne({ _id: userId }).select(
			'enrolledCourses'
		);

		if (!userExists) {
			throw new Error('User not found');
		}

		const hasBought = userExists?.enrolledCourses?.includes(courseId);

		return NextResponse.json({ hasBought }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
