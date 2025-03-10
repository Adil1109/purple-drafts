'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import SigninBtn from '@/components/SigninBtn';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import History from '@/components/History';
import Bookmarks from '@/components/Bookmarks';
import { useParams } from 'next/navigation';

function UserInfo() {
	const { status, data: session } = useSession();
	const params = useParams();
	const [activeTab, setActiveTab] = useState(0);

	const handleTabClick = (index) => {
		setActiveTab(index);
	};

	const tabs = [
		{ title: 'History', component: <History /> },
		{ title: 'Bookmarks', component: <Bookmarks /> },
	];

	if (status === 'loading') {
		return <Loader />;
	} else if (status === 'authenticated') {
		return (
			<div className='mx-auto px-8'>
				<div className=' py-4 rounded-md flex flex-col gap-3 items-center'>
					<button
						className='self-end text-center rounded-md w-20 h-10 cbgColor text-white'
						onClick={() => {
							signOut();
						}}>
						Signout
					</button>
					<Image
						className='rounded-full w-[100px] h-[100px] shadow-2xl'
						src={session?.user?.image}
						width={600}
						height={600}
						alt='User Photo'
						placeholder='blur'
						blurDataURL='L02rs+~q9FRjj[j[ayfQfQfQfQfQ'
					/>

					<div>
						Name: <span className='font-bold'>{session?.user?.name}</span>
					</div>
					<div>
						Email:{' '}
						<span className='font-bold ssm:text-sm'>
							{session?.user?.email}
						</span>
					</div>

					<hr className='w-full border-slate-700' />
				</div>
				<div>
					<div className='flex flex-col'>
						<div className='flex mt-2 justify-center'>
							<div className='bg-base-200 shadow-md rounded-3xl  text-center flex  justify-center'>
								{tabs.map((tab, index) => (
									<button
										key={index}
										className={`${
											activeTab === index ? 'cbgColor text-white' : ''
										} rounded-3xl w-32 py-2`}
										onClick={() => handleTabClick(index)}>
										{tab.title}
									</button>
								))}
							</div>
						</div>
					</div>
					<div>{tabs[activeTab].component}</div>
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

export default UserInfo;
