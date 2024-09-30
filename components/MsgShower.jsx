export default function MsgShower({ msg }) {
	return (
		<div className='grid place-items-center w-[calc(95%)] h-screen mx-3'>
			<p className='shadow-xl text-center p-8 rounded-md flex flex-col gap-3 !bg-base-100 text-red-500'>
				{msg}
			</p>
		</div>
	);
}
