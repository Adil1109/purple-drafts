import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import User from '@/models/usersModel';
import Course from '@/models/coursesModel';
import axios from 'axios';

const joiBuyingSchema = Joi.object({
	courseBuyerId: Joi.string().min(5).required(),
	courseId: Joi.string().min(5).required(),
});
export const dynamic = 'force-dynamic';
export async function PUT(request) {
	try {
		const { courseBuyerId, courseId } = await request.json();
		const { error } = joiBuyingSchema.validate({
			courseBuyerId,
			courseId,
		});

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		await connectMongoDB();
		const courseExists = await Course.findOne({ _id: courseId }).select(
			'coursePrice courseDiscount courseBuyable courseExternelId'
		);

		if (!courseExists) {
			return NextResponse.json(
				{ message: 'The Course id is invalid!' },
				{ status: 400 }
			);
		}

		if (courseExists.courseBuyable === 'YES') {
			return NextResponse.json({ message: 'No Need!' }, { status: 403 });
		}

		const userExists = await User.findOne({ _id: courseBuyerId }).select(
			'email enrolledCourses'
		);

		if (!userExists) {
			return NextResponse.json(
				{ message: 'You are not registered!' },
				{ status: 403 }
			);
		}

		if (userExists.enrolledCourses.includes(courseId)) {
			return NextResponse.json(
				{ message: 'You cannot buy a course twice!' },
				{ status: 403 }
			);
		}

		const response = await axios.post(
			'https://shop.aparsclassroom.com/query/email',
			new URLSearchParams({ email: userExists.email }),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		if (!(response.status >= 200 && response.status < 300)) {
			return NextResponse.json(
				{ message: 'Failed to fetch transaction data!' },
				{ status: response.status }
			);
		}

		const data = response.data;
		const { tranx } = data;

		if (!tranx || !Array.isArray(tranx) || tranx.length === 0) {
			return NextResponse.json(
				{ message: 'No transactions found!' },
				{ status: 404 }
			);
		}

		const validTransaction = tranx.find(
			(transaction) =>
				transaction.ProductName === courseExists.courseExternelId &&
				transaction.status === 'VALID'
		);
		if (!validTransaction) {
			return NextResponse.json(
				{ message: 'You have not bought the course!' },
				{ status: 401 }
			);
		}
		if (validTransaction) {
			userExists.enrolledCourses.push(courseId);
			const result = await userExists.save();
			if (result) {
				const enrolledNumberInc = await Course.updateOne(
					{ _id: courseId },
					{ $inc: { courseEnrolledNumber: 1 } }
				);
				if (!enrolledNumberInc) {
					return NextResponse.json(
						{ message: 'Error while updating enrolled students count!' },
						{ status: 401 }
					);
				}
			}

			return NextResponse.json(
				{ message: 'You enrolled the course successfully!' },
				{ status: 201 }
			);
		}

		return NextResponse.json({ message: 'Unknown Error!' }, { status: 405 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
