import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import User from '@/models/usersModel';
import Course from '@/models/coursesModel';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const joiBuyingSchema = Joi.object({
	courseBuyerId: Joi.string().min(5).required(),
	courseId: Joi.string().min(5).required(),
});

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

		const userExists = await User.findOne({ _id: courseBuyerId }).select(
			'enrolledCourses'
		);

		if (!userExists) {
			return NextResponse.json(
				{ message: 'You are not registered!' },
				{ status: 400 }
			);
		}

		const courseExists = await Course.findOne({ _id: courseId }).select(
			'coursePrice courseDiscount'
		);

		if (!courseExists) {
			return NextResponse.json(
				{ message: 'The Course id is invalid!' },
				{ status: 400 }
			);
		}

		if (userExists.enrolledCourses.includes(courseId)) {
			return NextResponse.json(
				{ message: 'You cannot buy a course twice!' },
				{ status: 400 }
			);
		}

		if (courseExists.coursePrice - courseExists.courseDiscount > 0) {
			const tokenResp = await axios.post(
				process.env.BKASH_GRANT_TOKEN_URL,
				{
					app_key: process.env.BKASH_APP_KEY,
					app_secret: process.env.BKASH_APP_SECRET,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						username: process.env.BKASH_USERNAME,
						password: process.env.BKASH_PASSWORD,
					},
				}
			);
			const { data } = await axios.post(
				process.env.BKASH_CREATE_PAYMENT_URL,
				{
					mode: '0011',
					payerReference: `${courseExists._id.toString()} ${courseBuyerId?.toString()}`,
					callbackURL: `${process.env.NEXTAUTH_URL}/api/bkash-callback`,
					amount: (
						courseExists.coursePrice - courseExists.courseDiscount
					).toString(),
					currency: 'BDT',
					intent: 'sale',
					merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 6),
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: tokenResp.data.id_token,
						'X-App-Key': process.env.BKASH_APP_KEY,
					},
				}
			);

			if (data) {
				return NextResponse.json(
					{
						message: 'Do payment!',
						data: data,
					},
					{ status: 201 }
				);
			}
		}

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
			{
				message: 'You enrolled the course successfully!',
				data: result,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
