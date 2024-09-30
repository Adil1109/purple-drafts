import { formatPhoneNumber } from '@/lib/formatPhoneNumber';
import { connectMongoDB } from '@/lib/mongodb';
import { sendSmsPost } from '@/lib/sendSms';
import PrintingOrder from '@/models/printingOrdersModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const orderId = await request.nextUrl.searchParams.get('orderId');
		await connectMongoDB();

		const updatedOrder = await PrintingOrder.findByIdAndUpdate(
			orderId,
			{ status: 'paid', unprintableDescription: undefined },
			{ new: true }
		);

		if (!updatedOrder) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}

		const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);
		const message = `Your printing order with ID ${orderId} has been marked as printable. Soon you will get the delivery!`;

		// Send SMS notification
		await sendSmsPost(phoneNumber, message);

		return NextResponse.json({ message: 'Order printable' }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
