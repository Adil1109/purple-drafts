import mongoose from 'mongoose';
import { connectMongoDB } from '@/lib/mongodb';
import Transaction from '@/models/transactionsModel';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
	const courseId = request.nextUrl.searchParams.get('courseId');

	if (!courseId) {
		return NextResponse.json(
			{ message: 'courseId query parameter is missing' },
			{ status: 400 }
		);
	}

	try {
		await connectMongoDB();

		const courseObjectId = new mongoose.Types.ObjectId(courseId);

		const totalCourse = 1;
		const allTotals = await Transaction.aggregate([
			{
				$match: {
					transactionProductType: courseObjectId,
				},
			},
			{
				$group: {
					_id: null,
					totalAmount: { $sum: '$amount' },
					totalCount: { $sum: 1 },
				},
			},
		]);

		return NextResponse.json({ allTotals, totalCourse }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
