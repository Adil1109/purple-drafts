function MenuItem({ Icon, Title, onClickFunction, ExtraStyles }) {
	return (
		<div
			className={`flex mb-2 w-80  place-items-center mr-2 ${ExtraStyles} !bg-gray-800 flex-wrap px-2 py-2 rounded-lg shadow-lg hover:cursor-pointer`}
			onClick={onClickFunction}>
			<Icon className='text-slate-100 h-7 w-7 focus:h-5' />
			<h3 className='text-slate-100 pl-2'>{Title}</h3>
		</div>
	);
}

export default MenuItem;
