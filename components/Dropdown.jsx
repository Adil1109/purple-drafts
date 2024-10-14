'use client';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { GoSignOut } from 'react-icons/go';
// import { MdAdminPanelSettings } from 'react-icons/md';
// import { MdAssignmentAdd } from 'react-icons/md';
// import { FaCopyright } from 'react-icons/fa6';

export default function Dropdown() {
	const { status, data: session } = useSession();
	const [tabIndex, setTabIndex] = useState(0);
	const router = useRouter();
	return (
		<>
			{/* {status === 'unauthenticated' && (
				<Link
					className=' text-slate-100 bg-purple-500 mr-3 px-3 py-1 rounded-md mt-1'
					href={'/profile'}>
					Signin
				</Link>
			)} */}
			{status === 'authenticated' && (
				<div className='dropdown dropdown-end mr-5 sm:mr-1'>
					<Image
						className='rounded-full  border-2 shadow-blackish mr-3'
						tabIndex={tabIndex}
						role='button'
						src={session?.user?.image}
						width={28}
						height={28}
						alt='Profile Picture'
						// onClick={() => setTabIndex(0)}
						onClick={() => router.push('/profile')}
					/>
					{/* <ul
						tabIndex={tabIndex}
						className={`dropdown-content shadow-gray-700 z-[1] menu p-2 mt-5 shadow-sm base=300 rounded-box w-56 ${
							tabIndex === -1 ? 'hidden opacity-0' : 'block opacity-100'
						} transition-opacity duration-300 ease-in-out`}>
						{(session?.user?.role === 'admin' ||
							session?.user?.role === 'superAdmin') && (
							<li>
								<div
									onClick={() => {
										router.push('/admin-controls');
										setTabIndex(-1);
									}}>
									Admin Controls
								</div>
							</li>
						)}

						<li>
							<div
								onClick={() => {
									router.push('/profile');
									setTabIndex(-1);
								}}>
								Profile
							</div>
						</li>
						<li>
							<div
								className='flex items-center'
								onClick={() => {
									signOut();
									setTabIndex(-1);
								}}>
							
								Signout
							</div>
						</li>
					</ul> */}
				</div>
			)}
		</>
	);
}
