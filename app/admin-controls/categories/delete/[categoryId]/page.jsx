'use client';
import DeleteConfirmer from '@/components/DeleteConfirmer';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { deleteCategoryAction } from '@/actions/categoryActions';

export default function DeleteAdmin() {
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
			ModelType={'Category'}
			deleteAction={() => deleteCategoryAction(params.categoryId)}
		/>
	);
}
