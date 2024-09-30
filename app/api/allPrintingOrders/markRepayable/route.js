import { formatPhoneNumber } from '@/lib/formatPhoneNumber';
import { connectMongoDB } from '@/lib/mongodb';
import { sendSmsPost } from '@/lib/sendSms';
import PrintingOrder from '@/models/printingOrdersModel';
import Joi from 'joi';
import { NextResponse } from 'next/server';
const joiRepayableSchema = Joi.object({
	repayableAmount: Joi.number().required(),
	orderId: Joi.string().required(),
	feeDescription: Joi.string().allow('').optional(),
});
export async function POST(request) {
	try {
		const orderId = await request.nextUrl.searchParams.get('orderId');
		const { repayableAmount, feeDescription } = await request.json();
		await connectMongoDB();

		const { error } = joiRepayableSchema.validate({
			repayableAmount,
			orderId,
			feeDescription,
		});

		if (error) {
			return NextResponse.json(
				{ message: 'Validation error', error: error.details[0].message },
				{ status: 400 }
			);
		}
		const repayableAmountNumber = Number(repayableAmount);
		const repayableAmountCharge = repayableAmountNumber * 0.025;
		const repayableAmountWithCharges =
			repayableAmountNumber + repayableAmountNumber * 0.025;
		const updatedOrder = await PrintingOrder.findByIdAndUpdate(
			orderId,
			{
				status: 'repayable',
				repayableAmountCharge: parseFloat(repayableAmountCharge).toFixed(2),
				repayableAmount: parseFloat(repayableAmountWithCharges).toFixed(2),
				feeDescription,
			},
			{ new: true }
		);

		if (!updatedOrder) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}

		const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);
		const message = `আপনার প্রিন্টিং অর্ডার (আইডি: ${orderId}) সম্পূর্ণ করতে আরও ${updatedOrder.repayableAmount} টাকা পরিশোধের প্রয়োজন রয়েছে।

অর্থ পরিশোধ সম্পূর্ণ করতে অনুগ্রহ করে এই লিঙ্কে যান: https://hsccrackers.com/profile/allOrders`;

		// Send SMS notification
		await sendSmsPost(phoneNumber, message);

		return NextResponse.json({ message: 'Order Repayable!' }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
