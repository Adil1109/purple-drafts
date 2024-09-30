'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Dropdown from './Dropdown';

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<div className='z-10 sticky top-0'>
			<div className='w-full h-16 navbar bg-gradient-to-t to-[#0f172a] from-[#12243c]'>
				<div className='flex-1'>
					<Link href={'/'} className='btn btn-ghost text-xl'>
						<Image
							src={
								'https://res.cloudinary.com/dhbwywnjs/image/upload/v1727729771/s1gqkyjypw0dscldtblt.png'
							}
							alt='logo'
							width={40}
							height={40}
						/>
						PurpleDrafts
					</Link>
				</div>
				<div className='hidden lg:flex'>
					<ul className='menu menu-horizontal'>
						{/* Navbar menu content here */}
						<li>
							<Link className={` ${pathname === '/' && 'cbgColor'}`} href={'/'}>
								Home
							</Link>
						</li>
						<li>
							<Link
								className={` ${pathname === '/recent-blogs' && 'cbgColor'}`}
								href={'/recent-blogs'}>
								Recent Blogs
							</Link>
						</li>
						<li>
							<Link
								className={` ${pathname === '/categories' && 'cbgColor'}`}
								href={'/categories'}>
								Categories
							</Link>
						</li>
						<li>
							<Link
								className={` ${pathname === '/most-viewed' && 'cbgColor'}`}
								href={'/most-viewed'}>
								Most Viewed
							</Link>
						</li>
						<li>
							<Link
								className={` ${pathname === '/trending' && 'cbgColor'}`}
								href={'/trending'}>
								Trending
							</Link>
						</li>
						<li>
							<Link
								className={` ${pathname === '/about' && 'cbgColor'}`}
								href={'/about'}>
								About
							</Link>
						</li>
					</ul>

					<Dropdown />
				</div>
				<div>
					<div className='flex-none lg:hidden'>
						<label
							htmlFor='my-drawer-3'
							aria-label='open sidebar'
							className='btn btn-square btn-ghost'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								className='inline-block w-6 h-6 stroke-current'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M4 6h16M4 12h16M4 18h16'></path>
							</svg>
						</label>
					</div>
				</div>
			</div>
			<div className='drawer drawer-end  z-20 bg-green-300'>
				<input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
				<div className='drawer-content flex flex-col'>{/* Navbar */}</div>
				<div className='drawer-side'>
					<label
						htmlFor='my-drawer-3'
						aria-label='close sidebar'
						className='drawer-overlay'></label>
					<div className='menu p-4 w-80 min-h-full !bg-base-200 flex flex-col '>
						{/* Sidebar content here */}
						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-300 h-10 flex items-center p-3 rounded-md '>
								<span
									className={`w-full  ${pathname === '/' && 'cbgColor'}`}
									onClick={() => router.push('/')}>
									Home
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-300 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full  ${
										pathname === '/recent-blogs' && 'cbgColor'
									}`}
									onClick={() => router.push('/recent-blogs')}>
									Recent Blogs
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-300 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full  ${
										pathname === '/categories' && 'cbgColor'
									}`}
									onClick={() => router.push('/categories')}>
									Categories
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-300 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full  ${
										pathname === '/most-viewed' && 'cbgColor'
									}`}
									onClick={() => router.push('/most-viewed')}>
									Most Viewed
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-300 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full  ${
										pathname === '/trending' && 'cbgColor'
									}`}
									onClick={() => router.push('/trending')}>
									Trending
								</span>
							</label>
						</p>

						<p>
							<label
								htmlFor='my-drawer-3'
								className='cursor-pointer hover:!bg-base-300 h-10 flex items-center p-3 rounded-md'>
								<span
									className={`w-full  ${pathname === '/about' && 'cbgColor'}`}
									onClick={() => router.push('/about')}>
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
