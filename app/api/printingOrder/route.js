import { connectMongoDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Joi from 'joi';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import PrintingOrder from '@/models/printingOrdersModel';

const joiBuyingSchema = Joi.object({
	pdfURL: Joi.string().uri().min(5).required(),
	pageNumber: Joi.number().required(),
	printType: Joi.string().required(),
	district: Joi.string().required(),
	area: Joi.string().required(),
	detailedAddress: Joi.string().required(),
	deliveryMethod: Joi.string().allow('').optional(),
	phoneNumber: Joi.string().required(),
	userId: Joi.string().required(),
	description: Joi.string().allow('').optional(),
});

export async function POST(request) {
	try {
		const {
			pdfURL,
			pageNumber,
			printType,
			district,
			area,
			detailedAddress,
			deliveryMethod,
			phoneNumber,
			userId,
			description,
		} = await request.json();

		const { error } = joiBuyingSchema.validate({
			pdfURL,
			pageNumber: Number(pageNumber),
			printType,
			district,
			area,
			detailedAddress,
			deliveryMethod,
			phoneNumber,
			userId,
			description,
		});

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		await connectMongoDB();
		const deliveryCharge =
			district === 'Dhaka' ? 60 : deliveryMethod === 'Pickup' ? 70 : 130;
		const calculatedPrice =
			printType === 'Black And White' ? pageNumber * 1.3 : pageNumber * 1.55;
		const subtotal = deliveryCharge + calculatedPrice;
		const chargesAmount = subtotal * 0.025;
		const totalWithCharge = subtotal + subtotal * 0.025;
		const finalTotal = parseFloat(totalWithCharge).toFixed(2);
		const createdPrintingOrder = await PrintingOrder.create({
			pdfURL,
			pageNumber: Number(pageNumber),
			printType,
			district,
			area,
			detailedAddress,
			phoneNumber,
			costAmount: calculatedPrice,
			deliveryAmount: deliveryCharge,
			chargesAmount,
			amount: finalTotal,
			orderOwner: userId,
			description,
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
		//added
		const { data } = await axios.post(
			process.env.BKASH_CREATE_PAYMENT_URL,
			{
				mode: '0011',
				payerReference: `${createdPrintingOrder._id.toString()} ${userId.toString()}`,
				callbackURL: `${process.env.NEXTAUTH_URL}/api/bkash-printing-callback`,
				amount: finalTotal.toString(),
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
