'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateHistory() {
	const params = useParams();
	useEffect(() => {
		const saveHistory = async () => {
			await fetch(`/api/history/createHistory?blogId=${params?.blogId}`, {
				method: 'POST',
			});
		};
		saveHistory();
	}, []);
	return null;
}
