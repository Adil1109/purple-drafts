'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import ScrollMsg from '@/components/ScrollMsg';
import CategoryCard from '@/components/CategoryCard';
import { useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';

export default function RecentBlogs() {
	const [page, setPage] = useState(1);
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
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

				if (dataArr.blogs.length < 1) {
					setEnd(true);
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
			<p className='py-6 underline italic text-center text-2xl'>
				Recently Added
			</p>
			<div className='flex px-6 py-2 gap-5 flex-wrap w-full justify-center'>
				{!blogs ? (
					<MsgShower msg={'No Blogs available!'} />
				) : (
					blogs?.map((item) => {
						return <BlogCard key={item._id} blog={item} />;
					})
				)}
				{loading && <Loader className='self-center' />}
				{error && <ScrollMsg msg={error} />}
				{end && <ScrollMsg msg={'No further Blogs!'} />}
			</div>
		</div>
	);
}
