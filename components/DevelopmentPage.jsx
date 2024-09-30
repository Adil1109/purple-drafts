import Image from 'next/image';

export default function DevelopmentPage() {
	return (
		<div className='hero min-h-screen !bg-base-200'>
			<div className='hero-content flex-col lg:flex-row-reverse'>
				<Image
					alt='Maintain Image'
					width={600}
					height={600}
					src='https://ftywvrnzwxxtrgpuezac.supabase.co/storage/v1/object/public/files/static-images/HSC_-_26__14_.jpg'
					className='max-w-sm rounded-lg shadow-2xl'
				/>
				<div>
					<h1 className='text-5xl font-bold'>
						The Site Is In Under Development!
					</h1>
				</div>
			</div>
		</div>
	);
}
