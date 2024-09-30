import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const { _id } = await request.json();
		await connectMongoDB();
		const userExists = await User.findOne({ _id }).select('role');

		if (!userExists) {
			return NextResponse.json(
				{ message: 'User does not exists!' },
				{ status: 400 }
			);
		}

		if (userExists.role === 'admin' || userExists.role === 'superAdmin') {
			return NextResponse.json(
				{ message: 'You are Administrator' },
				{ status: 200 }
			);
		}

		return NextResponse.json(
			{ message: 'Bad Request happened!' },
			{ status: 400 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
