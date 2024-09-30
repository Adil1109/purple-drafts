import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Donation from '@/models/donationsModel';
import { jwtVerify } from '@/lib/jwtVerify';

const joiBuyingSchema = Joi.object({
	amount: Joi.number().required(),
	donorEmail: Joi.string().min(5).required(),
	userId: Joi.string().min(5).required(),
});

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		const { amount, donorEmail } = await request.json();

		const headerList = headers();
		const Authorization = headerList.get('Authorization');
		const user = jwtVerify(Authorization);

		const userId = session?.user?.mongoId || user.userId;

		const { error } = joiBuyingSchema.validate({
			amount,
			donorEmail,
			userId,
		});

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}
		if (amount < 5) {
			return NextResponse.json(
				{ message: 'Validation error: Minimum 5 tk!' },
				{ status: 400 }
			);
		}

		await connectMongoDB();
		const createdDonation = await Donation.create({
			amount: parseFloat(amount).toFixed(2),
			donorEmail,
			donor: userId,
		});
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
			process.env.BKASH_CREATE_PAYMENT_URL,
			{
				mode: '0011',
				payerReference: `${createdDonation._id.toString()} ${userId?.toString()}`,
				callbackURL: `${process.env.NEXTAUTH_URL}/api/donation/bkash-callback`,
				amount: createdDonation.amount.toString(),
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
					message: 'Donate!',
					data: data,
				},
				{ status: 201 }
			);
		}
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
