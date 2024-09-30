import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import PrintingOrder from '@/models/printingOrdersModel';

export async function POST(request) {
	try {
		const { orderId, userId } = await request.json();

		await connectMongoDB();
		const printingOrderExists = await PrintingOrder.findOne({ _id: orderId });

		if (!printingOrderExists) {
			return NextResponse.json(
				{
					message: 'Order does not Exists!',
				},
				{ status: 400 }
			);
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
		//added
		const { data } = await axios.post(
			process.env.BKASH_CREATE_PAYMENT_URL,
			{
				mode: '0011',
				payerReference: `${printingOrderExists._id.toString()} ${userId?.toString()}`,
				callbackURL: `${process.env.NEXTAUTH_URL}/api/bkash-printing-callback/extra`,
				amount: parseFloat(printingOrderExists?.repayableAmount)
					.toFixed(2)
					.toString(),
				currency: 'BDT',
				intent: 'sale',
				merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 6),
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

		if (data) {
			return NextResponse.json(
				{
					message: 'Do payment!',
					data: data,
				},
				{ status: 201 }
			);
		}

		return NextResponse.json(
			{
				message: 'Unknown Error Occured!',
			},
			{ status: 400 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
