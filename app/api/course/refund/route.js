import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Transaction from '@/models/transactionsModel';
import { authOptions } from '../../auth/[...nextauth]/route';
import axios from 'axios';
import User from '@/models/usersModel';
import Course from '@/models/coursesModel';

export async function PUT(request) {
	try {
		const session = await getServerSession(authOptions);
		const transactionMongoID =
			request.nextUrl.searchParams.get('transactionMongoID');

		if (session?.user?.role !== 'superAdmin') {
			return NextResponse.redirect(
				`${process.env.NEXTAUTH_URL}/payment-error?message=Unauthorized`
			);
		}

		await connectMongoDB();

		const transactionExists = await Transaction.findOne({
			_id: transactionMongoID,
		});

		if (!transactionExists) {
			return NextResponse.json(
				{ message: 'Transaction does not exists!' },
				{ status: 400 }
			);
		}

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
			process.env.BKASH_REFUND_URL,
			{
				paymentID: transactionExists.paymentID,
				amount: transactionExists.amount,
				trxID: transactionExists.transactionID,
				sku: 'Refund payment',
				reason: 'User Demand',
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

		if (data && data.statusCode === '0000') {
			await User.findByIdAndUpdate(
				transactionExists.transactionAuthor,
				{
					$pull: { enrolledCourses: transactionExists.transactionProductType },
				},
				{ new: true }
			);

			await Course.updateOne(
				{ _id: transactionExists.transactionProductType },
				{ $inc: { courseEnrolledNumber: -1 } }
			);

			transactionExists.transactionStatus = 'refunded';
			await transactionExists.save();
			return NextResponse.json(
				{
					message: 'Refunded!',
					data: { message: 'Refunded' },
				},
				{ status: 201 }
			);
		}

		return NextResponse.json(
			{
				message: 'Not Refunded!',
				data: { message: 'Not Refunded' },
			},
			{ status: 400 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
