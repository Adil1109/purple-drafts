'use client';
import { useState, useRef, useEffect } from 'react';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import { useSession } from 'next-auth/react';
import MsgShower from '@/components/MsgShower';
import Loader from '@/components/Loader';
import {
	fetchUserAction,
	updateUserDeletionRequestAction,
} from '@/actions/userActions';

const AccountDeletionForm = () => {
	const formRef = useRef(null);
	const successRef = useRef(null);
	const failedRef = useRef(null);
	const { status, data: session } = useSession();
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState(true);

	const byId = session?.user?.mongoId;

	const updateUserDeletionRequestActionWithId =
		updateUserDeletionRequestAction.bind(null, byId);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedUserData = await fetchUserAction(byId);
				setUserData(fetchedUserData);
			} catch (error) {
				throw new Error('Error fetching data');
			} finally {
				setLoading(false);
			}
		};

		if (byId) {
			fetchData();
		} else {
			setLoading(false);
		}
	}, [byId]);
	if (loading) {
		return <Loader />;
	}
	if (userData?.markedForDeletion) {
		return <MsgShower msg={'You have already submitted deletion request!'} />;
	}
	if (status === 'authenticated') {
		return (
			<div className='grid place-items-center h-screen '>
				<form
					ref={formRef}
					action={async (byId, formData) => {
						successRef.current.textContent = '';
						failedRef.current.textContent = '';

						const data = await updateUserDeletionRequestActionWithId(
							byId,
							formData
						);
						if (data?.success) {
							formRef.current?.reset();
							successRef.current.textContent = 'Request Submitted!';
						} else {
							failedRef.current.textContent = data?.error;
						}
					}}
					className='ssm:w-[90%] w-[580px] shadow-xl p-8 rounded-md flex flex-col gap-3 !bg-base-100'>
					<h2 className='text-white font-bold text-2xl text-center ssm:text-base mb-4 self-center'>
						Request Account Deletion
					</h2>

					<Input
						typeAttr={'text'}
						nameAttr={'name'}
						placeholderAttr={'Name'}
						requiredAttr={true}
						value={session?.user?.name}
					/>
					<Input
						typeAttr={'text'}
						nameAttr={'email'}
						placeholderAttr={'Email'}
						requiredAttr={true}
						value={session?.user?.email}
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
	return <MsgShower msg={'Login First!'} />;
};

export default AccountDeletionForm;
