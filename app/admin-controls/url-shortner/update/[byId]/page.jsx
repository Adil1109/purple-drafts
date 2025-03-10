'use client';
import { useState, useEffect, useRef } from 'react';
import {
	updateShortUrlAction,
	fetchShortUrlAction,
} from '@/actions/shortUrlActions';
import Input from '@/components/Input';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import SubmitButton from '@/components/SubmitButton';
import Select from '@/components/Select';

const ShortUrlUpdateForm = () => {
	const router = useRouter();
	const formRef = useRef(null);
	const successRef = useRef(null);
	const failedRef = useRef(null);

	const { byId } = useParams();
	const [shortUrlData, setShortUrlData] = useState({
		shortUrl: '',
		shortUrlIdentifier: '',
		shortUrlType: '',
	});
	const updateShortUrlWithId = updateShortUrlAction.bind(null, byId);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedShortUrlData = await fetchShortUrlAction(byId);
				setShortUrlData(fetchedShortUrlData);
			} catch (error) {
				throw new Error('Error fetching data');
			}
		};

		if (byId) {
			fetchData();
		}
	}, [byId]);

	if (!shortUrlData._id) {
		return <Loader />;
	}

	return (
		<div className='grid place-items-center h-screen '>
			<form
				ref={formRef}
				action={async (byId, formData) => {
					successRef.current.textContent = '';
					failedRef.current.textContent = '';

					const data = await updateShortUrlWithId(byId, formData);
					if (data?.success) {
						formRef.current?.reset();
						successRef.current.textContent = 'Updated!';
						router.replace('/admin-controls');
					} else {
						failedRef.current.textContent = data?.error;
					}
				}}
				className='ssm:w-[90%] w-[580px] shadow-xl p-8 rounded-md flex flex-col gap-3 !bg-base-100'>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Update ShortUrl
				</h2>

				<Input
					typeAttr={'text'}
					classAttr={'w-full'}
					nameAttr={'shortUrlIdentifier'}
					placeholderAttr={'ShortUrl Name (e.g: Varsity24)'}
					requiredAttr={true}
					value={shortUrlData.shortUrlIdentifier}
					onChange={(e) =>
						setShortUrlData({
							...shortUrlData,
							shortUrlIdentifier: e.target.value,
						})
					}
				/>
				<Input
					typeAttr={'text'}
					nameAttr={'shortUrl'}
					classAttr={'w-full'}
					placeholderAttr={'ShortUrl Name'}
					requiredAttr={true}
					value={shortUrlData.shortUrl}
					onChange={(e) =>
						setShortUrlData({ ...shortUrlData, shortUrl: e.target.value })
					}
				/>

				<Select
					nameAttr={'shortUrlType'}
					classAttr={'w-full'}
					value={shortUrlData.shortUrlType}
					optionsAttr={['INTERNEL', 'EXTERNEL']}
					required
					onChange={(e) =>
						setShortUrlData({ ...shortUrlData, shortUrlType: e.target.value })
					}
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
};

export default ShortUrlUpdateForm;
