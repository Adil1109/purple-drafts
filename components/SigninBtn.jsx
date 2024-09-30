'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';

function SigninBtn() {
	return (
		<button
			onClick={() => signIn('google')}
			className='flex bg-white items-center gap-4 shadow-xl rounded-md pl-3'>
			<Image
				src='/google-logo.png'
				height={30}
				width={30}
				alt='Google logo'
				placeholder='blur'
				blurDataURL='L02rs+~q9FRjj[j[ayfQfQfQfQfQ'
			/>

			<span className='bg-blue-500 text-white px-4 py-3 rounded-tr-md rounded-br-md'>
				Signin with Google
			</span>
		</button>
	);
}

export default SigninBtn;
