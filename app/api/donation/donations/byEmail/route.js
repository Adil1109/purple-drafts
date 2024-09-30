import { connectMongoDB } from '@/lib/mongodb';
import Donation from '@/models/donationsModel';
import User from '@/models/usersModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const page = request.nextUrl.searchParams.get('page');
		const donorEmail = request.nextUrl.searchParams.get('donorEmail');
		const DonationPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}

		const donations = await Donation.find({
			donorEmail: donorEmail,
			status: 'paid',
		})
			.populate({
				path: 'donor',
				select: 'name image',
				model: User,
			})
			.sort({ createdAt: -1 })
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
