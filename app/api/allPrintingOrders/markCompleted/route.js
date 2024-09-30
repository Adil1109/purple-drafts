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
			{
				status: 'completed',
			},
			{ new: true }
		);

		const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);
		const message = `আপনার প্রিন্টিং অর্ডার (আইডি: ${orderId}) সম্পূর্ণ হয়েছে। শীঘ্রই আপনি আপনার অর্ডারটি গ্রহণ করতে পারবেন।
- HSC Crackers`;

		// Send SMS notification
		await sendSmsPost(phoneNumber, message);

		return NextResponse.json(
			{ message: 'Order Completed successfully' },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
