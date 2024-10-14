'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

function LoginPage() {
	return (
		<div className=' flex flex-col items-center justify-center text-white'>
			<div className=' shadow-lg shadow-slate-900 rounded-lg p-8 max-w-md w-full text-center'>
				{/* Illustration */}
				<div className='mb-6'>
					<Image
						src='https://res.cloudinary.com/dccbdekei/image/upload/v1728768824/statics/jf3ub8jnj6gv7gpddiku.png'
						alt='Login illustration'
						width={200}
						height={200}
						className='mx-auto'
					/>
				</div>

				{/* Welcome Text */}
				<h1 className='text-3xl font-semibold mb-4 '>Welcome Back!</h1>
				<p className='text-gray-500 mb-8'>
					Sign in to access your account and start your journey.
				</p>

				{/* Signin Button */}
				<button
					onClick={() => signIn('google')}
					className='flex bg-white items-center gap-4 shadow-xl rounded-md pl-3 mx-auto'>
					<Image
						src='/google-logo.png'
						height={30}
						width={30}
						alt='Google logo'
						placeholder='blur'
						blurDataURL='L02rs+~q9FRjj[j[ayfQfQfQfQfQ'
					/>
					<span className='bg-blue-500 text-white px-4 py-3 rounded-tr-md rounded-br-md'>
						Sign in with Google
					</span>
				</button>

				{/* Terms & Privacy */}
				<div className='mt-6 text-sm text-gray-400'>
					By signing in, you agree to our{' '}
					<Link href='/policy' className='text-blue-500 hover:underline'>
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href='/policy' className='text-blue-500 hover:underline'>
						Privacy Policy
					</Link>
					.
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
