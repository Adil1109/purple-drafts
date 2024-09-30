import { connectMongoDB } from '@/lib/mongodb';
import PrintingOrder from '@/models/printingOrdersModel';
import Transaction from '@/models/transactionsModel';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET() {
	try {
		await connectMongoDB();
		const allTotals = await PrintingOrder.aggregate([
			{
				$match: {
					status: {
						$in: ['paid', 'repayable', 'unprintable', 'completed'],
					},
				},
			},
			{
				$group: {
					_id: null,
					totalAmount: { $sum: '$amount' },
					totalCostAmount: { $sum: '$costAmount' },
					totalDeliveryAmount: { $sum: '$deliveryAmount' },
					totalPageNumber: { $sum: '$pageNumber' },
					totalCount: {
						$sum: {
							$cond: [
								{
									$in: [
										'$status',
										['paid', 'repayable', 'unprintable', 'completed'],
									],
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);
		const courseTotals = await Transaction.aggregate([
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

		return NextResponse.json({ allTotals, courseTotals }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
