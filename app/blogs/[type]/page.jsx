'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import ScrollMsg from '@/components/ScrollMsg';
import CategoryCard from '@/components/CategoryCard';
import { useParams, useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import NoDataComponent from '@/components/NoDataMessage';

export default function RecentBlogs() {
	const [page, setPage] = useState(1);
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const [endErr, setEndErr] = useState(false);
	const router = useRouter();
	const params = useParams();
	function formatBlogType(text) {
		return text
			.split('-') // Split by dashes
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
			.join(' '); // Join words with spaces
	}

	// Example usage:
	console.log(formatBlogType('recent-blogs')); // "Recent Blogs"
	console.log(formatBlogType('most-viewed')); // "Most Viewed"
	console.log(formatBlogType('trending-blogs')); // "Trending Blogs"

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/allBlogs?page=${page}&type=${
						params.type ? params.type : 'recent-blogs'
					}`
				);

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
					setEnd(true);
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
	}, [page, params]);

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
	if (loading && page === 1) {
		return <Loader />;
	}

	return (
		<div className=''>
			<p className='py-6 underline italic text-center text-2xl'>
				{formatBlogType(params.type)}
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
