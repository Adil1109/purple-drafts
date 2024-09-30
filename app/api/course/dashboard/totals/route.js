import { connectMongoDB } from '@/lib/mongodb';
import Course from '@/models/coursesModel';
import Transaction from '@/models/transactionsModel';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request) {
	try {
		await connectMongoDB();
		const totalCourse = await Course.countDocuments();
		const allTotals = await Transaction.aggregate([
			{
				$match: {
					transactionProductRefModel: {
						$in: ['Course'],
					},
				},
			},
			{
				$group: {
					_id: null,
					totalAmount: { $sum: '$amount' },
					totalCount: {
						$sum: {
							$cond: [
								{
									$in: ['$transactionProductRefModel', ['Course']],
								},
								1,
								0,
							],
						},
					},
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
