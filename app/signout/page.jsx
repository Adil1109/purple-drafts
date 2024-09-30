'use client';
import MsgShower from '@/components/MsgShower';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function Signout() {
	useEffect(() => {
		signOut({ callbackUrl: '/', redirect: true });
	}, []);
	return <MsgShower msg={'Signing you out! You are not admin anymore!'} />;
}
