import { connectMongoDB } from '@/lib/mongodb';
import PrintingOrder from '@/models/printingOrdersModel';
import Transaction from '@/models/transactionsModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();
export const dynamic = 'force-dynamic';
export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');

		const TransactionPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}

		const transactions = await Transaction.find({
			transactionProductRefModel: 'PrintingOrder',
		})
			.populate({
				path: 'transactionAuthor',
				model: User,
			})
			.populate({
				path: 'transactionProductType',

				model: PrintingOrder,
			})
			.sort({ createdAt: -1 })
			.skip(pageNum * TransactionPerPage)
			.limit(TransactionPerPage);

		return NextResponse.json({ transactions }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
