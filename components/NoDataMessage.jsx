import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

const NoDataComponent = ({ message = 'No data available' }) => {
	return (
		<div className='flex flex-col items-center justify-center h-full py-6 text-gray-500'>
			<MdOutlineCancel className='text-6xl mb-4' />
			<p className='text-lg'>{message}</p>
		</div>
	);
};

export default NoDataComponent;
