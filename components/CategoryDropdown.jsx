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

export default function CategoryDropdown() {
	const { status, data: session } = useSession();
	const [tabIndex, setTabIndex] = useState(0);
	const router = useRouter();
	return (
		<>
			<div className='dropdown dropdown-end mr-5 sm:mr-1'>
				<span onClick={() => setTabIndex(1)}>Categories</span>
				<ul
					tabIndex={tabIndex}
					className={`dropdown-content shadow-gray-700 z-[1] menu p-2 mt-5 shadow-sm base=300 rounded-box w-56 ${
						tabIndex === -1 ? 'hidden opacity-0' : 'block opacity-100'
					} transition-opacity duration-300 ease-in-out`}>
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
				</ul>
			</div>
		</>
	);
}
