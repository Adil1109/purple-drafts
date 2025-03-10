'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import ScrollMsg from '@/components/ScrollMsg';
import CategoryCard from '@/components/CategoryCard';
import { useParams, useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import NoDataComponent from '@/components/NoDataMessage';
import { fetchCategoryAction } from '@/actions/categoryActions';

export default function CategoryBlogs() {
	const [page, setPage] = useState(1);
	const [blogs, setBlogs] = useState([]);
	const [category, setCategory] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const [endErr, setEndErr] = useState(false);
	const router = useRouter();
	const params = useParams();
	useEffect(() => {
		const fetchData = async () => {
			const categoryData = await fetchCategoryAction(params?.categoryId);
			console.log(categoryData);

			setCategory(categoryData);
		};
		fetchData();
	}, [params]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/allBlogs/byCategory?page=${page}&categoryId=${params.categoryId}`
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
				{category?.name}
			</p>
			<div className='flex px-6 pt-2 pb-6 gap-5 flex-wrap w-full justify-center'>
				{!blogs ? (
					<MsgShower msg={'No Blogs available!'} />
				) : (
					blogs?.map((item) => {
						{
							return <BlogCard key={item._id} blog={item} />;
						}
					})
				)}
			</div>
			{loading && <Loader className='self-center' />}
			{error && <ScrollMsg msg={error} />}
			{endErr && <NoDataComponent />}
		</div>
	);
}
