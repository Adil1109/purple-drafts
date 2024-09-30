import { connectMongoDB } from '@/lib/mongodb';
import PrintingOrder from '@/models/printingOrdersModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
		const query = request.nextUrl.searchParams.get('query') || '';

		const PrintingOrderPerPage = 10;
		const pageNum = page > 1 ? page - 1 : 0;

		// Find users that match the query
		const users = await User.find({ name: new RegExp(query, 'i') });
		const userIds = users.map((user) => user._id);

		const printingOrders = await PrintingOrder.find({
			orderOwner: { $in: userIds },
			status: {
				$in: ['paid'],
			},
		})
			.populate({
				path: 'orderOwner',
				model: User,
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
