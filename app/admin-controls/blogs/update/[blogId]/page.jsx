/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Tiptap from '@/components/TipTap';
import FileInput from '@/components/FileInput';
import Textarea from '@/components/Textarea';
import DynamicSelect from '@/components/DynamicSelect';
import { fetchAllCategoryAction } from '@/actions/categoryActions';
import { updateBlogAction, fetchBlogAction } from '@/actions/blogActions';

const UpdateBlog = () => {
	const formRef = useRef(null);
	const failedRef = useRef('');
	const successRef = useRef(null);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const { status, data: session } = useSession();
	const router = useRouter();
	const params = useParams();
	const [selectedFile, setSelectedFile] = useState(null);
	const [categories, setCategories] = useState([]);
	const [blogData, setBlogData] = useState({
		title: '',
		shortDescription: '',
		tags: '',
		selectedCategories: [],
	});

	useEffect(() => {
		const fetchBlogData = async () => {
			try {
				const fetchedBlogData = await fetchBlogAction(params.blogId);
				setBlogData({
					title: fetchedBlogData.title,
					shortDescription: fetchedBlogData.shortDescription,
					tags: fetchedBlogData.tags,
					selectedCategories: fetchedBlogData.categories.map(
						(category) => category.id
					),
				});
				setContent(fetchedBlogData?.description);
			} catch (error) {
				console.error('Error fetching blog data:', error);
			}
		};

		if (params.blogId) {
			fetchBlogData();
		}
	}, [params.blogId]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const fetchedCategoryData = await fetchAllCategoryAction();
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
					successRef.current.textContent = '';
					formData.append('description', content);
					formData.append('author', session?.user?.mongoId);
					formData.append('blogId', params.blogId);
					const data = await updateBlogAction(formData);

					if (data?.success) {
						successRef.current.textContent = 'Blog updated successfully!';
						router.push(`/admin-controls`);
					} else {
						failedRef.current.textContent = data?.error;
					}
				}}>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Update Blog
				</h2>
				<Input
					nameAttr={'title'}
					classAttr={'w-full'}
					typeAttr={'text'}
					requiredAttr={true}
					placeholderAttr={'Enter the blog title'}
					value={blogData.title}
					onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
				/>
				<Textarea
					nameAttr={'shortDescription'}
					classAttr={'w-full'}
					requiredAttr={true}
					placeholderAttr={'Enter a short description'}
					value={blogData.shortDescription}
					onChange={(e) =>
						setBlogData({ ...blogData, shortDescription: e.target.value })
					}
				/>

				<DynamicSelect
					classAttr={'w-full'}
					multiple
					optionsAttr={categories}
					valueAttr={blogData.selectedCategories}
					ds={'name'}
					placeholderAttr={'Select category'}
					requiredAttr={true}
					onChange={(selectedOptions) =>
						setBlogData({ ...blogData, selectedCategories: selectedOptions })
					}
				/>
				<FileInput
					nameAttr={'thumbnailImage'}
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
				/>

				<Tiptap
					content={content}
					description={blogData?.description}
					onChange={(newContent) => setContent(newContent)}
				/>

				<Textarea
					nameAttr={'tags'}
					classAttr={'w-full'}
					requiredAttr={true}
					placeholderAttr={'Enter some tags'}
					value={blogData.tags}
					onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })}
				/>
				<SubmitButton
					classAttr='w-full'
					nrmText={'Update Blog'}
					lnrmText={'Updating...'}
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

export default UpdateBlog;
