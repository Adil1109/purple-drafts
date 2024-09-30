import Link from 'next/link';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa6';
import { IoLogoYoutube } from 'react-icons/io';

export default function Footer() {
	return (
		<div className='transparent mt-20'>
			<div className='mx-20 ssm:mx-6 py-6 flex flex-1 flex-wrap aa:gap-40 gap-5'>
				<div className='ssm:text-center'>
					<Link href={'/'} className='font-bold text-xl text-white'>
						<span>Purple Drafts</span>
					</Link>
					<p className='text-ssm py-3 w-96 smd:w-full text-justify ssm:text-center'>
						The most <span className='text-white'> RELIABLE</span> ed-tech
						startup in Bangladesh
					</p>
				</div>
				<div className='flex flex-wrap gap-6 smd:gap-10 ssm:w-full ssm:justify-center'>
					<div>
						<h2 className='font-bold text-white'>Company</h2>
						<p className='text-ssm py-4 flex flex-col gap-2'>
							<Link className='underline' href={'/about'}>
								About
							</Link>

							<Link className='underline' href={'/policy'}>
								Policies
							</Link>
						</p>
					</div>
					<div>
						<h2 className='font-bold text-white'>Contact Us</h2>
						<p className='text-xl py-4 flex gap-4'>
							<a
								href='https://www.youtube.com/@HscCrackers'
								target='_blank'
								rel='noopener noreferrer'>
								<IoLogoYoutube />
							</a>
							<a
								href='https://www.facebook.com/hsccrackersofficial'
								target='_blank'
								rel='noopener noreferrer'>
								<FaFacebookF />
							</a>
							<a
								target='_blank'
								rel='noopener noreferrer'
								href='mailto:hsccrackers5@gmail.com'>
								<MdOutlineMailOutline />
							</a>
						</p>
						<p className='text-xs'>Made with Love</p>
					</div>
				</div>
			</div>
			<hr className='w-full border-slate-700 my-4' />
			<h2 className='text-center pb-3'>
				&copy; 2024 Purple Drafts, All Rights Reserved.
			</h2>
		</div>
	);
}
