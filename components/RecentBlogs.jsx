'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import ScrollMsg from '@/components/ScrollMsg';
import CategoryCard from '@/components/CategoryCard';
import { useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import NoDataComponent from './NoDataMessage';

export default function RecentBlogs() {
	const [page, setPage] = useState(1);
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [endErr, setEndErr] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(`/api/allBlogs?page=${page}`);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();
				if (!dataArr.blogs) {
					setError('Data not received');
					return;
				}
				if (dataArr.blogs.length < 1 && page === 1) {
					setEndErr(true);
				}

				setBlogs((prev) => [...prev, ...dataArr.blogs]);
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page]);

	return (
		<div className=''>
			<p className='py-6 underline italic text-center text-2xl'>
				Recently Added
			</p>
			<div className='flex px-6 pt-2 pb-6 gap-5 flex-wrap w-full justify-center'>
				{!blogs ? (
					<MsgShower msg={'No Blogs available!'} />
				) : (
					blogs?.map((item) => {
						return <BlogCard key={item._id} blog={item} />;
					})
				)}
			</div>
			{loading && <Loader className='self-center' />}
			{error && <ScrollMsg msg={error} />}
			{endErr && <NoDataComponent />}
		</div>
	);
}
