import { connectMongoDB } from '@/lib/mongodb';
import ShortUrl from '@/models/shortUrlsModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const identifier = request.nextUrl.searchParams.get('identifier');

		const existingShortUrl = await ShortUrl.findOne({
			shortUrlIdentifier: new RegExp(`^${identifier}$`, 'i'),
		});

		if (existingShortUrl) {
			await ShortUrl.updateOne(
				{ _id: existingShortUrl._id },
				{ $inc: { shortUrlClickCount: 1 } }
			);
			return NextResponse.json({ existingShortUrl }, { status: 200 });
		} else {
			throw new Error('Invalid URL');
		}
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
