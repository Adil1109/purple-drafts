'use client';
import { createShortUrlAction } from '@/actions/shortUrlActions';
import Input from '@/components/Input';
import Select from '@/components/Select';
import SubmitButton from '@/components/SubmitButton';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';

export default function CreateShortUrl() {
	const formRef = useRef(null);
	const successRef = useRef(null);
	const failedRef = useRef(null);
	const { status, data: session } = useSession();

	return (
		<div className='grid place-items-center h-screen'>
			<form
				ref={formRef}
				action={async (formData) => {
					successRef.current.textContent = '';
					failedRef.current.textContent = '';
					formData.append('shortUrlCreator', session?.user?.mongoId);
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
					placeholderAttr={'Short Url Name (e.g: Google24Plan)'}
					requiredAttr={true}
					classAttr={'w-full'}
				/>
				<Input
					typeAttr={'url'}
					nameAttr={'shortUrl'}
					placeholderAttr={'Main URL'}
					requiredAttr={true}
					classAttr={'w-full'}
				/>

				<Select
					requiredAttr={true}
					placeholderAttr={'Select Type'}
					classAttr={'w-full'}
					optionsAttr={['INTERNEL', 'EXTERNEL']}
				/>

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
