import { connectMongoDB } from '@/lib/mongodb';
import axios from 'axios';
import { NextResponse } from 'next/server';
import Transaction from '@/models/transactionsModel';
import PrintingOrder from '@/models/printingOrdersModel';
import { formatPhoneNumber } from '@/lib/formatPhoneNumber';
import { sendSmsPost } from '@/lib/sendSms';
export const dynamic = 'force-dynamic';
export async function GET(request) {
	try {
		const status = request.nextUrl.searchParams.get('status');
		const paymentID = request.nextUrl.searchParams.get('paymentID');

		if (status === 'cancel' || status === 'failure') {
			return NextResponse.redirect(
				`${process.env.NEXTAUTH_URL}/payment-error?message=canceled-or-failed`
			);
		}

		if (status === 'success') {
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
				process.env.BKASH_EXECUTE_PAYMENT_URL,
				{ paymentID },
				{
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: tokenResp.data.id_token,
						'X-App-Key': process.env.BKASH_APP_KEY,
					},
				}
			);

			if (data?.statusCode === '2023') {
				return NextResponse.redirect(
					`${process.env.NEXTAUTH_URL}/payment-error?message=Insufficient-balance`
				);
			}

			if (data?.statusCode === '0000') {
				await connectMongoDB();
				const references = data?.payerReference.split(' ');
				const createdTransaction = await Transaction.create({
					amount: parseFloat(data.amount).toFixed(2),
					paymentID,
					transactionID: data.trxID,
					transactionDate: data.paymentExecuteTime,
					transactionAuthor: references[1],
					transactionProductType: references[0],
					transactionProductRefModel: 'PrintingOrder',
				});
				const updatedOrder = await PrintingOrder.findByIdAndUpdate(
					references[0],
					{
						status: 'paid',
						orderPSITransaction: createdTransaction._id,
					},
					{ new: true }
				);

				if (!updatedOrder) {
					return NextResponse.json(
						{ message: 'Order not found' },
						{ status: 404 }
					);
				}

				const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);
				const message = `আপনার প্রিন্টিং অর্ডার সফলভাবে গৃহীত হয়েছে। 
- HSC Crackers`;

				// Send SMS notification
				await sendSmsPost(phoneNumber, message);

				return NextResponse.redirect(
					`${
						process.env.NEXTAUTH_URL
					}/payment-success?message=${'Your Order Placed Successfully!'}&rUrl=${'/shop'}`
				);
			}
		}

		return NextResponse.redirect(
			`${process.env.NEXTAUTH_URL}/payment-error?message=Unknown-Error`
		);
	} catch (error) {
		return NextResponse.redirect(
			`${process.env.NEXTAUTH_URL}/payment-error?message=${error.message}`
		);
	}
}
