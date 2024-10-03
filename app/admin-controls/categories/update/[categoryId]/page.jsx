'use client';
import { useEffect, useRef, useState } from 'react';
import {
	fetchCategoryAction,
	updateCategoryAction,
} from '@/actions/categoriesActions';
import FileInput from '@/components/FileInput';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import { useParams } from 'next/navigation';

export default function UpdateCategory() {
	const formRef = useRef(null);
	const successRef = useRef(null);
	const failedRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [categoryData, setCategoryData] = useState({});

	const params = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedCategoryData = await fetchCategoryAction(
					params.categoryId
				);
				setCategoryData(fetchedCategoryData);
			} catch (error) {
				console.error('Error fetching category data:', error);
				failedRef.current.textContent = 'Error fetching category data';
			}
		};

		if (params.categoryId) {
			fetchData();
		}
	}, [params.categoryId]);

	return (
		<div className='grid place-items-center h-screen'>
			<form
				ref={formRef}
				onReset={() => setSelectedFile(null)}
				action={async (formData) => {
					successRef.current.textContent = '';
					failedRef.current.textContent = '';

					formData.append('categoryId', params.categoryId);
					const data = await updateCategoryAction(formData);

					if (data?.success) {
						formRef.current?.reset();
						setSelectedFile(null);
						successRef.current.textContent = 'Updated successfully!';
					} else {
						failedRef.current.textContent = data?.error;
					}
				}}
				className='ssm:w-[90%] w-[580px] shadow-xl p-8 rounded-md flex flex-col gap-3 bg-base-100'>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Update Category
				</h2>

				<Input
					typeAttr={'text'}
					nameAttr={'name'}
					placeholderAttr={'Category Name'}
					requiredAttr={true}
					value={categoryData?.name}
					onChange={(e) =>
						setCategoryData({
							...categoryData,
							name: e.target.value,
						})
					}
					classAttr={'w-full'}
				/>
				<Input
					typeAttr={'text'}
					nameAttr={'description'}
					placeholderAttr={'Description'}
					requiredAttr={true}
					value={categoryData?.description}
					onChange={(e) =>
						setCategoryData({
							...categoryData,
							description: e.target.value,
						})
					}
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
