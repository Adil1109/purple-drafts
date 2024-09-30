import { formatPhoneNumber } from '@/lib/formatPhoneNumber';
import { connectMongoDB } from '@/lib/mongodb';
import { sendSmsPost } from '@/lib/sendSms';
import PrintingOrder from '@/models/printingOrdersModel';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { headers } from 'next/headers';
import { jwtVerify } from '@/lib/jwtVerify';

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		let unprintableDescription;
		try {
			const jsonData = await request.json();
			unprintableDescription = jsonData.unprintableDescription || undefined;
		} catch (jsonError) {
			unprintableDescription = undefined;
		}
		const orderId = await request.nextUrl.searchParams.get('orderId');

		const headerList = headers();
		const Authorization = headerList.get('Authorization');
		const user = jwtVerify(Authorization);

		const userId = session?.user?.mongoId || user.userId;

		await connectMongoDB();

		if (
			session?.user?.role !== 'manager' &&
			session?.user?.role !== 'superAdmin'
		) {
			const printingOrderExists = await PrintingOrder.findOne({ _id: orderId });

			if (printingOrderExists.orderOwner.toString() !== userId) {
				throw new Error('You are not allowed to do this!');
			}
		}

		const updatedOrder = await PrintingOrder.findByIdAndUpdate(
			orderId,
			{
				status: 'unprintable',
				unprintableDescription,
			},
			{ new: true }
		);

		if (!updatedOrder) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}

		const phoneNumber = formatPhoneNumber(updatedOrder.phoneNumber);
		const message = `আপনার প্রিন্টিং অর্ডার (আইডি: ${orderId}) সম্পন্ন করা সম্ভব হচ্ছে না। আপনার পরিশোধকৃত অর্থ শীঘ্রই ফেরত পাঠানো হবে। বিস্তারিত জানার জন্য HSC Crackers ফেসবুক পেজে যোগাযোগ করুন।`;

		// Send SMS notification
		await sendSmsPost(phoneNumber, message);

		return NextResponse.json({ message: 'Order Unprintable' }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
