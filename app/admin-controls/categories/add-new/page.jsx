'use client';
import { createCategoryAction } from '@/actions/categoryActions';
import FileInput from '@/components/FileInput';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Textarea from '@/components/Textarea';
import { useRef, useState } from 'react';

export default function CreateCategory() {
	const formRef = useRef(null);
	const successRef = useRef(null);
	const failedRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);

	return (
		<div className='grid place-items-center h-screen'>
			<form
				ref={formRef}
				action={async (formData) => {
					successRef.current.textContent = '';
					failedRef.current.textContent = '';

					const data = await createCategoryAction(formData);

					if (data?.success) {
						formRef.current?.reset();
						setSelectedFile(null);
						successRef.current.textContent = 'Created!';
					} else {
						failedRef.current.textContent = data?.error;
					}
				}}
				className='ssm:w-[90%] w-[580px] shadow-xl p-8 rounded-md flex flex-col gap-3 !bg-base-100 '>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Create Category
				</h2>

				<Input
					typeAttr={'text'}
					nameAttr={'name'}
					placeholderAttr={'Category Name'}
					requiredAttr={true}
					classAttr={'w-full'}
				/>
				<Textarea
					typeAttr={'text'}
					nameAttr={'description'}
					placeholderAttr={'Description'}
					requiredAttr={true}
					classAttr={'w-full'}
				/>

				<FileInput
					nameAttr={'thumbnailImage'}
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
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
