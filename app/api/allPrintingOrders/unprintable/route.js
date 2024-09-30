import { connectMongoDB } from '@/lib/mongodb';
import PrintingOrder from '@/models/printingOrdersModel';
import Transaction from '@/models/transactionsModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');

		const PrintingOrderPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const printingOrders = await PrintingOrder.find({ status: 'unprintable' })
			.populate({
				path: 'orderOwner',
				model: User,
			})
			.populate({
				path: 'orderPSITransaction',
				model: Transaction,
			})
			.sort({ createdAt: -1 })
			.skip(pageNum * PrintingOrderPerPage)
			.limit(PrintingOrderPerPage);

		return NextResponse.json({ printingOrders }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
