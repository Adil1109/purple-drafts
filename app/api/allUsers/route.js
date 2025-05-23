import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');

		const UserPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const users = await User.find()
			.select('name email image')
			.sort({ createdAt: 1 })
			.skip(pageNum * UserPerPage)
			.limit(UserPerPage);

		return NextResponse.json({ users }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
