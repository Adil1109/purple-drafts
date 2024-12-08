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
import Checkbox from '@/components/Checkbox';

const UpdateBlog = () => {
	const formRef = useRef(null);
	const failedRef = useRef('');
	const successRef = useRef(null);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const { status, data: session } = useSession();
	const router = useRouter();
	const params = useParams();
	const [description, setDescription] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [categories, setCategories] = useState([]);
	const [blogData, setBlogData] = useState({
		title: '',
		shortDescription: '',
		tags: '',
		categories: [],
	});

	useEffect(() => {
		const fetchBlogData = async () => {
			try {
				const fetchedBlogData = await fetchBlogAction(params.blogId);
				setBlogData({
					title: fetchedBlogData.title,
					shortDescription: fetchedBlogData.shortDescription,
					tags: fetchedBlogData.tags,
					categories: fetchedBlogData.categories,
				});
				setContent(fetchedBlogData?.description);
				setDescription(fetchedBlogData?.description);
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
				<p>Select Category:</p>
				<div className='flex w-full gap-4'>
					{categories?.map((item) => (
						<Checkbox
							checked={blogData?.categories?.some((category) => {
								return category === item._id;
							})}
							key={item?._id}
							label={item?.name}
							name={'categories'}
							value={item?._id}
							_id={item?._id}
							onChange={(e) => {
								const newCategories = e.target.checked
									? [...blogData.categories, item._id]
									: blogData.categories.filter(
											(category) => category !== item._id
									  );
								setBlogData({ ...blogData, categories: newCategories });
							}}
						/>
					))}
				</div>

				<FileInput
					nameAttr={'thumbnailImage'}
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
				/>

				<Tiptap
					content={content}
					description={description}
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
