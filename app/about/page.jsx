import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaFacebook } from 'react-icons/fa';
import { IoLogoYoutube } from 'react-icons/io';
import { MdMail } from 'react-icons/md';

export default function About() {
	return (
		<div className='flex flex-col'>
			<div className='hero  min-h-screen'>
				<div className='hero-content flex-col lg:flex-row'>
					<Image
						src={
							'https://res.cloudinary.com/dhbwywnjs/image/upload/v1727729771/s1gqkyjypw0dscldtblt.png'
						}
						className='max-w-sm rounded-lg '
						width={300}
						height={200}
						alt='Logo Image'
					/>
					<div>
						<h1 className='text-5xl smd:text-3xl font-bold'>Purple Drafts</h1>
						<h3>Biomedical Engineering , BUET</h3>
						<p className='py-6'>
							“Finances should not be the barrier to premium education for any
							student. Our mission is to create a better online education
							system. To achieve this we first need to provide all students with
							the best quality education irrespective of their economic
							background.”
						</p>
						<div className='flex gap-5 pb-6'>
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
						</div>
					</div>
				</div>
			</div>

			<div className='flex-1'></div>
			<Footer className='self-end' />
		</div>
	);
}
