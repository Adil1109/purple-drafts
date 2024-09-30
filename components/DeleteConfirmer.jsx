import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Loader from './Loader';

export default function DeleteConfirmer({ ModelType, deleteAction }) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	return (
		<div className='h-screen w-full flex items-center justify-center'>
			<div className='w-full !bg-base-100 h-56 -mt-20 mx-6 rounded-lg flex flex-col justify-evenly items-center'>
				<h2 className='font-bold my-4 text-red-400'>
					Sure about deleting this {ModelType}?
				</h2>
				<button
					onClick={() => {
						setLoading(true);
						deleteAction();
						router.replace('/admin-controls');
					}}
					className='border-2 px-4 py-2 mb-2 font-bold rounded-md border-red-900 hover:bg-red-900'>
					Yes
				</button>
				{loading && <Loader />}
			</div>
		</div>
	);
}
