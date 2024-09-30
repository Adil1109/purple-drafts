'use client';
import DeleteConfirmer from '@/components/DeleteConfirmer';
import { deleteShortUrlAction } from '@/actions/shortUrlActions';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

export default function DeleteShortUrl() {
	const params = useParams();
	const { status, data: session } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const doRedirect = async () => {
			if (!session?.user || session?.user.role !== 'superAdmin') {
				router.replace('/admin-controls');
			} else {
				setLoading(false);
			}
		};

		doRedirect();
	}, [session?.user, session?.user?.role, router]);

	if (loading) {
		return <Loader />;
	}
	return (
		<DeleteConfirmer
			ModelType={'ShortUrl'}
			deleteAction={() => deleteShortUrlAction(params.byId)}
		/>
	);
}
