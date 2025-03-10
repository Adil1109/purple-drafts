'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import SigninBtn from '@/components/SigninBtn';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import MsgShower from '@/components/MsgShower';
import ScrollMsg from '@/components/ScrollMsg';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Bookmark() {
	const { status, data: session } = useSession();
	const [page, setPage] = useState(1);
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const [endErr, setEndErr] = useState(false);
	const userId = session?.user?.mongoId;
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				if (!userId) {
					return;
				}
				const response = await fetch(
					`/api/bookmarks?userId=${userId}&page=${page}`
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();

				if (!dataArr.bookmarks) {
					setError(`Data not received!`);
					return;
				}

				if (dataArr.bookmarks.length < 1) {
					setEnd(true);
				}
				if (dataArr.bookmarks.length < 1 && page == 1) {
					setEndErr(true);
				}

				setBlogs((prev) => [...prev, ...dataArr.bookmarks]);
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page, userId]);

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

	if (status === 'loading') {
		return <Loader />;
	} else if (status === 'authenticated') {
		return (
			<div className='mx-auto'>
				<div>
					<div className='flex py-2 flex-wrap w-full gap-3 mt-2 justify-center'>
						{!blogs ? (
							<MsgShower msg={'No Blogs available!'} />
						) : (
							blogs?.map((item) => {
								return (
									<BlogCard
										key={item._id}
										blog={item?.Blog}
										onClick={() => router.push(`/blogs/view/${item._id}`)}
									/>
								);
							})
						)}
						{loading && <Loader className='self-center' />}
						{error && <ScrollMsg msg={error} />}
						{endErr && <ScrollMsg msg={'No Bookmarks Available!'} />}
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className='flex items-center justify-center h-screen pb-24'>
				<SigninBtn />
			</div>
		);
	}
}

export default Bookmark;
