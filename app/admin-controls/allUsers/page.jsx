'use client';

import MsgShower from '@/components/MsgShower';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';

import ScrollMsg from '@/components/ScrollMsg';
import Image from 'next/image';
import Link from 'next/link';
import Input from '@/components/Input';
import { useRouter } from 'next/navigation';

export default function AllUsers() {
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState('');
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const router = useRouter();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(`/api/allUsers?page=${page}`);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();

				if (!dataArr.users) {
					setError('Data not received');
					return;
				}

				if (dataArr.users.length < 1) {
					setEnd(true);
				}

				setUsers((prev) => [...prev, ...dataArr.users]);
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
			<h2 className='px-6 py-4 font-bold text-lg text-white'>All Users</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					router.push(`/admin-controls/allUsers/${query}`);
				}}
				className='w-96 smd:w-full px-6 py-5 smd:text-center'>
				<Input
					typeAttr={'email'}
					requiredAttr={true}
					placeholderAttr={'User Email'}
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
				/>
			</form>
			<div className='flex mx-6 py-2 flex-wrap w-[calc(95%)] justify-stretch gap-4'>
				{!users ? (
					<MsgShower msg={'No Users available!'} />
				) : (
					users?.map((item) => {
						return (
							<Link
								href={`/admin-controls/allUsers/${item.email}`}
								key={item._id}
								className='flex !bg-base-100 p-4 rounded-lg shadow-lg w-96 smd:w-full items-center'>
								<Image
									className='rounded-full shadow-lg'
									src={item.image}
									alt='Rater Image'
									placeholder='blur'
									blurDataURL='L02rs+~q9FRjj[j[ayfQfQfQfQfQ'
									width={100}
									height={100}
								/>
								<h2 className='text-xl flex flex-col font-bold pl-4 text-slate-200'>
									<span>{item.name}</span>
									<span className='text-xs'>{item.email}</span>
								</h2>
							</Link>
						);
					})
				)}
				{loading && <Loader className='self-center' />}
				{error && <ScrollMsg msg={error} />}
				{end && <ScrollMsg msg={'No further User!'} />}
			</div>
		</div>
	);
}
