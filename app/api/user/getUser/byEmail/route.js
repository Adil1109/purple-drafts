import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

import User from '@/models/usersModel';

await connectMongoDB();

export async function GET(req) {
	try {
		const byEmail = req.nextUrl.searchParams.get('byEmail');

		const user = await User.findOne({ email: byEmail }).select(
			'name email image'
		);

		return NextResponse.json({ user }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
