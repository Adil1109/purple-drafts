import { formatPhoneNumber } from '@/lib/formatPhoneNumber';
import { connectMongoDB } from '@/lib/mongodb';
import { sendSmsPost } from '@/lib/sendSms';
import PrintingOrder from '@/models/printingOrdersModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import Transaction from '@/models/transactionsModel';

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		const orderId = await request.nextUrl.searchParams.get('orderId');
		await connectMongoDB();

		if (session?.user?.role !== 'superAdmin') {
			throw new Error('You are not allowed to do this!');
		}

		const updatedOrder = await PrintingOrder.findByIdAndUpdate(
			orderId,
			{ status: 'refunded' },
			{ new: true }
		);

		if (!updatedOrder) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}

		const existingTransaction = await Transaction.findOne({
			transactionProductType: orderId,
		});
		existingTransaction.transactionStatus = 'refunded';
		await existingTransaction.save();

		const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);

		const message = ` আপনার প্রিন্টিং অর্ডার (আইডি: ${orderId}) এর জন্য প্রদত্ত অর্থ ফেরত পাঠানো হয়েছে। আপনার বিকাশ ওয়ালেট চেক করুন। 
-  HSC Crackers`;

		// Send SMS notification
		await sendSmsPost(phoneNumber, message);

		return NextResponse.json(
			{ message: 'Order marked Refunded' },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 400 });
	}
}
