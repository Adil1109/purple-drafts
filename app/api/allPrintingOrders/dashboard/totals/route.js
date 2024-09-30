import { connectMongoDB } from '@/lib/mongodb';
import PrintingOrder from '@/models/printingOrdersModel';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request) {
	try {
		await connectMongoDB();
		const allTotals = await PrintingOrder.aggregate([
			{
				$match: {
					status: {
						$in: ['paid', 'repayable', 'unprintable', 'refunded', 'completed'],
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
										[
											'paid',
											'repayable',
											'unprintable',
											'refunded',
											'completed',
										],
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
		const totals = await PrintingOrder.aggregate([
			{
				$match: { status: { $in: ['completed'] } },
			},
			{
				$group: {
					_id: null,
					totalAmount: { $sum: '$amount' },
					totalCostAmount: { $sum: '$costAmount' },
					totalDeliveryAmount: { $sum: '$deliveryAmount' },
					totalPageNumber: { $sum: '$pageNumber' },
					totalCompletedCount: {
						$sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
					},
				},
			},
		]);

		const pendings = await PrintingOrder.aggregate([
			{
				$match: {
					status: { $in: ['paid', 'repayable', 'unprintable'] },
				},
			},
			{
				$group: {
					_id: null,
					totalAmount: { $sum: '$amount' },
					totalCostAmount: { $sum: '$costAmount' },
					totalDeliveryAmount: { $sum: '$deliveryAmount' },
					totalPageNumber: { $sum: '$pageNumber' },
					totalPendingCount: {
						$sum: {
							$cond: [
								{
									$in: ['$status', ['paid', 'repayable', 'unprintable']],
								},
								1,
								0,
							],
						},
					},
				},
			},
		]);

		const refunded = await PrintingOrder.aggregate([
			{
				$match: { status: { $in: ['refunded'] } },
			},
			{
				$group: {
					_id: null,
					totalAmount: { $sum: '$amount' },
					totalRefundedCount: {
						$sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] },
					},
				},
			},
		]);

		return NextResponse.json(
			{ allTotals, totals, pendings, refunded },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
