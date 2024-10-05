/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';
import { addBlogAction } from '@/actions/blogActions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Tiptap from '@/components/TipTap';
import FileInput from '@/components/FileInput';

const Upload = () => {
	const formRef = useRef(null);
	const failedRef = useRef('');
	const successRef = useRef(null);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const { status, data: session } = useSession();
	const router = useRouter();
	const [selectedFile, setSelectedFile] = useState(null);

	return (
		<div className='grid place-items-center h-screen'>
			<form
				className='ssm:w-[90%] w-[1080px] shadow-xl p-8 rounded-md flex flex-col gap-3 !bg-base-100 '
				ref={formRef}
				onReset={() => setSelectedFile(null)}
				action={async (formData) => {
					failedRef.current.textContent = '';
					formData.append('description', content);
					const data = await addBlogAction(formData);

					if (data?.success) {
						formRef.current?.reset();
					} else {
						failedRef.current.textContent = data?.error;
					}
				}}>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Create Blog
				</h2>
				<Input
					nameAttr={'title'}
					classAttr={'w-full'}
					typeAttr={'text'}
					requiredAttr={true}
					placeholderAttr={'Enter the blog title'}
				/>
				<FileInput
					nameAttr={'thumbnailImage'}
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
				/>
				<Tiptap
					content={content}
					onChange={(newContent) => setContent(newContent)}
				/>
				<SubmitButton
					classAttr='w-full'
					nrmText={'Upload'}
					lnrmText={'Uploading...'}
				/>

				<p
					className='text-green-600 text-center font-bold text-lg'
					ref={successRef}></p>
				<p
					className='text-red-600 text-center font-bold text-lg'
					ref={failedRef}></p>
			</form>
		</div>
	);
};
export default Upload;
