import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(req) {
	const token = await getToken({ req });
	const resp = await fetch(`${process.env.NEXTAUTH_URL}/api/signout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			_id: token?.mongoId,
		}),
	});

	if ((token?.role !== 'admin' && token?.role !== 'superAdmin') || !resp.ok) {
		return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signout`);
	}
}

export const config = { matcher: ['/admin-controls/:path*'] };
