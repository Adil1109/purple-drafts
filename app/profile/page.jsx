'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import SigninBtn from '@/components/SigninBtn';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import MsgShower from '@/components/MsgShower';
import ScrollMsg from '@/components/ScrollMsg';
// import CourseCard from '@/components/CourseCard';
import Link from 'next/link';
import { resizeGoogleProfileImage } from '@/lib/formatTime';

function UserInfo() {
	const { status, data: session } = useSession();

	if (status === 'loading') {
		return <Loader />;
	} else if (status === 'authenticated') {
		return (
			<div className='mx-auto  mr-4'>
				<div className='px-8 py-4 rounded-md flex flex-col gap-3 items-center'>
					<button
						className='self-end text-center rounded-md w-20 h-10 cbgColor'
						onClick={() => {
							signOut();
						}}>
						Signout
					</button>
					<Image
						className='rounded-full shadow-lg h-32 w-32'
						src={resizeGoogleProfileImage(session?.user?.image)}
						alt='User Image'
						width={800}
						height={800}
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
					<div>
						<Link
							href={'/profile/your-donations'}
							className='underline text-white font-bold text-lg ssm:text-sm'>
							Your Donations
						</Link>
					</div>

					<hr className='w-full border-slate-700' />
				</div>
				<div>
					<h2 className='pl-8 flex justify-between text-white font-bold text-lg ssm:text-sm'>
						<span>Enrolled Courses</span>
						<Link href={'/profile/allOrders'} className='underline mr-5'>
							See Orders
						</Link>
					</h2>
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
