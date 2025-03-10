import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const { name, email, image } = await request.json();
		await connectMongoDB();
		const userExists = await User.findOne({ email });

		if (userExists) {
			userExists.name = name;
			userExists.image = image;
			const updatedUser = await userExists.save();

			return NextResponse.json(
				{ message: 'User exists!', data: updatedUser },
				{ status: 200 }
			);
		}

		const newUser = await new User({ name, email, image });
		const createdUser = await newUser.save();
		if (createdUser) {
			return NextResponse.json(
				{ message: 'User created successfully', token, data: createdUser },
				{ status: 201 }
			);
		}
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 500 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
