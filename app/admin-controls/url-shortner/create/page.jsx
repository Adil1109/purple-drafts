'use client';
import { createShortUrlAction } from '@/actions/shortUrlActions';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import { useRef, useState } from 'react';

export default function CreateShortUrl() {
	const formRef = useRef(null);
	const successRef = useRef(null);
	const failedRef = useRef(null);

	return (
		<div className='grid place-items-center h-screen'>
			<form
				ref={formRef}
				action={async (formData) => {
					successRef.current.textContent = '';
					failedRef.current.textContent = '';

					const data = await createShortUrlAction(formData);

					if (data?.success) {
						formRef.current?.reset();
						successRef.current.textContent = 'Created!';
					} else {
						failedRef.current.textContent = data?.error;
					}
				}}
				className='ssm:w-[90%] w-[580px] shadow-xl p-8 rounded-md flex flex-col gap-3 !bg-base-100 '>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Create Short Url
				</h2>

				<Input
					typeAttr={'text'}
					nameAttr={'shortUrlIdentifier'}
					placeholderAttr={'Short Url Name (e.g: Varsity24)'}
					requiredAttr={true}
				/>
				<Input
					typeAttr={'url'}
					nameAttr={'shortUrl'}
					placeholderAttr={'Main URL'}
					requiredAttr={true}
				/>

				<select
					name='shortUrlType'
					defaultValue={''}
					className='!bg-base-300 px-4 py-2 rounded-md w-full'
					required>
					<option disabled value=''>
						Select Type
					</option>
					<option value='INTERNEL'>INTERNEL</option>
					<option value='EXTERNEL'>EXTERNEL</option>
				</select>

				<div className='self-center mt-4'>
					<SubmitButton />
				</div>
				<p
					className='text-green-600 text-center font-bold text-lg'
					ref={successRef}></p>
				<p
					className='text-red-600 text-center font-bold text-lg'
					ref={failedRef}></p>
			</form>
		</div>
	);
}
