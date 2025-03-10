'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Dropdown from './Dropdown';
import {
	FaHome,
	FaBook,
	FaThLarge,
	FaEye,
	FaChartLine,
	FaInfoCircle,
	FaBars,
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { CgProfile } from 'react-icons/cg';
import CategoryDropdown from './CategoryDropdown';

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { status, data: session } = useSession();

	return (
		<div className='z-20 sticky top-0'>
			<div className='w-full h-16 navbar bg-gradient-to-t to-[#0f172a] from-[#12243c]'>
				<div className='flex-1'>
					<Link href={'/'} className='btn btn-ghost text-xl flex items-center'>
						<Image
							src={
								'https://res.cloudinary.com/dccbdekei/image/upload/v1728768824/statics/jf3ub8jnj6gv7gpddiku.png'
							}
							alt='logo'
							width={40}
							height={40}
						/>
						<span className='ml-1 italic'>
							Purple<span className='ctxtColor'>Drafts</span>
						</span>
					</Link>
				</div>
				<div className='hidden lg:flex'>
					<ul className='menu menu-horizontal'>
						<li>
							<Link
								className={` ${
									pathname === '/' && 'cbgColor'
								} flex items-center`}
								href={'/'}>
								<FaHome className='mr-1' />
								Home
							</Link>
						</li>
						<li>
							<Link
								className={` ${
									pathname === '/blogs/recent-blogs' && 'cbgColor'
								} flex items-center`}
								href={'/blogs/recent-blogs'}>
								<FaBook className='mr-1' />
								Recent Blogs
							</Link>
						</li>
						<li>
							<Link
								className={` ${
									pathname === '/categorized' && 'cbgColor'
								} flex items-center`}
								href={'/categorized'}>
								<FaBook className='mr-1' />
								Categorized
							</Link>
						</li>
						<li>
							<Link
								className={` ${
									pathname === '/blogs/most-viewed' && 'cbgColor'
								} flex items-center`}
								href={'/blogs/most-viewed'}>
								<FaEye className='mr-1' />
								Most Viewed
							</Link>
						</li>
						<li>
							<Link
								className={` ${
									pathname === '/blogs/trending' && 'cbgColor'
								} flex items-center`}
								href={'/blogs/trending'}>
								<FaChartLine className='mr-1' />
								Trending
							</Link>
						</li>
						{status === 'unauthenticated' && (
							<li>
								<Link
									className={` ${
										pathname === '/profile' && 'cbgColor'
									} flex items-center`}
									href={'/profile'}>
									<CgProfile className='mr-1' />
									Profile
								</Link>
							</li>
						)}
					</ul>

					<Dropdown />
				</div>
				<div className='flex-none lg:hidden'>
					<label
						htmlFor='my-drawer-3'
						aria-label='open sidebar'
						className='btn btn-square btn-ghost'>
						<FaBars className='w-6 h-6' />
					</label>
				</div>
			</div>
			<div className='drawer drawer-end  z-20'>
				<input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
				<div className='drawer-content flex flex-col gap-3'>{/* Navbar */}</div>
				<div className='drawer-side'>
					<label
						htmlFor='my-drawer-3'
						aria-label='close sidebar'
						className='drawer-overlay'></label>
					<div className='menu p-4 w-80 min-h-full !bg-base-200 flex flex-col gap-3'>
						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-100 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full text-lg flex items-center ${
										pathname === '/' && 'ctxtColor'
									}`}
									onClick={() => router.push('/')}>
									<FaHome className='mr-2' />
									Home
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-100 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full text-lg flex items-center ${
										pathname === '/blogs/recent-blogs' && 'ctxtColor'
									}`}
									onClick={() => router.push('/blogs/recent-blogs')}>
									<FaBook className='mr-2' />
									Recent Blogs
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-100 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full text-lg flex items-center ${
										pathname === '/categorized' && 'ctxtColor'
									}`}
									onClick={() => router.push('/categorized')}>
									<FaThLarge className='mr-2' />
									Categorized
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-100 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full text-lg flex items-center ${
										pathname === '/blogs/most-viewed' && 'ctxtColor'
									}`}
									onClick={() => router.push('/blogs/most-viewed')}>
									<FaEye className='mr-2' />
									Most Viewed
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-100 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full text-lg flex items-center ${
										pathname === '/blogs/trending' && 'ctxtColor'
									}`}
									onClick={() => router.push('/blogs/trending')}>
									<FaChartLine className='mr-2' />
									Trending
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-100 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full text-lg flex items-center ${
										pathname === '/about' && 'ctxtColor'
									}`}
									onClick={() => router.push('/about')}>
									<FaInfoCircle className='mr-2' />
									About
								</span>
							</label>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
