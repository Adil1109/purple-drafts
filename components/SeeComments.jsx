'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { MdDelete } from 'react-icons/md';
import ScrollMsg from '@/components/ScrollMsg';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { IoSend } from 'react-icons/io5';
import { FaCheckDouble } from 'react-icons/fa6';
// import { deleteCommentAction } from '@/actions/commentActions';
import Link from 'next/link';

export default function SeeComments({ RefModel, ContentID }) {
	const [page, setPage] = useState(1);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const [endErr, setEndErr] = useState(false);
	const [commentBody, setCommentBody] = useState('');
	const [cError, setCError] = useState(null);
	const [cLoading, setCLoading] = useState(null);
	const [cSuccess, setCSuccess] = useState(false);
	const router = useRouter();

	const { status, data: session } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/comment/seeComments?ContentID=${ContentID}&page=${page}`
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();

				if (!dataArr.comments) {
					setError('Data not received');
					return;
				}

				if (dataArr.comments.length < 1) {
					setEnd(true);
				}
				if (dataArr.comments.length < 1 && page == 1) {
					setEndErr(true);
				}

				setComments((prev) => [...prev, ...dataArr.comments]);
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page, ContentID]);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setCLoading(true);
		setCError(null);

		try {
			// Make the API request here using fetch
			const response = await fetch('/api/comment/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					commentBody,
					commentAuthor: session?.user?.mongoId,
					commentContentID: ContentID,
					commentContentIDRefModel: RefModel,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			// Handle success
			setCSuccess(true);
			setComments((prevComments) => [
				{
					_id: data.data._id,
					commentBody: data.data.commentBody,
					commentAuthor: {
						name: session?.user?.name,
						image: session?.user?.image,
					},
				},
				...prevComments,
			]);
		} catch (error) {
			setCError('An error occurred' + error);
		} finally {
			setCLoading(false);
			setCommentBody('');
		}
	};

	return (
		<div className='w-full'>
			{status === 'authenticated' && (
				<div className='mt-5 flex items-start'>
					<Image
						src={session?.user?.image}
						alt='profile image'
						width={35}
						height={35}
						className='rounded-full'
					/>
					<form className='flex flex-1' onSubmit={handleSubmit}>
						<textarea
							className={` ${
								cSuccess ? '!bg-base-300' : '!bg-base-200'
							} mx-2 flex-1 px-3 py-2 rounded-md w-96 smd:w-64 resize-none`}
							name='commentBody'
							placeholder={
								cSuccess
									? 'You just wrote a comment! Wait a bit to comment again.'
									: 'Write a comment!'
							}
							value={commentBody}
							onChange={(event) => setCommentBody(event.target.value)}
							rows={3}
							required
							disabled={cSuccess}
							minLength={3}
							maxLength={1000}></textarea>

						{cLoading ? (
							<span className='loading loading-spinner loading-md ctxtColor self-center'></span>
						) : cSuccess ? (
							<FaCheckDouble className='self-center h-6 w-6 ctxtColor' />
						) : (
							<button
								type='submit'
								className='cursor-pointer self-center h-7 w-7 focus:h-6 focus:w-6'>
								<IoSend height={30} width={30} className='ctxtColor h-6 w-6' />
							</button>
						)}
					</form>
					{cError && <p className='text-red-500 text-center'>{cError}</p>}
				</div>
			)}

			<h2 className='py-4 font-bold text-base ctxtColor'>Comments</h2>

			<div className='flex py-2 flex-wrap justify-stretch'>
				{!comments ? (
					<MsgShower msg={'No Comments yet!'} />
				) : (
					comments?.map((item) => {
						return (
							<div
								key={item._id}
								className='w-full flex flex-col !bg-base-200 my-1 p-3 rounded-lg'>
								{(session?.user?.role === 'admin' ||
									session?.user?.role === 'superAdmin') && (
									<div className='self-end flex gap-4'>
										<Link href={`/admin-controls/comment/delete/${item?._id}`}>
											<MdDelete className='h-6 w-6 text-red-400' />
										</Link>
									</div>
								)}

								<div className='flex items-center'>
									<Image
										src={item?.commentAuthor?.image}
										className='rounded-full'
										alt={'Commentor Picture'}
										width={30}
										height={30}
									/>
									<p className='pl-2 ctxtColor'>{item?.commentAuthor?.name}</p>
								</div>
								<div className='pl-10' style={{ wordBreak: 'break-all' }}>
									{item?.commentBody}
								</div>
							</div>
						);
					})
				)}
				{loading && <Loader className='self-center' />}
				{error && <ScrollMsg msg={error} />}
				{endErr && <ScrollMsg msg='No Comments Yet!' />}
			</div>
		</div>
	);
}
