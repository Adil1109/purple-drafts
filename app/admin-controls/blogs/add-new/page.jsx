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
import Textarea from '@/components/Textarea';
import DynamicSelect from '@/components/DynamicSelect';
import { fetchAllCategoryAction } from '@/actions/categoryActions';

const Upload = () => {
	const formRef = useRef(null);
	const failedRef = useRef('');
	const successRef = useRef(null);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const { status, data: session } = useSession();
	const router = useRouter();
	const [selectedFile, setSelectedFile] = useState(null);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const fetchedCategoryData = await fetchAllCategoryAction();
				console.log(fetchedCategoryData);

				setCategories(fetchedCategoryData);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

		fetchCategories();
	}, []);

	return (
		<div className='grid place-items-center min-h-screen'>
			<form
				className='w-[90%] max-w-[1080px] shadow-xl p-8 rounded-md flex flex-col gap-3 !bg-base-100'
				ref={formRef}
				onReset={() => setSelectedFile(null)}
				action={async (formData) => {
					failedRef.current.textContent = '';
					formData.append('description', content);
					formData.append('author', session?.user?.mongoId);
					const data = await addBlogAction(formData);

					if (data?.success) {
						successRef.current.textContent = 'Created!';
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
				<Textarea
					nameAttr={'shortDescription'}
					classAttr={'w-full'}
					requiredAttr={true}
					placeholderAttr={'Enter the a short description!'}
				/>
				<DynamicSelect
					classAttr={'w-full'}
					multiple
					optionsAttr={categories}
					ds={'name'}
					placeholderAttr={'Select category'}
					requiredAttr={true}
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
				<Textarea
					nameAttr={'tags'}
					classAttr={'w-full'}
					requiredAttr={true}
					placeholderAttr={'Enter the a some tags!'}
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
