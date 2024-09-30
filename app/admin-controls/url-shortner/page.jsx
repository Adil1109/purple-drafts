'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import ScrollMsg from '@/components/ScrollMsg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdContentCopy, MdDelete, MdEdit } from 'react-icons/md';
import { useSession } from 'next-auth/react';

export default function AllShortUrls() {
	const [page, setPage] = useState(1);
	const [shortUrls, setShortUrls] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const router = useRouter();
	const [copied, setCopied] = useState(false);
	const { status, data: session } = useSession();

	const handleCopy = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1000);
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(`/api/allShortUrls?page=${page}`);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();

				if (!dataArr.shortUrls) {
					setError('Data not received');
					return;
				}

				if (dataArr.shortUrls.length < 1) {
					setEnd(true);
				}

				setShortUrls((prev) => [...prev, ...dataArr.shortUrls]);
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
		<div className='mx-auto ssm:ml-0 ssm:mr-2'>
			<div className='flex flex-wrap items-center justify-between pl-7 pr-5 py-4'>
				<h2 className='font-bold text-lg '>Short URLs</h2>
				<div className='flex justify-between flex-wrap'>
					<button
						className='cbgColor h-12 w-28 rounded-md'
						onClick={() => router.push('/admin-controls/url-shortner/create')}>
						Add
					</button>
				</div>
			</div>

			<div className='flex mx-6 py-2 flex-wrap w-[calc(95%)] justify-stretch gap-4'>
				{!shortUrls ? (
					<MsgShower msg={'No Short Url available!'} />
				) : (
					shortUrls?.map((item) => {
						return (
							<div
								key={item._id}
								className='flex !bg-base-100 p-4 rounded-lg shadow-lg w-96 smd:w-full items-center relative'>
								<div className='flex self-start items-center'>
									<div className='absolute right-5 top-3 flex items-center gap-3'>
										<span className='text-xs mr-3'>
											{item?.shortUrlClickCount} Clicks
										</span>
										<MdContentCopy
											onClick={() =>
												handleCopy(
													'https://hsccrackers.com/c/' +
														item?.shortUrlIdentifier
												)
											}
											className='cursor-pointer w-6 h-6 text-white'
										/>
										<MdEdit
											onClick={() =>
												router.push(
													`/admin-controls/url-shortner/update/${item?._id}`
												)
											}
											className='cursor-pointer w-6 h-6 text-yellow-200'
										/>
										{session?.user?.role === 'superAdmin' && (
											<MdDelete
												onClick={() =>
													router.push(
														`/admin-controls/url-shortner/delete/${item?._id}`
													)
												}
												className='cursor-pointer w-6 h-6 text-red-300'
											/>
										)}
									</div>
									<h2 className='text-xs flex flex-col font-bold pl-4 text-slate-200'>
										<span className='text-lg text-green-500 mt-4 mb-3'>
											{item?.shortUrlIdentifier}
										</span>
										<span className='mb-3' style={{ wordBreak: 'break-all' }}>
											{'https://hsccrackers.com/c/' + item?.shortUrlIdentifier}
										</span>
										<span className='mb-3' style={{ wordBreak: 'break-all' }}>
											{item?.shortUrl}
										</span>
										<span
											className='text-xs'
											style={{ wordBreak: 'break-all' }}>
											{item?.shortUrlType + ' Link'}
										</span>
									</h2>
								</div>
							</div>
						);
					})
				)}
				{loading && <Loader className='self-center' />}
				{error && <ScrollMsg msg={error} />}
				{end && <ScrollMsg msg={'No further Short URL'} />}
			</div>
			{copied && (
				<div className='modal modal-open'>
					<div className='modal-box'>
						<h3 className='font-bold text-lg'>Info</h3>
						<p className='py-4'>Link copied to clipboard!</p>
					</div>
				</div>
			)}
		</div>
	);
}
