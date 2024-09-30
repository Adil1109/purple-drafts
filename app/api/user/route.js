import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
	try {
		const { name, email, image } = await request.json();
		await connectMongoDB();
		const userExists = await User.findOne({ email });

		if (userExists) {
			userExists.name = name;
			userExists.image = image;
			const updatedUser = await userExists.save();
			const token = jwt.sign(
				{
					userId: updatedUser._id,
					email: updatedUser.email,
					name: updatedUser.name,
					image: updatedUser.image,
					role: updatedUser.role,
				},
				process.env.TOKEN_SECRET
			);
			return NextResponse.json(
				{ message: 'User exists!', token, data: updatedUser },
				{ status: 200 }
			);
		}

		const newUser = await new User({ name, email, image });
		const createdUser = await newUser.save();
		if (createdUser) {
			const token = jwt.sign(
				{
					userId: createdUser._id,
					email: createdUser.email,
					name: createdUser.name,
					image: createdUser.image,
					role: createdUser.role,
				},
				process.env.TOKEN_SECRET
			);
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
