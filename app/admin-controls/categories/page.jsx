'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import CategoryCard from '@/components/CategoryCard';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchAllCategoryAction } from '@/actions/categoryActions';

export default function AllCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { status, data: session } = useSession();

	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			try {
				const fetchedCategoryData = await fetchAllCategoryAction();
				setCategories(fetchedCategoryData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		fetchCategories();
	}, []);

	if (loading || status === 'loading') {
		return <Loader />;
	}
	if (categories.length < 1) {
		return <MsgShower msg={'No Categories available!'} />;
	}

	return (
		<div className=''>
			<div className='flex flex-wrap items-center justify-between pl-7 pr-5 py-4'>
				<h2 className='font-bold text-lg '>All Categories</h2>
				<div className='flex justify-between flex-wrap'>
					<button
						className='cbgColor h-12 w-28 rounded-md'
						onClick={() => router.push('/admin-controls/categories/add-new')}>
						Add
					</button>
				</div>
			</div>
			<div className='flex px-6 py-2 gap-5 flex-wrap w-full justify-stretch smd:justify-center'>
				{!categories ? (
					<MsgShower msg={'No Categories available!'} />
				) : (
					categories?.map((item) => {
						return <CategoryCard key={item._id} category={item} />;
					})
				)}
			</div>
		</div>
	);
}
