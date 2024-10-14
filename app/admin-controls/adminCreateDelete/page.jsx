'use client';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import MsgShower from '@/components/MsgShower';
import { useSession } from 'next-auth/react';
import {
	createAdminAction,
	deleteAdminAction,
	fetchAdminAction,
} from '@/actions/adminActions';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import SubmitButton from '@/components/SubmitButton';
import Select from '@/components/Select';

export default function AdminCreateDelete() {
	const [adminData, setAdminData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedAdminData = await fetchAdminAction();
				setAdminData(fetchedAdminData);
			} catch (error) {
				throw new Error(error);
			}
		};

		fetchData();
	}, []);
	const router = useRouter();
	const { status, data: session } = useSession();
	if (session?.user?.role !== 'superAdmin') {
		return <MsgShower msg={'You are not Super Admin!'} />;
	}

	return (
		<div className='grid place-items-center min-h-screen'>
			<form
				action={async (formData) => {
					await createAdminAction(formData);
					router.push('/');
				}}
				className='shadow-xl ssm:w-[90%] w-[580px] p-8 mt-4 rounded-md flex flex-col gap-3 !bg-base-100'>
				<h2 className='text-white font-bold text-2xl mb-4 self-center'>
					Create Admin
				</h2>

				<Input
					typeAttr={'email'}
					nameAttr={'email'}
					placeholderAttr={'User Email'}
					classAttr={'w-full'}
					requiredAttr={true}
				/>

				<Select
					name='role'
					requiredAttr={true}
					classAttr={'w-full'}
					placeholderAttr={'Select Role'}
					optionsAttr={['admin', 'superAdmin']}
				/>

				<div className='self-center mt-4'>
					<SubmitButton />
				</div>
			</form>
			<div className='mt-4 ssm:w-[90%] w-[580px]'>
				{adminData.length > 0 &&
					adminData.map((item) => {
						return (
							<div
								key={item._id}
								className='my-4 flex flex-col !bg-base-100 p-4 rounded-lg'>
								<MdDelete
									className='self-end text-red-400 cursor-pointer h-6 w-6'
									onClick={() => {
										deleteAdminAction(item.email);
										router.replace('/admin-controls');
									}}
								/>
								<h2>Name: {item.name}</h2>
								<h2>Email: {item.email}</h2>
								<h2>Role: {item.role}</h2>
							</div>
						);
					})}
			</div>
		</div>
	);
}
