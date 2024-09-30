import { formatPhoneNumber } from '@/lib/formatPhoneNumber';
import { connectMongoDB } from '@/lib/mongodb';
import { sendSmsPost } from '@/lib/sendSms';
import PrintingOrder from '@/models/printingOrdersModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import Transaction from '@/models/transactionsModel';
import axios from 'axios';
export const dynamic = 'force-dynamic';
export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		const orderId = await request.nextUrl.searchParams.get('orderId');
		await connectMongoDB();

		if (session?.user?.role !== 'superAdmin') {
			throw new Error('You are not allowed to do this!');
		}

		const transactionExists = await Transaction.findOne({
			transactionProductType: orderId,
		}).sort({ createdAt: 1 });

		if (!transactionExists) {
			throw new Error('Transaction does not exist!');
		}
		const tokenResp = await axios.post(
			process.env.BKASH_GRANT_TOKEN_URL,
			{
				app_key: process.env.BKASH_APP_KEY,
				app_secret: process.env.BKASH_APP_SECRET,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					username: process.env.BKASH_USERNAME,
					password: process.env.BKASH_PASSWORD,
				},
			}
		);

		const { data } = await axios.post(
			process.env.BKASH_REFUND_URL,
			{
				paymentID: transactionExists.paymentID,
				amount: transactionExists.amount,
				trxID: transactionExists.transactionID,
				sku: 'Refund payment',
				reason: 'User Demand',
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: tokenResp.data.id_token,
					'X-App-Key': process.env.BKASH_APP_KEY,
				},
			}
		);

		if (data && data.statusCode === '2023') {
			throw new Error('Insufficient balance!');
		}
		if (data && data.statusCode === '3020') {
			throw new Error('Refund duration expired!');
		}

		if (data && data.statusCode === '0000') {
			transactionExists.transactionStatus = 'refunded';
			await transactionExists.save();
			const updatedOrder = await PrintingOrder.findByIdAndUpdate(
				orderId,
				{ status: 'refunded' },
				{ new: true }
			);

			if (!updatedOrder) {
				throw new Error('Order not found!');
			}
			const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);
			const message = ` আপনার প্রিন্টিং অর্ডার (আইডি: ${orderId}) এর জন্য প্রদত্ত অর্থ ফেরত পাঠানো হয়েছে। আপনার বিকাশ ওয়ালেট চেক করুন। 
-  HSC Crackers`;

			// Send SMS notification
			await sendSmsPost(phoneNumber, message);
			return NextResponse.json({ message: 'Order Refunded' }, { status: 201 });
		}

		return NextResponse.json(
			{ message: 'Unknown error occured' },
			{ status: 401 }
		);
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 400 });
	}
}
