'use client';
import BlogCard from '@/components/BlogCard';
import Loader from '@/components/Loader';
import MsgShower from '@/components/MsgShower';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CgArrowRight } from 'react-icons/cg';

const CategorizedBlogs = () => {
	const [categoriesWithBlogs, setCategoriesWithBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCategoriesWithBlogs = async () => {
			try {
				const response = await fetch('/api/categorizedBlogs');
				if (!response.ok) throw new Error('Failed to fetch data');

				const data = await response.json();
				setCategoriesWithBlogs(data.categoriesWithBlogs);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCategoriesWithBlogs();
	}, []);

	if (loading) return <Loader />;
	if (error) return <MsgShower msg={error} />;

	return (
		<div className='max-w-7xl mx-auto p-4'>
			{categoriesWithBlogs.length === 0 ? (
				<p className='text-gray-500 text-center'>No categories found.</p>
			) : (
				categoriesWithBlogs.map(({ category, blogs }) => (
					<div key={category._id} className='mb-10'>
						<div className='flex justify-between '>
							<h2 className='text-2xl font-semibold mb-4'>{category.name}</h2>
							<Link
								className='ctxtColor underline flex items-center gap-2'
								href={`/blogs/byCategory/${category?._id}`}>
								View Category <CgArrowRight />
							</Link>
						</div>

						{blogs.length > 0 ? (
							<div className='flex flex-wrap gap-3'>
								{blogs.map((blog) => (
									<BlogCard key={blog?._id} blog={blog} />
								))}
							</div>
						) : (
							<p className='text-gray-500'>No blogs in this category.</p>
						)}
					</div>
				))
			)}
		</div>
	);
};

export default CategorizedBlogs;
