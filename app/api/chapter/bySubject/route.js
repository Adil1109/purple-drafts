import { connectMongoDB } from '@/lib/mongodb';
import Chapter from '@/models/chaptersModel';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const subjectId = request.nextUrl.searchParams.get('subjectId');
		await connectMongoDB();
		const chapters = await Chapter.find({ chapterSubject: subjectId });

		return NextResponse.json({ chapters }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 400 }
		);
	}
}
