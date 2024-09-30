import { connectMongoDB } from '@/lib/mongodb';
import Playlist from '@/models/playlistsModel';
import { NextResponse } from 'next/server';

await connectMongoDB();

export async function GET(request) {
	try {
		const stClass = request.nextUrl.searchParams.get('stClass');
		const page = request.nextUrl.searchParams.get('page');

		const PlaylistPerPage = 10;
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const playlists = await Playlist.find({ playlistClass: stClass })
			.sort({ playlistName: 1 })
			.skip(pageNum * PlaylistPerPage)
			.limit(PlaylistPerPage);

		return NextResponse.json({ playlists }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
