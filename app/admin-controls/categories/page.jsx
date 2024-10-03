'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import ScrollMsg from '@/components/ScrollMsg';
import CategoryCard from '@/components/CategoryCard';
import { useRouter } from 'next/navigation';

export default function AllCategories() {
	const [page, setPage] = useState(1);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(`/api/allCategories?page=${page}`);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();

				if (!dataArr.categories) {
					setError('Data not received');
					return;
				}

				if (dataArr.categories.length < 1) {
					setEnd(true);
				}

				setCategories((prev) => [...prev, ...dataArr.categories]);
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page]);

	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop + 1 >=
			document.documentElement.scrollHeight
		) {
			if (!end) {
				setPage((prev) => prev + 1);
			}
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	});

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
				{loading && <Loader className='self-center' />}
				{error && <ScrollMsg msg={error} />}
				{end && <ScrollMsg msg={'No further Categories!'} />}
			</div>
		</div>
	);
}
