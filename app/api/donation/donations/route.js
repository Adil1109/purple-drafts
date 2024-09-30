import { connectMongoDB } from '@/lib/mongodb';
import Donation from '@/models/donationsModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const type = request.nextUrl.searchParams.get('type');
		const page = request.nextUrl.searchParams.get('page');

		const DonationPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}

		let sortOption = {};

		if (type === 'recent') {
			sortOption = { createdAt: -1 };
		} else if (type === 'top') {
			sortOption = { amount: -1 };
		}

		const donations = await Donation.find({ status: 'paid' })
			.populate({
				path: 'donor',
				select: 'name image',
				model: User,
			})
			.sort(sortOption)
			.skip(pageNum * DonationPerPage)
			.limit(DonationPerPage);

		return NextResponse.json({ donations }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
