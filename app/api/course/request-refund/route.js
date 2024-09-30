import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Transaction from '@/models/transactionsModel';

const joiBuyingSchema = Joi.object({
	courseBuyerId: Joi.string().min(5).required(),
	courseId: Joi.string().min(5).required(),
});

export async function PUT(request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.redirect(
				`${process.env.NEXTAUTH_URL}/payment-error?message=Unauthenticated`
			);
		}
		const { courseId } = await request.json();
		const courseBuyerId = session?.user?.mongoId;

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

		const transactionExists = await Transaction.findOne({
			transactionAuthor: courseBuyerId,
			transactionProductType: courseId,
		});

		if (!transactionExists) {
			return NextResponse.json(
				{ message: 'Transaction does not exists!' },
				{ status: 400 }
			);
		}

		transactionExists.transactionStatus = 'refund';
		await transactionExists.save();

		return NextResponse.json(
			{
				message: 'Refund Requested!',
				data: { message: 'Refund Requested' },
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
