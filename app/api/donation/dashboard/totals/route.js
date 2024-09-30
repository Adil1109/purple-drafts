import { connectMongoDB } from '@/lib/mongodb';
import Course from '@/models/coursesModel';
import DistributedDonation from '@/models/distributedDonationsModel';
import Transaction from '@/models/transactionsModel';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request) {
	try {
		await connectMongoDB();
		const distributedDonation = await DistributedDonation.findOne({
			_id: '66c10e82c4fca90436228c59',
		});

		const allTotals = await Transaction.aggregate([
			{
				$match: {
					transactionProductRefModel: {
						$in: ['Donation'],
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
									$in: ['$transactionProductRefModel', ['Donation']],
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);
		allTotals.push({ amount: distributedDonation.amount });

		return NextResponse.json({ allTotals }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
