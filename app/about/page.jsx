import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaFacebook } from 'react-icons/fa';
import { IoLogoYoutube } from 'react-icons/io';
import { MdMail } from 'react-icons/md';

export default function About() {
	return (
		<div className='flex flex-col -mt-16'>
			<div className='hero  min-h-screen'>
				<div className='hero-content flex-col lg:flex-row'>
					<Image
						src={
							'https://res.cloudinary.com/dccbdekei/image/upload/v1728768824/statics/jf3ub8jnj6gv7gpddiku.png'
						}
						className='max-w-sm rounded-lg'
						width={300}
						height={200}
						alt='Logo Image'
					/>
					<div>
						<h1 className='text-5xl smd:text-3xl font-bold italic'>
							Purple<span className='ctxtColor'>Drafts</span>
						</h1>
						<h3 className='italic'>
							Your Daily Dose of Insights and Inspiration!
						</h3>
						<p className='py-6 italic'>
							“Inspiring minds and sparking conversations through thoughtful
							stories. At PurpleDrafts, we turn ideas into insights, keeping you
							informed, entertained, and engaged. Whether it’s the latest
							trends, life lessons, or creative musings, discover a blog crafted
							for curious souls. Join us on a journey of inspiration, growth,
							and discovery — because every story has the power to shape
							tomorrow.”
						</p>
						{/* <div className='flex gap-5 pb-6'>
							<a
								href='https://www.youtube.com/@HscCrackers'
								target='_blank'
								rel='noopener noreferrer'>
								<IoLogoYoutube className='h-6 w-6' />
							</a>
							<a
								href='https://www.facebook.com/s12013024'
								target='_blank'
								rel='noopener noreferrer'>
								<FaFacebook className='h-6 w-6' />
							</a>

							<a
								href='mailto:hsccrackers5@gmail.com'
								target='_blank'
								rel='noopener noreferrer'>
								<MdMail className='h-6 w-6' />
							</a>
						</div> */}
					</div>
				</div>
			</div>

			<div className='flex-1'></div>
			{/* <Footer className='self-end' /> */}
		</div>
	);
}
