import { connectMongoDB } from '@/lib/mongodb';
import Video from '@/models/playlistsModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(req) {
	try {
		const playlistId = req.nextUrl.searchParams.get('playlistId');

		const playlist = await Video.findOne({ _id: playlistId });
		if (!playlist) {
			return NextResponse.json(
				{ message: 'Playlist not available' },
				{ status: 400 }
			);
		}
		return NextResponse.json({ playlist }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
