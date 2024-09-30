'use client';
import { FaCirclePlus } from 'react-icons/fa6';

export default function Modal({ Icon, fetchData, children, modalId }) {
	return (
		<>
			<button
				className='btn'
				onClick={() => {
					fetchData();
					document.getElementById(`my_modal_${modalId}`).showModal();
				}}>
				{Icon ? (
					<Icon className='h-7 w-7 text-slate-400' />
				) : (
					<FaCirclePlus className='h-7 w-7 text-slate-400' />
				)}
			</button>
			<dialog id={`my_modal_${modalId}`} className='modal'>
				<div className='modal-box w-3/4 smd:w-[95%] max-w-5xl'>
					<div className='modal-action'>
						{children}
						<form method='dialog'>
							{/* if there is a button, it will close the modal */}
							<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
								✕
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
