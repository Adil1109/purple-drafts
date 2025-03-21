import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(req) {
	const token = await getToken({ req });

	if (token?.role !== 'admin' && token?.role !== 'superAdmin') {
		return NextResponse.redirect(process.env.NEXTAUTH_URL);
	}
}

export const config = { matcher: ['/admin-controls/:path*'] };
